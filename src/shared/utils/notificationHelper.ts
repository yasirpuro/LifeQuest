export function scheduleFocusNotificationIfNeeded(_title: unknown, _body?: string): void {
  if (typeof window === 'undefined') return;
  console.info('[NotificationHelper] Focus notification requested', _title, _body);
}
