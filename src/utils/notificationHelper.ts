export async function scheduleFocusNotificationIfNeeded(skillEngine: any) {
  try {
    if (!skillEngine) return false;
    const payload = skillEngine.buildDecisionPayload?.(null);
    if (!payload) return false;
    const focus = payload.focusSkill as any;
    if (!focus) return false;
    const skillId = focus.skillId;
    if (!skillId) return false;

    if (!skillEngine.shouldSendNotification?.(skillId)) return false;

    const title = 'Tekrar zamanı';
    const body = `${skillEngine.skills.find((s: any) => s.id === skillId)?.name || 'Odak'} tekrar zamanı (+${Math.max(5, Math.floor((focus.mastery || 0) / 10))} XP)`;

    // Try to use Capacitor Local Notifications if available
    try {
      // dynamic import by variable to avoid bundler resolution
      const _mod = '@capacitor/local-notifications';
      const { LocalNotifications } = (await import(_mod)) as any;
      await LocalNotifications.requestPermissions();
      await LocalNotifications.schedule({
        notifications: [{
          title,
          body,
          id: Date.now(),
        }]
      });
    } catch (e) {
      // Fallback: console log
      console.log('Notify:', title, body);
    }

    skillEngine.markNotificationSent?.(skillId);
    return true;
  } catch (e) {
    return false;
  }
}
