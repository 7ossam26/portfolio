import { useState } from 'react';
import type { ProductionOrder } from '../domain/types.ts';
import { Icon } from './Icon.tsx';

const formatQuantity = (value: number) => value.toFixed(3);
const formatMoney = (piasters: number) => `${(piasters / 100).toFixed(2)} ج.م`;

interface Props {
  readonly orders: readonly ProductionOrder[];
  readonly onBack: () => void;
}

export function ProductionHistory({ orders, onBack }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(orders[0]?.id ?? null);
  const [search, setSearch] = useState('');
  const filtered = orders.filter((order) => order.bomName.includes(search.trim()));

  return (
    <section className="w-full max-w-6xl mx-auto" aria-labelledby="history-heading">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} aria-label="العودة إلى وصفات التصنيع" className="icon-button text-gray-500"><Icon name="arrow" className="size-5" /></button>
          <div className="bg-green-100 p-3 rounded-full text-green-600"><Icon name="factory" className="size-7" /></div>
          <div><h1 id="history-heading" className="text-2xl sm:text-3xl font-bold">سجل الإنتاج</h1><p className="text-sm text-gray-500">تاريخ أوامر تنفيذ الإنتاج</p></div>
        </div>
        <div className="relative w-full sm:w-64"><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="بحث باسم الوصفة..." className="field pl-10" /><Icon name="search" className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /></div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border-light p-12 text-center"><Icon name="factory" className="size-12 text-gray-300 mx-auto mb-4" /><p className="text-lg text-gray-500">لا توجد أوامر إنتاج مسجلة</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const expanded = expandedId === order.id;
            const created = new Date(order.createdAt);
            return (
              <article key={order.id} className="bg-white rounded-2xl shadow-sm border border-border-light overflow-hidden hover:shadow-md" data-testid="production-order">
                <div className="flex items-center justify-between gap-3 p-4 sm:p-5 cursor-pointer hover:bg-gray-50" onClick={() => setExpandedId(expanded ? null : order.id)}>
                  <div className="flex items-center gap-4 min-w-0"><div className="bg-green-100 p-2.5 rounded-xl text-green-600"><Icon name="factory" className="size-5" /></div><div className="min-w-0"><h2 className="font-bold text-lg">{order.bomName}</h2><div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500"><span>مستهدف: <b>{formatQuantity(order.targetOutputQty)}</b></span><span>•</span><span>فعلي: <b className="text-green-600">{formatQuantity(order.actualOutputQty)}</b></span><span>•</span><span>{order.sourceWarehouseName} ← {order.destWarehouseName}</span></div></div></div>
                  <div className="flex items-center gap-3 shrink-0"><div className="text-left hidden sm:block"><p className="font-bold" data-testid="order-total-cost">{formatMoney(order.totalCostPiasters)}</p><p className="text-xs text-gray-400">{order.createdByName}</p><p className="text-xs text-gray-400">{created.toLocaleDateString('ar-EG')} {created.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</p></div><span className="bg-green-100 text-green-800 border border-green-200 rounded-full px-2.5 py-1 text-xs font-bold">مكتمل</span><Icon name="chevron" className={`size-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} /></div>
                </div>

                {expanded && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50/50" data-testid="order-details">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      <div className="detail-card"><span>الكمية المستهدفة</span><b>{formatQuantity(order.targetOutputQty)}</b></div>
                      <div className="detail-card border-green-100"><span>الكمية الفعلية</span><b className="text-green-600">{formatQuantity(order.actualOutputQty)}</b></div>
                      <div className="detail-card"><span>تكلفة المواد</span><b>{formatMoney(order.totalCostPiasters)}</b></div>
                      <div className="detail-card"><span>تكلفة الوحدة</span><b data-testid="order-unit-cost">{formatMoney(order.unitCostPiasters)}</b></div>
                    </div>
                    <div className="overflow-x-auto"><table className="w-full min-w-[30rem] text-sm"><thead><tr className="text-xs text-gray-500 border-b border-gray-200"><th className="text-right py-2 px-3">#</th><th className="text-right py-2 px-3">المادة الخام</th><th className="text-center py-2 px-3">الكمية المستهلكة</th></tr></thead><tbody>{order.items.map((item, index) => <tr key={item.id} className="border-b border-gray-100 last:border-0"><td className="py-2.5 px-3 text-gray-400 font-mono">{index + 1}</td><td className="py-2.5 px-3 font-medium">{item.itemName}</td><td className="py-2.5 px-3 text-center font-bold text-primary" data-testid={`used-${item.itemId}`}>{item.quantityUsed.toFixed(4)} <small className="text-gray-400">{item.unit}</small></td></tr>)}</tbody></table></div>
                    {order.notes && <p className="mt-3 text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg">{order.notes}</p>}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
