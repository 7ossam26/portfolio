export type QuantityUnit = 'kg' | 'piece';

export interface DemoPersona {
  readonly id: number;
  readonly name: string;
  readonly role: string;
  readonly permissions: readonly ('PRODUCTION' | 'CREATES_PRODUCTION')[];
  readonly branchId: number;
}

export interface Branch {
  readonly id: number;
  readonly name: string;
  readonly warehouseId: number;
}

export interface Warehouse {
  readonly id: number;
  readonly name: string;
  readonly branchId: number;
}

export interface InventoryRow {
  readonly itemId: number;
  readonly code: string;
  readonly name: string;
  readonly category: string;
  readonly unit: QuantityUnit;
  readonly warehouseId: number;
  readonly quantity: number;
  readonly costPricePiasters: number;
}

export interface BomItem {
  readonly id: number;
  readonly itemId: number;
  readonly itemName: string;
  readonly quantity: number;
  readonly notes: string | null;
}

export interface Bom {
  readonly id: number;
  readonly name: string;
  readonly outputItemId: number;
  readonly outputItemName: string;
  readonly outputQuantity: number;
  readonly unit: QuantityUnit;
  readonly isActive: boolean;
  readonly notes: string | null;
  readonly items: readonly BomItem[];
}

export interface MaterialUsage {
  readonly id: number;
  readonly itemId: number;
  readonly itemName: string;
  readonly unit: QuantityUnit;
  readonly quantityUsed: number;
}

export interface ProductionOrder {
  readonly id: number;
  readonly bomId: number;
  readonly bomName: string;
  readonly sourceWarehouseId: number;
  readonly sourceWarehouseName: string;
  readonly destWarehouseId: number;
  readonly destWarehouseName: string;
  readonly targetOutputQty: number;
  readonly actualOutputQty: number;
  readonly outputWasteQty: number;
  readonly totalCostPiasters: number;
  readonly unitCostPiasters: number;
  readonly notes: string | null;
  readonly status: 'COMPLETED';
  readonly createdByName: string;
  readonly createdAt: string;
  readonly items: readonly MaterialUsage[];
}

export interface ExecuteProductionInput {
  readonly operationId: string;
  readonly bomId: number;
  readonly sourceWarehouseId: number;
  readonly destWarehouseId: number;
  readonly targetOutputQty: number;
  readonly actualOutputQty: number;
  readonly notes?: string;
}

export interface VertexSnapshot {
  readonly persona: DemoPersona;
  readonly branch: Branch;
  readonly warehouses: readonly Warehouse[];
  readonly boms: readonly Bom[];
  readonly inventory: readonly InventoryRow[];
  readonly orders: readonly ProductionOrder[];
}

export type VertexDemoErrorCode =
  | 'INVALID_QUANTITY'
  | 'INVALID_WAREHOUSE'
  | 'PERMISSION_DENIED'
  | 'BOM_NOT_FOUND'
  | 'INSUFFICIENT_MATERIALS'
  | 'PRODUCTION_PENDING'
  | 'OPERATION_RESET';

export interface MaterialShortage {
  readonly itemId: number;
  readonly itemName: string;
  readonly available: number;
  readonly required: number;
  readonly unit: QuantityUnit;
}

export class VertexDemoError extends Error {
  readonly code: VertexDemoErrorCode;
  readonly shortages: readonly MaterialShortage[];

  constructor(
    code: VertexDemoErrorCode,
    message: string,
    shortages: readonly MaterialShortage[] = [],
  ) {
    super(message);
    this.name = 'VertexDemoError';
    this.code = code;
    this.shortages = shortages;
  }
}

export interface VertexProductionDemoService {
  getSnapshot(): Promise<VertexSnapshot>;
  listBoms(): Promise<readonly Bom[]>;
  listWarehouses(): Promise<readonly Warehouse[]>;
  listInventory(): Promise<readonly InventoryRow[]>;
  executeProduction(input: ExecuteProductionInput): Promise<ProductionOrder>;
  listProductionOrders(): Promise<readonly ProductionOrder[]>;
  reset(): void;
}
