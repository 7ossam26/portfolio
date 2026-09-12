import { createSeedSnapshot, FIXTURE_TIME_MS } from '../domain/fixtures.ts';
import type {
  CarFilters,
  CarSummary,
  CompletionOutcome,
  ContactRequest,
  CreateContactRequestInput,
  DemoEvent,
  DemoSnapshot,
  Employee,
  Persona,
  Scheduler,
} from '../domain/types.ts';

const OUTCOMES = new Set<CompletionOutcome>(['sold', 'interested', 'no_answer', 'cancelled']);

const browserScheduler: Scheduler = {
  now: () => Date.now(),
  setTimeout: (callback, delayMs) => window.setTimeout(callback, delayMs),
  clearTimeout: (handle) => window.clearTimeout(handle as number),
};

export class DemoTransitionError extends Error {
  readonly code: 'NOT_FOUND' | 'INVALID_STATE' | 'EMPLOYEE_NOT_AVAILABLE' | 'FORBIDDEN' | 'VALIDATION_ERROR';

  constructor(code: 'NOT_FOUND' | 'INVALID_STATE' | 'EMPLOYEE_NOT_AVAILABLE' | 'FORBIDDEN' | 'VALIDATION_ERROR', message: string) {
    super(message);
    this.name = 'DemoTransitionError';
    this.code = code;
  }
}

type Subscriber = (event: DemoEvent | null, snapshot: DemoSnapshot) => void;

export class AutoZainDemoService {
  private snapshot = createSeedSnapshot();
  private readonly listeners = new Set<Subscriber>();
  private readonly timeoutHandles = new Map<string, unknown>();
  private logicalNowMs = FIXTURE_TIME_MS;
  private sequence = 1;
  private readonly scheduler: Scheduler;
  readonly timeoutMs: number;

  constructor(scheduler: Scheduler = browserScheduler, timeoutMs = 30_000) {
    this.scheduler = scheduler;
    this.timeoutMs = timeoutMs;
  }

  async listCars(filters: CarFilters = {}): Promise<readonly CarSummary[]> {
    const query = filters.search?.trim().toLocaleLowerCase('ar') ?? '';
    return this.clone(this.snapshot.cars.filter((car) => {
      const searchMatches = !query || `${car.carType} ${car.model} ${car.color}`.toLocaleLowerCase('ar').includes(query);
      const typeMatches = !filters.carType || car.carType === filters.carType;
      const transmissionMatches = !filters.transmission || car.transmission === filters.transmission;
      return searchMatches && typeMatches && transmissionMatches;
    }));
  }

  async getCar(id: string): Promise<CarSummary> {
    const car = this.snapshot.cars.find((candidate) => candidate.id === id);
    if (!car) throw new DemoTransitionError('NOT_FOUND', 'العربية التجريبية غير موجودة.');
    return this.clone(car);
  }

  async listEmployees(): Promise<readonly Employee[]> {
    return this.clone(this.snapshot.employees.filter((employee) => employee.status !== 'offline'));
  }

  async createRequest(input: CreateContactRequestInput): Promise<ContactRequest> {
    const employee = this.snapshot.employees.find((candidate) => candidate.id === input.employeeId);
    const car = this.snapshot.cars.find((candidate) => candidate.id === input.carId);
    if (!input.buyerName.trim() || !input.buyerPhone.trim() || !car) {
      throw new DemoTransitionError('VALIDATION_ERROR', 'الاسم ورقم الموبايل والعربية مطلوبين.');
    }
    if (!employee || employee.role !== 'employee') {
      throw new DemoTransitionError('NOT_FOUND', 'الموظف التجريبي غير موجود.');
    }
    if (employee.status !== 'available') {
      throw new DemoTransitionError('EMPLOYEE_NOT_AVAILABLE', 'الموظف مش متاح دلوقتي — جرّب موظف تاني.');
    }

    const createdAtMs = this.tick();
    const request: ContactRequest = {
      id: `demo-request-${String(this.sequence++).padStart(3, '0')}`,
      buyerName: input.buyerName.trim(),
      buyerPhone: input.buyerPhone.trim(),
      employeeId: input.employeeId,
      interestedCarId: input.carId,
      status: 'pending',
      outcome: null,
      createdAt: new Date(createdAtMs).toISOString(),
      acceptedAt: null,
      completedAt: null,
      expiresAt: new Date(createdAtMs + this.timeoutMs).toISOString(),
    };

    this.snapshot = { ...this.snapshot, requests: [...this.snapshot.requests, request] };
    this.scheduleTimeout(request.id);
    this.emit({ type: 'contact_request:new', requestId: request.id, at: this.isoNow() });
    return this.clone(request);
  }

  async listMyRequests(persona: Persona, staffId = 'demo-staff-11'): Promise<readonly ContactRequest[]> {
    const requests = persona === 'staff'
      ? this.snapshot.requests.filter((request) => request.employeeId === staffId)
      : this.snapshot.requests;
    return this.clone(requests);
  }

  async respond(id: string, action: 'accept' | 'reject', staffId = 'demo-staff-11'): Promise<ContactRequest> {
    const request = this.requireRequest(id);
    if (request.employeeId !== staffId) throw new DemoTransitionError('FORBIDDEN', 'الطلب مخصص لموظف تجريبي آخر.');
    if (request.status !== 'pending') throw new DemoTransitionError('INVALID_STATE', 'الطلب لم يعد في حالة انتظار.');

    this.clearRequestTimer(id);
    const updated: ContactRequest = action === 'accept'
      ? { ...request, status: 'accepted', acceptedAt: new Date(this.tick()).toISOString() }
      : { ...request, status: 'rejected' };
    this.replaceRequest(updated);

    if (action === 'accept') {
      this.setEmployeeStatus(staffId, 'busy');
      this.emit({ type: 'employee:status_changed', employeeId: staffId, status: 'busy', at: this.isoNow() });
      this.emit({ type: 'contact_request:accepted', requestId: id, at: this.isoNow() });
    } else {
      this.emit({ type: 'contact_request:rejected', requestId: id, at: this.isoNow() });
    }
    return this.clone(updated);
  }

  async complete(id: string, outcome: CompletionOutcome, staffId = 'demo-staff-11'): Promise<ContactRequest> {
    const request = this.requireRequest(id);
    if (request.employeeId !== staffId) throw new DemoTransitionError('FORBIDDEN', 'الجلسة مخصصة لموظف تجريبي آخر.');
    if (request.status !== 'accepted') throw new DemoTransitionError('INVALID_STATE', 'لا يمكن إنهاء طلب غير مقبول.');
    if (!OUTCOMES.has(outcome)) throw new DemoTransitionError('VALIDATION_ERROR', 'نتيجة الجلسة غير صالحة.');

    const updated: ContactRequest = {
      ...request,
      status: 'completed',
      outcome,
      completedAt: new Date(this.tick()).toISOString(),
    };
    this.replaceRequest(updated);

    const hasOtherActive = this.snapshot.requests.some((candidate) => (
      candidate.id !== id && candidate.employeeId === staffId && candidate.status === 'accepted'
    ));
    if (!hasOtherActive) {
      this.setEmployeeStatus(staffId, 'available');
      this.emit({ type: 'employee:status_changed', employeeId: staffId, status: 'available', at: this.isoNow() });
    }
    this.emit({ type: 'session:ended', requestId: id, outcome, at: this.isoNow() });
    return this.clone(updated);
  }

  advanceClock(ms: number): void {
    if (!Number.isFinite(ms) || ms < 0) throw new DemoTransitionError('VALIDATION_ERROR', 'قيمة الوقت غير صالحة.');
    this.logicalNowMs += ms;
    const expiredIds = this.snapshot.requests
      .filter((request) => request.status === 'pending' && Date.parse(request.expiresAt) <= this.logicalNowMs)
      .map((request) => request.id);
    expiredIds.forEach((id) => this.expireRequest(id));
  }

  subscribe(listener: Subscriber): () => void {
    this.listeners.add(listener);
    listener(null, this.getSnapshot());
    return () => this.listeners.delete(listener);
  }

  getSnapshot(): DemoSnapshot {
    return this.clone(this.snapshot);
  }

  getDiagnostics() {
    return { timerCount: this.timeoutHandles.size, listenerCount: this.listeners.size } as const;
  }

  reset(): void {
    this.clearTimers();
    this.logicalNowMs = FIXTURE_TIME_MS;
    this.sequence = 1;
    this.snapshot = createSeedSnapshot();
    this.notify(null);
  }

  dispose(): void {
    this.clearTimers();
    this.listeners.clear();
  }

  private scheduleTimeout(requestId: string) {
    const handle = this.scheduler.setTimeout(() => {
      this.timeoutHandles.delete(requestId);
      this.advanceClock(this.timeoutMs);
    }, this.timeoutMs);
    this.timeoutHandles.set(requestId, handle);
  }

  private expireRequest(id: string) {
    const request = this.requireRequest(id);
    if (request.status !== 'pending') return;
    this.clearRequestTimer(id);
    this.replaceRequest({ ...request, status: 'expired' });
    this.emit({ type: 'contact_request:timeout', requestId: id, at: this.isoNow() });
  }

  private requireRequest(id: string) {
    const request = this.snapshot.requests.find((candidate) => candidate.id === id);
    if (!request) throw new DemoTransitionError('NOT_FOUND', 'الطلب التجريبي غير موجود.');
    return request;
  }

  private replaceRequest(updated: ContactRequest) {
    this.snapshot = {
      ...this.snapshot,
      requests: this.snapshot.requests.map((request) => request.id === updated.id ? updated : request),
    };
  }

  private setEmployeeStatus(id: string, status: Employee['status']) {
    this.snapshot = {
      ...this.snapshot,
      employees: this.snapshot.employees.map((employee) => employee.id === id ? { ...employee, status } : employee),
    };
  }

  private clearRequestTimer(id: string) {
    const handle = this.timeoutHandles.get(id);
    if (handle !== undefined) this.scheduler.clearTimeout(handle);
    this.timeoutHandles.delete(id);
  }

  private clearTimers() {
    this.timeoutHandles.forEach((handle) => this.scheduler.clearTimeout(handle));
    this.timeoutHandles.clear();
  }

  private emit(event: DemoEvent) {
    this.snapshot = { ...this.snapshot, events: [...this.snapshot.events, event] };
    this.notify(event);
  }

  private notify(event: DemoEvent | null) {
    const snapshot = this.getSnapshot();
    this.listeners.forEach((listener) => listener(event, snapshot));
  }

  private tick() {
    this.logicalNowMs += 1000;
    return this.logicalNowMs;
  }

  private isoNow() {
    return new Date(this.logicalNowMs).toISOString();
  }

  private clone<T>(value: T): T {
    return structuredClone(value);
  }
}
