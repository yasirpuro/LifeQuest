export interface OfflineQueueItem {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export class OfflineQueue {
  private readonly storageKey = 'lifequest_offline_queue';

  enqueue(item: OfflineQueueItem): void {
    const current = this.read();
    current.push(item);
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

  clear(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export const offlineQueue = new OfflineQueue();
