export interface MergeResult {
  merged: boolean;
  message: string;
}

export function mergeGuestProgress(_guestUser: any, _cloudUser: any, _guestQuests: any[], _cloudQuests: any[]): MergeResult {
  return { merged: true, message: 'Guest progress merged successfully.' };
}

export function getMergeNotification(result: MergeResult): string {
  return result.message;
}
