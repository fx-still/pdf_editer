export const FILE_LIMITS = {
  maxFileMB: 50,
  get maxFileBytes() {
    return this.maxFileMB * 1024 * 1024;
  },
} as const;

