/**
 * Composable for centralized date formatting
 * Eliminates duplicate date formatting logic across components
 */
export function useDateFormatter(): {
  formatShortDate: (timestamp: number | string | Date) => string;
  formatMediumDate: (timestamp: number | string | Date) => string;
  formatLongDate: (timestamp: number | string | Date) => string;
  formatISODate: (timestamp: number | string | Date) => string;
  formatRelativeTime: (timestamp: number | string | Date) => string;
  formatTime: (timestamp: number | string | Date) => string;
} {
  /**
   * Format a timestamp to a short date string (e.g., "Jan 15")
   * @param timestamp - Date timestamp or Date object
   * @returns Formatted date string
   */
  const formatShortDate = (timestamp: number | string | Date): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  /**
   * Format a timestamp to a medium date string (e.g., "Jan 15, 2024")
   * @param timestamp - Date timestamp or Date object
   * @returns Formatted date string
   */
  const formatMediumDate = (timestamp: number | string | Date): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  /**
   * Format a timestamp to a long date string (e.g., "January 15, 2024")
   * @param timestamp - Date timestamp or Date object
   * @returns Formatted date string
   */
  const formatLongDate = (timestamp: number | string | Date): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  /**
   * Format a timestamp to ISO date format for input fields (YYYY-MM-DD)
   * @param timestamp - Date timestamp or Date object
   * @returns ISO date string
   */
  const formatISODate = (timestamp: number | string | Date): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const result = date.toISOString().split('T')[0];
    return result ?? '';
  };

  /**
   * Format a timestamp to a relative time string (e.g., "2 days ago", "in 3 hours")
   * @param timestamp - Date timestamp or Date object
   * @returns Relative time string
   */
  const formatRelativeTime = (timestamp: number | string | Date): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffDays === 0) {
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        if (diffMinutes === 0) return 'just now';
        return diffMinutes > 0 ? `in ${diffMinutes} minutes` : `${Math.abs(diffMinutes)} minutes ago`;
      }
      return diffHours > 0 ? `in ${diffHours} hours` : `${Math.abs(diffHours)} hours ago`;
    } else if (diffDays === 1) {
      return 'tomorrow';
    } else if (diffDays === -1) {
      return 'yesterday';
    } else if (diffDays > 0) {
      return `in ${diffDays} days`;
    } else {
      return `${Math.abs(diffDays)} days ago`;
    }
  };

  /**
   * Format a timestamp to a time string (e.g., "2:30 PM")
   * @param timestamp - Date timestamp or Date object
   * @returns Time string
   */
  const formatTime = (timestamp: number | string | Date): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return {
    formatShortDate,
    formatMediumDate,
    formatLongDate,
    formatISODate,
    formatRelativeTime,
    formatTime
  };
}
