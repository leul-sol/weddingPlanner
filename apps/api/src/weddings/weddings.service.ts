import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PlatformRole,
  WeddingRole,
  WeddingStatus,
  DEFAULT_ROLE_PERMISSIONS,
} from '@wedlink/shared';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../auth/auth.types';
import {
  CreateWeddingDto,
  UpdateWeddingDto,
  ChangeStatusDto,
} from './dto/wedding.dto';

@Injectable()
export class WeddingsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Create a wedding and make the creator its OWNER (full permissions). */
  async create(user: AuthUser, dto: CreateWeddingDto) {
    return this.prisma.$transaction(async (tx) => {
      const wedding = await tx.wedding.create({
        data: {
          title: dto.title,
          groomName: dto.groomName,
          brideName: dto.brideName,
          description: dto.description,
          date: new Date(dto.date),
          startTime: dto.startTime,
          endTime: dto.endTime,
          timeZone: dto.timeZone ?? 'Africa/Addis_Ababa',
          venueName: dto.venueName,
          venueAddress: dto.venueAddress,
          mapUrl: dto.mapUrl,
          contactInfo: dto.contactInfo,
          theme: dto.theme ?? 'LUXURY_GOLD',
          defaultLanguage: dto.defaultLanguage ?? 'EN',
          albumPrivacy: dto.albumPrivacy ?? 'PRIVATE',
          rsvpDeadline: dto.rsvpDeadline ? new Date(dto.rsvpDeadline) : null,
          status: WeddingStatus.DRAFT,
          ownerId: user.id,
        },
      });

      await tx.weddingMembership.create({
        data: {
          userId: user.id,
          weddingId: wedding.id,
          role: WeddingRole.OWNER,
          permissions: DEFAULT_ROLE_PERMISSIONS[WeddingRole.OWNER],
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          weddingId: wedding.id,
          action: 'WEDDING_CREATED',
          target: wedding.id,
        },
      });

      return wedding;
    });
  }

  /**
   * List weddings the user may manage. SUPER_ADMIN sees all; everyone else
   * sees only weddings where they hold a membership. Supports search,
   * status filter, sorting, and pagination.
   */
  async list(
    user: AuthUser,
    opts: {
      search?: string;
      status?: WeddingStatus;
      page?: number;
      pageSize?: number;
      sort?: 'date' | 'createdAt' | 'title';
      order?: 'asc' | 'desc';
    },
  ) {
    const page = Math.max(1, opts.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, opts.pageSize ?? 20));
    const isSuper = user.platformRole === PlatformRole.SUPER_ADMIN;

    const where: Record<string, unknown> = {};
    if (!isSuper) {
      where.memberships = { some: { userId: user.id } };
    }
    if (opts.status) where.status = opts.status;
    if (opts.search) {
      where.OR = [
        { title: { contains: opts.search, mode: 'insensitive' } },
        { groomName: { contains: opts.search, mode: 'insensitive' } },
        { brideName: { contains: opts.search, mode: 'insensitive' } },
      ];
    }

    const orderBy = { [opts.sort ?? 'date']: opts.order ?? 'desc' };

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.wedding.count({ where }),
      this.prisma.wedding.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          owner: { select: { id: true, name: true, email: true } },
          _count: {
            select: {
              guests: true,
              invitations: true,
              events: true,
              albums: true,
            },
          },
        },
      }),
    ]);

    return {
      data: rows,
      pagination: { page, pageSize, total, pages: Math.ceil(total / pageSize) },
    };
  }

  /** Compact list for the wedding-context selector in the nav bar. */
  async mySelector(user: AuthUser) {
    const isSuper = user.platformRole === PlatformRole.SUPER_ADMIN;
    if (isSuper) {
      const rows = await this.prisma.wedding.findMany({
        orderBy: { date: 'desc' },
        take: 50,
        select: { id: true, title: true, brideName: true, groomName: true },
      });
      return rows.map((w) => ({ ...w, role: 'SUPER_ADMIN' as const }));
    }
    const memberships = await this.prisma.weddingMembership.findMany({
      where: { userId: user.id },
      include: {
        wedding: {
          select: { id: true, title: true, brideName: true, groomName: true },
        },
      },
      orderBy: { wedding: { date: 'desc' } },
    });
    return memberships.map((m) => ({
      id: m.wedding.id,
      title: m.wedding.title,
      brideName: m.wedding.brideName,
      groomName: m.wedding.groomName,
      role: m.role,
    }));
  }

  async findOne(weddingId: string) {
    const wedding = await this.prisma.wedding.findUnique({
      where: { id: weddingId },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        events: { orderBy: { startsAt: 'asc' } },
      },
    });
    if (!wedding) throw new NotFoundException('Wedding not found');
    return wedding;
  }

  async update(weddingId: string, actor: AuthUser, dto: UpdateWeddingDto) {
    const data: Record<string, unknown> = { ...dto };
    if (dto.date) data.date = new Date(dto.date);
    if (dto.rsvpDeadline) data.rsvpDeadline = new Date(dto.rsvpDeadline);

    const updated = await this.prisma.wedding.update({
      where: { id: weddingId },
      data,
    });
    await this.prisma.auditLog.create({
      data: {
        actorUserId: actor.id,
        weddingId,
        action: 'WEDDING_UPDATED',
        target: weddingId,
      },
    });
    return updated;
  }

  async changeStatus(
    weddingId: string,
    actor: AuthUser,
    dto: ChangeStatusDto,
  ) {
    const updated = await this.prisma.wedding.update({
      where: { id: weddingId },
      data: {
        status: dto.status,
        archivedAt: dto.status === WeddingStatus.ARCHIVED ? new Date() : null,
      },
    });
    await this.prisma.auditLog.create({
      data: {
        actorUserId: actor.id,
        weddingId,
        action: `WEDDING_STATUS_${dto.status}`,
        target: weddingId,
      },
    });
    return updated;
  }

  /** Dashboard counts for one wedding — all computed from real records. */
  async dashboard(weddingId: string) {
    const [
      guests,
      invitations,
      invitesSent,
      rsvpConfirmed,
      rsvpDeclined,
      rsvpPending,
      events,
      albums,
      approvedMedia,
      pendingMedia,
      admittedCheckIns,
      revokedInvites,
    ] = await this.prisma.$transaction([
      this.prisma.guest.count({ where: { weddingId } }),
      this.prisma.invitation.count({ where: { weddingId } }),
      this.prisma.invitation.count({
        where: { weddingId, status: 'PUBLISHED' },
      }),
      this.prisma.rSVPResponse.count({
        where: { invitation: { weddingId }, status: 'CONFIRMED' },
      }),
      this.prisma.rSVPResponse.count({
        where: { invitation: { weddingId }, status: 'DECLINED' },
      }),
      this.prisma.rSVPResponse.count({
        where: { invitation: { weddingId }, status: 'PENDING' },
      }),
      this.prisma.weddingEvent.count({ where: { weddingId } }),
      this.prisma.album.count({ where: { weddingId, published: true } }),
      this.prisma.mediaFile.count({
        where: { weddingId, status: 'APPROVED' },
      }),
      this.prisma.mediaFile.count({ where: { weddingId, status: 'PENDING' } }),
      this.prisma.checkInRecord.count({
        where: { weddingId, result: 'ADMITTED' },
      }),
      this.prisma.invitation.count({
        where: { weddingId, status: 'REVOKED' },
      }),
    ]);

    return {
      guests,
      invitations,
      invitesSent,
      rsvp: {
        confirmed: rsvpConfirmed,
        declined: rsvpDeclined,
        pending: rsvpPending,
      },
      events,
      publishedAlbums: albums,
      media: { approved: approvedMedia, pending: pendingMedia },
      checkedIn: admittedCheckIns,
      revokedInvitations: revokedInvites,
    };
  }
}
