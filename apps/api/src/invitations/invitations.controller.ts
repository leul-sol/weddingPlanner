import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { WeddingPermission } from '@wedlink/shared';
import { InvitationsService } from './invitations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WeddingAccessGuard } from '../auth/wedding-access.guard';
import { RequireWeddingPermission } from '../auth/require-wedding-permission.decorator';

@Controller('weddings/:weddingId/invitations')
@UseGuards(JwtAuthGuard, WeddingAccessGuard)
export class InvitationsController {
  constructor(private readonly invitations: InvitationsService) {}

  @Get()
  @RequireWeddingPermission(WeddingPermission.INVITES_MANAGE)
  list(@Param('weddingId') weddingId: string) {
    return this.invitations.list(weddingId);
  }

  @Post()
  @RequireWeddingPermission(WeddingPermission.INVITES_MANAGE)
  create(@Param('weddingId') weddingId: string) {
    return this.invitations.create(weddingId);
  }

  @Post(':invitationId/publish')
  @RequireWeddingPermission(WeddingPermission.INVITES_MANAGE)
  publish(
    @Param('weddingId') weddingId: string,
    @Param('invitationId') invitationId: string,
  ) {
    return this.invitations.publish(weddingId, invitationId);
  }

  @Post(':invitationId/revoke')
  @RequireWeddingPermission(WeddingPermission.INVITES_REVOKE)
  revoke(
    @Param('weddingId') weddingId: string,
    @Param('invitationId') invitationId: string,
  ) {
    return this.invitations.revoke(weddingId, invitationId);
  }

  @Post(':invitationId/regenerate-token')
  @RequireWeddingPermission(WeddingPermission.INVITES_REVOKE)
  regenerateToken(
    @Param('weddingId') weddingId: string,
    @Param('invitationId') invitationId: string,
  ) {
    return this.invitations.regenerateToken(weddingId, invitationId);
  }
}

/**
 * PUBLIC invitation page (spec §5.5). Not wedding-guarded — resolved by the
 * opaque token only. Kept as a separate controller so it is obviously outside
 * the authenticated, wedding-scoped surface.
 */
@Controller('public/invitations')
export class PublicInvitationsController {
  constructor(private readonly invitations: InvitationsService) {}

  @Get(':token')
  getByToken(@Param('token') token: string) {
    return this.invitations.getByPublicToken(token);
  }
}
