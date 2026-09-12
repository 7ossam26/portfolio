import type { FabricUnit } from './domain/types.ts';

export function formatQuantity(quantityMilliunits: number): string {
  return (quantityMilliunits / 1_000).toFixed(3);
}

export function unitLabel(unit: FabricUnit): string {
  return unit === 'meter' ? 'متر' : 'كجم';
}

export function formatMoney(piastres: number): string {
  return (piastres / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function parseMoneyToPiastres(value: string): number | null {
  if (!/^\d+(?:\.\d{0,2})?$/.test(value.trim())) return null;
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Math.round(amount * 100);
}
