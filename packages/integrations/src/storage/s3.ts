import {
  S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "node:stream";

export interface StorageProvider {
  put(key: string, body: Buffer | Uint8Array | string, contentType: string): Promise<{ key: string; bytes: number }>;
  get(key: string): Promise<Buffer>;
  getUrl(key: string, expiresInSeconds?: number): Promise<string>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}

/** S3-compatible storage. Works against AWS S3 and MinIO (path-style) in dev. */
export class S3Provider implements StorageProvider {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET ?? "demoforge";
    this.client = new S3Client({
      region: process.env.S3_REGION ?? "us-east-1",
      endpoint: process.env.S3_ENDPOINT || undefined,
      forcePathStyle: (process.env.S3_FORCE_PATH_STYLE ?? "true") === "true",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "minio",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "minio123",
      },
    });
  }

  async put(key: string, body: Buffer | Uint8Array | string, contentType: string) {
    const buf = typeof body === "string" ? Buffer.from(body) : Buffer.from(body);
    await this.client.send(
      new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: buf, ContentType: contentType }),
    );
    return { key, bytes: buf.byteLength };
  }

  async get(key: string): Promise<Buffer> {
    const res = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }));
    const stream = res.Body as Readable;
    const chunks: Buffer[] = [];
    for await (const c of stream) chunks.push(Buffer.from(c));
    return Buffer.concat(chunks);
  }

  async getUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    return getSignedUrl(this.client, new GetObjectCommand({ Bucket: this.bucket, Key: key }), {
      expiresIn: expiresInSeconds,
    });
  }

  async delete(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  async exists(key: string): Promise<boolean> {
    try {
      await this.client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: key }));
      return true;
    } catch {
      return false;
    }
  }
}

let _storage: StorageProvider | null = null;
export function getStorage(): StorageProvider {
  if (!_storage) _storage = new S3Provider();
  return _storage;
}
