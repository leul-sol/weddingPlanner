import { redirect } from 'next/navigation';
import { serverGet } from '@/lib/server-api';
import { PlatformStats } from '@/lib/api';

export default async function AdminPage() {
  // Backend enforces SUPER_ADMIN; null means forbidden/unauthorized.
  const stats = await serverGet<PlatformStats>('/admin/stats');
  if (!stats) {
    redirect('/dashboard');
  }

  const mb = (stats.storageBytes / (1024 * 1024)).toFixed(1);

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-ink">
        Platform administration
      </h1>
      <p className="mt-1 text-ink/60">Platform-wide statistics across all weddings.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Total weddings" value={stats.weddings.total} />
        <Metric label="Active" value={stats.weddings.active} />
        <Metric label="Upcoming" value={stats.weddings.upcoming} />
        <Metric label="Completed" value={stats.weddings.completed} />
        <Metric label="Archived" value={stats.weddings.archived} />
        <Metric label="Registered users" value={stats.totalUsers} />
        <Metric label="Total invitations" value={stats.totalInvitations} />
        <Metric label="Total check-ins" value={stats.totalCheckIns} />
      </div>

      <div className="card mt-4 inline-block">
        <div className="text-3xl font-semibold text-gold-dark">{mb} MB</div>
        <div className="mt-1 text-sm text-ink/60">Media storage used</div>
      </div>
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
