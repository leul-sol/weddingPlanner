import { PlatformRole } from '@wedlink/shared';

/** Shape of the decoded JWT access-token payload. */
export interface JwtPayload {
  sub: string; // user id
  email: string;
  platformRole: PlatformRole;
}

/** Authenticated user attached to the request after JwtAuthGuard runs. */
export interface AuthUser {
  id: string;
  email: string;
  platformRole: PlatformRole;
}
