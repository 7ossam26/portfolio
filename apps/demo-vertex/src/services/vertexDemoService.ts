import { createVertexSeed, FIXED_CLOCK } from '../domain/fixtures.ts';
import {
  VertexDemoError,
  type Bom,
  type ExecuteProductionInput,
  type InventoryRow,
  type MaterialUsage,
  type ProductionOrder,
  type VertexProductionDemoService,
  type VertexSnapshot,
  type Warehouse,
} from '../domain/types.ts';

const clone = <T>(value: T): T => structuredClone(value);
const round4 = (value: number) => Number(value.toFixed(4));
const round6 = (value: number) => Number(value.toFixed(6));
const waitForLocalLatency = () => new Promise<void>((resolve) => globalThis.setTimeout(resolve, 140));

export class InMemoryVertexProductionService implements VertexProductionDemoService {
  private state = createVertexSeed();
  private activeExecution: { operationId: string; promise: Promise<ProductionOrder> } | null = null;
  private completedOperations = new Map<string, ProductionOrder>();
  private generation = 0;

  async getSnapshot(): Promise<VertexSnapshot> {
    return clone(this.state);
  }

  async listBoms(): Promise<readonly Bom[]> {
    return clone(this.state.boms);
  }

  async listWarehouses(): Promise<readonly Warehouse[]> {
    return clone(this.state.warehouses);
  }

  async listInventory(): Promise<readonly InventoryRow[]> {
    return clone(this.state.inventory);
  }

  async listProductionOrders(): Promise<readonly ProductionOrder[]> {
    return clone([...this.state.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  }

  executeProduction(input: ExecuteProductionInput): Promise<ProductionOrder> {
    const completed = this.completedOperations.get(input.operationId);
    if (completed) return Promise.resolve(clone(completed));
    if (this.activeExecution?.operationId === input.operationId) return this.activeExecution.promise;
    if (this.activeExecution) {
      return Promise.reject(new VertexDemoError(
        'PRODUCTION_PENDING',
        'يوجد أمر إنتاج قيد التنفيذ. انتظر اكتماله قبل بدء أمر آخر.',
      ));
    }

    const promise = this.commitProduction(input).finally(() => {
      if (this.activeExecution?.operationId === input.operationId) this.activeExecution = null;
    });
    this.activeExecution = { operationId: input.operationId, promise };
    return promise;
  }

  reset(): void {
    this.generation += 1;
    this.state = createVertexSeed();
    this.activeExecution = null;
    this.completedOperations.clear();
  }

  private async commitProduction(input: ExecuteProductionInput): Promise<ProductionOrder> {
    const generation = this.generation;
    const { persona } = this.state;
    if (!persona.permissions.includes('CREATES_PRODUCTION')) {
      throw new VertexDemoError('PERMISSION_DENIED', 'ليس لديك صلاحية تنفيذ الإنتاج.');
    }

    if (!Number.isFinite(input.targetOutputQty) || input.targetOutputQty <= 0
      || !Number.isFinite(input.actualOutputQty) || input.actualOutputQty < 0
      || input.actualOutputQty > input.targetOutputQty) {
      throw new VertexDemoError('INVALID_QUANTITY', 'الكمية الفعلية لا يمكن أن تتجاوز الكمية المستهدفة.');
    }

    const bom = this.state.boms.find((candidate) => candidate.id === input.bomId);
    if (!bom) throw new VertexDemoError('BOM_NOT_FOUND', 'وصفة التصنيع غير موجودة.');

    const source = this.state.warehouses.find((warehouse) => warehouse.id === input.sourceWarehouseId);
    const destination = this.state.warehouses.find((warehouse) => warehouse.id === input.destWarehouseId);
    if (!source || !destination || source.branchId !== persona.branchId || destination.branchId !== persona.branchId) {
      throw new VertexDemoError('INVALID_WAREHOUSE', 'المستودع المختار خارج سياق الفرع التجريبي.');
    }

    const multiplier = input.targetOutputQty / bom.outputQuantity;
    const materialUsage: MaterialUsage[] = bom.items.map((component, index) => {
      const inventory = this.state.inventory.find((row) => (
        row.itemId === component.itemId && row.warehouseId === source.id
      ));
      return {
        id: 1_000 + index,
        itemId: component.itemId,
        itemName: component.itemName,
        unit: inventory?.unit ?? 'kg',
        quantityUsed: round6(component.quantity * multiplier),
      };
    });

    const shortages = materialUsage.flatMap((usage) => {
      const inventory = this.state.inventory.find((row) => (
        row.itemId === usage.itemId && row.warehouseId === source.id
      ));
      const available = inventory?.quantity ?? 0;
      return available < usage.quantityUsed
        ? [{
            itemId: usage.itemId,
            itemName: usage.itemName,
            available,
            required: usage.quantityUsed,
            unit: usage.unit,
          }]
        : [];
    });
    if (shortages.length > 0) {
      throw new VertexDemoError(
        'INSUFFICIENT_MATERIALS',
        'رصيد غير كافٍ لبعض المواد الخام',
        shortages,
      );
    }

    const nextInventory: InventoryRow[] = clone([...this.state.inventory]);
    let totalCostPiasters = 0;
    for (const usage of materialUsage) {
      const index = nextInventory.findIndex((row) => (
        row.itemId === usage.itemId && row.warehouseId === source.id
      ));
      const current = nextInventory[index];
      if (!current) throw new VertexDemoError('INSUFFICIENT_MATERIALS', 'رصيد المادة الخام غير موجود.');
      totalCostPiasters += Math.round(current.costPricePiasters * usage.quantityUsed);
      nextInventory[index] = { ...current, quantity: round6(current.quantity - usage.quantityUsed) };
    }

    const unitCostPiasters = input.actualOutputQty > 0
      ? Math.round(totalCostPiasters / input.actualOutputQty)
      : 0;
    const outputIndex = nextInventory.findIndex((row) => (
      row.itemId === bom.outputItemId && row.warehouseId === destination.id
    ));
    if (outputIndex >= 0) {
      const output = nextInventory[outputIndex];
      nextInventory[outputIndex] = {
        ...output,
        quantity: round4(output.quantity + input.actualOutputQty),
        costPricePiasters: unitCostPiasters,
      };
    }

    const order: ProductionOrder = {
      id: 9_001,
      bomId: bom.id,
      bomName: bom.name,
      sourceWarehouseId: source.id,
      sourceWarehouseName: source.name,
      destWarehouseId: destination.id,
      destWarehouseName: destination.name,
      targetOutputQty: round4(input.targetOutputQty),
      actualOutputQty: round4(input.actualOutputQty),
      outputWasteQty: round4(input.targetOutputQty - input.actualOutputQty),
      totalCostPiasters,
      unitCostPiasters,
      notes: input.notes?.trim() || null,
      status: 'COMPLETED',
      createdByName: persona.name,
      createdAt: FIXED_CLOCK,
      items: materialUsage,
    };

    await waitForLocalLatency();
    if (generation !== this.generation) {
      throw new VertexDemoError('OPERATION_RESET', 'تم إلغاء أمر الإنتاج لأن بيانات العينة أُعيد ضبطها.');
    }
    this.state = {
      ...this.state,
      inventory: nextInventory,
      orders: [order, ...this.state.orders],
    };
    this.completedOperations.set(input.operationId, order);
    return clone(order);
  }
}

export const vertexDemoService = new InMemoryVertexProductionService();
