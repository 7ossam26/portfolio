import type { Invoice } from '../domain/types';
import { formatMoney, formatQuantity, unitLabel } from '../format';

export function InvoiceView({ invoice, onShowStock }: { invoice: Invoice; onShowStock(): void }) {
  return <main className="document-page">
    <section className="result-banner"><div className="result-icon">✓</div><div><p className="eyebrow">تم البيع بنجاح</p><h1>حُفظت الفاتورة وبيانات الكمية</h1><p>الكمية والوحدة أدناه نسخة ثابتة من لحظة البيع، وليستا قراءة جديدة من شاشة المخزون.</p></div><button type="button" className="primary-button" onClick={onShowStock}>عرض حالة المخزون</button></section>

    <article className="invoice-document" aria-labelledby="invoice-title">
      <header><div className="invoice-brand"><span>R</span><div><h2 id="invoice-title">Ramex</h2><p>فاتورة بيع — بيانات عينة</p></div></div><div className="invoice-number"><small>رقم الفاتورة</small><strong dir="ltr">{invoice.invoiceNo}</strong><span dir="ltr">12/09/2026 · 10:30</span></div></header>
      <div className="invoice-parties"><dl><div><dt>العميل</dt><dd>{invoice.customer.nameAr}</dd></div><div><dt>كود العميل</dt><dd dir="ltr">{invoice.customer.code}</dd></div></dl><dl><div><dt>الكاشير</dt><dd>{invoice.cashier.nameAr}</dd></div><div><dt>الوردية</dt><dd dir="ltr">#{invoice.shiftId}</dd></div></dl></div>
      <div className="table-scroll invoice-scroll" tabIndex={0} aria-label="جدول بنود الفاتورة قابل للتمرير أفقيًا">
        <table><thead><tr><th>الصنف</th><th>رقم التوب</th><th>الكمية المحفوظة</th><th>سعر الوحدة</th><th>الإجمالي</th></tr></thead><tbody>{invoice.lines.map((line) => <tr key={line.rollId}><td><b>{line.fabricNameAr}</b><small>{line.colorAr}</small></td><td dir="ltr">{line.rollSerial}</td><td dir="ltr"><strong>{formatQuantity(line.quantityMilliunits)}</strong> {unitLabel(line.quantityUnit)}</td><td dir="ltr">{formatMoney(line.finalPricePiastresPerUnit)}</td><td dir="ltr"><strong>{formatMoney(line.lineTotalPiastres)}</strong></td></tr>)}</tbody></table>
      </div>
      <div className="invoice-footer"><div className="snapshot-proof"><span>▣</span><div><strong>Invoice quantity snapshot</strong><p dir="ltr">30.000 meter · · RMX-M-0701</p></div></div><dl><div><dt>الإجمالي</dt><dd dir="ltr">{formatMoney(invoice.totalPiastres)} EGP</dd></div><div><dt>مدفوع نقدًا</dt><dd dir="ltr">{formatMoney(invoice.paidPiastres)} EGP</dd></div><div className="invoice-balance"><dt>المتبقي</dt><dd dir="ltr">0.00 EGP</dd></div></dl></div>
    </article>
  </main>;
}
