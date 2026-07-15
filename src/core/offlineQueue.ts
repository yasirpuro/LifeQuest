export interface OfflineQueueItem {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: string;
  status: 'pending' | 'syncing' | 'success' | 'failed';
  retryCount: number;
  lastAttempt?: string;
  error?: string;
}

export class OfflineQueue {
  private readonly storageKey = 'lifequest_offline_queue';

  enqueue(item: Omit<OfflineQueueItem, 'status' | 'retryCount'>): void {
    const queueItem: OfflineQueueItem = {
      ...item,
      status: 'pending',
      retryCount: 0,
    };
    const current = this.read();
    current.push(queueItem);
    localStorage.setItem(this.storageKey, JSON.stringify(current));
  }

  read(): OfflineQueueItem[] {
    try {
      const value = localStorage.getItem(this.storageKey);
      return value ? JSON.parse(value) as OfflineQueueItem[] : [];
    } catch {
      return [];
    }
  }

  updateStatus(id: string, status: OfflineQueueItem['status'], error?: string): void {
    const current = this.read();
    const index = current.findIndex(item => item.id === id);
    if (index !== -1) {
      current[index].status = status;
      current[index].lastAttempt = new Date().toISOString();
      if (error) {
        current[index].error = error;
      }
      if (status === 'syncing') {
        current[index].retryCount += 1;
      }
      localStorage.setItem(this.storageKey, JSON.stringify(current));
    }
  }

  async processSyncQueue(syncFn: (item: OfflineQueueItem) => Promise<boolean>): Promise<{
    processed: number;
    failed: number;
    skipped: number;
  }> {
    const current = this.read();
    let processed = 0;
    let failed = 0;
    let skipped = 0;

    for (const item of current) {
      if (item.status === 'success') {
        skipped++;
        continue;
      }

      if (item.status === 'failed' && item.retryCount >= 3) {
        skipped++;
        continue;
      }

      try {
        this.updateStatus(item.id, 'syncing');
        const success = await syncFn(item);
        
        if (success) {
          this.updateStatus(item.id, 'success');
          processed++;
        } else {
          this.updateStatus(item.id, 'failed', 'Sync function returned false');
          failed++;
        }
      } catch (error) {
        this.updateStatus(item.id, 'failed', error instanceof Error ? error.message : 'Unknown error');
        failed++;
      }
    }

    return { processed, failed, skipped };
  }

  async retryFailedSync(syncFn: (item: OfflineQueueItem) => Promise<boolean>): Promise<{
    retried: number;
    succeeded: number;
    failed: number;
  }> {
    const current = this.read();
    const failedItems = current.filter(item => item.status === 'failed');
    
    let retried = 0;
    let succeeded = 0;
    let failed = 0;

    for (const item of failedItems) {
      if (item.retryCount >= 3) {
        failed++;
        continue;
      }

      try {
        this.updateStatus(item.id, 'syncing');
        const success = await syncFn(item);
        
        if (success) {
          this.updateStatus(item.id, 'success');
          succeeded++;
        } else {
          this.updateStatus(item.id, 'failed', 'Retry sync function returned false');
          failed++;
        }
        retried++;
      } catch (error) {
        this.updateStatus(item.id, 'failed', error instanceof Error ? error.message : 'Unknown error');
        failed++;
        retried++;
      }
    }

    return { retried, succeeded, failed };
  }

  clearCompletedQueue(): void {
    const current = this.read();
    const filtered = current.filter(item => item.status !== 'success');
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
  }

  getStats(): {
    total: number;
    pending: number;
    syncing: number;
    success: number;
    failed: number;
  } {
    const current = this.read();
    return {
      total: current.length,
      pending: current.filter(i => i.status === 'pending').length,
      syncing: current.filter(i => i.status === 'syncing').length,
      success: current.filter(i => i.status === 'success').length,
      failed: current.filter(i => i.status === 'failed').length,
    };
  }
}

export const offlineQueue = new OfflineQueue();
