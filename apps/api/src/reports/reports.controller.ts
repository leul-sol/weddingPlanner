import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { WeddingPermission } from '@wedlink/shared';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WeddingAccessGuard } from '../auth/wedding-access.guard';
import { RequireWeddingPermission } from '../auth/require-wedding-permission.decorator';

@Controller('weddings/:weddingId/reports')
@UseGuards(JwtAuthGuard, WeddingAccessGuard)
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Get('guests')
  @RequireWeddingPermission(WeddingPermission.REPORTS_VIEW)
  guests(@Param('weddingId') weddingId: string) {
    return this.reports.guestReport(weddingId);
  }

  @Get('attendance')
  @RequireWeddingPermission(WeddingPermission.REPORTS_VIEW)
  attendance(@Param('weddingId') weddingId: string) {
    return this.reports.attendanceReport(weddingId);
  }

  @Get('rsvp')
  @RequireWeddingPermission(WeddingPermission.REPORTS_VIEW)
  rsvp(@Param('weddingId') weddingId: string) {
    return this.reports.rsvpReport(weddingId);
  }

  @Get('export')
  @RequireWeddingPermission(WeddingPermission.REPORTS_EXPORT)
  export(
    @Param('weddingId') weddingId: string,
    @Query('kind') kind: string,
  ) {
    return this.reports.export(weddingId, kind);
  }
}
