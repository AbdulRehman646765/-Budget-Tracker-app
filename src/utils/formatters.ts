import { CurrencySymbol } from '@/types/budget';

export function formatCurrency(amount: number, symbol: CurrencySymbol = 'Rs.'): string {
  const formattedNumber = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount || 0);

  return `${symbol} ${formattedNumber}`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value || 0)}%`;
}

export function formatDate(dateString?: string): string {
  if (!dateString) return new Date().toLocaleDateString();
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
