import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PlatformRole } from '@wedlink/shared';
import { PrismaService } from '../prisma/prisma.service';
import {
  hashPassword,
  verifyPassword,
  hashToken,
  verifyToken,
  generateOpaqueToken,
} from '../common/crypto.util';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtPayload } from './auth.types';

export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        name: dto.name,
        passwordHash: await hashPassword(dto.password),
        platformRole: PlatformRole.USER,
      },
    });

    return this.issueFor(user.id, user.email, user.platformRole as PlatformRole);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const ok = await verifyPassword(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.issueFor(user.id, user.email, user.platformRole as PlatformRole);
  }

  /** Rotate a refresh token: validate the presented one, revoke it, issue new. */
  async refresh(presentedToken: string) {
    const [userId, raw] = this.splitRefresh(presentedToken);
    if (!userId || !raw) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const candidates = await this.prisma.refreshToken.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
    });

    let matched = null as (typeof candidates)[number] | null;
    for (const c of candidates) {
      if (await verifyToken(raw, c.tokenHash)) {
        matched = c;
        break;
      }
    }
    if (!matched) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { id: matched.id },
      data: { revokedAt: new Date() },
    });

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    return this.issueFor(user.id, user.email, user.platformRole as PlatformRole);
  }

  async logout(presentedToken: string | undefined) {
    if (!presentedToken) return;
    const [userId, raw] = this.splitRefresh(presentedToken);
    if (!userId || !raw) return;
    const candidates = await this.prisma.refreshToken.findMany({
      where: { userId, revokedAt: null },
    });
    for (const c of candidates) {
      if (await verifyToken(raw, c.tokenHash)) {
        await this.prisma.refreshToken.update({
          where: { id: c.id },
          data: { revokedAt: new Date() },
        });
        break;
      }
    }
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        platformRole: true,
        createdAt: true,
      },
    });
    return user;
  }

  // ── helpers ──

  private async issueFor(
    userId: string,
    email: string,
    platformRole: PlatformRole,
  ): Promise<IssuedTokens> {
    const payload: JwtPayload = { sub: userId, email, platformRole };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('jwt.accessSecret'),
      expiresIn: this.config.get<number>('jwt.accessTtl'),
    });

    const raw = generateOpaqueToken(48);
    const ttl = this.config.get<number>('jwt.refreshTtl') ?? 1209600;
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: await hashToken(raw),
        expiresAt: new Date(Date.now() + ttl * 1000),
      },
    });
    // Transport format: "<userId>.<raw>" so refresh can scope the lookup.
    const refreshToken = `${userId}.${raw}`;
    return { accessToken, refreshToken };
  }

  private splitRefresh(token: string): [string | null, string | null] {
    const idx = token.indexOf('.');
    if (idx <= 0) return [null, null];
    return [token.slice(0, idx), token.slice(idx + 1)];
  }
}
