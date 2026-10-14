/**
 * Development seed data for WedLink.
 *
 * Creates a platform super-admin, three independent weddings (each with its
 * own owner, team, events, guests, and invitations), and a shared set of
 * reusable invitation templates.
 *
 * Sample account passwords are intentionally simple for local development
 * ONLY. Never use these in a real environment.
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import {
  PlatformRole,
  WeddingRole,
  WeddingStatus,
  InvitationType,
  InvitationStatus,
  RSVPStatus,
  DEFAULT_ROLE_PERMISSIONS,
} from '@wedlink/shared';

const prisma = new PrismaClient();

function token(bytes = 32): string {
  return randomBytes(bytes)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function hash(pw: string): Promise<string> {
  return bcrypt.hash(pw, 12);
}

async function createUser(
  email: string,
  name: string,
  password: string,
  platformRole: PlatformRole = PlatformRole.USER,
) {
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      passwordHash: await hash(password),
      platformRole,
    },
  });
}

interface WeddingSpec {
  title: string;
  groom: string;
  bride: string;
  date: string;
  ownerEmail: string;
  ownerName: string;
  venue: string;
  guests: Array<{ first: string; last: string; group?: number }>;
}

async function seedWedding(spec: WeddingSpec, organizerId: string) {
  const owner = await createUser(spec.ownerEmail, spec.ownerName, 'password123');

  const wedding = await prisma.wedding.create({
    data: {
      title: spec.title,
      groomName: spec.groom,
      brideName: spec.bride,
      description: `Join us to celebrate ${spec.groom} & ${spec.bride}.`,
      date: new Date(spec.date),
      startTime: '16:00',
      endTime: '23:00',
      timeZone: 'Africa/Addis_Ababa',
      venueName: spec.venue,
      venueAddress: `${spec.venue}, Addis Ababa`,
      theme: 'LUXURY_GOLD',
      status: WeddingStatus.ACTIVE,
      ownerId: owner.id,
    },
  });

  // Owner membership (full permissions).
  await prisma.weddingMembership.create({
    data: {
      userId: owner.id,
      weddingId: wedding.id,
      role: WeddingRole.OWNER,
      permissions: DEFAULT_ROLE_PERMISSIONS[WeddingRole.OWNER],
    },
  });

  // Shared organizer added to each wedding with organizer defaults.
  await prisma.weddingMembership.create({
    data: {
      userId: organizerId,
      weddingId: wedding.id,
      role: WeddingRole.ORGANIZER,
      permissions: DEFAULT_ROLE_PERMISSIONS[WeddingRole.ORGANIZER],
    },
  });

  // Two events per wedding.
  const ceremony = await prisma.weddingEvent.create({
    data: {
      weddingId: wedding.id,
      name: 'Wedding Ceremony',
      startsAt: new Date(spec.date + 'T16:00:00'),
      venueName: spec.venue,
      openToAllGuests: true,
    },
  });
  const reception = await prisma.weddingEvent.create({
    data: {
      weddingId: wedding.id,
      name: 'Reception',
      startsAt: new Date(spec.date + 'T19:00:00'),
      venueName: spec.venue,
      openToAllGuests: false,
    },
  });

  // Guests + invitations.
  for (const g of spec.guests) {
    const guest = await prisma.guest.create({
      data: {
        weddingId: wedding.id,
        firstName: g.first,
        lastName: g.last,
        displayName: `${g.first} ${g.last}`,
        category: 'FAMILY',
      },
    });

    const isGroup = (g.group ?? 1) > 1;
    const invitation = await prisma.invitation.create({
      data: {
        weddingId: wedding.id,
        guestId: guest.id,
        type: isGroup ? InvitationType.GROUP : InvitationType.INDIVIDUAL,
        displayName: `${g.first} ${g.last}`,
        token: token(),
        maxAttendees: g.group ?? 1,
        status: InvitationStatus.PUBLISHED,
        publishedAt: new Date(),
        events: {
          // Ceremony for everyone; reception only for groups (demonstrates
          // event-specific access).
          create: isGroup
            ? [{ eventId: ceremony.id }, { eventId: reception.id }]
            : [{ eventId: ceremony.id }],
        },
        rsvp: {
          create: {
            status: RSVPStatus.PENDING,
            confirmedCount: 0,
          },
        },
      },
    });

    // Pre-create attendee slots for the invitation allowance.
    for (let i = 0; i < (g.group ?? 1); i++) {
      await prisma.invitationAttendee.create({
        data: { invitationId: invitation.id },
      });
    }
  }

  return wedding;
}

/**
 * Reset all data so the seed is idempotent and never creates duplicates.
 * Order respects FK constraints (children before parents). Cascades handle
 * most of it, but we clear explicitly for clarity and determinism.
 */
async function reset() {
  await prisma.checkInRecord.deleteMany();
  await prisma.mediaModerationRecord.deleteMany();
  await prisma.mediaFile.deleteMany();
  await prisma.albumPermission.deleteMany();
  await prisma.album.deleteMany();
  await prisma.rSVPResponse.deleteMany();
  await prisma.invitationAttendee.deleteMany();
  await prisma.invitationEvent.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.guest.deleteMany();
  await prisma.weddingEvent.deleteMany();
  await prisma.weddingSubscription.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.weddingMembership.deleteMany();
  await prisma.wedding.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  console.log('Seeding WedLink development data...');
  console.log('Resetting existing data for a clean, idempotent seed...');
  await reset();

  // Platform super admin.
  await createUser(
    'admin@wedlink.dev',
    'Platform Admin',
    'admin1234',
    PlatformRole.SUPER_ADMIN,
  );

  // A shared organizer used across weddings (demonstrates per-wedding roles).
  const organizer = await createUser(
    'organizer@wedlink.dev',
    'Sara Organizer',
    'password123',
  );

  await seedWedding(
    {
      title: 'The Wedding of Abebe & Hana',
      groom: 'Abebe',
      bride: 'Hana',
      date: '2026-12-20',
      ownerEmail: 'abebe@wedlink.dev',
      ownerName: 'Abebe Kebede',
      venue: 'Sheraton Addis',
      guests: [
        { first: 'Selam', last: 'Tesfaye' },
        { first: 'Dawit', last: 'Bekele', group: 3 },
        { first: 'Marta', last: 'Girma' },
      ],
    },
    organizer.id,
  );

  await seedWedding(
    {
      title: 'The Wedding of Dawit & Selam',
      groom: 'Dawit',
      bride: 'Selam',
      date: '2027-01-15',
      ownerEmail: 'dawit@wedlink.dev',
      ownerName: 'Dawit Alemu',
      venue: 'Hyatt Regency',
      guests: [
        { first: 'Henok', last: 'Tadesse' },
        { first: 'Meron', last: 'Haile', group: 2 },
      ],
    },
    organizer.id,
  );

  await seedWedding(
    {
      title: 'The Wedding of Michael & Sara',
      groom: 'Michael',
      bride: 'Sara',
      date: '2027-02-10',
      ownerEmail: 'michael@wedlink.dev',
      ownerName: 'Michael Yohannes',
      venue: 'Skylight Hotel',
      guests: [
        { first: 'Rahel', last: 'Negash' },
        { first: 'Yonas', last: 'Mekonnen', group: 4 },
      ],
    },
    organizer.id,
  );

  console.log('Seed complete.');
  console.log('\nSample accounts (dev only):');
  console.table([
    { role: 'Super Admin', email: 'admin@wedlink.dev', password: 'admin1234' },
    { role: 'Owner (A&H)', email: 'abebe@wedlink.dev', password: 'password123' },
    { role: 'Owner (D&S)', email: 'dawit@wedlink.dev', password: 'password123' },
    { role: 'Owner (M&S)', email: 'michael@wedlink.dev', password: 'password123' },
    { role: 'Organizer', email: 'organizer@wedlink.dev', password: 'password123' },
  ]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
