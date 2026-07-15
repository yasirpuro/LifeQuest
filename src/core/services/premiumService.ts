/**
 * Premium Service Interface for RevenueCat Integration
 * 
 * This service handles premium subscription management through RevenueCat.
 * Currently prepared for integration - actual RevenueCat SDK will be added later.
 */

export interface PremiumEntitlement {
  isActive: boolean;
  productId?: string;
  expirationDate?: string;
  isTrial?: boolean;
  isSandbox?: boolean;
}

export interface PremiumStatus {
  isPremium: boolean;
  entitlement: PremiumEntitlement;
  lastChecked: string;
  error?: string;
}

class PremiumService {
  private static instance: PremiumService;
  private status: PremiumStatus = {
    isPremium: false,
    entitlement: {
      isActive: false,
    },
    lastChecked: new Date().toISOString(),
  };

  private constructor() {}

  static getInstance(): PremiumService {
    if (!PremiumService.instance) {
      PremiumService.instance = new PremiumService();
    }
    return PremiumService.instance;
  }

  /**
   * Get current premium status
   */
  async getPremiumStatus(): Promise<PremiumStatus> {
    // TODO: Integrate with RevenueCat SDK
    // const entitlements = await Purchases.getEntitlements();
    
    // For now, return cached status
    return this.status;
  }

  /**
   * Check if user has premium entitlement
   */
  async checkEntitlement(): Promise<boolean> {
    // TODO: Integrate with RevenueCat SDK
    // const entitlementInfo = await Purchases.getEntitlementInfo(entitlementId);
    // return entitlementInfo.isActive;
    
    return this.status.isPremium;
  }

  /**
   * Unlock premium features
   */
  async unlockPremium(): Promise<void> {
    // TODO: This will be called after successful RevenueCat purchase
    this.status = {
      isPremium: true,
      entitlement: {
        isActive: true,
        isTrial: false,
        isSandbox: false,
      },
      lastChecked: new Date().toISOString(),
    };
  }

  /**
   * Revoke premium (for testing or subscription cancellation)
   */
  async revokePremium(): Promise<void> {
    this.status = {
      isPremium: false,
      entitlement: {
        isActive: false,
      },
      lastChecked: new Date().toISOString(),
    };
  }

  /**
   * Set fake premium user for testing
   */
  async setTestPremiumUser(isPremium: boolean): Promise<void> {
    this.status = {
      isPremium,
      entitlement: {
        isActive: isPremium,
        isTrial: false,
        isSandbox: true,
      },
      lastChecked: new Date().toISOString(),
    };
  }

  /**
   * Refresh premium status from RevenueCat
   */
  async refreshStatus(): Promise<void> {
    // TODO: Call RevenueCat to get latest status
    // const customerInfo = await Purchases.getCustomerInfo();
    // this.status = this.parseRevenueCatStatus(customerInfo);
    
    this.status.lastChecked = new Date().toISOString();
  }

  /**
   * Get premium features available to user
   */
  getAvailableFeatures(): string[] {
    if (!this.status.isPremium) {
      return [];
    }

    return [
      'unlimited_quests',
      'premium_rewards',
      'streak_freeze',
      'skill_boosts',
      'custom_themes',
      'analytics_insights',
    ];
  }

  /**
   * Check if specific feature is available
   */
  hasFeature(feature: string): boolean {
    if (!this.status.isPremium) {
      return false;
    }

    const availableFeatures = this.getAvailableFeatures();
    return availableFeatures.includes(feature);
  }
}

export const premiumService = PremiumService.getInstance();
