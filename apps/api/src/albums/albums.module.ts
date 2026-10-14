import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { MediaService } from './media.service';
import {
  AlbumsController,
  PublicAlbumsController,
} from './albums.controller';
import { WeddingAccessGuard } from '../auth/wedding-access.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [AlbumsService, MediaService, WeddingAccessGuard],
  controllers: [AlbumsController, PublicAlbumsController],
})
export class AlbumsModule {}
