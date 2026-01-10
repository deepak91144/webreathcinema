import { Hero } from "@/components/Hero";
import { MovieCard } from "@/components/MovieCard";
import { SuggestedUsers } from "@/components/SuggestedUsers";

// Mock Data
const TRENDING_MOVIES = [
  { id: 1, title: "Dune: Part Two", year: "2024", rating: 8.8, posterUrl: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg" },
  { id: 2, title: "Poor Things", year: "2023", rating: 8.1, posterUrl: "https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c6Mrqcn.jpg" },
  { id: 3, title: "Oppenheimer", year: "2023", rating: 8.6, posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" },
  { id: 4, title: "The Zone of Interest", year: "2023", rating: 7.9, posterUrl: "https://image.tmdb.org/t/p/w500/hUu9zyZmDD8VZegKi1iK1q0wfld.jpg" },
  { id: 5, title: "Anatomy of a Fall", year: "2023", rating: 7.8, posterUrl: "https://image.tmdb.org/t/p/w500/k9r197E6u1T0Qd3k7XjM9f7d4.jpg" },
  { id: 6, title: "Past Lives", year: "2023", rating: 7.9, posterUrl: "https://image.tmdb.org/t/p/w500/k3waqVXSnvCZW5J9rQG98.jpg" },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-20">
      <Hero />
      
      {/* Connect with Cinephiles */}
      <section className="container px-4 md:px-6">
        <SuggestedUsers />
      </section>
      
      <section className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tighter text-foreground">Trending Now</h2>
          <a href="/trending" className="text-sm font-medium text-primary hover:underline">View All</a>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {TRENDING_MOVIES.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      </section>

      <section className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tighter text-foreground">Curated Collections</h2>
          <a href="/collections" className="text-sm font-medium text-primary hover:underline">View All</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="group relative aspect-video overflow-hidden rounded-xl bg-muted">
             <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
             <div className="absolute bottom-0 left-0 p-6">
               <h3 className="text-2xl font-bold text-white">Neon Noir Essentials</h3>
               <p className="text-gray-300">Rain-slicked streets and moral ambiguity.</p>
             </div>
           </div>
           <div className="group relative aspect-video overflow-hidden rounded-xl bg-muted">
             <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
             <div className="absolute bottom-0 left-0 p-6">
               <h3 className="text-2xl font-bold text-white">Japanese New Wave</h3>
               <p className="text-gray-300">Rebellion and experimentation from the 60s.</p>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}
