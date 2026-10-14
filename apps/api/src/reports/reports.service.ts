import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { notImplemented } from '../common/not-implemented';

/**
 * Reporting — Phase 5 (spec §11). All reports are wedding-scoped and must apply
 * authorization before generating/downloading (REPORTS_VIEW / REPORTS_EXPORT).
 * Figures must be computed from real records (spec §10, §18 acceptance #23).
 */
@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  /** TODO(Phase 5, §11): guest report (details, invite type, RSVP, status). */
  async guestReport(weddingId: string) {
    void weddingId;
    void this.prisma;
    return notImplemented('Guest report');
  }

  /** TODO(Phase 5, §11): attendance report (permitted vs actual, times, staff). */
  async attendanceReport(weddingId: string) {
    void weddingId;
    return notImplemented('Attendance report');
  }

  /** TODO(Phase 5, §11): RSVP report (confirmed/declined/pending). */
  async rsvpReport(weddingId: string) {
    void weddingId;
    return notImplemented('RSVP report');
  }

  /**
   * TODO(Phase 5, §11): export a report as CSV/Excel. Apply REPORTS_EXPORT and
   * stream the file. Keep rows limited to this wedding only.
   */
  async export(weddingId: string, kind: string) {
    void weddingId;
    void kind;
    return notImplemented('Report export');
  }
}
