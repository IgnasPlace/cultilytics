/**
 * Composable for file size formatting utilities
 * Eliminates duplicate file size formatting logic
 */
export function useFileSize(): {
  formatBytes: (bytes: number, decimals?: number) => string;
  formatKB: (bytes: number, decimals?: number) => string;
  formatMB: (bytes: number, decimals?: number) => string;
  exceedsLimit: (bytes: number, limitMB: number) => boolean;
} {
  /**
   * Format bytes to human readable format
   * @param bytes - Size in bytes
   * @param decimals - Number of decimal places
   * @returns Human readable size string
   */
  const formatBytes = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return '0 Bytes';

    const k: number = 1024;
    const dm: number = decimals < 0 ? 0 : decimals;
    const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i: number = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  /**
   * Format bytes to kilobytes
   * @param bytes - Size in bytes
   * @param decimals - Number of decimal places
   * @returns Size in KB
   */
  const formatKB = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return '0 KB';
    const kb: number = bytes / 1024;
    return `${kb.toFixed(decimals)} KB`;
  };

  /**
   * Format bytes to megabytes
   * @param bytes - Size in bytes
   * @param decimals - Number of decimal places
   * @returns Size in MB
   */
  const formatMB = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return '0 MB';
    const mb: number = bytes / (1024 * 1024);
    return `${mb.toFixed(decimals)} MB`;
  };

  /**
   * Check if file size exceeds a limit
   * @param bytes - File size in bytes
   * @param limitMB - Size limit in MB
   * @returns True if file exceeds limit
   */
  const exceedsLimit = (bytes: number, limitMB: number): boolean => {
    const limitBytes: number = limitMB * 1024 * 1024;
    return bytes > limitBytes;
  };

  return {
    formatBytes,
    formatKB,
    formatMB,
    exceedsLimit
  };
}
