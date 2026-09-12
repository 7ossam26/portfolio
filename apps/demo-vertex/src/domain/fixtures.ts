import type { VertexSnapshot } from './types.ts';

export const FIXED_CLOCK = '2026-09-12T09:00:00.000Z';

export const createVertexSeed = (): VertexSnapshot => ({
  persona: {
    id: 501,
    name: 'مشغّل إنتاج تجريبي',
    role: 'مشغّل الإنتاج',
    permissions: ['PRODUCTION', 'CREATES_PRODUCTION'],
    branchId: 11,
  },
  branch: {
    id: 11,
    name: 'فرع الجيزة التجريبي',
    warehouseId: 101,
  },
  warehouses: [
    { id: 101, name: 'مستودع فرع الجيزة (تجريبي)', branchId: 11 },
  ],
  boms: [
    {
      id: 701,
      name: 'وصفة المنتج التجريبي',
      outputItemId: 203,
      outputItemName: 'منتج تجريبي نهائي',
      outputQuantity: 1,
      unit: 'piece',
      isActive: true,
      notes: 'بيانات محلية توضح مسار الإنتاج فقط.',
      items: [
        { id: 801, itemId: 201, itemName: 'خامة تجريبية أ', quantity: 2, notes: null },
        { id: 802, itemId: 202, itemName: 'خامة تجريبية ب', quantity: 0.5, notes: null },
      ],
    },
  ],
  inventory: [
    {
      itemId: 201,
      code: 'DEMO-MAT-A',
      name: 'خامة تجريبية أ',
      category: 'مواد خام تجريبية',
      unit: 'kg',
      warehouseId: 101,
      quantity: 100,
      costPricePiasters: 1_000,
    },
    {
      itemId: 202,
      code: 'DEMO-MAT-B',
      name: 'خامة تجريبية ب',
      category: 'مواد خام تجريبية',
      unit: 'kg',
      warehouseId: 101,
      quantity: 50,
      costPricePiasters: 2_000,
    },
    {
      itemId: 203,
      code: 'DEMO-FINISHED',
      name: 'منتج تجريبي نهائي',
      category: 'منتجات تامة',
      unit: 'piece',
      warehouseId: 101,
      quantity: 0,
      costPricePiasters: 0,
    },
  ],
  orders: [],
});
