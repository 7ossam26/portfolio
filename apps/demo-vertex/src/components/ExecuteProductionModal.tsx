import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import type { Bom, InventoryRow, ProductionOrder, Warehouse } from '../domain/types.ts';
import { VertexDemoError, type VertexProductionDemoService } from '../domain/types.ts';
import { Icon } from './Icon.tsx';

interface Props {
  readonly bom: Bom;
  readonly inventory: readonly InventoryRow[];
  readonly warehouses: readonly Warehouse[];
  readonly service: VertexProductionDemoService;
  readonly onClose: () => void;
  readonly onSuccess: (order: ProductionOrder) => void;
}

export function ExecuteProductionModal({
  bom,
  inventory,
  warehouses,
  service,
  onClose,
  onSuccess,
}: Props) {
  const [targetQty, setTargetQty] = useState('');
  const [actualQty, setActualQty] = useState('');
  const [sourceWarehouseId, setSourceWarehouseId] = useState('');
  const [destWarehouseId, setDestWarehouseId] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const operationId = useRef(`vertex-${crypto.randomUUID()}`);
  const submitting = useRef(false);
  const initialFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initialFocus.current?.focus();
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || loading) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [loading, onClose]);

  const bomOutputQty = Number(bom.outputQuantity) || 1;
  const materialRows = useMemo(() => bom.items.map((component) => {
    const multiplier = targetQty ? Number(targetQty) / bomOutputQty : 0;
    const required = Number((component.quantity * multiplier).toFixed(6));
    const rawItem = inventory.find((row) => (
      row.itemId === component.itemId
      && (!sourceWarehouseId || row.warehouseId === Number(sourceWarehouseId))
    ));
    const stock = rawItem?.quantity ?? 0;
    return {
      itemId: component.itemId,
      itemName: component.itemName,
      unit: rawItem?.unit ?? 'kg',
      required,
      stock,
      insufficient: Boolean(targetQty) && required > stock,
    };
  }), [bom.items, bomOutputQty, inventory, sourceWarehouseId, targetQty]);

  const wasteQty = targetQty && actualQty
    ? Math.max(0, Number(targetQty) - Number(actualQty))
    : 0;
  const insufficient = materialRows.some((row) => row.insufficient);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting.current) return;
    setError('');
    if (!sourceWarehouseId) return setError('اختر مستودع الخصم.');
    if (!targetQty || Number(targetQty) <= 0) return setError('أدخل الكمية المستهدفة.');
    if (actualQty === '' || Number(actualQty) < 0) return setError('أدخل الكمية الفعلية.');
    if (Number(actualQty) > Number(targetQty)) return setError('الكمية الفعلية لا تتجاوز المستهدفة.');
    if (!destWarehouseId) return setError('اختر مستودع الإضافة.');
    if (insufficient) return setError('رصيد غير كافٍ لبعض المواد الخام.');

    submitting.current = true;
    setLoading(true);
    try {
      const order = await service.executeProduction({
        operationId: operationId.current,
        bomId: bom.id,
        sourceWarehouseId: Number(sourceWarehouseId),
        destWarehouseId: Number(destWarehouseId),
        targetOutputQty: Number(targetQty),
        actualOutputQty: Number(actualQty),
        notes,
      });
      onSuccess(order);
    } catch (caught) {
      setError(caught instanceof VertexDemoError ? caught.message : 'فشل تنفيذ الإنتاج.');
      submitting.current = false;
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="execute-production-title"
      data-vertex-modal
    >
      <div className="bg-surface-light rounded-2xl shadow-2xl w-full max-w-2xl max-h-[94vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2.5 rounded-xl text-green-600"><Icon name="factory" className="size-6" /></div>
            <div>
              <h2 id="execute-production-title" className="text-lg font-bold text-text-light">تنفيذ إنتاج</h2>
              <p className="text-sm text-gray-500">{bom.name}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} disabled={loading} aria-label="إغلاق نافذة تنفيذ الإنتاج" className="icon-button text-gray-500">
            <Icon name="close" className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="space-y-1.5 text-sm font-bold text-gray-700">
              الكمية المستهدفة
              <input ref={initialFocus} data-testid="target-quantity" type="number" step="0.1" min="0.1" value={targetQty} onChange={(event) => { setTargetQty(event.target.value); setActualQty(event.target.value); }} className="field text-center" placeholder="0" />
            </label>
            <label className="space-y-1.5 text-sm font-bold text-gray-700">
              الكمية الفعلية المنتجة
              <input data-testid="actual-quantity" type="number" step="0.1" min="0" value={actualQty} onChange={(event) => setActualQty(event.target.value)} className="field text-center" placeholder="0" />
            </label>
            <div className="space-y-1.5">
              <span className="block text-sm font-bold text-gray-700">الهالك (تلقائي)</span>
              <div className={`rounded-xl border py-2.5 px-4 text-center font-bold ${wasteQty > 0 ? 'border-red-300 bg-red-50 text-red-600' : 'border-gray-200 bg-gray-50 text-gray-400'}`}>
                {wasteQty > 0 ? wasteQty.toFixed(3) : '—'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1.5 text-sm font-bold text-gray-700">
              مستودع الخصم (المواد الخام)
              <select data-testid="source-warehouse" className="field" value={sourceWarehouseId} onChange={(event) => setSourceWarehouseId(event.target.value)} required>
                <option value="">اختر المستودع</option>
                {warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-bold text-gray-700">
              مستودع الإضافة (المنتج النهائي)
              <select data-testid="destination-warehouse" className="field" value={destWarehouseId} onChange={(event) => setDestWarehouseId(event.target.value)} required>
                <option value="">اختر المستودع</option>
                {warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}
              </select>
            </label>
          </div>

          <div className="space-y-2">
            <span className="block text-sm font-bold text-gray-700">المواد الخام المستهلكة</span>
            <div className="rounded-xl border border-gray-200 overflow-x-auto">
              <table className="w-full min-w-[34rem] text-sm" data-testid="material-review">
                <thead className="bg-gray-50 text-gray-500"><tr><th className="text-right py-2 px-3">المادة</th><th className="text-center py-2 px-3">الكمية المطلوبة</th><th className="text-center py-2 px-3">الرصيد المتاح</th><th className="text-center py-2 px-3">الحالة</th></tr></thead>
                <tbody>{materialRows.map((row) => (
                  <tr key={row.itemId} className="border-t border-gray-100">
                    <td className="py-2.5 px-3 font-medium text-text-light">{row.itemName}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-primary" data-testid={`required-${row.itemId}`}>{targetQty ? row.required.toFixed(4) : '—'} <small className="text-gray-400">{row.unit}</small></td>
                    <td className="py-2.5 px-3 text-center">{row.stock.toFixed(4)} <small className="text-gray-400">{row.unit}</small></td>
                    <td className="py-2.5 px-3 text-center">{targetQty ? (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${row.insufficient ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {row.insufficient ? 'رصيد غير كافٍ' : 'متاح'}
                      </span>
                    ) : '—'}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>

          <label className="space-y-1.5 text-sm font-bold text-gray-700">
            ملاحظات
            <textarea className="field resize-none" rows={2} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="ملاحظات اختيارية..." />
          </label>

          {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700" role="alert">{error}</p>}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} disabled={loading} className="flex-1 min-h-touch rounded-xl border border-gray-300 text-sm font-bold hover:bg-gray-50 disabled:opacity-50">إلغاء</button>
            <button data-testid="execute-production" type="submit" disabled={loading || insufficient} className="flex-1 min-h-touch rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <Icon name="factory" className="size-5" />{loading ? 'جاري التنفيذ...' : 'تنفيذ الإنتاج'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
