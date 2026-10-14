/** Domain enums shared across the platform. Kept in sync with the Prisma schema. */

export enum WeddingStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
  SUSPENDED = 'SUSPENDED',
}

export enum InvitationType {
  INDIVIDUAL = 'INDIVIDUAL',
  GROUP = 'GROUP',
}

export enum InvitationStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  REVOKED = 'REVOKED',
}

export enum RSVPStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DECLINED = 'DECLINED',
  CANCELLED = 'CANCELLED',
}

export enum CheckInResult {
  ADMITTED = 'ADMITTED',
  REJECTED_UNKNOWN = 'REJECTED_UNKNOWN',
  REJECTED_REVOKED = 'REJECTED_REVOKED',
  REJECTED_WRONG_WEDDING = 'REJECTED_WRONG_WEDDING',
  REJECTED_WRONG_EVENT = 'REJECTED_WRONG_EVENT',
  REJECTED_ALLOWANCE_EXCEEDED = 'REJECTED_ALLOWANCE_EXCEEDED',
}

export enum AlbumPrivacy {
  PRIVATE = 'PRIVATE',
  INVITED = 'INVITED',
  PUBLIC = 'PUBLIC',
}

export enum MediaStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export enum GuestLanguage {
  EN = 'EN',
  AM = 'AM',
}
