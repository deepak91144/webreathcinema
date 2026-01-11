"use client";

import { useState, useEffect } from "react";
import { X, Search, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchMovies, createPost } from "@/lib/api";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [sceneHighlight, setSceneHighlight] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    // Initial fetch
    if (open && !searchTerm) {
        fetchMovies().then(setMovies).catch(console.error);
    }
  }, [open, searchTerm]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchMovies(searchTerm).then(setMovies).catch(console.error);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Client side filtering is redundant if backend filters, but okay for mixed approach.
  // We'll rely on backend results if searchTerm is present.
  const displayMovies = searchTerm ? movies : movies; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMovie) return;

    // Hardcoded user ID for now until auth is fully implemented
    // In real app, we get this from session/context
    // We need to fetch a user to get their ID first or just use the seed user ID if known.
    // For this prototype, I'll fetch the user 'cinephile_jane' to get ID.
    // Ideally this should be context.
    
    // Quick hack: fetch user first
    const user = await fetch("http://localhost:8000/api/users/cinephile_jane").then(r => r.json());
    
    try {
        await createPost({
            userId: user.user._id,
            movieId: selectedMovie, // This is tmdbId in our dropdown logic, ensure backend handles it
            rating,
            content,
            sceneHighlight
        });
        onOpenChange(false);
        setSelectedMovie(null);
        setRating(0);
        setContent("");
        setSceneHighlight("");
        setSearchTerm("");
        // Ideally reload feed
        window.location.reload(); 
    } catch (e) {
        console.error("Failed to create post", e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Log a Movie</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {!selectedMovie ? (
            <div className="space-y-4">
               <div className="relative">
                 <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                 <input 
                    type="text" 
                    placeholder="Search for a film..."
                    className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                 />
               </div>
               <div className="h-[200px] overflow-y-auto space-y-2">
                 {displayMovies.map(movie => (
                   <div 
                      key={movie._id || movie.tmdbId}
                      className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md cursor-pointer transition-colors"
                      onClick={() => { setSelectedMovie(movie.tmdbId); setSearchTerm(""); }}
                   >
                     <img src={movie.posterUrl} alt={movie.title} className="h-10 w-8 object-cover rounded bg-muted" />
                     <div>
                       <div className="font-medium text-sm">{movie.title}</div>
                       <div className="text-xs text-muted-foreground">{movie.year}</div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          ) : (
            <div className="space-y-4">
               <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-md">
                 <img 
                    src={movies.find(m => m.tmdbId === selectedMovie)?.posterUrl} 
                    className="h-12 w-8 object-cover rounded"
                 />
                 <div className="flex-1">
                   <div className="font-medium">{movies.find(m => m.tmdbId === selectedMovie)?.title}</div>
                   <button 
                      type="button" 
                      className="text-xs text-primary hover:underline"
                      onClick={() => setSelectedMovie(null)}
                   >
                      Change film
                   </button>
                 </div>
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-medium">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                       <button
                         key={star}
                         type="button"
                         onClick={() => setRating(star)}
                         className="focus:outline-none"
                       >
                         <Star 
                           className={`h-6 w-6 ${rating >= star ? "fill-primary text-primary" : "text-muted-foreground/30 hover:text-primary/50"}`} 
                         />
                       </button>
                    ))}
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-medium">Review</label>
                  <textarea 
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    placeholder="Add your thoughts..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-medium">Scene Highlight <span className="text-[10px] text-muted-foreground uppercase tracking-wider ml-1">(Optional)</span></label>
                  <input 
                    type="text"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. The hallway fight scene"
                    value={sceneHighlight}
                    onChange={(e) => setSceneHighlight(e.target.value)}
                  />
               </div>
               
               <div className="flex justify-end pt-2">
                 <button 
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors shadow-lg shadow-primary/20"
                    disabled={!selectedMovie || rating === 0}
                 >
                    Direct Critique
                 </button>
               </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
