import { Module } from '@nestjs/common';
import { CheckinService } from './checkin.service';
import { CheckinController } from './checkin.controller';
import { WeddingAccessGuard } from '../auth/wedding-access.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [CheckinService, WeddingAccessGuard],
  controllers: [CheckinController],
})
export class CheckinModule {}
