'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';

export function CreateWeddingButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [groomName, setGroom] = useState('');
  const [brideName, setBride] = useState('');
  const [date, setDate] = useState('');
  const [venueName, setVenue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post('/weddings', {
        title: `The Wedding of ${groomName} & ${brideName}`,
        groomName,
        brideName,
        date: new Date(date).toISOString(),
        venueName,
      });
      setOpen(false);
      setGroom('');
      setBride('');
      setDate('');
      setVenue('');
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-gold">
        + New wedding
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-xl font-semibold text-ink">
              Create a wedding
            </h2>
            <form onSubmit={submit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="groom">
                    Groom&apos;s name
                  </label>
                  <input
                    id="groom"
                    className="input"
                    value={groomName}
                    onChange={(e) => setGroom(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label" htmlFor="bride">
                    Bride&apos;s name
                  </label>
                  <input
                    id="bride"
                    className="input"
                    value={brideName}
                    onChange={(e) => setBride(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="date">
                  Wedding date
                </label>
                <input
                  id="date"
                  type="date"
                  className="input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="venue">
                  Venue
                </label>
                <input
                  id="venue"
                  className="input"
                  value={venueName}
                  onChange={(e) => setVenue(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold" disabled={loading}>
                  {loading ? 'Creating…' : 'Create wedding'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
