import { useMemo, useState } from 'react';
import type { Bom, InventoryRow, ProductionOrder, Warehouse } from '../domain/types.ts';
import type { VertexProductionDemoService } from '../domain/types.ts';
import { ExecuteProductionModal } from './ExecuteProductionModal.tsx';
import { Icon } from './Icon.tsx';

interface Props {
  readonly boms: readonly Bom[];
  readonly inventory: readonly InventoryRow[];
  readonly warehouses: readonly Warehouse[];
  readonly service: VertexProductionDemoService;
  readonly onSuccess: (order: ProductionOrder) => void;
  readonly onShowHistory: () => void;
}

export function BomManager({ boms, inventory, warehouses, service, onSuccess, onShowHistory }: Props) {
  const [expandedBom, setExpandedBom] = useState<number | null>(null);
  const [executingBom, setExecutingBom] = useState<Bom | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const filteredBoms = useMemo(() => boms.filter((bom) => (
    `${bom.name} ${bom.outputItemName} ${bom.items.map((item) => item.itemName).join(' ')}`.includes(searchQuery.trim())
  )), [boms, searchQuery]);

  const stockFor = (itemId: number) => inventory.find((row) => row.itemId === itemId)?.quantity ?? 0;
  const maxProduction = (bom: Bom) => Math.min(...bom.items.map((item) => (
    stockFor(item.itemId) / item.quantity * bom.outputQuantity
  )));

  return (
    <section className="w-full max-w-5xl mx-auto" aria-labelledby="bom-heading">
      {executingBom && (
        <ExecuteProductionModal
          bom={executingBom}
          inventory={inventory}
          warehouses={warehouses}
          service={service}
          onClose={() => setExecutingBom(null)}
          onSuccess={(order) => { setExecutingBom(null); onSuccess(order); }}
        />
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-full text-primary"><Icon name="recipe" className="size-7" /></div>
          <div><h1 id="bom-heading" className="text-2xl sm:text-3xl font-bold text-text-light">وصفات التصنيع</h1><p className="text-sm text-gray-600">إدارة قوائم المواد (BOM)</p></div>
        </div>
        <button type="button" onClick={onShowHistory} className="action-secondary text-green-700 border-green-300"><Icon name="history" className="size-5" />سجل الإنتاج</button>
      </div>

      <div className="mb-6 relative">
        <Icon name="search" className="size-5 absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="ابحث باسم الوصفة أو المنتج أو المكوّنات..." className="w-full bg-white border border-border-light rounded-xl py-3 pr-12 pl-4 focus:ring-2 focus:ring-primary" />
      </div>

      <div className="space-y-4">
        {filteredBoms.map((bom) => {
          const expanded = expandedBom === bom.id;
          return (
            <article key={bom.id} className="bg-white rounded-2xl shadow-sm border border-border-light overflow-hidden hover:shadow-md transition-shadow" data-testid="bom-card">
              <div className="flex items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-gray-50" onClick={() => setExpandedBom(expanded ? null : bom.id)}>
                <div className="flex items-center gap-4 min-w-0">
                  <div className="bg-green-100 text-green-600 p-2.5 rounded-xl"><Icon name="recipe" className="size-5" /></div>
                  <div className="min-w-0">
                    <h2 className="font-bold text-lg text-text-light">{bom.name}</h2>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600">
                      <span>المنتج: {bom.outputItemName}</span><span>•</span><span>{bom.items.length} مادة خام</span><span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">مفعّل</span>
                    </div>
                    <p className="mt-2 text-sm text-green-700 font-bold">إمكانية الإنتاج: {Number(maxProduction(bom).toFixed(2))} وحدة</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button data-testid="open-production" type="button" onClick={(event) => { event.stopPropagation(); setExecutingBom(bom); }} title="تنفيذ إنتاج" aria-label={`تنفيذ إنتاج ${bom.name}`} className="icon-button text-green-600"><Icon name="factory" className="size-5" /></button>
                  <Icon name="chevron" className={`size-5 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </div>
              </div>
              {expanded && (
                <div className="border-t border-gray-100 p-4 bg-gray-50/50 overflow-x-auto">
                  <table className="w-full min-w-[34rem] text-sm"><thead><tr className="text-xs text-gray-600 border-b border-gray-200"><th className="text-right py-2 px-3">#</th><th className="text-right py-2 px-3">المادة الخام</th><th className="text-right py-2 px-3">الكمية المطلوبة</th><th className="text-center py-2 px-3">الرصيد المتاح</th><th className="text-right py-2 px-3">ملاحظات</th></tr></thead>
                    <tbody>{bom.items.map((item, index) => {
                      const stock = stockFor(item.itemId);
                      return <tr key={item.id} className="border-b border-gray-100 last:border-0"><td className="py-2.5 px-3 text-gray-500 font-mono">{index + 1}</td><td className="py-2.5 px-3 font-medium">{item.itemName}</td><td className="py-2.5 px-3 font-bold text-primary">{item.quantity}</td><td className="py-2.5 px-3 text-center"><b className={stock < item.quantity ? 'text-red-500' : 'text-green-600'}>{stock.toFixed(2)}</b><small className="block text-gray-500">يكفي {Number((stock / item.quantity).toFixed(2))}</small></td><td className="py-2.5 px-3 text-gray-600">{item.notes ?? '—'}</td></tr>;
                    })}</tbody>
                  </table>
                  {bom.notes && <p className="mt-3 text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">{bom.notes}</p>}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
