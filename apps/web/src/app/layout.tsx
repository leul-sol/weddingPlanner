import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WedLink — Beautiful Weddings, Managed',
  description:
    'Create digital invitations, verify guests by QR, and preserve your wedding memories.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
