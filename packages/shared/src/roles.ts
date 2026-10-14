/**
 * Access-control vocabulary shared by API and web.
 * This is the single source of truth for roles and permissions.
 */

/** Global platform-level role attached to a User account. */
export enum PlatformRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  USER = 'USER',
}

/** Role a user holds WITHIN a specific wedding (via WeddingMembership). */
export enum WeddingRole {
  OWNER = 'OWNER',
  ORGANIZER = 'ORGANIZER',
  ENTRANCE_STAFF = 'ENTRANCE_STAFF',
  PHOTOGRAPHER = 'PHOTOGRAPHER',
}

/**
 * Fine-grained, per-membership permissions. Nothing is auto-granted:
 * an OWNER implicitly holds all of these; other roles hold only what
 * the owner explicitly assigns on the membership.
 */
export enum WeddingPermission {
  WEDDING_EDIT = 'WEDDING_EDIT',
  WEDDING_MANAGE_TEAM = 'WEDDING_MANAGE_TEAM',
  EVENTS_MANAGE = 'EVENTS_MANAGE',

  GUESTS_VIEW = 'GUESTS_VIEW',
  GUESTS_MANAGE = 'GUESTS_MANAGE',
  GUESTS_IMPORT = 'GUESTS_IMPORT',

  INVITES_MANAGE = 'INVITES_MANAGE',
  INVITES_SEND = 'INVITES_SEND',
  INVITES_REVOKE = 'INVITES_REVOKE',

  RSVP_VIEW = 'RSVP_VIEW',
  RSVP_MANAGE = 'RSVP_MANAGE',

  CHECKIN_SCAN = 'CHECKIN_SCAN',

  ALBUMS_MANAGE = 'ALBUMS_MANAGE',
  MEDIA_UPLOAD = 'MEDIA_UPLOAD',
  MEDIA_MODERATE = 'MEDIA_MODERATE',
  MEDIA_DELETE = 'MEDIA_DELETE',
  MEDIA_PUBLISH = 'MEDIA_PUBLISH',
  ALBUM_DOWNLOAD = 'ALBUM_DOWNLOAD',

  REPORTS_VIEW = 'REPORTS_VIEW',
  REPORTS_EXPORT = 'REPORTS_EXPORT',
}

/** All permissions — the implicit grant set for a wedding OWNER. */
export const ALL_WEDDING_PERMISSIONS: WeddingPermission[] =
  Object.values(WeddingPermission);

/** Sensible default permission bundles per wedding role (owner may override). */
export const DEFAULT_ROLE_PERMISSIONS: Record<WeddingRole, WeddingPermission[]> = {
  [WeddingRole.OWNER]: ALL_WEDDING_PERMISSIONS,
  [WeddingRole.ORGANIZER]: [
    WeddingPermission.GUESTS_VIEW,
    WeddingPermission.GUESTS_MANAGE,
    WeddingPermission.GUESTS_IMPORT,
    WeddingPermission.INVITES_MANAGE,
    WeddingPermission.INVITES_SEND,
    WeddingPermission.RSVP_VIEW,
    WeddingPermission.RSVP_MANAGE,
    WeddingPermission.EVENTS_MANAGE,
    WeddingPermission.REPORTS_VIEW,
  ],
  [WeddingRole.ENTRANCE_STAFF]: [
    WeddingPermission.CHECKIN_SCAN,
    WeddingPermission.GUESTS_VIEW,
  ],
  [WeddingRole.PHOTOGRAPHER]: [
    WeddingPermission.ALBUMS_MANAGE,
    WeddingPermission.MEDIA_UPLOAD,
  ],
};
