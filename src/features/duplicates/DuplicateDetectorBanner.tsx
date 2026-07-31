import React from 'react';

export interface DuplicateDetectorBannerProps {
  message: string | null;
  onDismiss: () => void;
}

export const DuplicateDetectorBanner: React.FC<DuplicateDetectorBannerProps> = ({
  message,
  onDismiss,
}) => {
  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        maxWidth: '480px',
        width: '90%',
        background: 'rgba(120,53,15,0.92)',
        border: '1px solid rgba(245,158,11,0.5)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 18px',
        boxShadow: 'var(--shadow-lg)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        color: '#fef3c7',
        animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1) both',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(245,158,11,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fbbf24',
          flexShrink: 0,
        }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '15px' }} />
        </div>
        <div style={{ fontSize: '12px', fontWeight: 500 }}>{message}</div>
      </div>
      <button
        onClick={onDismiss}
        style={{
          width: '28px',
          height: '28px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(0,0,0,0.2)',
          border: 'none',
          color: '#fef3c7',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <i className="fa-solid fa-xmark" style={{ fontSize: '13px' }} />
      </button>
    </div>
  );
};
