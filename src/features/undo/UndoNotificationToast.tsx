import React from 'react';
import { UndoAction } from '@/types/budget';
import { Button } from '@/components/ui/Button';

export interface UndoNotificationToastProps {
  latestUndo: UndoAction | null;
  onUndo: () => void;
  onDismiss: () => void;
}

export const UndoNotificationToast: React.FC<UndoNotificationToastProps> = ({
  latestUndo,
  onUndo,
  onDismiss,
}) => {
  if (!latestUndo) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 1000,
        background: 'var(--bg-body)',
        border: '1px solid var(--primary-500)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 18px',
        boxShadow: 'var(--shadow-lg)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        maxWidth: '400px',
        width: 'calc(100% - 48px)',
        animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1) both',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(99,102,241,0.15)',
          color: 'var(--primary-400)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <i className="fa-solid fa-rotate-left" style={{ fontSize: '14px' }} />
        </div>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            {latestUndo.description}
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
            Click undo to restore item
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Button variant="primary" size="sm" onClick={onUndo} icon="fa-solid fa-rotate-left">
          Undo
        </Button>
        <button
          onClick={onDismiss}
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <i className="fa-solid fa-xmark" style={{ fontSize: '13px' }} />
        </button>
      </div>
    </div>
  );
};
