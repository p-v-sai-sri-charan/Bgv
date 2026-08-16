import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { StorageProvider } from "./types";

/**
 * Stores uploaded documents on local disk. Fine for development/single-box
 * deployments; swap in an S3-compatible provider for production by
 * implementing StorageProvider and wiring it in index.ts.
 */
export class LocalStorageProvider implements StorageProvider {
  name = "local";
  private readonly rootDir: string;

  constructor(rootDir: string) {
    this.rootDir = path.resolve(rootDir);
  }

  private resolveSafePath(key: string): string {
    const resolved = path.resolve(this.rootDir, key);
    if (!resolved.startsWith(this.rootDir + path.sep)) {
      throw new Error("Invalid storage key");
    }
    return resolved;
  }

  async save(key: string, buffer: Buffer): Promise<void> {
    const filePath = this.resolveSafePath(key);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, buffer);
  }

  async read(key: string): Promise<Buffer> {
    return readFile(this.resolveSafePath(key));
  }

  async delete(key: string): Promise<void> {
    await rm(this.resolveSafePath(key), { force: true });
  }
}
