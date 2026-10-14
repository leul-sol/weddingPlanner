import { notFound } from 'next/navigation';
import { serverGet } from '@/lib/server-api';
import { WeddingDashboard } from '@/lib/api';

interface WeddingDetail {
  id: string;
  title: string;
  groomName: string;
  brideName: string;
  date: string;
  venueName: string | null;
  status: string;
}

export default async function WeddingDashboardPage({
  params,
}: {
  params: Promise<{ weddingId: string }>;
}) {
  const { weddingId } = await params;

  // Both calls are membership-verified by the backend WeddingAccessGuard.
  const wedding = await serverGet<WeddingDetail>(`/weddings/${weddingId}`);
  if (!wedding) notFound();
  const dash = await serverGet<WeddingDashboard>(
    `/weddings/${weddingId}/dashboard`,
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-ink">
            {wedding.groomName} &amp; {wedding.brideName}
          </h1>
          <p className="mt-1 text-ink/60">
            {new Date(wedding.date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            {wedding.venueName ? ` · ${wedding.venueName}` : ''}
          </p>
        </div>
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
          {wedding.status}
        </span>
      </div>

      {dash && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Registered guests" value={dash.guests} />
            <Metric label="Invitations" value={dash.invitations} />
            <Metric label="Invitations sent" value={dash.invitesSent} />
            <Metric label="Events" value={dash.events} />
            <Metric label="RSVP confirmed" value={dash.rsvp.confirmed} />
            <Metric label="RSVP pending" value={dash.rsvp.pending} />
            <Metric label="RSVP declined" value={dash.rsvp.declined} />
            <Metric label="Checked in" value={dash.checkedIn} />
            <Metric label="Published albums" value={dash.publishedAlbums} />
            <Metric label="Approved media" value={dash.media.approved} />
            <Metric label="Pending media" value={dash.media.pending} />
            <Metric
              label="Revoked invitations"
              value={dash.revokedInvitations}
            />
          </div>

          <p className="mt-6 text-sm text-ink/50">
            All figures are computed live from this wedding&apos;s records.
          </p>
        </>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="card">
      <div className="text-3xl font-semibold text-gold-dark">{value}</div>
      <div className="mt-1 text-sm text-ink/60">{label}</div>
    </div>
  );
}
