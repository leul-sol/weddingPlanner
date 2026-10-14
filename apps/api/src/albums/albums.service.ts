import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { notImplemented } from '../common/not-implemented';
import { STORAGE_SERVICE, StorageService } from '../storage/storage.service';

/**
 * Wedding albums + media — Phase 4 (spec §9).
 *
 * Album privacy (spec §9.4): PRIVATE | INVITED | PUBLIC.
 *   - PRIVATE: only the couple + explicitly authorized users (AlbumPermission).
 *   - INVITED: guests with a valid invitation token/session.
 *   - PUBLIC: anyone with the album's opaque publicToken.
 * A private album MUST NOT be reachable by guessing a URL (spec §9.4).
 */
@Injectable()
export class AlbumsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(STORAGE_SERVICE) private readonly storage: StorageService,
  ) {}

  /** TODO(Phase 4, §9.1): list albums for a wedding (filter by weddingId). */
  async list(weddingId: string) {
    void weddingId;
    void this.prisma;
    return notImplemented('Album listing');
  }

  /** TODO(Phase 4, §9.1): create an album under weddingId. */
  async create(weddingId: string) {
    void weddingId;
    return notImplemented('Album creation');
  }

  /**
   * TODO(Phase 4, §9.2): begin a media upload. Validate file type + size
   * server-side, create a PENDING MediaFile row, and return a presigned upload
   * URL from the storage service. Denormalize weddingId onto MediaFile for fast
   * isolation checks.
   */
  async requestUpload(weddingId: string, albumId: string) {
    // The implementer will call this.storage.getUploadUrl(...)
    void this.storage;
    void weddingId;
    void albumId;
    return notImplemented('Media upload URL');
  }

  /**
   * TODO(Phase 4, §9.4): PUBLIC — resolve a public album by its opaque
   * publicToken. Only works when album.privacy === PUBLIC and album.published.
   * Return approved media only.
   */
  async getPublicAlbum(publicToken: string) {
    void publicToken;
    return notImplemented('Public album lookup');
  }
}
