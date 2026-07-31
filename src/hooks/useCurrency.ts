import { useState, useEffect } from 'react';
import { CurrencySymbol, ExchangeRates } from '@/types/budget';
import { CURRENCIES, convertCurrency } from '@/constants/currencies';
import { fetchLiveExchangeRates } from '@/services/apiService';

export function useCurrency() {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(false);

  const loadRates = async () => {
    setIsLoadingRates(true);
    const rates = await fetchLiveExchangeRates();
    if (rates) {
      setExchangeRates(rates);
    }
    setIsLoadingRates(false);
  };

  useEffect(() => {
    loadRates();
  }, []);

  const convert = (amount: number, from: CurrencySymbol, to: CurrencySymbol) => {
    return convertCurrency(amount, from, to, exchangeRates || undefined);
  };

  return {
    exchangeRates,
    isLoadingRates,
    refreshRates: loadRates,
    convert,
    currencies: CURRENCIES,
  };
}
