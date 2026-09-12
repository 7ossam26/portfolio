import type { Branch, InventoryRow } from '../domain/types.ts';
import { Icon } from './Icon.tsx';

const formatMoney = (piasters: number) => `${(piasters / 100).toFixed(2)} ج.م`;
const formatQuantity = (quantity: number) => Number(quantity.toFixed(4)).toLocaleString('ar-EG');

interface Props {
  readonly branch: Branch;
  readonly inventory: readonly InventoryRow[];
  readonly onBack: () => void;
}

export function InventoryView({ branch, inventory, onBack }: Props) {
  const totalValuePiasters = inventory.reduce((sum, row) => (
    sum + Math.round(row.quantity * row.costPricePiasters)
  ), 0);

  return (
    <section className="w-full max-w-6xl mx-auto" aria-labelledby="inventory-heading">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} aria-label="العودة إلى وصفات التصنيع" className="icon-button text-gray-500"><Icon name="arrow" className="size-5" /></button>
          <div className="bg-primary/10 p-3 rounded-full text-primary"><Icon name="inventory" className="size-7" /></div>
          <div><h1 id="inventory-heading" className="text-2xl sm:text-3xl font-bold">إدارة المخزون <span className="text-gray-400 font-normal text-xl">- الجرد</span></h1><p className="text-sm text-gray-500">إدارة مستويات المخزون، الأسعار وتفاصيل المنتجات</p></div>
        </div>
        <div className="rounded-xl border border-border-light bg-white px-4 py-2.5 text-sm font-bold">{branch.name}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="metric-card"><span>عدد الأصناف</span><b>{inventory.length}</b></div>
        <div className="metric-card"><span>أصناف منخفضة</span><b>{inventory.filter((row) => row.quantity <= 10).length}</b></div>
        <div className="metric-card"><span>إجمالي قيمة التكلفة</span><b>{formatMoney(totalValuePiasters)}</b></div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 border border-border-light">
        <div className="flex items-center gap-2 mb-5"><Icon name="inventory" className="size-5 text-primary" /><h2 className="font-bold">المخزون الحالي · بيانات تجريبية</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[48rem] text-sm" data-testid="inventory-table">
            <thead className="bg-gray-50 text-gray-500"><tr><th className="text-right py-3 px-3">الصنف</th><th className="text-right py-3 px-3">التصنيف</th><th className="text-center py-3 px-3">الكمية المتاحة</th><th className="text-center py-3 px-3">سعر التكلفة (الأخير)</th><th className="text-center py-3 px-3">إجمالي التكلفة</th><th className="text-center py-3 px-3">الحالة</th></tr></thead>
            <tbody>{inventory.map((row) => {
              const low = row.quantity <= 10;
              return (
                <tr key={row.itemId} className="border-b border-gray-100 last:border-0" data-testid={`inventory-${row.code}`}>
                  <td className="py-3 px-3"><b>{row.name}</b><small className="block text-gray-400 font-mono" dir="ltr">{row.code}</small></td>
                  <td className="py-3 px-3"><span className="rounded-md bg-[#EFEBE9] text-gray-700 text-xs px-2.5 py-1 border border-[#D7CCC8]">{row.category}</span></td>
                  <td className={`py-3 px-3 text-center font-bold ${low ? 'text-red-600' : 'text-text-light'}`}><span data-testid={`quantity-${row.code}`}>{formatQuantity(row.quantity)}</span> <small className="text-gray-400">{row.unit}</small></td>
                  <td className="py-3 px-3 text-center text-gray-600" data-testid={`cost-${row.code}`}>{formatMoney(row.costPricePiasters)}</td>
                  <td className="py-3 px-3 text-center"><span className="inline-flex rounded-md bg-red-50 text-red-700 border border-red-100 px-2.5 py-1">{formatMoney(Math.round(row.quantity * row.costPricePiasters))}</span></td>
                  <td className="py-3 px-3 text-center"><span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${low ? 'bg-red-100 text-red-800 border-red-200' : 'bg-green-100 text-green-800 border-green-200'}`}>{low ? 'نقص بالمخزون' : 'متوفر'}</span></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
