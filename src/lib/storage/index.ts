import "server-only";

import type { StorageProvider } from "./types";
import { LocalStorageProvider } from "./local-provider";

export type { StorageProvider } from "./types";

/**
 * Add a real provider (e.g. S3 / R2 / GCS) by implementing StorageProvider
 * and registering it here, then set STORAGE_PROVIDER to enable it.
 */
function resolveStorageProvider(): StorageProvider {
  const key = process.env.STORAGE_PROVIDER ?? "local";
  switch (key) {
    case "local":
      return new LocalStorageProvider(
        process.env.STORAGE_LOCAL_DIR ?? "./storage",
      );
    default:
      throw new Error(
        `Unknown STORAGE_PROVIDER "${key}". Only "local" is wired up today — ` +
          `implement StorageProvider and register it in src/lib/storage/index.ts to add a real backend.`,
      );
  }
}

export const storageProvider = resolveStorageProvider();

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB
export const ALLOWED_UPLOAD_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

export function assertValidUpload(file: { size: number; type: string }) {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File exceeds the 10MB upload limit");
  }
  if (!ALLOWED_UPLOAD_MIME_TYPES.includes(file.type)) {
    throw new Error("Only PDF, JPEG, and PNG files are allowed");
  }
}
