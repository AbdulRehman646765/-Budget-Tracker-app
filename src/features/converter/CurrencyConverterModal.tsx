import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CurrencySymbol } from '@/types/budget';
import { useCurrency } from '@/hooks/useCurrency';

export interface CurrencyConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CurrencyConverterModal: React.FC<CurrencyConverterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { convert, currencies, isLoadingRates, refreshRates } = useCurrency();

  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState<CurrencySymbol>('Rs.');
  const [toCurrency, setToCurrency] = useState<CurrencySymbol>('$');

  const convertedValue = convert(amount, fromCurrency, toCurrency);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Live Currency Converter"
      subtitle="Convert amounts using real-time exchange rates"
      icon="fa-solid fa-arrows-rotate"
      maxWidth={440}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Amount Input */}
        <Input
          label="Amount to Convert"
          type="number"
          value={amount || ''}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter amount"
        />

        {/* Currency Dropdowns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              From
            </label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value as CurrencySymbol)}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-input)',
                borderRadius: 'var(--radius-sm)',
                padding: '9px 10px',
                fontSize: '13px',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            >
              {Object.keys(currencies).map((sym) => (
                <option key={sym} value={sym} style={{ background: 'var(--gray-900)', color: '#fff' }}>
                  {sym} - {currencies[sym as CurrencySymbol].name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={swapCurrencies}
            title="Swap currencies"
            style={{
              marginTop: '18px',
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              color: 'var(--primary-400)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <i className="fa-solid fa-right-left" style={{ fontSize: '13px' }} />
          </button>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              To
            </label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value as CurrencySymbol)}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-input)',
                borderRadius: 'var(--radius-sm)',
                padding: '9px 10px',
                fontSize: '13px',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            >
              {Object.keys(currencies).map((sym) => (
                <option key={sym} value={sym} style={{ background: 'var(--gray-900)', color: '#fff' }}>
                  {sym} - {currencies[sym as CurrencySymbol].name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Converted Output Display */}
        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.25)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '12px', color: 'var(--primary-400)', fontWeight: 600, margin: 0 }}>
            Converted Value
          </p>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0' }}>
            {toCurrency} {convertedValue.toFixed(2)}
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
            1 {fromCurrency} ≈ {(convert(1, fromCurrency, toCurrency)).toFixed(4)} {toCurrency}
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshRates}
            disabled={isLoadingRates}
            icon={isLoadingRates ? 'fa-solid fa-spinner animate-spin' : 'fa-solid fa-arrows-rotate'}
          >
            {isLoadingRates ? 'Updating...' : 'Refresh Rates'}
          </Button>

          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
