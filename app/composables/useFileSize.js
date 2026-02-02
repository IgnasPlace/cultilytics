/**
 * Composable for file size formatting utilities
 * Eliminates duplicate file size formatting logic
 */
export function useFileSize() {
  /**
   * Format bytes to human readable format
   * @param {number} bytes - Size in bytes
   * @param {number} decimals - Number of decimal places
   * @returns {string} Human readable size string
   */
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  /**
   * Format bytes to kilobytes
   * @param {number} bytes - Size in bytes
   * @param {number} decimals - Number of decimal places
   * @returns {string} Size in KB
   */
  const formatKB = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 KB';
    const kb = bytes / 1024;
    return `${kb.toFixed(decimals)} KB`;
  };

  /**
   * Format bytes to megabytes
   * @param {number} bytes - Size in bytes
   * @param {number} decimals - Number of decimal places
   * @returns {string} Size in MB
   */
  const formatMB = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(decimals)} MB`;
  };

  /**
   * Check if file size exceeds a limit
   * @param {number} bytes - File size in bytes
   * @param {number} limitMB - Size limit in MB
   * @returns {boolean} True if file exceeds limit
   */
  const exceedsLimit = (bytes, limitMB) => {
    const limitBytes = limitMB * 1024 * 1024;
    return bytes > limitBytes;
  };

  return {
    formatBytes,
    formatKB,
    formatMB,
    exceedsLimit
  };
}
