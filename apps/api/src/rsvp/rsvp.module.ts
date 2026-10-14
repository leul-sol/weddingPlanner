import { Module } from '@nestjs/common';
import { RsvpService } from './rsvp.service';
import { RsvpController, PublicRsvpController } from './rsvp.controller';
import { WeddingAccessGuard } from '../auth/wedding-access.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [RsvpService, WeddingAccessGuard],
  controllers: [RsvpController, PublicRsvpController],
})
export class RsvpModule {}
