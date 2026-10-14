import { SetMetadata } from '@nestjs/common';
import { WeddingPermission } from '@wedlink/shared';

export const WEDDING_PERMISSION_KEY = 'weddingPermission';

/**
 * Declare the wedding-scoped permission a route requires. The
 * WeddingAccessGuard enforces that the authenticated user holds it
 * for the wedding identified in the route.
 */
export const RequireWeddingPermission = (permission: WeddingPermission) =>
  SetMetadata(WEDDING_PERMISSION_KEY, permission);
