import { useEffect, useState } from 'react';
import type { CarSummary, ContactRequest, Employee } from '../domain/types';
import { Icon } from './Icon';

const statusLabels: Record<ContactRequest['status'], string> = {
  pending: 'في انتظار رد الموظف',
  accepted: 'تم قبول الطلب',
  rejected: 'تم رفض الطلب',
  expired: 'انتهى وقت الطلب',
  completed: 'تم تسجيل النتيجة',
};

interface Props {
  readonly request: ContactRequest;
  readonly employee: Employee;
  readonly car: CarSummary;
  readonly timeoutMs: number;
  readonly onStaff: () => void;
  readonly onTimeout: () => void;
}

export function RequestConfirmation({ request, employee, car, timeoutMs, onStaff, onTimeout }: Props) {
  const [remaining, setRemaining] = useState(timeoutMs);

  useEffect(() => {
    if (request.status !== 'pending') return undefined;
    const deadline = Date.now() + timeoutMs;
    setRemaining(timeoutMs);
    const timer = window.setInterval(() => {
      setRemaining(Math.max(0, deadline - Date.now()));
    }, 250);
    return () => window.clearInterval(timer);
  }, [request.id, request.status, timeoutMs]);

  const seconds = Math.max(0, Math.ceil(remaining / 1000));

  return (
    <section className={`confirmation-panel status-${request.status}`} aria-live="polite">
      <Icon name={request.status === 'pending' ? 'clock' : 'check'} />
      <div className="confirmation-copy">
        <p className="section-kicker">طلب #{request.id.replace('demo-request-', '')}</p>
        <h2>{statusLabels[request.status]}</h2>
        <p>{car.carType} {car.model} · {employee.fullName}</p>
        {request.status === 'completed' && <p className="outcome-line">النتيجة: {outcomeLabel(request.outcome)}</p>}
      </div>
      {request.status === 'pending' && (
        <div className="confirmation-actions">
          <span className="countdown" aria-label={`متبقي ${seconds} ثانية`}>00:{String(seconds).padStart(2, '0')}</span>
          <button type="button" className="primary-button" onClick={onStaff}>الانتقال للموظف</button>
          <button type="button" className="text-button" onClick={onTimeout}>تجربة انتهاء الوقت فوراً</button>
        </div>
      )}
    </section>
  );
}

export function outcomeLabel(outcome: ContactRequest['outcome']) {
  return ({ sold: 'اتباعت', interested: 'مهتم', no_answer: 'ما ردش', cancelled: 'اتلغى' } as const)[outcome ?? 'interested'];
}
