export interface StorageProvider {
  name: string;
  save(key: string, buffer: Buffer): Promise<void>;
  read(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
}
