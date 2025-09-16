/**
 * Format file size in bytes to KB format
 * @param bytes - File size in bytes
 * @returns Formatted file size string in KB (e.g., "1024.0 KB", "500.0 KB")
 */
export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes || bytes === 0) {
    return '0.0 KB';
  }

  const sizeInKB = bytes / 1024;
  return `${sizeInKB.toFixed(1)} KB`;
}

/**
 * Convert bytes to specific unit
 * @param bytes - File size in bytes
 * @param unit - Target unit ('KB', 'MB', 'GB')
 * @returns Converted size as number
 */
export function convertFileSize(bytes: number, unit: 'KB' | 'MB' | 'GB'): number {
  const units = {
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024
  };
  
  return bytes / units[unit];
}