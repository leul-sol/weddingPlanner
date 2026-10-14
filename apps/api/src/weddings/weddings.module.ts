import { Module } from '@nestjs/common';
import { WeddingsService } from './weddings.service';
import { WeddingsController } from './weddings.controller';
import { WeddingAccessGuard } from '../auth/wedding-access.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [WeddingsService, WeddingAccessGuard],
  controllers: [WeddingsController],
})
export class WeddingsModule {}
