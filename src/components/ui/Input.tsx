import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
  prefix?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  prefix,
  error,
  className = '',
  style,
  ...props
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            left: '12px',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
            fontSize: '13px',
          }}>
            <i className={icon} />
          </div>
        )}
        {prefix && (
          <div style={{
            position: 'absolute',
            left: '12px',
            color: 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '13px',
            pointerEvents: 'none',
          }}>
            {prefix}
          </div>
        )}
        <input
          style={{
            width: '100%',
            background: 'var(--bg-input)',
            border: error ? '1px solid var(--danger-500)' : '1px solid var(--border-input)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            paddingLeft: icon || prefix ? '36px' : '14px',
            fontSize: '13px',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'var(--transition)',
            fontFamily: 'inherit',
            ...style,
          }}
          className={className}
          {...props}
        />
      </div>
      {error && <span style={{ fontSize: '11px', color: 'var(--danger-400)' }}>{error}</span>}
    </div>
  );
};
