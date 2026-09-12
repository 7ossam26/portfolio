import { useEffect, useRef, useState } from 'react';
import { sampleBuyer } from '../domain/fixtures';
import type { CarSummary, CreateContactRequestInput, Employee } from '../domain/types';
import { Icon } from './Icon';

interface Props {
  readonly employee: Employee;
  readonly car: CarSummary;
  readonly onClose: () => void;
  readonly onSubmit: (input: CreateContactRequestInput) => Promise<void>;
}

export function ContactRequestModal({ employee, car, onClose, onSubmit }: Props) {
  const [name, setName] = useState<string>(sampleBuyer.name);
  const [phone, setPhone] = useState<string>(sampleBuyer.phone);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [onClose]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setWorking(true);
    setError('');
    try {
      await onSubmit({ buyerName: name, buyerPhone: phone, employeeId: employee.id, carId: car.id });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'حصل خطأ في التجربة.');
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="inner-overlay" role="dialog" aria-modal="true" aria-labelledby="contact-title">
      <div className="inner-backdrop" onClick={onClose} />
      <div className="request-modal">
        <button type="button" className="modal-close" onClick={onClose} aria-label="إغلاق"><Icon name="close" /></button>
        <p className="section-kicker">بيانات خيالية قابلة للتعديل</p>
        <h2 id="contact-title" tabIndex={-1} ref={headingRef}>تواصل مع {employee.fullName}</h2>
        <p>هنحفظ الطلب داخل جلسة العرض دي فقط. لن يتم إرسال أي شيء.</p>
        <div className="selected-car-line"><Icon name="car" /> مهتم بـ: <strong>{car.carType} {car.model}</strong></div>
        <form onSubmit={submit}>
          <label>الاسم<input required value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label>رقم الموبايل<input required inputMode="numeric" value={phone} onChange={(event) => setPhone(event.target.value)} /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="primary-button" disabled={working || !name.trim() || !phone.trim()}>
            {working ? 'بنسجل الطلب محلياً…' : 'إرسال الطلب التجريبي'}
          </button>
        </form>
      </div>
    </div>
  );
}
