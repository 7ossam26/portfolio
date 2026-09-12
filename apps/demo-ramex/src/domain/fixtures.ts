import type { RamexFixture } from './types.ts';

export const ramexFixture: RamexFixture = {
  persona: { id: 'demo-cashier-07', nameAr: 'مريم حسن — عينة', roleAr: 'كاشير تجريبي' },
  shift: { id: 707, openedAt: '2026-09-12T09:00:00+03:00', openingCashPiastres: 100_000, status: 'open' },
  customer: { id: 41, code: 'CUS-DEMO-041', nameAr: 'عميل نقدي — بيانات عينة', phone: '0100 000 0041' },
  rolls: [
    {
      id: 701, fabricId: 88, fabricNameAr: 'كتان سادة', brandAr: 'نسيج النيل — عينة', gradeAr: 'درجة أولى',
      colorAr: 'رملي', colorCode: 'SND-12', widthCm: 150, rollSerial: 'RMX-M-0701', barcode: 'DEMO0701001',
      warehouse: 'shop', visibleAtPos: true, unit: 'meter', quantityMilliunits: 30_000,
      referencePricePiastresPerUnit: 18_500, status: 'in_stock',
    },
    {
      id: 702, fabricId: 88, fabricNameAr: 'كتان سادة', brandAr: 'نسيج النيل — عينة', gradeAr: 'درجة أولى',
      colorAr: 'رملي', colorCode: 'SND-12', widthCm: 150, rollSerial: 'RMX-M-0702', barcode: 'DEMO0702001',
      warehouse: 'shop', visibleAtPos: true, unit: 'meter', quantityMilliunits: 24_750,
      referencePricePiastresPerUnit: 18_500, status: 'in_stock',
    },
  ],
};
