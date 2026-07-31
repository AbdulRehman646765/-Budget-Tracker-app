import { CurrencySymbol } from '@/types/budget';

export interface CurrencyDetails {
  symbol: CurrencySymbol;
  code: string;
  name: string;
  baseRateToUSD: number; // USD per 1 unit of currency
}

export const CURRENCIES: Record<CurrencySymbol, CurrencyDetails> = {
  'Rs.': { symbol: 'Rs.', code: 'PKR', name: 'Pakistani Rupee', baseRateToUSD: 0.0036 },
  '$':   { symbol: '$',   code: 'USD', name: 'US Dollar',        baseRateToUSD: 1.0 },
  '€':   { symbol: '€',   code: 'EUR', name: 'Euro',             baseRateToUSD: 1.08 },
  'AED': { symbol: 'AED', code: 'AED', name: 'UAE Dirham',       baseRateToUSD: 0.27 },
  'SR':  { symbol: 'SR',  code: 'SAR', name: 'Saudi Riyal',      baseRateToUSD: 0.27 },
  '₹':   { symbol: '₹',   code: 'INR', name: 'Indian Rupee',     baseRateToUSD: 0.012 },
};

export function convertCurrency(
  amount: number,
  fromSymbol: CurrencySymbol,
  toSymbol: CurrencySymbol,
  customRates?: Record<string, number>
): number {
  if (fromSymbol === toSymbol) return amount;
  const fromInfo = CURRENCIES[fromSymbol];
  const toInfo = CURRENCIES[toSymbol];
  if (!fromInfo || !toInfo) return amount;

  // Amount in USD = amount * fromInfo.baseRateToUSD
  // Target amount = amountInUSD / toInfo.baseRateToUSD
  const amountInUSD = amount * (customRates?.[fromInfo.code] || fromInfo.baseRateToUSD);
  const targetRate = customRates?.[toInfo.code] || toInfo.baseRateToUSD;
  return amountInUSD / targetRate;
}
