import { useCallback, useEffect, useRef, useState } from 'react';
import { InvoiceView } from './components/InvoiceView';
import { PaymentModal } from './components/PaymentModal';
import { PosView } from './components/PosView';
import { StockView } from './components/StockView';
import type { DemoCustomer, DemoPersona, DemoShift, Invoice, Roll, SalePreview } from './domain/types';
import { formatMoney, formatQuantity, parseMoneyToPiastres } from './format';
import { isEmbedded, postDemoMessage } from './frameBridge';
import { RamexDemoService } from './services/ramexDemoService';

type View = 'pos' | 'invoice' | 'stock';

const errorCopy: Record<string, string> = {
  ROLL_NOT_AVAILABLE: 'هذا التوب مباع أو غير متاح للبيع.',
  DUPLICATE_ROLL_IN_CART: 'لا يمكن إضافة التوب نفسه أكثر من مرة.',
  SALE_IN_PROGRESS: 'جارٍ تسجيل البيع بالفعل.',
  PAYMENT_MUST_EQUAL_TOTAL: 'يجب أن يساوي المبلغ النقدي إجمالي الفاتورة.',
  LINE_PRICE_REQUIRED: 'أدخل سعرًا صحيحًا للمتر بدقة قرشين.',
};

export default function App() {
  const serviceRef = useRef<RamexDemoService | null>(null);
  if (!serviceRef.current) serviceRef.current = new RamexDemoService();
  const service = serviceRef.current;
  const resetGeneration = useRef(0);
  const [persona, setPersona] = useState<DemoPersona | null>(null);
  const [shift, setShift] = useState<DemoShift | null>(null);
  const [customer, setCustomer] = useState<DemoCustomer | null>(null);
  const [rolls, setRolls] = useState<Roll[]>([]);
  const [selectedRoll, setSelectedRoll] = useState<Roll | null>(null);
  const [price, setPrice] = useState('185.00');
  const [preview, setPreview] = useState<SalePreview | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [view, setView] = useState<View>('pos');
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFixture = useCallback(async () => {
    const [nextPersona, nextShift, customers, nextRolls] = await Promise.all([
      service.getPersona(),
      service.getCurrentShift(),
      service.listCustomers(),
      service.listRolls({ includeSold: true }),
    ]);
    setPersona(nextPersona);
    setShift(nextShift);
    setCustomer(customers[0] ?? null);
    setRolls(nextRolls);
  }, [service]);

  useEffect(() => {
    void loadFixture().catch(() => postDemoMessage('ERROR', { message: 'The local sample data could not be prepared.' }));
  }, [loadFixture]);

  useEffect(() => {
    if (!selectedRoll || !customer || !shift) {
      setPreview(null);
      return;
    }
    const pricePiastres = parseMoneyToPiastres(price);
    if (pricePiastres == null) {
      setPreview(null);
      return;
    }
    let current = true;
    void service.previewSale({
      customerId: customer.id,
      shiftId: shift.id,
      rollIds: [selectedRoll.id],
      finalPricePiastresPerUnit: pricePiastres,
    }).then((next) => current && setPreview(next)).catch((reason: unknown) => {
      if (current) setError(messageFor(reason));
    });
    return () => { current = false; };
  }, [customer, price, selectedRoll, service, shift]);

  useEffect(() => {
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
  }, []);

  useEffect(() => {
    if (!persona || !shift || !customer || rolls.length === 0) return;
    const frame = window.requestAnimationFrame(() => postDemoMessage('READY'));
    return () => window.cancelAnimationFrame(frame);
  }, [customer, persona, rolls.length, shift]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (paymentOpen) {
        setPaymentOpen(false);
        return;
      }
      postDemoMessage('REQUEST_CLOSE');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [paymentOpen]);

  function selectView(next: View) {
    setView(next);
    if (next === 'stock') {
      postDemoMessage('STEP_CHANGED', { guidance: 'Compare each roll’s independent status and the available stock total.' });
    }
  }

  function selectRoll(roll: Roll) {
    setError(null);
    if (roll.status !== 'in_stock') {
      setError(errorCopy.ROLL_NOT_AVAILABLE);
      return;
    }
    if (selectedRoll?.id === roll.id) {
      setSelectedRoll(null);
      return;
    }
    setSelectedRoll(roll);
    setPrice((roll.referencePricePiastresPerUnit / 100).toFixed(2));
    postDemoMessage('STEP_CHANGED', { guidance: `The complete ${formatQuantity(roll.quantityMilliunits)} ${roll.unit} roll ${roll.rollSerial} is selected. Review its fixed quantity and unit price, then choose Payment.` });
  }

  function openPayment() {
    if (!preview) {
      setError(errorCopy.LINE_PRICE_REQUIRED);
      return;
    }
    setError(null);
    setPaymentOpen(true);
    postDemoMessage('STEP_CHANGED', { guidance: 'Confirm the fictional customer and exact cash total, then complete the sample sale once.' });
  }

  async function submitSale() {
    if (submitting || !selectedRoll || !customer || !shift || !preview) return;
    const pricePiastres = parseMoneyToPiastres(price);
    if (pricePiastres == null) return;
    setSubmitting(true);
    setError(null);
    const generation = resetGeneration.current;
    try {
      const created = await service.createSale({
        customerId: customer.id,
        shiftId: shift.id,
        rollIds: [selectedRoll.id],
        finalPricePiastresPerUnit: pricePiastres,
        payment: { method: 'cash', amountPiastres: preview.totalPiastres },
      });
      const [savedInvoice, nextRolls] = await Promise.all([
        service.getInvoice(created.id),
        service.listRolls({ includeSold: true }),
      ]);
      if (generation !== resetGeneration.current) return;
      setInvoice(savedInvoice);
      setRolls(nextRolls);
      setSelectedRoll(null);
      setPreview(null);
      setPaymentOpen(false);
      setView('invoice');
      const line = savedInvoice.lines[0]!;
      postDemoMessage('COMPLETE', { guidance: `Invoice ${savedInvoice.invoiceNo} preserves ${formatQuantity(line.quantityMilliunits)} ${line.quantityUnit} for ${line.rollSerial}. Open Stock to inspect independent roll balances.` });
    } catch (reason) {
      if (generation === resetGeneration.current) setError(messageFor(reason));
    } finally {
      if (generation === resetGeneration.current) setSubmitting(false);
    }
  }

  async function resetDemo() {
    resetGeneration.current += 1;
    service.reset();
    setSelectedRoll(null);
    setPrice('185.00');
    setPreview(null);
    setInvoice(null);
    setView('pos');
    setPaymentOpen(false);
    setSubmitting(false);
    setError(null);
    await loadFixture();
    postDemoMessage('STEP_CHANGED', { guidance: 'The sample invoice was removed and both original roll balances were restored.' });
  }

  if (!persona || !shift || !customer) {
    return <main className="local-loading" aria-live="polite"><span className="spinner" />Ramex</main>;
  }

  return (
    <div className="demo-root" data-view={view} data-sale-state={invoice ? 'completed' : 'seed'}>
      <section className="demo-control-bar" dir="ltr" aria-label="Demo controls">
        <div className="sample-label"><span className="sample-dot" />Sample data · Local only</div>
        {!isEmbedded ? <div className="standalone-actions"><button type="button" onClick={() => void resetDemo()}>Reset</button><a href="/work/ramex/">Back to portfolio</a></div> : null}
      </section>

      <header className="app-header">
        <div className="brand"><span className="brand-mark">R</span><span><b>Ramex</b><small>Fabric ERP</small></span></div>
        <nav aria-label="أقسام العرض">
          <button type="button" aria-current={view === 'pos' ? 'page' : undefined} onClick={() => selectView('pos')}>نقطة البيع</button>
          <button type="button" aria-current={view === 'stock' ? 'page' : undefined} onClick={() => selectView('stock')}>المخزون</button>
          <button type="button" aria-current={view === 'invoice' ? 'page' : undefined} disabled={!invoice} onClick={() => selectView('invoice')}>الفاتورة</button>
        </nav>
        <div className="persona"><span className="avatar">م</span><span><b>{persona.nameAr}</b><small>{persona.roleAr}</small></span></div>
      </header>

      <section className="shift-strip" aria-label="الوردية التجريبية">
        <div><span className="status-dot" />الوردية مفتوحة <strong dir="ltr">#{shift.id}</strong></div>
        <div className="shift-meta">بدأت 09:00 · رصيد افتتاحي <strong dir="ltr">{formatMoney(shift.openingCashPiastres)} EGP</strong></div>
      </section>

      {error ? <div className="error-banner" role="alert"><b>تعذر إكمال الإجراء</b><span>{error}</span><button type="button" aria-label="إغلاق التنبيه" onClick={() => setError(null)}>×</button></div> : null}

      {view === 'pos' ? <PosView rolls={rolls} selectedRoll={selectedRoll} price={price} preview={preview} onPriceChange={setPrice} onSelectRoll={selectRoll} onPay={openPayment} /> : null}
      {view === 'invoice' && invoice ? <InvoiceView invoice={invoice} onShowStock={() => selectView('stock')} /> : null}
      {view === 'stock' ? <StockView rolls={rolls} soldRollId={invoice?.lines[0]?.rollId ?? null} /> : null}

      {paymentOpen && preview ? <PaymentModal customer={customer} preview={preview} submitting={submitting} onCancel={() => setPaymentOpen(false)} onSubmit={() => void submitSale()} /> : null}
    </div>
  );
}

function messageFor(reason: unknown): string {
  const code = reason instanceof Error ? reason.message : '';
  return errorCopy[code] ?? 'حدث خطأ داخل بيانات العرض المحلية. أعد ضبط التجربة وحاول مرة أخرى.';
}
