/**
 * RevenueCat Service
 * Firebase Auth ID → RevenueCat Customer ID → Subscription → Premium entitlement
 */

import { Purchases, LogLevel } from '@revenuecat/purchases-js';

// RevenueCat API Keys (staging environment)
// Note: API key will be configured in RevenueCat dashboard
// const REVENUECAT_API_KEY = 'appl_OXpPnFQjFIJiKxLjYJdQrYKcVb';

export interface SubscriptionInfo {
  isActive: boolean;
  productId?: string;
  expiryDate?: Date;
  isPremium: boolean;
}

/**
 * Initialize RevenueCat
 */
export async function initializeRevenueCat(): Promise<void> {
  try {
    Purchases.setLogLevel(LogLevel.Debug);
    
    // Note: RevenueCat for web requires different configuration
    // This is a placeholder for web integration
    console.log('[RevenueCat] Web integration initialized');
  } catch (error) {
    console.error('[RevenueCat] Initialization failed:', error);
  }
}

/**
 * Configure RevenueCat with Firebase Auth user ID
 */
export async function configureRevenueCatUser(userId: string): Promise<void> {
  try {
    // Use Firebase Auth ID as RevenueCat Customer ID
    // Note: This is a placeholder for actual RevenueCat configuration
    console.log('[RevenueCat] Configuring user with ID:', userId);
    
    // In a real implementation, you would use:
    // await Purchases.logIn(userId);
  } catch (error) {
    console.error('[RevenueCat] User configuration failed:', error);
  }
}

/**
 * Get current subscription info
 */
export async function getSubscriptionInfo(): Promise<SubscriptionInfo> {
  try {
    // Note: This is a placeholder for actual RevenueCat customer info
    // In a real implementation, you would use:
    // const customerInfo = await Purchases.getCustomerInfo();
    
    // For now, return default (no subscription)
    return {
      isActive: false,
      isPremium: false,
    };
  } catch (error) {
    console.error('[RevenueCat] Failed to get subscription info:', error);
    return {
      isActive: false,
      isPremium: false,
    };
  }
}

/**
 * Check if user has premium entitlement
 */
export async function hasPremiumEntitlement(): Promise<boolean> {
  const subscriptionInfo = await getSubscriptionInfo();
  return subscriptionInfo.isPremium;
}

/**
 * Purchase premium subscription
 */
export async function purchasePremium(productId: string): Promise<boolean> {
  try {
    // Note: This is a placeholder for actual RevenueCat purchase
    // In a real implementation, you would use:
    // const { customerInfo } = await Purchases.purchaseProduct(productId);
    
    console.log('[RevenueCat] Purchasing premium:', productId);
    return true;
  } catch (error) {
    console.error('[RevenueCat] Purchase failed:', error);
    return false;
  }
}

/**
 * Restore purchases
 */
export async function restorePurchases(): Promise<boolean> {
  try {
    // Note: This is a placeholder for actual RevenueCat restore
    // In a real implementation, you would use:
    // const customerInfo = await Purchases.restorePurchases();
    
    console.log('[RevenueCat] Restoring purchases');
    return true;
  } catch (error) {
    console.error('[RevenueCat] Restore failed:', error);
    return false;
  }
}
