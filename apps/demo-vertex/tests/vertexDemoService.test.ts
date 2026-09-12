import assert from 'node:assert/strict';
import test from 'node:test';
import { InMemoryVertexProductionService } from '../src/services/vertexDemoService.ts';
import { VertexDemoError } from '../src/domain/types.ts';

const validInput = {
  operationId: 'test-production-001',
  bomId: 701,
  sourceWarehouseId: 101,
  destWarehouseId: 101,
  targetOutputQty: 4,
  actualOutputQty: 4,
  notes: 'اختبار محلي',
} as const;

test('four finished units consume 8 kg and 2 kg and cost EGP 120', async () => {
  const service = new InMemoryVertexProductionService();
  const order = await service.executeProduction(validInput);
  const snapshot = await service.getSnapshot();
  const quantities = Object.fromEntries(snapshot.inventory.map((row) => [row.code, row.quantity]));

  assert.equal(quantities['DEMO-MAT-A'], 92);
  assert.equal(quantities['DEMO-MAT-B'], 48);
  assert.equal(quantities['DEMO-FINISHED'], 4);
  assert.equal(order.items[0]?.quantityUsed, 8);
  assert.equal(order.items[1]?.quantityUsed, 2);
  assert.equal(order.totalCostPiasters, 12_000);
  assert.equal(order.unitCostPiasters, 3_000);
  assert.equal(snapshot.inventory.find((row) => row.code === 'DEMO-FINISHED')?.costPricePiasters, 3_000);
  assert.equal(snapshot.orders.length, 1);
});

test('the same in-flight/completed operation is idempotent', async () => {
  const service = new InMemoryVertexProductionService();
  const [first, repeated] = await Promise.all([
    service.executeProduction(validInput),
    service.executeProduction(validInput),
  ]);
  const replayed = await service.executeProduction(validInput);
  const snapshot = await service.getSnapshot();

  assert.equal(first.id, repeated.id);
  assert.equal(first.id, replayed.id);
  assert.equal(snapshot.orders.length, 1);
  assert.equal(snapshot.inventory.find((row) => row.code === 'DEMO-MAT-A')?.quantity, 92);
});

test('insufficient material rejects atomically', async () => {
  const service = new InMemoryVertexProductionService();
  const before = await service.getSnapshot();

  await assert.rejects(
    service.executeProduction({ ...validInput, operationId: 'too-large', targetOutputQty: 60, actualOutputQty: 60 }),
    (error: unknown) => error instanceof VertexDemoError
      && error.code === 'INSUFFICIENT_MATERIALS'
      && error.shortages.some((shortage) => shortage.itemId === 201 && shortage.required === 120),
  );

  assert.deepEqual(await service.getSnapshot(), before);
});

test('warehouse context is enforced and reset restores every entity', async () => {
  const service = new InMemoryVertexProductionService();
  const seed = await service.getSnapshot();

  await assert.rejects(
    service.executeProduction({ ...validInput, operationId: 'bad-warehouse', sourceWarehouseId: 999 }),
    (error: unknown) => error instanceof VertexDemoError && error.code === 'INVALID_WAREHOUSE',
  );
  assert.deepEqual(await service.getSnapshot(), seed);

  await service.executeProduction(validInput);
  service.reset();
  assert.deepEqual(await service.getSnapshot(), seed);
});

test('reset invalidates a pending commit so stale work cannot overwrite the seed', async () => {
  const service = new InMemoryVertexProductionService();
  const seed = await service.getSnapshot();
  const pending = service.executeProduction({ ...validInput, operationId: 'reset-during-pending' });

  service.reset();

  await assert.rejects(
    pending,
    (error: unknown) => error instanceof VertexDemoError && error.code === 'OPERATION_RESET',
  );
  assert.deepEqual(await service.getSnapshot(), seed);
});
