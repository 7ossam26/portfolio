import { ramexFixture } from '../domain/fixtures.ts';
import type {
  DemoCustomer,
  DemoShift,
  Invoice,
  RamexFixture,
  Roll,
  SalePreview,
  WholeRollSaleInput,
} from '../domain/types.ts';

const MAX_DECIMAL_10_3_MILLIUNITS = 9_999_999_999;

function clone<T>(value: T): T {
  return structuredClone(value);
}

function validateSourceQuantity(roll: Roll) {
  if (!Number.isSafeInteger(roll.quantityMilliunits)) throw new Error('ROLL_QUANTITY_PRECISION');
  if (roll.quantityMilliunits <= 0) throw new Error('ROLL_QUANTITY_INVALID');
  if (roll.quantityMilliunits > MAX_DECIMAL_10_3_MILLIUNITS) throw new Error('ROLL_QUANTITY_EXCEEDS_SOURCE_LIMIT');
}

function lineTotal(quantityMilliunits: number, perUnitPiastres: number): number {
  return Math.round((quantityMilliunits * perUnitPiastres) / 1_000);
}

export class RamexDemoService {
  #seed: RamexFixture;
  #fixture: RamexFixture;
  #invoices = new Map<string, Invoice>();
  #salePending = false;
  #generation = 0;
  #invoiceSequence = 701;

  constructor(seed: RamexFixture = ramexFixture) {
    this.#seed = clone(seed);
    this.#fixture = clone(seed);
  }

  async getPersona() {
    return clone(this.#fixture.persona);
  }

  async getCurrentShift(): Promise<DemoShift> {
    return clone(this.#fixture.shift);
  }

  async listCustomers(): Promise<DemoCustomer[]> {
    return [clone(this.#fixture.customer)];
  }

  async listRolls(options: { includeSold?: boolean; query?: string } = {}): Promise<Roll[]> {
    const query = options.query?.trim().toLocaleLowerCase('ar') ?? '';
    return this.#fixture.rolls
      .filter((roll) => options.includeSold || roll.status === 'in_stock')
      .filter((roll) => !query || `${roll.fabricNameAr} ${roll.colorAr} ${roll.rollSerial} ${roll.barcode}`.toLocaleLowerCase('ar').includes(query))
      .map(clone);
  }

  async previewSale(input: Omit<WholeRollSaleInput, 'payment'>): Promise<SalePreview> {
    this.#validateContext(input.customerId, input.shiftId);
    const rolls = this.#selectRolls(input.rollIds);
    if (!Number.isSafeInteger(input.finalPricePiastresPerUnit) || input.finalPricePiastresPerUnit <= 0) {
      throw new Error('LINE_PRICE_REQUIRED');
    }
    const lines = rolls.map((roll) => {
      validateSourceQuantity(roll);
      return {
        rollId: roll.id,
        quantityMilliunits: roll.quantityMilliunits,
        quantityUnit: roll.unit,
        finalPricePiastresPerUnit: input.finalPricePiastresPerUnit,
        lineTotalPiastres: lineTotal(roll.quantityMilliunits, input.finalPricePiastresPerUnit),
      } as const;
    });
    const totalPiastres = lines.reduce((sum, line) => sum + line.lineTotalPiastres, 0);
    return clone({ lines, subtotalPiastres: totalPiastres, totalPiastres });
  }

  async createSale(input: WholeRollSaleInput): Promise<Invoice> {
    if (this.#salePending) throw new Error('SALE_IN_PROGRESS');
    this.#salePending = true;
    const generation = this.#generation;
    try {
      await new Promise((resolve) => setTimeout(resolve, 120));
      if (generation !== this.#generation) throw new Error('SALE_CANCELLED_BY_RESET');
      const preview = await this.previewSale(input);
      if (input.payment.method !== 'cash') throw new Error('DEMO_CASH_ONLY');
      if (input.payment.amountPiastres !== preview.totalPiastres) throw new Error('PAYMENT_MUST_EQUAL_TOTAL');

      const selected = this.#selectRolls(input.rollIds);
      const invoice: Invoice = {
        id: `demo-invoice-${String(this.#invoiceSequence).padStart(4, '0')}`,
        invoiceNo: `DEMO-2026-${String(this.#invoiceSequence).padStart(4, '0')}`,
        issuedAt: '2026-09-12T10:30:00+03:00',
        status: 'completed',
        customer: clone(this.#fixture.customer),
        cashier: clone(this.#fixture.persona),
        shiftId: this.#fixture.shift.id,
        lines: preview.lines.map((line) => {
          const roll = selected.find((candidate) => candidate.id === line.rollId)!;
          return { ...line, rollSerial: roll.rollSerial, fabricNameAr: roll.fabricNameAr, colorAr: roll.colorAr };
        }),
        subtotalPiastres: preview.subtotalPiastres,
        totalPiastres: preview.totalPiastres,
        paidPiastres: input.payment.amountPiastres,
        paymentMethod: 'cash',
      };

      const soldIds = new Set(input.rollIds);
      this.#fixture = {
        ...this.#fixture,
        rolls: this.#fixture.rolls.map((roll) => soldIds.has(roll.id) ? { ...roll, status: 'sold' as const } : roll),
      };
      this.#invoices.set(invoice.id, clone(invoice));
      this.#invoiceSequence += 1;
      return clone(invoice);
    } finally {
      if (generation === this.#generation) this.#salePending = false;
    }
  }

  async getInvoice(id: string): Promise<Invoice> {
    const invoice = this.#invoices.get(id);
    if (!invoice) throw new Error('INVOICE_NOT_FOUND');
    return clone(invoice);
  }

  reset() {
    this.#generation += 1;
    this.#invoiceSequence = 701;
    this.#fixture = clone(this.#seed);
    this.#invoices.clear();
    this.#salePending = false;
  }

  #validateContext(customerId: number, shiftId: number) {
    if (customerId !== this.#fixture.customer.id) throw new Error('CUSTOMER_NOT_FOUND');
    if (shiftId !== this.#fixture.shift.id || this.#fixture.shift.status !== 'open') throw new Error('SHIFT_NOT_OPEN');
  }

  #selectRolls(rollIds: readonly number[]): Roll[] {
    if (rollIds.length === 0) throw new Error('SALE_LINES_REQUIRED');
    if (new Set(rollIds).size !== rollIds.length) throw new Error('DUPLICATE_ROLL_IN_CART');
    return rollIds.map((id) => {
      const roll = this.#fixture.rolls.find((candidate) => candidate.id === id);
      if (!roll) throw new Error('ROLL_NOT_FOUND');
      if (roll.status !== 'in_stock') throw new Error('ROLL_NOT_AVAILABLE');
      if (!roll.visibleAtPos) throw new Error('ROLL_NOT_VISIBLE_AT_POS');
      if (roll.warehouse !== 'shop') throw new Error('ROLL_NOT_AT_SHOP');
      validateSourceQuantity(roll);
      return roll;
    });
  }
}
