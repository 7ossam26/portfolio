import { useState } from 'react';
import type { Roll, SalePreview } from '../domain/types';
import { formatMoney, formatQuantity, parseMoneyToPiastres, unitLabel } from '../format';

interface Props {
  rolls: readonly Roll[];
  selectedRoll: Roll | null;
  price: string;
  preview: SalePreview | null;
  onPriceChange(value: string): void;
  onSelectRoll(roll: Roll): void;
  onPay(): void;
}

export function PosView({ rolls, selectedRoll, price, preview, onPriceChange, onSelectRoll, onPay }: Props) {
  const [query, setQuery] = useState('');
  // The pay control is disabled while the price is unparseable; say why instead of
  // leaving the visitor with a dead button and an em dash line total.
  const priceInvalid = selectedRoll !== null && parseMoneyToPiastres(price) === null;
  const shownRolls = rolls.filter((roll) => roll.status === 'in_stock' && `${roll.fabricNameAr} ${roll.rollSerial} ${roll.barcode}`.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <main className="pos-layout">
      <section className="products-panel" aria-labelledby="products-title">
        <div className="section-heading">
          <div><p className="eyebrow">مخزون المحل</p><h1 id="products-title">نقطة البيع</h1><p>اختر التوب المحدد لإضافته إلى الفاتورة</p></div>
          <label className="search-box"><span>⌕</span><span className="sr-only">بحث في الأتواب</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث بالاسم أو رقم التوب" /></label>
        </div>

        <div className="source-note"><strong>بيع توب كامل</strong><span>الكمية ووحدتها تأتيان من سجل التوب ولا يمكن تجزئتهما في هذا الإصدار.</span></div>

        <div className="roll-grid">
          {shownRolls.map((roll) => {
            const selected = selectedRoll?.id === roll.id;
            return <article className={`roll-card${selected ? ' selected' : ''}`} key={roll.id} data-roll-id={roll.id}>
              <div className="roll-card-top"><span className="roll-icon">▧</span><span className="availability"><i />متاح</span></div>
              <h2>{roll.fabricNameAr}</h2>
              <p>{roll.brandAr}</p>
              <div className="chips"><span>{roll.gradeAr}</span><span>{roll.widthCm} سم</span><span>{roll.colorAr}</span></div>
              <dl>
                <div><dt>رقم التوب</dt><dd dir="ltr">{roll.rollSerial}</dd></div>
                <div><dt>الكمية</dt><dd dir="ltr">{formatQuantity(roll.quantityMilliunits)} <span>{unitLabel(roll.unit)}</span></dd></div>
                <div><dt>السعر المرجعي / {unitLabel(roll.unit)}</dt><dd dir="ltr">{formatMoney(roll.referencePricePiastresPerUnit)}</dd></div>
              </dl>
              <button type="button" className={selected ? 'secondary-button' : 'primary-button'} onClick={() => onSelectRoll(roll)}>{selected ? 'إزالة من الفاتورة' : 'إضافة للفاتورة'}</button>
            </article>;
          })}
        </div>
      </section>

      <aside className="cart-card" aria-labelledby="cart-title">
        <div className="cart-title"><span>▤</span><h2 id="cart-title">الفاتورة الحالية</h2>{selectedRoll ? <b>1</b> : null}</div>
        {!selectedRoll ? <div className="empty-cart"><span>▱</span><p>لم تتم إضافة أتواب بعد</p><small>اختر التوب RMX-M-0701 لبدء السيناريو</small></div> : <>
          <article className="cart-line">
            <div className="cart-line-heading"><div><h3>{selectedRoll.fabricNameAr}</h3><p>{selectedRoll.brandAr}</p></div><span dir="ltr">{selectedRoll.rollSerial}</span></div>
            <div className="chips"><span>{selectedRoll.colorAr}</span><span>{selectedRoll.widthCm} سم</span></div>
            <div className="locked-quantity"><span><b>الكمية المباعة</b><small>مأخوذة من التوب الكامل</small></span><strong dir="ltr">{formatQuantity(selectedRoll.quantityMilliunits)} {unitLabel(selectedRoll.unit)}</strong><i aria-label="للقراءة فقط">قفل</i></div>
            <label className="field-label">السعر النهائي / {unitLabel(selectedRoll.unit)}<input dir="ltr" inputMode="decimal" value={price} onChange={(event) => onPriceChange(event.target.value)} aria-label={`السعر النهائي لكل ${unitLabel(selectedRoll.unit)}`} aria-invalid={priceInvalid} aria-describedby={priceInvalid ? 'price-format-error' : undefined} /></label>
            {priceInvalid ? <p className="field-error" id="price-format-error" role="alert">أدخل سعرًا صحيحًا بدقة قرشين، مثل 185.00</p> : null}
            <div className="line-total"><span>إجمالي السطر</span><strong dir="ltr">{preview ? formatMoney(preview.totalPiastres) : '—'} EGP</strong></div>
          </article>
        </>}
        <div className="cart-summary"><div><span>الإجمالي قبل الضريبة</span><strong dir="ltr">{preview ? formatMoney(preview.subtotalPiastres) : '0.00'}</strong></div><div className="grand-total"><span>الإجمالي</span><strong dir="ltr">{preview ? formatMoney(preview.totalPiastres) : '0.00'} EGP</strong></div></div>
        <button type="button" className="pay-button" disabled={!preview} onClick={onPay}><span>◇</span>الدفع</button>
        <p className="cash-only">العرض المحلي يدعم الدفع النقدي الكامل فقط</p>
      </aside>
    </main>
  );
}
