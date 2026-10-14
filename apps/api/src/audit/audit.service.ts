import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Audit logging for sensitive operations (spec §13, §18 acceptance #25).
 *
 * Call `record()` from any service after an important mutation (wedding status
 * change, invitation revoke, token regeneration, media deletion, report export,
 * role/permission changes). The Weddings service already demonstrates this
 * pattern inline; new modules should prefer this shared helper.
 */
@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async record(params: {
    actorUserId?: string;
    weddingId?: string;
    action: string;
    target?: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorUserId: params.actorUserId,
        weddingId: params.weddingId,
        action: params.action,
        target: params.target,
        metadata: params.metadata as object | undefined,
      },
    });
  }
}
