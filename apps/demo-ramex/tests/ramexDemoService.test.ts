import assert from 'node:assert/strict';
import test from 'node:test';
import { ramexFixture } from '../src/domain/fixtures.ts';
import type { RamexFixture, WholeRollSaleInput } from '../src/domain/types.ts';
import { formatQuantity } from '../src/format.ts';
import { RamexDemoService } from '../src/services/ramexDemoService.ts';

const saleInput: WholeRollSaleInput = {
  customerId: 41,
  shiftId: 707,
  rollIds: [701],
  finalPricePiastresPerUnit: 18_500,
  payment: { method: 'cash', amountPiastres: 555_000 },
};

function previewInput() {
  const { payment: _payment, ...input } = saleInput;
  return input;
}

test('derives the complete selected-roll quantity and exact total', async () => {
  const preview = await new RamexDemoService().previewSale(previewInput());
  assert.equal(preview.lines[0]?.quantityMilliunits, 30_000);
  assert.equal(formatQuantity(preview.lines[0]!.quantityMilliunits), '30.000');
  assert.equal(preview.lines[0]?.quantityUnit, 'meter');
  assert.equal(preview.totalPiastres, 555_000);
});

test('sells only the selected roll and leaves the matching roll untouched', async () => {
  const service = new RamexDemoService();
  await service.createSale(saleInput);
  const rolls = await service.listRolls({ includeSold: true });
  assert.equal(rolls.find((roll) => roll.id === 701)?.status, 'sold');
  assert.equal(rolls.find((roll) => roll.id === 701)?.quantityMilliunits, 30_000);
  assert.equal(rolls.find((roll) => roll.id === 702)?.status, 'in_stock');
  assert.equal(rolls.find((roll) => roll.id === 702)?.quantityMilliunits, 24_750);
});

test('preserves a stable three-decimal quantity and unit invoice snapshot', async () => {
  const service = new RamexDemoService();
  const created = await service.createSale(saleInput);
  const firstRead = await service.getInvoice(created.id);
  const listed = await service.listRolls({ includeSold: true });
  listed[0] = { ...listed[0]!, quantityMilliunits: 1_000 };
  const secondRead = await service.getInvoice(created.id);
  assert.deepEqual(firstRead.lines[0], secondRead.lines[0]);
  assert.equal(formatQuantity(secondRead.lines[0]!.quantityMilliunits), '30.000');
  assert.equal(secondRead.lines[0]?.quantityUnit, 'meter');
});

test('rejects quantities outside the source decimal(10,3) boundary', async () => {
  for (const quantityMilliunits of [0, -1, NaN, Infinity, 30_000.5, 10_000_000_000]) {
    const seed: RamexFixture = {
      ...ramexFixture,
      rolls: [{ ...ramexFixture.rolls[0]!, quantityMilliunits }, ramexFixture.rolls[1]!],
    };
    await assert.rejects(() => new RamexDemoService(seed).previewSale(previewInput()), /ROLL_QUANTITY_/);
  }
});

test('a second independent sale has a unique invoice and preserves the first snapshot', async () => {
  const service = new RamexDemoService();
  const first = await service.createSale(saleInput);
  const second = await service.createSale({ ...saleInput, rollIds: [702], payment: { method: 'cash', amountPiastres: 457_875 } });
  assert.equal(second.invoiceNo, 'DEMO-2026-0702');
  assert.equal(second.lines[0]?.quantityMilliunits, 24_750);
  assert.deepEqual(await service.getInvoice(first.id), first);
  assert.equal((await service.listRolls()).length, 0);
});

test('reset cancels an in-flight sale without changing restored stock or new submit lock', async () => {
  const service = new RamexDemoService();
  const oldSale = service.createSale(saleInput);
  const cancelled = assert.rejects(oldSale, /SALE_CANCELLED_BY_RESET/);
  service.reset();
  assert.deepEqual(await service.listRolls({ includeSold: true }), ramexFixture.rolls);
  const newSale = service.createSale(saleInput);
  await assert.rejects(() => service.createSale(saleInput), /SALE_IN_PROGRESS/);
  await cancelled;
  assert.equal((await newSale).invoiceNo, 'DEMO-2026-0701');
  assert.equal((await service.listRolls()).length, 1);
});

test('prevents concurrent repeat submit and creates one invoice only', async () => {
  const service = new RamexDemoService();
  const first = service.createSale(saleInput);
  await assert.rejects(() => service.createSale(saleInput), /SALE_IN_PROGRESS/);
  const invoice = await first;
  assert.equal(invoice.invoiceNo, 'DEMO-2026-0701');
  assert.equal((await service.listRolls({ includeSold: true })).filter((roll) => roll.status === 'sold').length, 1);
});

test('rejects duplicate roll IDs and a later attempt to resell the sold roll', async () => {
  await assert.rejects(() => new RamexDemoService().previewSale({ ...previewInput(), rollIds: [701, 701] }), /DUPLICATE_ROLL_IN_CART/);
  const service = new RamexDemoService();
  await service.createSale(saleInput);
  await assert.rejects(() => service.createSale(saleInput), /ROLL_NOT_AVAILABLE/);
  assert.equal((await service.listRolls({ includeSold: true })).find((roll) => roll.id === 702)?.status, 'in_stock');
});

test('requires exact full payment and keeps state atomic after rejection', async () => {
  const service = new RamexDemoService();
  await assert.rejects(() => service.createSale({ ...saleInput, payment: { method: 'cash', amountPiastres: 554_999 } }), /PAYMENT_MUST_EQUAL_TOTAL/);
  assert.equal((await service.listRolls({ includeSold: true })).find((roll) => roll.id === 701)?.status, 'in_stock');
  await assert.rejects(() => service.getInvoice('demo-invoice-0701'), /INVOICE_NOT_FOUND/);
});

test('reset removes the invoice and restores both exact seed balances', async () => {
  const service = new RamexDemoService();
  await service.createSale(saleInput);
  service.reset();
  assert.deepEqual(await service.listRolls({ includeSold: true }), ramexFixture.rolls);
  await assert.rejects(() => service.getInvoice('demo-invoice-0701'), /INVOICE_NOT_FOUND/);
});
