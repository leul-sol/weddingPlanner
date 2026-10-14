'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, ApiError } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post('/auth/login', { email, password });
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 block text-center font-serif text-2xl font-semibold text-gold-dark"
        >
          WedLink
        </Link>
        <div className="card">
          <h1 className="font-serif text-2xl font-semibold text-ink">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            Sign in to manage your weddings.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button type="submit" className="btn-gold w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-ink/60">
            New to WedLink?{' '}
            <Link href="/register" className="text-gold-dark underline">
              Create an account
            </Link>
          </p>
        </div>

        <div className="mt-4 rounded-lg bg-champagne/20 p-3 text-center text-xs text-ink/60">
          Demo: abebe@wedlink.dev / password123 · admin@wedlink.dev / admin1234
        </div>
      </div>
    </main>
  );
}
