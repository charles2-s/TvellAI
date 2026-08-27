import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-cream-100 flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=2000&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/70 via-charcoal-900/50 to-charcoal-950/70" />

      <div className="relative z-10 max-w-2xl w-full mx-auto px-6 py-16 text-center animate-fade-in">
        <h1 className="font-display text-5xl sm:text-6xl text-white mb-4 tracking-tight">
          TrailShare
        </h1>
        <p className="text-lg sm:text-xl text-cream-200 mb-10 leading-relaxed max-w-lg mx-auto">
          Share your travel itinerary with the world. Track destinations, manage trips, and keep your travelers informed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="px-8 py-3.5 bg-clay-500 text-white rounded-2xl text-sm font-semibold hover:bg-clay-600 transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg shadow-clay-900/20"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-8 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl text-sm font-semibold hover:bg-white/20 transition-all duration-200 hover:scale-[1.02] active:scale-95"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
