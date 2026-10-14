import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WeddingPermission } from '@wedlink/shared';
import { AlbumsService } from './albums.service';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WeddingAccessGuard } from '../auth/wedding-access.guard';
import { RequireWeddingPermission } from '../auth/require-wedding-permission.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/auth.types';

@Controller('weddings/:weddingId/albums')
@UseGuards(JwtAuthGuard, WeddingAccessGuard)
export class AlbumsController {
  constructor(
    private readonly albums: AlbumsService,
    private readonly media: MediaService,
  ) {}

  @Get()
  @RequireWeddingPermission(WeddingPermission.ALBUMS_MANAGE)
  list(@Param('weddingId') weddingId: string) {
    return this.albums.list(weddingId);
  }

  @Post()
  @RequireWeddingPermission(WeddingPermission.ALBUMS_MANAGE)
  create(@Param('weddingId') weddingId: string) {
    return this.albums.create(weddingId);
  }

  @Post(':albumId/upload-url')
  @RequireWeddingPermission(WeddingPermission.MEDIA_UPLOAD)
  requestUpload(
    @Param('weddingId') weddingId: string,
    @Param('albumId') albumId: string,
  ) {
    return this.albums.requestUpload(weddingId, albumId);
  }

  // ── Moderation (spec §9.3) ──

  @Get('media/pending')
  @RequireWeddingPermission(WeddingPermission.MEDIA_MODERATE)
  pending(@Param('weddingId') weddingId: string) {
    return this.media.pendingForWedding(weddingId);
  }

  @Post('media/:mediaId/moderate')
  @RequireWeddingPermission(WeddingPermission.MEDIA_MODERATE)
  moderate(
    @Param('weddingId') weddingId: string,
    @Param('mediaId') mediaId: string,
    @Body('decision') decision: 'APPROVED' | 'REJECTED',
    @CurrentUser() user: AuthUser,
  ) {
    return this.media.moderate(weddingId, mediaId, decision, user.id);
  }

  @Delete('media/:mediaId')
  @RequireWeddingPermission(WeddingPermission.MEDIA_DELETE)
  removeMedia(
    @Param('weddingId') weddingId: string,
    @Param('mediaId') mediaId: string,
  ) {
    return this.media.remove(weddingId, mediaId);
  }
}

/** PUBLIC album access by opaque token (spec §9.4). Not wedding-guarded. */
@Controller('public/albums')
export class PublicAlbumsController {
  constructor(private readonly albums: AlbumsService) {}

  @Get(':publicToken')
  getPublic(@Param('publicToken') publicToken: string) {
    return this.albums.getPublicAlbum(publicToken);
  }
}
