import Link from "next/link";
import { Search, Film, Menu } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Film className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tighter text-foreground">
              We Breath Cinema
            </span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/trending" className="transition-colors hover:text-primary">
            Trending
          </Link>
          <Link href="/collections" className="transition-colors hover:text-primary">
            Collections
          </Link>
          <Link href="/journal" className="transition-colors hover:text-primary">
            Journal
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-muted-foreground hover:text-primary transition-colors">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </button>
          <button className="md:hidden text-muted-foreground hover:text-primary transition-colors">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </button>
          <div className="hidden md:flex items-center gap-2">
             {/* Placeholder for Auth/Profile */}
             <div className="h-8 w-8 rounded-full bg-muted/50 border border-white/10"></div>
          </div>
        </div>
      </div>
    </header>
  );
}
