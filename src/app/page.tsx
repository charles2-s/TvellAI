import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <header className="border-b border-green-200 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-green-800">TrailShare</h1>
          <nav className="flex gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-green-700 hover:text-green-900"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 py-20 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-green-900 sm:text-5xl">
            Share your trip.<br />
            Track every destination.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-green-700/80">
            TrailShare helps tour operators and travel companies create a single
            shareable link for their travelers. Mark destinations as visited,
            track progress, and keep everyone on the same page.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-green-700 px-6 py-3 text-base font-semibold text-white hover:bg-green-800"
            >
              Start your trip page
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-green-300 px-6 py-3 text-base font-semibold text-green-800 hover:bg-green-50"
            >
              Log in
            </Link>
          </div>
        </section>

        <section className="bg-green-50/50 border-t border-green-200">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-200 text-2xl">
                  🗺️
                </div>
                <h3 className="text-lg font-semibold text-green-900">
                  Build your itinerary
                </h3>
                <p className="mt-2 text-green-700/80">
                  Add destinations with photos, descriptions, and durations in
                  minutes.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sand-200 text-2xl">
                  🔗
                </div>
                <h3 className="text-lg font-semibold text-green-900">
                  Share one link
                </h3>
                <p className="mt-2 text-green-700/80">
                  Give travelers a single URL. No login required for them to
                  view your trip.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-200 text-2xl">
                  ✅
                </div>
                <h3 className="text-lg font-semibold text-green-900">
                  Track progress together
                </h3>
                <p className="mt-2 text-green-700/80">
                  Both you and your travelers can mark destinations as completed
                  in real time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-green-200 bg-white/60">
        <div className="mx-auto max-w-5xl px-6 py-6 text-center text-sm text-green-600">
          TrailShare — built for tour operators and adventure companies.
        </div>
      </footer>
    </div>
  );
}
