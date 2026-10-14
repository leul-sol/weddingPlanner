import { redirect } from 'next/navigation';
import { TopNav } from '@/components/TopNav';
import { serverGet } from '@/lib/server-api';
import { Me, SelectorItem } from '@/lib/api';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await serverGet<Me>('/auth/me');
  if (!me) {
    redirect('/login');
  }
  const weddings =
    (await serverGet<SelectorItem[]>('/weddings/selector/mine')) ?? [];

  return (
    <div className="min-h-screen">
      <TopNav me={me} weddings={weddings} />
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
