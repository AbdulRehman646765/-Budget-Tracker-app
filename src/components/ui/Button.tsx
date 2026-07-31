import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  style,
  ...props
}) => {
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '6px 12px', fontSize: '12px', gap: '6px' },
    md: { padding: '8px 16px', fontSize: '13px', gap: '8px' },
    lg: { padding: '12px 22px', fontSize: '15px', gap: '10px' },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--primary-500)',
      color: '#fff',
      border: '1px solid transparent',
      boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
    },
    secondary: {
      background: 'var(--bg-card)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-card)',
    },
    danger: {
      background: 'var(--danger-600)',
      color: '#fff',
      border: '1px solid transparent',
      boxShadow: '0 4px 14px rgba(220,38,38,0.3)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--primary-400)',
      border: '1px solid var(--primary-500)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent',
    },
  };

  return (
    <button
      className={`ui-btn ui-btn-${variant} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'inherit',
        fontWeight: 500,
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        transition: 'var(--transition)',
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {icon && <i className={icon} style={{ fontSize: '13px' }} />}
      {children}
    </button>
  );
};
