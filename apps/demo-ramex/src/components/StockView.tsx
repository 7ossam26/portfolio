import type { Roll } from '../domain/types';
import { formatMoney, formatQuantity, unitLabel } from '../format';

export function StockView({ rolls, soldRollId }: { rolls: readonly Roll[]; soldRollId: number | null }) {
  const inStock = rolls.filter((roll) => roll.status === 'in_stock');
  const totalMeters = inStock.reduce((sum, roll) => sum + roll.quantityMilliunits, 0);
  const soldRoll = rolls.find((roll) => roll.id === soldRollId);
  return <main className="stock-page">
    <div className="section-heading stock-heading"><div><p className="eyebrow">متابعة الأتواب</p><h1>المخزون الحالي</h1><p>كل توب سجل مستقل حتى عندما يتشارك القماش واللون</p></div><div className="stock-kpis"><div><small>المتاح للبيع</small><strong dir="ltr">{inStock.length}</strong><span>توب</span></div><div><small>إجمالي المتر المتاح</small><strong dir="ltr">{formatQuantity(totalMeters)}</strong><span>متر</span></div></div></div>
    {soldRoll ? <div className="reconcile-banner"><span>✓</span><div><strong>تمت مطابقة نتيجة البيع</strong><p>التوب {soldRoll.rollSerial} أصبح مباعًا. {inStock.map((roll) => `التوب ${roll.rollSerial} ما زال متاحًا بكمية ${formatQuantity(roll.quantityMilliunits)} ${unitLabel(roll.unit)}.`).join(' ') || 'لا توجد أتواب متاحة للبيع.'}</p></div></div> : <div className="source-note"><strong>الحالة الأصلية</strong><span>كلا التوبين مستقل ومتاح قبل إنشاء الفاتورة.</span></div>}
    <section className="stock-table-card" aria-labelledby="stock-table-title"><header><div><h2 id="stock-table-title">سجل الأتواب</h2><p>المخزن: المحل · بيانات تجريبية</p></div><span>{rolls.length} سجلات</span></header>
      <div className="table-scroll" tabIndex={0} aria-label="جدول المخزون قابل للتمرير أفقيًا"><table><thead><tr><th>التوب</th><th>القماش / اللون</th><th>الوحدة</th><th>الكمية</th><th>السعر المرجعي</th><th>المخزن</th><th>الحالة</th></tr></thead><tbody>{rolls.map((roll) => <tr key={roll.id} className={roll.status === 'sold' ? 'sold-row' : ''} data-stock-roll={roll.id}><td><strong dir="ltr">{roll.rollSerial}</strong><small dir="ltr">{roll.barcode}</small></td><td><b>{roll.fabricNameAr}</b><small>{roll.colorAr} · {roll.colorCode}</small></td><td>{unitLabel(roll.unit)}</td><td dir="ltr"><strong>{formatQuantity(roll.quantityMilliunits)}</strong></td><td dir="ltr">{formatMoney(roll.referencePricePiastresPerUnit)}</td><td>المحل</td><td><span className={`status-pill ${roll.status}`}>{roll.status === 'sold' ? 'مباع · غير متاح' : 'متاح للبيع'}</span></td></tr>)}</tbody></table></div>
    </section>
    <p className="stock-footnote">تظل كمية التوب المباع ظاهرة في سجل المخزون للتعريف به، بينما تمنع حالته إضافته إلى بيع جديد.</p>
  </main>;
}
