import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WeddingPermission } from '@wedlink/shared';
import { CheckinService } from './checkin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WeddingAccessGuard } from '../auth/wedding-access.guard';
import { RequireWeddingPermission } from '../auth/require-wedding-permission.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/auth.types';

/**
 * Entrance check-in — Phase 3 (spec §8). All routes require CHECKIN_SCAN and
 * are wedding-scoped so entrance staff can only act on their assigned wedding.
 */
@Controller('weddings/:weddingId/events/:eventId/checkin')
@UseGuards(JwtAuthGuard, WeddingAccessGuard)
export class CheckinController {
  constructor(private readonly checkin: CheckinService) {}

  /** Preview a scan result without admitting. */
  @Post('verify')
  @RequireWeddingPermission(WeddingPermission.CHECKIN_SCAN)
  verify(
    @Param('weddingId') weddingId: string,
    @Param('eventId') eventId: string,
    @Body('token') token: string,
  ) {
    return this.checkin.verify(weddingId, eventId, token);
  }

  /** Admit attendees (concurrency-safe; see service TODO). */
  @Post('admit')
  @RequireWeddingPermission(WeddingPermission.CHECKIN_SCAN)
  admit(
    @Param('weddingId') weddingId: string,
    @Param('eventId') eventId: string,
    @Body('token') token: string,
    @Body('count') count: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.checkin.admit(weddingId, eventId, token, user.id, count ?? 1);
  }

  @Get('search')
  @RequireWeddingPermission(WeddingPermission.CHECKIN_SCAN)
  manualSearch(
    @Param('weddingId') weddingId: string,
    @Query('q') query: string,
  ) {
    return this.checkin.manualSearch(weddingId, query);
  }

  @Get('report')
  @RequireWeddingPermission(WeddingPermission.REPORTS_VIEW)
  report(
    @Param('weddingId') weddingId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.checkin.attendanceReport(weddingId, eventId);
  }
}
