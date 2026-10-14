import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { WeddingPermission } from '@wedlink/shared';
import { RsvpService } from './rsvp.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WeddingAccessGuard } from '../auth/wedding-access.guard';
import { RequireWeddingPermission } from '../auth/require-wedding-permission.decorator';

/** Authenticated RSVP views for organizers (spec §7, §10). */
@Controller('weddings/:weddingId/rsvp')
@UseGuards(JwtAuthGuard, WeddingAccessGuard)
export class RsvpController {
  constructor(private readonly rsvp: RsvpService) {}

  @Get('summary')
  @RequireWeddingPermission(WeddingPermission.RSVP_VIEW)
  summary(@Param('weddingId') weddingId: string) {
    return this.rsvp.summary(weddingId);
  }
}

/** PUBLIC guest RSVP by invitation token (spec §7). Not wedding-guarded. */
@Controller('public/rsvp')
export class PublicRsvpController {
  constructor(private readonly rsvp: RsvpService) {}

  @Post(':token')
  submit(@Param('token') token: string) {
    return this.rsvp.submitByToken(token);
  }
}
