import { Injectable, Logger } from '@nestjs/common';

/**
 * Object-storage abstraction for wedding media — Phase 4 (spec §9.2, §16).
 *
 * The receiving team should implement this against the S3-compatible MinIO
 * instance already provided in docker-compose (env: S3_ENDPOINT, S3_BUCKET,
 * S3_ACCESS_KEY, S3_SECRET_KEY). Media must be stored in PRIVATE object
 * storage and served via short-lived signed URLs — never public buckets and
 * never large binaries in Postgres (spec §9.2).
 */
export interface StorageService {
  /** Return a presigned URL the client can PUT a file to directly. */
  getUploadUrl(key: string, contentType: string): Promise<string>;
  /** Return a short-lived presigned URL to read a private object. */
  getDownloadUrl(key: string): Promise<string>;
  deleteObject(key: string): Promise<void>;
}

export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');

/**
 * ⚠️ MOCK IMPLEMENTATION — NOT REAL STORAGE.
 *
 * This mock lets the API boot and the media flow be wired end-to-end before
 * S3/MinIO is integrated. It returns fake URLs and does NOT persist bytes.
 * It must be replaced before any media feature is considered functional
 * (spec §16: "Do not represent ... database operations as production
 * functionality").
 *
 * TODO(Phase 4): replace with a real S3 client implementation, e.g.
 *   - use @aws-sdk/client-s3 + @aws-sdk/s3-request-presigner
 *   - point at env.S3_ENDPOINT with forcePathStyle: true for MinIO
 *   - getUploadUrl -> getSignedUrl(PutObjectCommand), short expiry
 *   - getDownloadUrl -> getSignedUrl(GetObjectCommand), short expiry
 *   - generate thumbnails on upload completion (sharp) where supported
 */
@Injectable()
export class MockStorageService implements StorageService {
  private readonly logger = new Logger(MockStorageService.name);

  async getUploadUrl(key: string, contentType: string): Promise<string> {
    this.logger.warn(
      `MOCK storage: pretend upload URL for "${key}" (${contentType}). No bytes are stored.`,
    );
    return `mock://upload/${encodeURIComponent(key)}`;
  }

  async getDownloadUrl(key: string): Promise<string> {
    this.logger.warn(`MOCK storage: pretend download URL for "${key}".`);
    return `mock://download/${encodeURIComponent(key)}`;
  }

  async deleteObject(key: string): Promise<void> {
    this.logger.warn(`MOCK storage: pretend delete "${key}".`);
  }
}
