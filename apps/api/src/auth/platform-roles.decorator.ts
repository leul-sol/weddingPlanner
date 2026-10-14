import { SetMetadata } from '@nestjs/common';
import { PlatformRole } from '@wedlink/shared';

export const PLATFORM_ROLES_KEY = 'platformRoles';

/** Restrict a route to specific platform roles (e.g. SUPER_ADMIN). */
export const PlatformRoles = (...roles: PlatformRole[]) =>
  SetMetadata(PLATFORM_ROLES_KEY, roles);
