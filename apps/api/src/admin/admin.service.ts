import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  /** Platform-wide dashboard. All values from real records. */
  async platformStats() {
    const [
      totalWeddings,
      activeWeddings,
      completedWeddings,
      archivedWeddings,
      upcomingWeddings,
      totalUsers,
      totalInvitations,
      totalCheckIns,
      storageAgg,
    ] = await this.prisma.$transaction([
      this.prisma.wedding.count(),
      this.prisma.wedding.count({ where: { status: 'ACTIVE' } }),
      this.prisma.wedding.count({ where: { status: 'COMPLETED' } }),
      this.prisma.wedding.count({ where: { status: 'ARCHIVED' } }),
      this.prisma.wedding.count({
        where: { status: 'ACTIVE', date: { gt: new Date() } },
      }),
      this.prisma.user.count(),
      this.prisma.invitation.count(),
      this.prisma.checkInRecord.count({ where: { result: 'ADMITTED' } }),
      this.prisma.mediaFile.aggregate({ _sum: { sizeBytes: true } }),
    ]);

    return {
      weddings: {
        total: totalWeddings,
        active: activeWeddings,
        completed: completedWeddings,
        archived: archivedWeddings,
        upcoming: upcomingWeddings,
      },
      totalUsers,
      totalInvitations,
      totalCheckIns,
      storageBytes: Number(storageAgg._sum.sizeBytes ?? 0),
    };
  }
}
