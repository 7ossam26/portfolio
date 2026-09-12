export type Persona = 'buyer' | 'staff';
export type EmployeeStatus = 'available' | 'busy' | 'offline';
export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'expired' | 'completed';
export type CompletionOutcome = 'sold' | 'interested' | 'no_answer' | 'cancelled';

export interface CarSummary {
  readonly id: string;
  readonly carType: string;
  readonly model: string;
  readonly listingPrice: number;
  readonly transmission: 'automatic' | 'manual';
  readonly fuelType: 'benzine' | 'diesel' | 'electric' | 'hybrid';
  readonly odometer: number;
  readonly color: string;
  readonly year: number;
  readonly images: readonly string[];
  readonly additionalInfo: string;
}

export interface CarFilters {
  readonly search?: string;
  readonly carType?: string;
  readonly transmission?: '' | 'automatic' | 'manual';
}

export interface Employee {
  readonly id: string;
  readonly fullName: string;
  readonly role: 'employee';
  readonly status: EmployeeStatus;
}

export interface ContactRequest {
  readonly id: string;
  readonly buyerName: string;
  readonly buyerPhone: string;
  readonly employeeId: string;
  readonly interestedCarId: string;
  readonly status: RequestStatus;
  readonly outcome: CompletionOutcome | null;
  readonly createdAt: string;
  readonly acceptedAt: string | null;
  readonly completedAt: string | null;
  readonly expiresAt: string;
}

export type DemoEvent =
  | { readonly type: 'contact_request:new'; readonly requestId: string; readonly at: string }
  | { readonly type: 'contact_request:accepted'; readonly requestId: string; readonly at: string }
  | { readonly type: 'contact_request:rejected'; readonly requestId: string; readonly at: string }
  | { readonly type: 'contact_request:timeout'; readonly requestId: string; readonly at: string }
  | { readonly type: 'employee:status_changed'; readonly employeeId: string; readonly status: EmployeeStatus; readonly at: string }
  | { readonly type: 'session:ended'; readonly requestId: string; readonly outcome: CompletionOutcome | null; readonly at: string };

export interface DemoSnapshot {
  readonly cars: readonly CarSummary[];
  readonly employees: readonly Employee[];
  readonly requests: readonly ContactRequest[];
  readonly events: readonly DemoEvent[];
}

export interface CreateContactRequestInput {
  readonly buyerName: string;
  readonly buyerPhone: string;
  readonly employeeId: string;
  readonly carId: string;
}

export interface Scheduler {
  now(): number;
  setTimeout(callback: () => void, delayMs: number): unknown;
  clearTimeout(handle: unknown): void;
}
