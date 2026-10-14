import { cookies } from 'next/headers';

/**
 * Server-side fetch to the backend. Forwards the incoming auth cookies so
 * server components render with the authenticated user's data.
 */
const API_BASE = process.env.API_PROXY_URL ?? 'http://localhost:4100';

export async function serverGet<T>(path: string): Promise<T | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const res = await fetch(`${API_BASE}/api${path}`, {
    headers: { cookie: cookieHeader },
    cache: 'no-store',
  });

  if (res.status === 401 || res.status === 403) return null;
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}
