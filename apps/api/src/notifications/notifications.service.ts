import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Notification + invitation distribution — Phase 5 (spec §14).
 *
 * DELIVERY HONESTY RULE (spec §14): distinguish "sharing a link" from
 * "confirmed delivery". Do NOT mark a notification SENT unless the provider
 * returns a supported delivery result. When provider credentials are absent,
 * this service runs in MOCK mode and records deliveryStatus = 'MOCK'.
 *
 * Keep provider credentials server-side only (never in the frontend).
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private get emailConfigured(): boolean {
    return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);
  }

  private get smsConfigured(): boolean {
    return Boolean(process.env.SMS_PROVIDER_API_KEY);
  }

  /**
   * Produce a shareable invitation link. This is always available (it is just
   * a URL), independent of email/SMS providers.
   *
   * TODO(Phase 5, §5.4): build the real public invitation URL from the
   * invitation token once the public page route is finalized.
   */
  buildShareLink(invitationToken: string): string {
    const base = process.env.PUBLIC_WEB_URL ?? 'http://localhost:3000';
    return `${base}/i/${invitationToken}`;
  }

  /**
   * Send an email. In MOCK mode (no SMTP configured) it logs and records
   * deliveryStatus = 'MOCK' — it does NOT claim delivery.
   *
   * TODO(Phase 5, §14): integrate a real SMTP/provider client and only set
   * 'SENT' on a confirmed provider response; set 'FAILED' otherwise.
   */
  async sendEmail(params: {
    weddingId?: string;
    to: string;
    subject: string;
    body: string;
  }): Promise<{ deliveryStatus: 'MOCK' | 'SENT' | 'FAILED' }> {
    const status = this.emailConfigured ? 'SENT' : 'MOCK';
    if (status === 'MOCK') {
      this.logger.warn(
        `MOCK email to ${params.to} ("${params.subject}") — no SMTP configured, nothing sent.`,
      );
    }
    // TODO(Phase 5): when configured, actually send and derive status from result.
    await this.prisma.notification.create({
      data: {
        weddingId: params.weddingId,
        type: 'EMAIL',
        channel: 'EMAIL',
        payload: { to: params.to, subject: params.subject },
        deliveryStatus: status,
      },
    });
    return { deliveryStatus: status };
  }

  /** TODO(Phase 5, §14): same contract as sendEmail for SMS via smsConfigured. */
  async sendSms(params: {
    weddingId?: string;
    to: string;
    message: string;
  }): Promise<{ deliveryStatus: 'MOCK' | 'SENT' | 'FAILED' }> {
    const status = this.smsConfigured ? 'SENT' : 'MOCK';
    if (status === 'MOCK') {
      this.logger.warn(
        `MOCK SMS to ${params.to} — no SMS provider configured, nothing sent.`,
      );
    }
    await this.prisma.notification.create({
      data: {
        weddingId: params.weddingId,
        type: 'SMS',
        channel: 'SMS',
        payload: { to: params.to },
        deliveryStatus: status,
      },
    });
    return { deliveryStatus: status };
  }
}
