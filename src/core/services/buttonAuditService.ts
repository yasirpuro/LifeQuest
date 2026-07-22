/**
 * Button Audit Service
 * Firebase backend ile uyumlu buton etkileşim takibi
 */

import { firestoreService } from './firestoreService';
import { trackEvent } from './analyticsService';

export interface ButtonClickEvent {
  buttonId: string;
  buttonText?: string;
  screen: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

const BUTTON_AUDIT_COLLECTION = 'button_audit';

/**
 * Track button click event
 */
export async function trackButtonClick(
  buttonId: string,
  screen: string,
  buttonText?: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const clickEvent: ButtonClickEvent = {
      buttonId,
      buttonText,
      screen,
      timestamp: new Date().toISOString(),
      metadata,
    };

    // Log to analytics
    trackEvent('button_click', {
      button_id: buttonId,
      button_text: buttonText,
      screen,
      ...metadata,
    });

    // Store in Firestore for detailed audit trail
    await firestoreService.createDocument(BUTTON_AUDIT_COLLECTION, clickEvent);
  } catch (error) {
    console.error('[Button Audit] Failed to track button click:', error);
  }
}

/**
 * Get button click statistics for a screen
 */
export async function getButtonClickStats(
  screen: string,
  userId?: string
): Promise<Record<string, number>> {
  try {
    const constraints = [
      { field: 'screen', operator: '==', value: screen },
    ];

    if (userId) {
      constraints.push({ field: 'userId', operator: '==', value: userId });
    }

    const events = await firestoreService.queryCollection(BUTTON_AUDIT_COLLECTION, constraints);

    const stats: Record<string, number> = {};
    events.forEach((event: any) => {
      const buttonId = event.buttonId;
      stats[buttonId] = (stats[buttonId] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('[Button Audit] Failed to get button click stats:', error);
    return {};
  }
}

/**
 * Get recent button click events
 */
export async function getRecentButtonClicks(
  userId: string,
  limit: number = 50
): Promise<ButtonClickEvent[]> {
  try {
    const events = await firestoreService.queryCollection(
      BUTTON_AUDIT_COLLECTION,
      [
        { field: 'userId', operator: '==', value: userId },
      ],
      { field: 'timestamp', direction: 'desc' },
      limit
    );

    return events as ButtonClickEvent[];
  } catch (error) {
    console.error('[Button Audit] Failed to get recent button clicks:', error);
    return [];
  }
}

/**
 * Clear old button audit data (maintenance function)
 */
export async function clearOldButtonAuditData(daysToKeep: number = 30): Promise<void> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const events = await firestoreService.queryCollection(
      BUTTON_AUDIT_COLLECTION,
      [],
      { field: 'timestamp', direction: 'asc' },
      1000
    );

    let deletedCount = 0;
    for (const event of events as any[]) {
      const eventDate = new Date(event.timestamp);
      if (eventDate < cutoffDate) {
        await firestoreService.deleteDocument(BUTTON_AUDIT_COLLECTION, event.id);
        deletedCount++;
      }
    }

    console.log(`[Button Audit] Cleared ${deletedCount} old events`);
  } catch (error) {
    console.error('[Button Audit] Failed to clear old data:', error);
  }
}
