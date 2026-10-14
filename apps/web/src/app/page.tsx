import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-5 md:px-12">
        <span className="font-serif text-2xl font-semibold text-gold-dark">
          WedLink
        </span>
        <nav className="flex items-center gap-3">
          <Link href="/login" className="btn-outline">
            Sign in
          </Link>
          <Link href="/register" className="btn-gold">
            Get started
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-gold-dark">
          One platform · Many weddings
        </p>
        <h1 className="font-serif text-4xl font-semibold leading-tight text-ink md:text-6xl">
          Beautiful invitations.
          <br />
          Effortless guest check-in.
          <br />
          Memories that last.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-ink/70">
          WedLink lets couples and organizers create digital invitations,
          verify guests with secure QR codes, and manage wedding albums — each
          wedding fully isolated and secure.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/register" className="btn-gold px-6 py-3 text-lg">
            Create your wedding
          </Link>
          <Link href="/login" className="btn-outline px-6 py-3 text-lg">
            Sign in
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-24 md:grid-cols-3">
        {[
          {
            title: 'Digital Invitations',
            body: 'Elegant, customizable templates in English and Amharic with live preview and secure sharing.',
          },
          {
            title: 'QR Guest Verification',
            body: 'Unique, revocable QR codes with concurrency-safe check-in and full attendance audit trails.',
          },
          {
            title: 'Wedding Albums',
            body: 'Private, invited, or public albums with guest uploads and moderation controls.',
          },
        ].map((f) => (
          <div key={f.title} className="card">
            <h3 className="font-serif text-xl font-semibold text-gold-dark">
              {f.title}
            </h3>
            <p className="mt-2 text-ink/70">{f.body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
