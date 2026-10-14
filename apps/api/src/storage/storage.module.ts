import { Global, Module } from '@nestjs/common';
import { STORAGE_SERVICE, MockStorageService } from './storage.service';

/**
 * Provides the StorageService via the STORAGE_SERVICE token. Currently bound to
 * the MOCK implementation. TODO(Phase 4): swap useClass to the real S3 client.
 */
@Global()
@Module({
  providers: [{ provide: STORAGE_SERVICE, useClass: MockStorageService }],
  exports: [STORAGE_SERVICE],
})
export class StorageModule {}
