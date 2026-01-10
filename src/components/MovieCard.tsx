import Link from "next/link";
import { Star, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  id: number;
  title: string;
  year: string;
  posterUrl: string;
  rating: number;
  className?: string;
}

export function MovieCard({ id, title, year, posterUrl, rating, className }: MovieCardProps) {
  return (
    <div className={cn("group relative overflow-hidden rounded-lg bg-card transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/10", className)}>
      <Link href={`/movie/${id}`} className="block aspect-[2/3] w-full overflow-hidden">
        <div 
          className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
      </Link>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="line-clamp-1 text-lg font-bold text-white group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-300">{year}</p>
          </div>
          <div className="flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 backdrop-blur-sm">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-xs font-bold text-white">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button className="flex items-center gap-1 text-xs font-medium text-white hover:text-primary transition-colors">
            <Plus className="h-3 w-3" />
            Watchlist
          </button>
        </div>
      </div>
    </div>
  );
}
