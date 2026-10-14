-- CreateEnum
CREATE TYPE "PlatformRole" AS ENUM ('SUPER_ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "WeddingRole" AS ENUM ('OWNER', 'ORGANIZER', 'ENTRANCE_STAFF', 'PHOTOGRAPHER');

-- CreateEnum
CREATE TYPE "WeddingStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "InvitationType" AS ENUM ('INDIVIDUAL', 'GROUP');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'REVOKED');

-- CreateEnum
CREATE TYPE "RSVPStatus" AS ENUM ('PENDING', 'CONFIRMED', 'DECLINED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CheckInResult" AS ENUM ('ADMITTED', 'REJECTED_UNKNOWN', 'REJECTED_REVOKED', 'REJECTED_WRONG_WEDDING', 'REJECTED_WRONG_EVENT', 'REJECTED_ALLOWANCE_EXCEEDED');

-- CreateEnum
CREATE TYPE "AlbumPrivacy" AS ENUM ('PRIVATE', 'INVITED', 'PUBLIC');

-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "GuestLanguage" AS ENUM ('EN', 'AM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platformRole" "PlatformRole" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeddingMembership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "role" "WeddingRole" NOT NULL,
    "permissions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeddingMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wedding" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "groomName" TEXT NOT NULL,
    "brideName" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "timeZone" TEXT NOT NULL DEFAULT 'Africa/Addis_Ababa',
    "venueName" TEXT,
    "venueAddress" TEXT,
    "mapUrl" TEXT,
    "contactInfo" TEXT,
    "coverImageKey" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'LUXURY_GOLD',
    "defaultLanguage" "GuestLanguage" NOT NULL DEFAULT 'EN',
    "albumPrivacy" "AlbumPrivacy" NOT NULL DEFAULT 'PRIVATE',
    "rsvpDeadline" TIMESTAMP(3),
    "rsvpRequired" BOOLEAN NOT NULL DEFAULT true,
    "status" "WeddingStatus" NOT NULL DEFAULT 'DRAFT',
    "ownerId" TEXT NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wedding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeddingEvent" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "venueName" TEXT,
    "venueAddress" TEXT,
    "openToAllGuests" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeddingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "displayName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "language" "GuestLanguage" NOT NULL DEFAULT 'EN',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "type" "InvitationType" NOT NULL DEFAULT 'INDIVIDUAL',
    "displayName" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "maxAttendees" INTEGER NOT NULL DEFAULT 1,
    "mainGuestMustAttend" BOOLEAN NOT NULL DEFAULT false,
    "allowDoorAddons" BOOLEAN NOT NULL DEFAULT false,
    "status" "InvitationStatus" NOT NULL DEFAULT 'DRAFT',
    "templateId" TEXT,
    "personalMessage" TEXT,
    "publishedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvitationEvent" (
    "invitationId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "InvitationEvent_pkey" PRIMARY KEY ("invitationId","eventId")
);

-- CreateTable
CREATE TABLE "InvitationAttendee" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "name" TEXT,
    "checkedInAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvitationAttendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RSVPResponse" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "status" "RSVPStatus" NOT NULL DEFAULT 'PENDING',
    "confirmedCount" INTEGER NOT NULL DEFAULT 0,
    "dietaryNotes" TEXT,
    "accessibility" TEXT,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RSVPResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckInRecord" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "attendeeRef" TEXT,
    "staffUserId" TEXT NOT NULL,
    "result" "CheckInResult" NOT NULL,
    "metadata" JSONB,
    "checkedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckInRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvitationTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isGlobal" BOOLEAN NOT NULL DEFAULT true,
    "weddingId" TEXT,
    "config" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvitationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "eventId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "coverKey" TEXT,
    "privacy" "AlbumPrivacy" NOT NULL DEFAULT 'PRIVATE',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "allowGuestUploads" BOOLEAN NOT NULL DEFAULT false,
    "requireModeration" BOOLEAN NOT NULL DEFAULT true,
    "publicToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaFile" (
    "id" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "thumbnailKey" TEXT,
    "type" "MediaType" NOT NULL,
    "status" "MediaStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "tags" TEXT[],
    "uploaderRef" TEXT,
    "sizeBytes" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlbumPermission" (
    "id" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "principal" TEXT NOT NULL,
    "access" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlbumPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaModerationRecord" (
    "id" TEXT NOT NULL,
    "mediaFileId" TEXT NOT NULL,
    "decision" "MediaStatus" NOT NULL,
    "moderatorUserId" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaModerationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT,
    "type" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "deliveryStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "weddingId" TEXT,
    "action" TEXT NOT NULL,
    "target" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "maxWeddings" INTEGER,
    "maxStorageMb" INTEGER,
    "features" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeddingSubscription" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WeddingSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_platformRole_idx" ON "User"("platformRole");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_tokenHash_idx" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "WeddingMembership_weddingId_idx" ON "WeddingMembership"("weddingId");

-- CreateIndex
CREATE INDEX "WeddingMembership_userId_idx" ON "WeddingMembership"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WeddingMembership_userId_weddingId_key" ON "WeddingMembership"("userId", "weddingId");

-- CreateIndex
CREATE INDEX "Wedding_ownerId_idx" ON "Wedding"("ownerId");

-- CreateIndex
CREATE INDEX "Wedding_status_idx" ON "Wedding"("status");

-- CreateIndex
CREATE INDEX "Wedding_date_idx" ON "Wedding"("date");

-- CreateIndex
CREATE INDEX "WeddingEvent_weddingId_idx" ON "WeddingEvent"("weddingId");

-- CreateIndex
CREATE INDEX "Guest_weddingId_idx" ON "Guest"("weddingId");

-- CreateIndex
CREATE INDEX "Guest_weddingId_phone_idx" ON "Guest"("weddingId", "phone");

-- CreateIndex
CREATE INDEX "Guest_weddingId_email_idx" ON "Guest"("weddingId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_guestId_key" ON "Invitation"("guestId");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_token_key" ON "Invitation"("token");

-- CreateIndex
CREATE INDEX "Invitation_weddingId_idx" ON "Invitation"("weddingId");

-- CreateIndex
CREATE INDEX "Invitation_status_idx" ON "Invitation"("status");

-- CreateIndex
CREATE INDEX "InvitationEvent_eventId_idx" ON "InvitationEvent"("eventId");

-- CreateIndex
CREATE INDEX "InvitationAttendee_invitationId_idx" ON "InvitationAttendee"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "RSVPResponse_invitationId_key" ON "RSVPResponse"("invitationId");

-- CreateIndex
CREATE INDEX "CheckInRecord_weddingId_idx" ON "CheckInRecord"("weddingId");

-- CreateIndex
CREATE INDEX "CheckInRecord_invitationId_eventId_idx" ON "CheckInRecord"("invitationId", "eventId");

-- CreateIndex
CREATE INDEX "CheckInRecord_eventId_idx" ON "CheckInRecord"("eventId");

-- CreateIndex
CREATE INDEX "InvitationTemplate_weddingId_idx" ON "InvitationTemplate"("weddingId");

-- CreateIndex
CREATE UNIQUE INDEX "Album_publicToken_key" ON "Album"("publicToken");

-- CreateIndex
CREATE INDEX "Album_weddingId_idx" ON "Album"("weddingId");

-- CreateIndex
CREATE INDEX "MediaFile_albumId_idx" ON "MediaFile"("albumId");

-- CreateIndex
CREATE INDEX "MediaFile_weddingId_idx" ON "MediaFile"("weddingId");

-- CreateIndex
CREATE INDEX "MediaFile_status_idx" ON "MediaFile"("status");

-- CreateIndex
CREATE INDEX "AlbumPermission_albumId_idx" ON "AlbumPermission"("albumId");

-- CreateIndex
CREATE INDEX "MediaModerationRecord_mediaFileId_idx" ON "MediaModerationRecord"("mediaFileId");

-- CreateIndex
CREATE INDEX "Notification_weddingId_idx" ON "Notification"("weddingId");

-- CreateIndex
CREATE INDEX "AuditLog_weddingId_idx" ON "AuditLog"("weddingId");

-- CreateIndex
CREATE INDEX "AuditLog_actorUserId_idx" ON "AuditLog"("actorUserId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPlan_name_key" ON "SubscriptionPlan"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WeddingSubscription_weddingId_key" ON "WeddingSubscription"("weddingId");

-- CreateIndex
CREATE INDEX "WeddingSubscription_planId_idx" ON "WeddingSubscription"("planId");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingMembership" ADD CONSTRAINT "WeddingMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingMembership" ADD CONSTRAINT "WeddingMembership_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wedding" ADD CONSTRAINT "Wedding_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingEvent" ADD CONSTRAINT "WeddingEvent_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "InvitationTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationEvent" ADD CONSTRAINT "InvitationEvent_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationEvent" ADD CONSTRAINT "InvitationEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "WeddingEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationAttendee" ADD CONSTRAINT "InvitationAttendee_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RSVPResponse" ADD CONSTRAINT "RSVPResponse_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckInRecord" ADD CONSTRAINT "CheckInRecord_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckInRecord" ADD CONSTRAINT "CheckInRecord_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "WeddingEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckInRecord" ADD CONSTRAINT "CheckInRecord_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckInRecord" ADD CONSTRAINT "CheckInRecord_staffUserId_fkey" FOREIGN KEY ("staffUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "WeddingEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaFile" ADD CONSTRAINT "MediaFile_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaFile" ADD CONSTRAINT "MediaFile_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumPermission" ADD CONSTRAINT "AlbumPermission_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaModerationRecord" ADD CONSTRAINT "MediaModerationRecord_mediaFileId_fkey" FOREIGN KEY ("mediaFileId") REFERENCES "MediaFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaModerationRecord" ADD CONSTRAINT "MediaModerationRecord_moderatorUserId_fkey" FOREIGN KEY ("moderatorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingSubscription" ADD CONSTRAINT "WeddingSubscription_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingSubscription" ADD CONSTRAINT "WeddingSubscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
