export type FabricUnit = 'meter' | 'kg';
export type RollStatus = 'in_stock' | 'sold';

export interface DemoPersona {
  readonly id: 'demo-cashier-07';
  readonly nameAr: string;
  readonly roleAr: string;
}

export interface DemoShift {
  readonly id: 707;
  readonly openedAt: string;
  readonly openingCashPiastres: number;
  readonly status: 'open';
}

export interface DemoCustomer {
  readonly id: 41;
  readonly code: string;
  readonly nameAr: string;
  readonly phone: string;
}

export interface Roll {
  readonly id: number;
  readonly fabricId: number;
  readonly fabricNameAr: string;
  readonly brandAr: string;
  readonly gradeAr: string;
  readonly colorAr: string;
  readonly colorCode: string;
  readonly widthCm: number;
  readonly rollSerial: string;
  readonly barcode: string;
  readonly warehouse: 'shop';
  readonly visibleAtPos: true;
  readonly unit: FabricUnit;
  readonly quantityMilliunits: number;
  readonly referencePricePiastresPerUnit: number;
  readonly status: RollStatus;
}

export interface WholeRollSaleInput {
  readonly customerId: number;
  readonly shiftId: number;
  readonly rollIds: readonly number[];
  readonly finalPricePiastresPerUnit: number;
  readonly payment: {
    readonly method: 'cash';
    readonly amountPiastres: number;
  };
}

export interface SalePreviewLine {
  readonly rollId: number;
  readonly quantityMilliunits: number;
  readonly quantityUnit: FabricUnit;
  readonly finalPricePiastresPerUnit: number;
  readonly lineTotalPiastres: number;
}

export interface SalePreview {
  readonly lines: readonly SalePreviewLine[];
  readonly subtotalPiastres: number;
  readonly totalPiastres: number;
}

export interface InvoiceLineSnapshot extends SalePreviewLine {
  readonly rollSerial: string;
  readonly fabricNameAr: string;
  readonly colorAr: string;
}

export interface Invoice {
  readonly id: `demo-invoice-${string}`;
  readonly invoiceNo: `DEMO-2026-${string}`;
  readonly issuedAt: '2026-09-12T10:30:00+03:00';
  readonly status: 'completed';
  readonly customer: DemoCustomer;
  readonly cashier: DemoPersona;
  readonly shiftId: number;
  readonly lines: readonly InvoiceLineSnapshot[];
  readonly subtotalPiastres: number;
  readonly totalPiastres: number;
  readonly paidPiastres: number;
  readonly paymentMethod: 'cash';
}

export interface RamexFixture {
  readonly persona: DemoPersona;
  readonly shift: DemoShift;
  readonly customer: DemoCustomer;
  readonly rolls: readonly Roll[];
}
