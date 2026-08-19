import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-green-900 mb-4">
          TrailShare
        </h1>
        <p className="text-lg text-green-700/80 mb-8">
          Share your travel itinerary with the world. Track destinations, manage trips, and keep your travelers informed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="rounded-full bg-green-700 px-6 py-3 text-sm font-semibold text-white hover:bg-green-800"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-green-300 px-6 py-3 text-sm font-semibold text-green-800 hover:bg-green-50"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
