const intMoney = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export function formatPiastres(piastres: number, currency = 'EGP'): string {
  return `${intMoney.format(Math.round(piastres / 100))} ${currency}`;
}

export function formatPercent(rate: number | null): string {
  return `${intMoney.format(Math.round((rate ?? 0) * 100))}%`;
}
