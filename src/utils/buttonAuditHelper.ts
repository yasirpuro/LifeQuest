/**
 * Button Audit Helper
 * 
 * This helper provides utilities to ensure all buttons have proper state handling:
 * - Normal state
 * - Loading state
 * - Error state
 * - Offline state
 * - Empty state
 */

export interface ButtonState {
  isLoading: boolean;
  isError: boolean;
  isOffline: boolean;
  isEmpty: boolean;
  disabled: boolean;
  error?: string;
}

export interface ButtonAuditResult {
  buttonId: string;
  hasLoadingState: boolean;
  hasErrorState: boolean;
  hasOfflineState: boolean;
  hasEmptyState: boolean;
  overall: 'PASS' | 'FAIL';
  issues: string[];
}

/**
 * Create button state
 */
export function createButtonState(): ButtonState {
  return {
    isLoading: false,
    isError: false,
    isOffline: false,
    isEmpty: false,
    disabled: false,
  };
}

/**
 * Update button state
 */
export function updateButtonState(
  state: ButtonState,
  updates: Partial<ButtonState>
): ButtonState {
  return {
    ...state,
    ...updates,
  };
}

/**
 * Set loading state
 */
export function setLoadingState(state: ButtonState, isLoading: boolean): ButtonState {
  return updateButtonState(state, {
    isLoading,
    disabled: isLoading,
  });
}

/**
 * Set error state
 */
export function setErrorState(state: ButtonState, isError: boolean, error?: string): ButtonState {
  return updateButtonState(state, {
    isError,
    error,
    disabled: false,
  });
}

/**
 * Set offline state
 */
export function setOfflineState(state: ButtonState, isOffline: boolean): ButtonState {
  return updateButtonState(state, {
    isOffline,
    disabled: isOffline,
  });
}

/**
 * Set empty state
 */
export function setEmptyState(state: ButtonState, isEmpty: boolean): ButtonState {
  return updateButtonState(state, {
    isEmpty,
    disabled: isEmpty,
  });
}

/**
 * Audit button component
 */
export function auditButton(
  buttonId: string,
  component: any
): ButtonAuditResult {
  const issues: string[] = [];

  // Check if component has loading state handling
  if (!component.props?.loading && !component.state?.isLoading) {
    issues.push('Missing loading state handling');
  }

  // Check if component has error state handling
  if (!component.props?.error && !component.state?.isError) {
    issues.push('Missing error state handling');
  }

  // Check if component has offline state handling
  if (!component.props?.offline && !component.state?.isOffline) {
    issues.push('Missing offline state handling');
  }

  // Check if component has empty state handling
  if (!component.props?.empty && !component.state?.isEmpty) {
    issues.push('Missing empty state handling');
  }

  return {
    buttonId,
    hasLoadingState: !issues[0]?.includes('loading'),
    hasErrorState: !issues[1]?.includes('error'),
    hasOfflineState: !issues[2]?.includes('offline'),
    hasEmptyState: !issues[3]?.includes('empty'),
    overall: issues.length === 0 ? 'PASS' : 'FAIL',
    issues,
  };
}

/**
 * Audit all buttons in application
 */
export function auditAllButtons(): ButtonAuditResult[] {
  // This would scan all button components in the app
  // For now, return empty array as this requires component scanning
  return [];
}

/**
 * Get button state for rendering
 */
export function getButtonStateProps(state: ButtonState): {
  disabled: boolean;
  'aria-busy': boolean;
  'data-state': string;
} {
  return {
    disabled: state.disabled,
    'aria-busy': state.isLoading,
    'data-state': state.isLoading ? 'loading' : 
                  state.isError ? 'error' : 
                  state.isOffline ? 'offline' : 
                  state.isEmpty ? 'empty' : 'normal',
  };
}

/**
 * Get button text based on state
 */
export function getButtonText(
  normalText: string,
  state: ButtonState
): string {
  if (state.isLoading) {
    return 'Loading...';
  }
  if (state.isError) {
    return 'Retry';
  }
  if (state.isOffline) {
    return 'Offline';
  }
  if (state.isEmpty) {
    return 'No Data';
  }
  return normalText;
}
