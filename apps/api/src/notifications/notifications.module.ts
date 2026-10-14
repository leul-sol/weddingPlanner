import { Global, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

/**
 * Reusable notification service (spec §14). Global so any module can inject it.
 * No controller yet — distribution endpoints are added alongside invitations
 * in Phase 2/5.
 */
@Global()
@Module({
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
