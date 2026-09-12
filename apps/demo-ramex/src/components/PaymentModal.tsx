import { useEffect, useRef } from 'react';
import type { DemoCustomer, SalePreview } from '../domain/types';
import { formatMoney } from '../format';

interface Props {
  customer: DemoCustomer;
  preview: SalePreview;
  submitting: boolean;
  onCancel(): void;
  onSubmit(): void;
}

export function PaymentModal({ customer, preview, submitting, onCancel, onSubmit }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { cancelRef.current?.focus(); }, []);

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !submitting && onCancel()}>
    <section className="payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-title">
      <header><div><p className="eyebrow">فاتورة نقدية مكتملة</p><h2 id="payment-title">إتمام الدفع</h2></div><button ref={cancelRef} type="button" aria-label="إغلاق" disabled={submitting} onClick={onCancel}>×</button></header>
      <div className="customer-card"><span className="customer-icon">ش</span><div><small>العميل</small><strong>{customer.nameAr}</strong><span dir="ltr">{customer.code}</span></div><b>محدد</b></div>
      <div className="payment-choice"><span className="radio-selected" /> <span><strong>نقدي</strong><small>وسيلة الدفع الوحيدة في العرض المحلي</small></span></div>
      <label className="field-label">المبلغ النقدي<input readOnly dir="ltr" value={formatMoney(preview.totalPiastres)} aria-label="المبلغ النقدي" /></label>
      <dl className="payment-totals"><div><dt>إجمالي الفاتورة</dt><dd dir="ltr">{formatMoney(preview.totalPiastres)} EGP</dd></div><div><dt>المدفوع</dt><dd dir="ltr">{formatMoney(preview.totalPiastres)} EGP</dd></div><div><dt>المتبقي</dt><dd dir="ltr">0.00 EGP</dd></div></dl>
      <p className="atomic-note"><span>✓</span>سيُنشأ سجل الفاتورة وتتحول حالة التوب المحدد إلى مباع معًا.</p>
      <div className="modal-actions"><button type="button" className="secondary-button" disabled={submitting} onClick={onCancel}>رجوع</button><button type="button" className="primary-button" disabled={submitting} onClick={onSubmit}>{submitting ? <><span className="button-spinner" />جارٍ تسجيل البيع…</> : 'تأكيد البيع والدفع'}</button></div>
    </section>
  </div>;
}
