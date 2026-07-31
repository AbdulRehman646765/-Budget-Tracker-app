/**
 * BroadcastChannel Sync Service for real-time state synchronization across tabs.
 */

const SYNC_CHANNEL_NAME = 'budget_tracker_realtime_sync';

export interface SyncMessage {
  type: 'BUDGET_STATE_UPDATED';
  timestamp: number;
  data: any;
}

export class SyncService {
  private channel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      } catch (err) {
        console.warn('BroadcastChannel not supported or failed to initialize:', err);
      }
    }
  }

  public notifyUpdate(data: any): void {
    if (!this.channel) return;
    try {
      this.channel.postMessage({
        type: 'BUDGET_STATE_UPDATED',
        timestamp: Date.now(),
        data,
      });
    } catch (err) {
      console.warn('Error broadcasting update:', err);
    }
  }

  public subscribe(onUpdate: (data: any) => void): () => void {
    if (!this.channel) return () => {};

    const listener = (event: MessageEvent<SyncMessage>) => {
      if (event.data && event.data.type === 'BUDGET_STATE_UPDATED') {
        onUpdate(event.data.data);
      }
    };

    this.channel.addEventListener('message', listener);
    return () => {
      this.channel?.removeEventListener('message', listener);
    };
  }

  public close(): void {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
  }
}

export const syncService = new SyncService();
