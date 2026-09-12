import type { CarSummary, CompletionOutcome, ContactRequest, DemoEvent, Employee } from '../domain/types';
import { ActiveSessionPanel } from './ActiveSessionPanel';
import { Icon } from './Icon';
import { IncomingRequestOverlay } from './IncomingRequestOverlay';
import { outcomeLabel } from './RequestConfirmation';

interface Props {
  readonly employee: Employee;
  readonly requests: readonly ContactRequest[];
  readonly cars: readonly CarSummary[];
  readonly events: readonly DemoEvent[];
  readonly onAccept: (id: string) => Promise<void>;
  readonly onReject: (id: string) => Promise<void>;
  readonly onComplete: (id: string, outcome: CompletionOutcome) => Promise<void>;
  readonly onBuyer: () => void;
}

const eventLabels: Record<DemoEvent['type'], string> = {
  'contact_request:new': 'وصل طلب تواصل',
  'contact_request:accepted': 'تم قبول الطلب',
  'contact_request:rejected': 'تم رفض الطلب',
  'contact_request:timeout': 'انتهى وقت الطلب',
  'employee:status_changed': 'تغيّرت حالة الموظف',
  'session:ended': 'انتهت الجلسة',
};

export function StaffDashboard({ employee, requests, cars, events, onAccept, onReject, onComplete, onBuyer }: Props) {
  const pending = requests.find((request) => request.status === 'pending');
  const active = requests.find((request) => request.status === 'accepted');
  const latest = requests.at(-1);
  const carFor = (request: ContactRequest) => cars.find((car) => car.id === request.interestedCarId) ?? cars[0];

  return (
    <div className="staff-layout" id="main-content">
      <aside className="staff-sidebar" aria-label="قائمة الموظف التجريبية">
        <a className="staff-logo" href="#staff" onClick={(event) => event.preventDefault()}><Icon name="car" /> أوتوزين</a>
        <nav>
          <span className="nav-active"><Icon name="signal" /> الرئيسية</span>
          <span><Icon name="car" /> العربيات</span>
          <span><Icon name="user" /> الفريق</span>
        </nav>
        <div className="staff-identity"><strong>{employee.fullName}</strong><small>موظفة · شخصية تجريبية</small></div>
      </aside>
      <div className="staff-main">
        <header className="staff-header">
          <div><span className={`employee-status ${employee.status}`}><i />{employee.status === 'busy' ? 'مشغولة' : 'متاحة'}</span></div>
          <div className="avatar">{employee.fullName[0]}</div>
        </header>
        <main className="staff-content">
          <div className="staff-page-heading">
            <div><p className="section-kicker">لوحة الموظف الأصلية · نطاق محدود</p><h1>الرئيسية</h1></div>
            <button type="button" className="secondary-button" onClick={onBuyer}>الرجوع للمشتري</button>
          </div>

          {active && <ActiveSessionPanel request={active} car={carFor(active)} onComplete={(outcome) => onComplete(active.id, outcome)} />}

          <section className="staff-summary-grid">
            <div><Icon name="clock" /><span>طلبات في الانتظار</span><strong>{requests.filter((request) => request.status === 'pending').length}</strong></div>
            <div><Icon name="signal" /><span>جلسات شغالة</span><strong>{requests.filter((request) => request.status === 'accepted').length}</strong></div>
            <div><Icon name="check" /><span>جلسات مكتملة</span><strong>{requests.filter((request) => request.status === 'completed').length}</strong></div>
          </section>

          <div className="staff-columns">
            <section className="surface history-card">
              <h2>سجل الطلب التجريبي</h2>
              {!latest && <p className="muted">ابدأ من شخصية المشتري لإنشاء طلب.</p>}
              {latest && (
                <div className="request-history-row">
                  <div><strong>{latest.buyerName}</strong><span>{carFor(latest).carType} {carFor(latest).model}</span></div>
                  <span className={`request-badge ${latest.status}`}>{requestStatusLabel(latest)}</span>
                </div>
              )}
            </section>
            <section className="surface event-card">
              <h2>الأحداث المحلية</h2>
              <ol>
                {events.slice(-5).reverse().map((event, index) => (
                  <li key={`${event.type}-${event.at}-${index}`}><i /><span>{eventLabels[event.type]}</span><time>{new Date(event.at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</time></li>
                ))}
              </ol>
              {events.length === 0 && <p className="muted">لا توجد أحداث حتى الآن.</p>}
            </section>
          </div>
        </main>
      </div>
      {pending && <IncomingRequestOverlay request={pending} car={carFor(pending)} onAccept={() => onAccept(pending.id)} onReject={() => onReject(pending.id)} />}
    </div>
  );
}

function requestStatusLabel(request: ContactRequest) {
  if (request.status === 'completed') return `مكتمل · ${outcomeLabel(request.outcome)}`;
  return ({ pending: 'في الانتظار', accepted: 'مقبول', rejected: 'مرفوض', expired: 'انتهى الوقت' } as const)[request.status];
}
