import { useEffect, useRef, useState } from 'react';
import type { CarSummary, ContactRequest } from '../domain/types';
import { Icon } from './Icon';

interface Props {
  readonly request: ContactRequest;
  readonly car: CarSummary;
  readonly onAccept: () => Promise<void>;
  readonly onReject: () => Promise<void>;
}

export function IncomingRequestOverlay({ request, car, onAccept, onReject }: Props) {
  const [working, setWorking] = useState<'accept' | 'reject' | null>(null);
  const [error, setError] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => { headingRef.current?.focus(); }, []);

  async function act(action: 'accept' | 'reject') {
    setWorking(action);
    setError('');
    try {
      await (action === 'accept' ? onAccept() : onReject());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'فشل الإجراء التجريبي.');
    } finally {
      setWorking(null);
    }
  }

  return (
    <div className="inner-overlay staff-request-overlay" role="dialog" aria-modal="true" aria-labelledby="incoming-title">
      <div className="inner-backdrop" />
      <section className="incoming-card">
        <div className="incoming-heading">
          <div>
            <p className="section-kicker">طلب تواصل جديد · حدث محلي</p>
            <h2 id="incoming-title" tabIndex={-1} ref={headingRef}>{request.buyerName}</h2>
          </div>
          <span className="status-dot-label"><i /> في الانتظار</span>
        </div>
        <div className="safe-phone"><Icon name="phone" /><span>{request.buyerPhone}</span><small>عرض فقط · الاتصال معطّل</small></div>
        <div className="selected-car-line"><Icon name="car" /> مهتم بـ: <strong>{car.carType} {car.model}</strong></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="incoming-actions">
          <button type="button" className="secondary-button" disabled={working !== null} onClick={() => act('reject')}>
            <Icon name="close" /> {working === 'reject' ? 'جاري الرفض…' : 'رفض'}
          </button>
          <button type="button" className="primary-button" disabled={working !== null} onClick={() => act('accept')}>
            <Icon name="check" /> {working === 'accept' ? 'جاري القبول…' : 'قبول'}
          </button>
        </div>
      </section>
    </div>
  );
}
