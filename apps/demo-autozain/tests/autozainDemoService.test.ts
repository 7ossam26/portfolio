import assert from 'node:assert/strict';
import test from 'node:test';
import { sampleBuyer } from '../src/domain/fixtures.ts';
import type { Scheduler } from '../src/domain/types.ts';
import { AutoZainDemoService, DemoTransitionError } from '../src/services/autozainDemoService.ts';

class FakeScheduler implements Scheduler {
  private clock = Date.parse('2026-09-12T10:00:00.000Z');
  private sequence = 1;
  readonly tasks = new Map<number, () => void>();

  now() { return this.clock; }
  setTimeout(callback: () => void) {
    const id = this.sequence++;
    this.tasks.set(id, callback);
    return id;
  }
  clearTimeout(handle: unknown) { this.tasks.delete(handle as number); }
  runAll() {
    const tasks = [...this.tasks.values()];
    this.tasks.clear();
    tasks.forEach((task) => task());
  }
}

const createPending = async (service: AutoZainDemoService) => service.createRequest({
  buyerName: sampleBuyer.name,
  buyerPhone: sampleBuyer.phone,
  employeeId: 'demo-staff-11',
  carId: 'demo-car-az-101',
});

test('buyer request remains consistent through staff acceptance and completion', async () => {
  const scheduler = new FakeScheduler();
  const service = new AutoZainDemoService(scheduler, 15_000);
  const request = await createPending(service);

  assert.equal(request.status, 'pending');
  assert.equal(service.getDiagnostics().timerCount, 1);
  assert.equal((await service.listMyRequests('buyer'))[0]?.status, 'pending');
  assert.equal((await service.listMyRequests('staff'))[0]?.status, 'pending');

  await service.respond(request.id, 'accept');
  let snapshot = service.getSnapshot();
  assert.equal(snapshot.requests[0]?.status, 'accepted');
  assert.equal(snapshot.employees.find((employee) => employee.id === 'demo-staff-11')?.status, 'busy');
  assert.equal(service.getDiagnostics().timerCount, 0);

  await service.complete(request.id, 'interested');
  snapshot = service.getSnapshot();
  assert.equal(snapshot.requests[0]?.status, 'completed');
  assert.equal(snapshot.requests[0]?.outcome, 'interested');
  assert.equal(snapshot.employees.find((employee) => employee.id === 'demo-staff-11')?.status, 'available');
  assert.deepEqual(snapshot.events.map((event) => event.type), [
    'contact_request:new',
    'employee:status_changed',
    'contact_request:accepted',
    'employee:status_changed',
    'session:ended',
  ]);
});

test('invalid and repeated transitions are rejected without mutation', async () => {
  const service = new AutoZainDemoService(new FakeScheduler(), 15_000);
  const request = await createPending(service);
  const before = service.getSnapshot();

  await assert.rejects(() => service.complete(request.id, 'interested'), (error: unknown) => (
    error instanceof DemoTransitionError && error.code === 'INVALID_STATE'
  ));
  assert.deepEqual(service.getSnapshot(), before);

  await service.respond(request.id, 'accept');
  const accepted = service.getSnapshot();
  await assert.rejects(() => service.respond(request.id, 'accept'), (error: unknown) => (
    error instanceof DemoTransitionError && error.code === 'INVALID_STATE'
  ));
  assert.deepEqual(service.getSnapshot(), accepted);
});

test('rejection keeps the employee available and cannot be completed', async () => {
  const service = new AutoZainDemoService(new FakeScheduler(), 15_000);
  const request = await createPending(service);
  await service.respond(request.id, 'reject');

  const snapshot = service.getSnapshot();
  assert.equal(snapshot.requests[0]?.status, 'rejected');
  assert.equal(snapshot.employees[0]?.status, 'available');
  assert.equal(service.getDiagnostics().timerCount, 0);
  await assert.rejects(() => service.complete(request.id, 'sold'), /غير مقبول/);
});

test('timeout is deterministic and prevents a late staff response', async () => {
  const service = new AutoZainDemoService(new FakeScheduler(), 15_000);
  const request = await createPending(service);
  service.advanceClock(15_000);

  const snapshot = service.getSnapshot();
  assert.equal(snapshot.requests[0]?.status, 'expired');
  assert.equal(snapshot.events.at(-1)?.type, 'contact_request:timeout');
  assert.equal(snapshot.employees[0]?.status, 'available');
  await assert.rejects(() => service.respond(request.id, 'accept'), /لم يعد في حالة انتظار/);
});

test('reset and dispose clear pending timers and listeners', async () => {
  const scheduler = new FakeScheduler();
  const service = new AutoZainDemoService(scheduler, 15_000);
  const events: string[] = [];
  service.subscribe((event) => { if (event) events.push(event.type); });
  await createPending(service);

  assert.deepEqual(service.getDiagnostics(), { timerCount: 1, listenerCount: 1 });
  service.reset();
  assert.deepEqual(service.getDiagnostics(), { timerCount: 0, listenerCount: 1 });
  assert.equal(service.getSnapshot().requests.length, 0);
  scheduler.runAll();
  assert.equal(service.getSnapshot().requests.length, 0);
  assert.deepEqual(events, ['contact_request:new']);

  service.dispose();
  assert.deepEqual(service.getDiagnostics(), { timerCount: 0, listenerCount: 0 });
});

test('busy or unknown employees cannot receive a demo request', async () => {
  const service = new AutoZainDemoService(new FakeScheduler(), 15_000);
  await assert.rejects(() => service.createRequest({
    buyerName: sampleBuyer.name,
    buyerPhone: sampleBuyer.phone,
    employeeId: 'demo-staff-12',
    carId: 'demo-car-az-101',
  }), (error: unknown) => error instanceof DemoTransitionError && error.code === 'EMPLOYEE_NOT_AVAILABLE');

  assert.equal(service.getSnapshot().requests.length, 0);
});
