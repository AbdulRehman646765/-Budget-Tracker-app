import React from 'react';

export interface SyncBadgeProps {
  status: 'synced' | 'syncing';
}

export const SyncBadge: React.FC<SyncBadgeProps> = ({ status }) => {
  const isSyncing = status === 'syncing';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 600,
        background: isSyncing ? 'rgba(245,158,11,0.12)' : 'rgba(34,197,94,0.12)',
        border: isSyncing ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(34,197,94,0.3)',
        color: isSyncing ? 'var(--warning-400)' : 'var(--success-400)',
      }}
    >
      <span
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: isSyncing ? 'var(--warning-500)' : 'var(--success-500)',
          boxShadow: isSyncing ? '0 0 8px var(--warning-400)' : '0 0 8px var(--success-400)',
          display: 'inline-block',
        }}
      />
      <span>{isSyncing ? 'Syncing...' : 'Real-time Synced'}</span>
    </div>
  );
};
