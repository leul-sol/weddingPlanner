'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, Me, SelectorItem } from '@/lib/api';

export function TopNav({
  me,
  weddings,
  currentWeddingId,
}: {
  me: Me;
  weddings: SelectorItem[];
  currentWeddingId?: string;
}) {
  const router = useRouter();

  async function signOut() {
    await api.post('/auth/logout');
    router.push('/login');
    router.refresh();
  }

  function onSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (value === 'all') {
      router.push('/dashboard');
    } else {
      router.push(`/dashboard/weddings/${value}`);
    }
  }

  return (
    <header className="flex items-center justify-between border-b border-champagne/40 bg-white px-6 py-3">
      <div className="flex items-center gap-6">
        <Link
          href="/dashboard"
          className="font-serif text-xl font-semibold text-gold-dark"
        >
          WedLink
        </Link>

        {weddings.length > 0 && (
          <label className="flex items-center gap-2 text-sm">
            <span className="text-ink/50">Wedding:</span>
            <select
              className="rounded-md border border-champagne/60 bg-white px-2 py-1 text-ink"
              value={currentWeddingId ?? 'all'}
              onChange={onSelect}
            >
              <option value="all">Manage all my weddings</option>
              {weddings.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.groomName} &amp; {w.brideName}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="flex items-center gap-4">
        {me.platformRole === 'SUPER_ADMIN' && (
          <Link
            href="/dashboard/admin"
            className="text-sm text-gold-dark underline"
          >
            Platform admin
          </Link>
        )}
        <span className="text-sm text-ink/60">{me.name}</span>
        <button onClick={signOut} className="btn-outline px-3 py-1 text-sm">
          Sign out
        </button>
      </div>
    </header>
  );
}
