export const notificationService = {
  async initialize(): Promise<void> {
    return Promise.resolve();
  },
  async requestPermission(): Promise<boolean> {
    return true;
  },
};
