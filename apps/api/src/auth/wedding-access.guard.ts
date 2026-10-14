import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PlatformRole,
  WeddingRole,
  WeddingPermission,
  ALL_WEDDING_PERMISSIONS,
} from '@wedlink/shared';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from './auth.types';
import { WEDDING_PERMISSION_KEY } from './require-wedding-permission.decorator';

/** Verified wedding context attached to the request by this guard. */
export interface WeddingContext {
  weddingId: string;
  role: WeddingRole | 'SUPER_ADMIN';
  permissions: WeddingPermission[];
}

/**
 * The core isolation guard. For any route carrying a weddingId, it:
 *  1. Requires an authenticated user (JwtAuthGuard must run first).
 *  2. SUPER_ADMIN is granted full access (platform oversight).
 *  3. Otherwise loads the user's WeddingMembership for THAT wedding from
 *     the database. No membership -> 403. The client's weddingId is never
 *     trusted on its own.
 *  4. OWNER implicitly holds all permissions; others hold only what is
 *     stored on their membership.
 *  5. If the route declares a required permission, it is enforced.
 */
@Injectable()
export class WeddingAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user as AuthUser | undefined;
    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    const weddingId = this.extractWeddingId(req);
    if (!weddingId) {
      throw new BadRequestException('Missing wedding identifier');
    }

    const requiredPermission =
      this.reflector.getAllAndOverride<WeddingPermission>(
        WEDDING_PERMISSION_KEY,
        [context.getHandler(), context.getClass()],
      );

    // Super admin: platform-wide oversight.
    if (user.platformRole === PlatformRole.SUPER_ADMIN) {
      const exists = await this.prisma.wedding.findUnique({
        where: { id: weddingId },
        select: { id: true },
      });
      if (!exists) throw new ForbiddenException('Wedding not found');
      req.weddingContext = {
        weddingId,
        role: 'SUPER_ADMIN',
        permissions: ALL_WEDDING_PERMISSIONS,
      } satisfies WeddingContext;
      return true;
    }

    const membership = await this.prisma.weddingMembership.findUnique({
      where: { userId_weddingId: { userId: user.id, weddingId } },
    });
    if (!membership) {
      // Do not reveal whether the wedding exists — just deny.
      throw new ForbiddenException('You do not have access to this wedding');
    }

    const role = membership.role as WeddingRole;
    const permissions =
      role === WeddingRole.OWNER
        ? ALL_WEDDING_PERMISSIONS
        : (membership.permissions as WeddingPermission[]);

    if (requiredPermission && !permissions.includes(requiredPermission)) {
      throw new ForbiddenException(
        `Missing required permission: ${requiredPermission}`,
      );
    }

    req.weddingContext = { weddingId, role, permissions } satisfies WeddingContext;
    return true;
  }

  /** weddingId may arrive as a route param or (fallback) a body field. */
  private extractWeddingId(req: {
    params?: Record<string, string>;
    body?: Record<string, unknown>;
  }): string | null {
    return (
      req.params?.weddingId ??
      req.params?.id ??
      (typeof req.body?.weddingId === 'string'
        ? (req.body.weddingId as string)
        : null)
    );
  }
}
