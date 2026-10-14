import Link from 'next/link';
import { serverGet } from '@/lib/server-api';
import { WeddingList } from '@/lib/api';
import { CreateWeddingButton } from '@/components/CreateWeddingButton';

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  DRAFT: 'bg-gray-100 text-gray-700',
  COMPLETED: 'bg-blue-100 text-blue-800',
  ARCHIVED: 'bg-amber-100 text-amber-800',
  SUSPENDED: 'bg-red-100 text-red-800',
};

export default async function DashboardHome() {
  const list = await serverGet<WeddingList>('/weddings?pageSize=50');
  const weddings = list?.data ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-ink">
            My weddings
          </h1>
          <p className="mt-1 text-ink/60">
            {weddings.length} wedding{weddings.length === 1 ? '' : 's'} you can
            manage.
          </p>
        </div>
        <CreateWeddingButton />
      </div>

      {weddings.length === 0 ? (
        <div className="card mt-8 text-center">
          <p className="text-ink/60">
            You have no weddings yet. Create your first one to get started.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {weddings.map((w) => (
            <Link
              key={w.id}
              href={`/dashboard/weddings/${w.id}`}
              className="card transition-shadow hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <h2 className="font-serif text-xl font-semibold text-gold-dark">
                  {w.groomName} &amp; {w.brideName}
                </h2>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    STATUS_STYLES[w.status] ?? 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {w.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-ink/60">
                {new Date(w.date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Stat label="Guests" value={w._count.guests} />
                <Stat label="Invites" value={w._count.invitations} />
                <Stat label="Events" value={w._count.events} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-ivory py-2">
      <div className="text-lg font-semibold text-ink">{value}</div>
      <div className="text-xs text-ink/50">{label}</div>
    </div>
  );
}
