import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WeddingsModule } from './weddings/weddings.module';
import { AdminModule } from './admin/admin.module';
import { HealthController } from './health.controller';

// Cross-cutting (Phase 5) — provided globally.
import { StorageModule } from './storage/storage.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditModule } from './audit/audit.module';

// Feature stub modules (Phase 2–5). Routes are live; logic is stubbed with
// notImplemented() + TODOs. See docs/BUILD-GUIDE.md.
import { GuestsModule } from './guests/guests.module';
import { InvitationsModule } from './invitations/invitations.module';
import { RsvpModule } from './rsvp/rsvp.module';
import { TemplatesModule } from './templates/templates.module';
import { CheckinModule } from './checkin/checkin.module';
import { AlbumsModule } from './albums/albums.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      // .env lives at the monorepo root.
      envFilePath: [
        join(process.cwd(), '../../.env'),
        join(process.cwd(), '.env'),
      ],
    }),
    PrismaModule,
    AuthModule,

    // Cross-cutting
    StorageModule,
    NotificationsModule,
    AuditModule,

    // Phase 1 (implemented)
    WeddingsModule,
    AdminModule,

    // Phase 2–5 (stubbed, wired)
    GuestsModule,
    InvitationsModule,
    RsvpModule,
    TemplatesModule,
    CheckinModule,
    AlbumsModule,
    ReportsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
