import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import {
  InvitationsController,
  PublicInvitationsController,
} from './invitations.controller';
import { WeddingAccessGuard } from '../auth/wedding-access.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [InvitationsService, WeddingAccessGuard],
  controllers: [InvitationsController, PublicInvitationsController],
})
export class InvitationsModule {}
