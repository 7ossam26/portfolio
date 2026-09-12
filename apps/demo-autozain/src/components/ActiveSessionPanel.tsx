import { useState } from 'react';
import type { CarSummary, CompletionOutcome, ContactRequest } from '../domain/types';
import { Icon } from './Icon';

interface Props {
  readonly request: ContactRequest;
  readonly car: CarSummary;
  readonly onComplete: (outcome: CompletionOutcome) => Promise<void>;
}

export function ActiveSessionPanel({ request, car, onComplete }: Props) {
  const [outcome, setOutcome] = useState<CompletionOutcome>('interested');
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');

  async function complete() {
    setWorking(true);
    setError('');
    try {
      await onComplete(outcome);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'فشل إنهاء الجلسة التجريبية.');
    } finally {
      setWorking(false);
    }
  }

  return (
    <section className="active-session-panel">
      <div>
        <p className="section-kicker">جلسة شغالة · طلب #{request.id.replace('demo-request-', '')}</p>
        <h2>{request.buyerName}</h2>
        <div className="safe-phone compact"><Icon name="phone" /><span>{request.buyerPhone}</span><small>الاتصال معطّل</small></div>
        <p className="active-car">مهتم بـ: {car.carType} {car.model}</p>
      </div>
      <div className="session-outcome">
        <label>نتيجة الجلسة
          <select value={outcome} onChange={(event) => setOutcome(event.target.value as CompletionOutcome)}>
            <option value="interested">مهتم</option>
            <option value="sold">اتباعت</option>
            <option value="no_answer">ما ردش</option>
            <option value="cancelled">اتلغى</option>
          </select>
        </label>
        <button type="button" className="primary-button" disabled={working} onClick={complete}>
          <Icon name="check" /> {working ? 'جاري التسجيل…' : 'إنهاء الجلسة'}
        </button>
        {error && <p className="form-error" role="alert">{error}</p>}
      </div>
    </section>
  );
}
