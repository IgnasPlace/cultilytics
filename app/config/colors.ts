/**
 * Centralized color configuration for the application
 * Replaces hardcoded color values across components
 */

export const COLORS: Record<string, string> = {
  // Primary brand color - green (#4C763B)
  PRIMARY: '#4C763B',
  PRIMARY_LIGHT: '#5A8A47',
  PRIMARY_DARK: '#3D5F2F',
  PRIMARY_BACKGROUND: '#F0F4ED',

  // Secondary brand color - pink/magenta (#B95E82)
  SECONDARY: '#B95E82',
  SECONDARY_LIGHT: '#C97896',
  SECONDARY_DARK: '#9A4D6B',
  SECONDARY_BACKGROUND: '#FDF2F6',

  // Semantic colors
  SUCCESS: '#4C763B', // Same as primary
  SUCCESS_LIGHT: '#E8F5E9',
  WARNING: '#F59E0B',
  WARNING_LIGHT: '#FEF3C7',
  ERROR: '#EF4444',
  ERROR_LIGHT: '#FEE2E2',
  INFO: '#3B82F6',
  INFO_LIGHT: '#DBEAFE',

  // Health status colors
  HEALTH_HEALTHY: '#22C55E',
  HEALTH_ISSUE: '#EF4444',
  HEALTH_RECOVERING: '#F59E0B',

  // Priority colors
  PRIORITY_HIGH: '#EF4444',
  PRIORITY_MEDIUM: '#F59E0B',
  PRIORITY_LOW: '#22C55E',

  // Neutral colors
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_50: '#F9FAFB',
  GRAY_100: '#F3F4F6',
  GRAY_200: '#E5E7EB',
  GRAY_300: '#D1D5DB',
  GRAY_400: '#9CA3AF',
  GRAY_500: '#6B7280',
  GRAY_600: '#4B5563',
  GRAY_700: '#374151',
  GRAY_800: '#1F2937',
  GRAY_900: '#111827',

  // Overlay/background colors
  OVERLAY_LIGHT: 'rgba(255, 255, 255, 0.9)',
  OVERLAY_DARK: 'rgba(0, 0, 0, 0.5)',
  BACKDROP: 'rgba(0, 0, 0, 0.3)',

  // Border colors
  BORDER_LIGHT: '#E5E7EB',
  BORDER_MEDIUM: '#D1D5DB',
  BORDER_FOCUS: '#4C763B',
};

/**
 * Color utilities for dynamic color generation
 */
export const colorUtils: {
  hexToRgba: (hex: string, alpha?: number) => string;
  withOpacity: (colorKey: string, alpha?: number) => string;
  asCssVar: (colorKey: string) => string;
} = {
  /**
   * Convert hex color to rgba with opacity
   * @param hex - Hex color code
   * @param alpha - Opacity (0-1)
   * @returns rgba color string
   */
  hexToRgba(hex: string, alpha: number = 1): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  /**
   * Get color with opacity applied
   * @param colorKey - Key from COLORS object
   * @param alpha - Opacity (0-1)
   * @returns rgba color string
   */
  withOpacity(colorKey: string, alpha: number = 1): string {
    const hex = COLORS[colorKey];
    if (!hex || !hex.startsWith('#')) return hex;
    return this.hexToRgba(hex, alpha);
  },

  /**
   * Get CSS variable value for a color
   * Useful for dynamic style binding
   * @param colorKey - Key from COLORS object
   * @returns CSS variable reference
   */
  asCssVar(colorKey: string): string {
    return `var(--color-${colorKey.toLowerCase().replace(/_/g, '-')})`;
  },
};

interface ColorStyle {
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
}

/**
 * CSS-in-JS friendly color styles
 * Use these for inline style objects
 */
export const colorStyles: Record<string, ColorStyle> = {
  primary: { color: COLORS.PRIMARY },
  primaryBg: { backgroundColor: COLORS.PRIMARY },
  secondary: { color: COLORS.SECONDARY },
  secondaryBg: { backgroundColor: COLORS.SECONDARY },
  white: { color: COLORS.WHITE },
  whiteBg: { backgroundColor: COLORS.WHITE },
  grayText: { color: COLORS.GRAY_600 },
  border: { borderColor: COLORS.BORDER_LIGHT },
};

export default COLORS;
