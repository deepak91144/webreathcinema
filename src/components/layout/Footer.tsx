import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black py-12 md:py-16 lg:py-20">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold tracking-tighter text-foreground">We Breath Cinema</h3>
            <p className="text-sm text-muted-foreground">
              A community for those who live and breathe film. Discover, discuss, and document your cinematic journey.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/trending" className="hover:text-primary">Trending</Link></li>
              <li><Link href="/collections" className="hover:text-primary">Collections</Link></li>
              <li><Link href="/journal" className="hover:text-primary">Journal</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Community</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/discussions" className="hover:text-primary">Discussions</Link></li>
              <li><Link href="/guidelines" className="hover:text-primary">Guidelines</Link></li>
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Connect</h4>
            <div className="flex gap-4 text-muted-foreground">
              <Link href="#" className="hover:text-primary"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-primary"><Github className="h-5 w-5" /></Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} We Breath Cinema. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
