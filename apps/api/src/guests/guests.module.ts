import { Module } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { GuestsController } from './guests.controller';
import { WeddingAccessGuard } from '../auth/wedding-access.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [GuestsService, WeddingAccessGuard],
  controllers: [GuestsController],
})
export class GuestsModule {}
