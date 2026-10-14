import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { notImplemented } from '../common/not-implemented';
import {
  CreateGuestDto,
  UpdateGuestDto,
  ImportGuestsDto,
} from './dto/guest.dto';

/**
 * Guest management — Phase 2 (spec §6).
 *
 * IMPLEMENTATION NOTES
 * --------------------
 * Every method is wedding-scoped. The controller already enforces membership
 * via WeddingAccessGuard, and passes the verified weddingId. ALWAYS filter
 * Prisma queries by { weddingId } so one wedding can never read or mutate
 * another wedding's guests (spec §18 acceptance #3, #4; test Scenario 2).
 *
 * Reference the working Weddings service for the exact query/transaction shape.
 */
@Injectable()
export class GuestsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * TODO(Phase 2, spec §6.1): list guests for a wedding with search, category
   * filter, sorting, and pagination. Mirror WeddingsService.list().
   * Acceptance: results are limited to the given weddingId only.
   */
  async list(weddingId: string) {
    void weddingId;
    void this.prisma;
    return notImplemented('Guest listing');
  }

  /**
   * TODO(Phase 2, spec §6.1): create a guest under weddingId. Set weddingId
   * from the verified context, never from the request body.
   */
  async create(weddingId: string, dto: CreateGuestDto) {
    void weddingId;
    void dto;
    return notImplemented('Guest creation');
  }

  /**
   * TODO(Phase 2): update a guest. First load it and assert guest.weddingId
   * === weddingId before mutating (defense in depth against ID tampering).
   */
  async update(weddingId: string, guestId: string, dto: UpdateGuestDto) {
    void weddingId;
    void guestId;
    void dto;
    return notImplemented('Guest update');
  }

  /** TODO(Phase 2): remove a guest (and cascade its invitation per schema). */
  async remove(weddingId: string, guestId: string) {
    void weddingId;
    void guestId;
    return notImplemented('Guest removal');
  }

  /**
   * TODO(Phase 2, spec §6.3): Excel/CSV import. Required workflow:
   *   1. parse the uploaded file (xlsx/csv)
   *   2. map columns -> fields
   *   3. validate required fields
   *   4. detect duplicates (by phone/email within the SAME weddingId)
   *   5. return valid + invalid rows for preview
   *   6. on confirm, create guests in a transaction
   * MUST NOT silently create duplicates or assign to the wrong wedding.
   */
  async importGuests(weddingId: string, dto: ImportGuestsDto) {
    void weddingId;
    void dto;
    return notImplemented('Guest Excel/CSV import');
  }

  /** TODO(Phase 2, spec §6.3): export this wedding's guest list as CSV/Excel. */
  async exportGuests(weddingId: string) {
    void weddingId;
    return notImplemented('Guest export');
  }
}
