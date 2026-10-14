/**
 * Browser-side API client. All requests go to same-origin /api/* which
 * Next.js rewrites to the NestJS backend, so httpOnly auth cookies are sent
 * automatically.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = Array.isArray(body.message)
        ? body.message.join(', ')
        : (body.message ?? message);
    } catch {
      /* ignore non-JSON error bodies */
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body ?? {}) }),
};

// ── Response types mirrored from the API ──

export interface Me {
  id: string;
  email: string;
  name: string;
  platformRole: 'SUPER_ADMIN' | 'USER';
  createdAt: string;
}

export interface WeddingListItem {
  id: string;
  title: string;
  brideName: string;
  groomName: string;
  date: string;
  status: string;
  createdAt: string;
  owner: { id: string; name: string; email: string };
  _count: {
    guests: number;
    invitations: number;
    events: number;
    albums: number;
  };
}

export interface WeddingList {
  data: WeddingListItem[];
  pagination: { page: number; pageSize: number; total: number; pages: number };
}

export interface SelectorItem {
  id: string;
  title: string;
  brideName: string;
  groomName: string;
  role: string;
}

export interface WeddingDashboard {
  guests: number;
  invitations: number;
  invitesSent: number;
  rsvp: { confirmed: number; declined: number; pending: number };
  events: number;
  publishedAlbums: number;
  media: { approved: number; pending: number };
  checkedIn: number;
  revokedInvitations: number;
}

export interface PlatformStats {
  weddings: {
    total: number;
    active: number;
    completed: number;
    archived: number;
    upcoming: number;
  };
  totalUsers: number;
  totalInvitations: number;
  totalCheckIns: number;
  storageBytes: number;
}
