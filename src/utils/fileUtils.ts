/**
 * Validates if a file is a supported resume format
 */
export function isValidResumeFile(file: File): boolean {
  const validTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  return (
    validTypes.includes(file.type) ||
    file.name.toLowerCase().endsWith('.docx') ||
    file.name.toLowerCase().endsWith('.pdf')
  );
}

/**
 * Filters and validates multiple files
 * Returns array of valid files and error count
 */
export function validateResumeFiles(files: File[]): {
  validFiles: File[];
  invalidCount: number;
} {
  const validFiles = files.filter(isValidResumeFile);
  const invalidCount = files.length - validFiles.length;

  return {
    validFiles,
    invalidCount,
  };
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Gets a display name for a file (without extension)
 */
export function getFileDisplayName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, '');
}

/**
 * Checks if file size is within acceptable limits (5MB)
 */
export function isFileSizeValid(file: File, maxSizeMB: number = 5): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
}
