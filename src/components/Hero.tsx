import { Play, Info } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden">
      {/* Background Image (Placeholder) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </div>

      <div className="container relative z-10 flex h-full flex-col justify-end pb-20 px-4 md:px-6">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm">
            Featured Selection
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl">
            The Cinematic <span className="text-primary">Experience</span>
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Dive into a curated world of cinema. From timeless classics to modern masterpieces, discover films that move you.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Play className="mr-2 h-4 w-4 fill-current" />
              Start Watching
            </Link>
            <Link
              href="/about"
              className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background/50 px-8 text-sm font-medium shadow-sm backdrop-blur-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Info className="mr-2 h-4 w-4" />
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
