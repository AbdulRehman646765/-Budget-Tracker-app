import { AppDataBackup, ExchangeRates } from '@/types/budget';

export async function fetchLiveExchangeRates(): Promise<ExchangeRates | null> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.rates) {
      return {
        USD: 1.0,
        PKR: 1 / (data.rates.PKR || 278),
        EUR: 1 / (data.rates.EUR || 0.92),
        AED: 1 / (data.rates.AED || 3.67),
        SAR: 1 / (data.rates.SAR || 3.75),
        INR: 1 / (data.rates.INR || 83.5),
      };
    }
  } catch (err) {
    console.warn('Live rate fetch failed, fallback to defaults:', err);
  }
  return null;
}

export async function exportBudgetDataToAPI(data: AppDataBackup): Promise<boolean> {
  try {
    const res = await fetch('/api/budget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to export budget data via API:', err);
    return false;
  }
}

export async function fetchBudgetDataFromAPI(): Promise<AppDataBackup | null> {
  try {
    const res = await fetch('/api/budget');
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error('Failed to fetch budget data via API:', err);
    return null;
  }
}
