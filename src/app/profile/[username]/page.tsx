import { notFound } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import { Star, Film, Users } from "lucide-react";
import { fetchUserProfile } from "@/lib/api";
import { ProfileActions } from "@/components/ProfileActions";

interface ProfilePageProps {
  params: {
    username: string;
  };
}

// Genre-based themes
const genreThemes: Record<string, { gradient: string; color: string }> = {
  Action: { gradient: "from-red-500/20 to-orange-500/20", color: "text-red-500" },
  Drama: { gradient: "from-purple-500/20 to-pink-500/20", color: "text-purple-500" },
  Comedy: { gradient: "from-yellow-500/20 to-green-500/20", color: "text-yellow-500" },
  Thriller: { gradient: "from-gray-500/20 to-slate-500/20", color: "text-gray-500" },
  Horror: { gradient: "from-red-700/20 to-black/20", color: "text-red-700" },
  "Sci-Fi": { gradient: "from-cyan-500/20 to-blue-500/20", color: "text-cyan-500" },
  Romance: { gradient: "from-pink-500/20 to-rose-500/20", color: "text-pink-500" },
  Documentary: { gradient: "from-green-500/20 to-teal-500/20", color: "text-green-500" },
  Animation: { gradient: "from-indigo-500/20 to-violet-500/20", color: "text-indigo-500" },
  Mystery: { gradient: "from-purple-700/20 to-indigo-700/20", color: "text-purple-700" },
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  // Next.js 15: params is a Promise and must be awaited
  const { username } = await params;
  
  let data;
  
  try {
    data = await fetchUserProfile(username);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    notFound();
  }

  if (!data || !data.user) {
    console.log("No user data found for username:", username);
    notFound();
  }

  const { user, posts } = data;
  const primaryGenre = user.preferences?.favoriteGenres?.[0] || "Drama";
  const theme = genreThemes[primaryGenre] || genreThemes.Drama;
  const hasPreferences = user.preferences && (
    user.preferences.favoriteActors.length > 0 ||
    user.preferences.favoriteMovies.length > 0 ||
    user.preferences.favoriteActresses.length > 0 ||
    user.preferences.favoriteGenres.length > 0
  );

  return (
    <div>
      {/* Profile Header with Genre Theme */}
      <div className={`relative h-48 w-full bg-gradient-to-r ${theme.gradient}`}>
           <div className="absolute inset-0 bg-black/40" />
      </div>
      
      <div className="container max-w-4xl px-4 md:px-6">
        <div className="relative -mt-20 mb-8 flex flex-col items-center sm:items-start sm:flex-row sm:gap-6">
           <div className="h-40 w-40 overflow-hidden rounded-full border-4 border-background bg-background shadow-xl">
              <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
           </div>
           
           <div className="mt-4 flex flex-1 flex-col items-center text-center sm:mt-20 sm:items-start sm:text-left">
              <div className="flex items-center gap-2">
                 <h1 className="text-3xl font-bold">{user.name}</h1>
                 <span className={`rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium ${theme.color}`}>
                   {primaryGenre} Fan
                 </span>
              </div>
              <p className="text-muted-foreground">@{user.username}</p>
              
              <div className="mt-4 flex flex-wrap justify-center gap-4 sm:justify-start">
                 <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span className="font-bold text-foreground">{user.followers}</span> Followers
                 </div>
                 <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span className="font-bold text-foreground">{user.following}</span> Following
                 </div>
              </div>
           </div>

           <ProfileActions userId={user._id} />
        </div>

        <div className="mb-8 max-w-2xl">
           <p className="text-lg leading-relaxed">{user.bio}</p>
        </div>

        {/* Preferences Section */}
        {hasPreferences && (
          <div className="mb-12 rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Star className={`h-5 w-5 ${theme.color}`} />
              Cinema Favorites
            </h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              {user.preferences.favoriteGenres.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Genres</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.preferences.favoriteGenres.map((genre: string) => (
                      <span key={genre} className={`px-3 py-1 rounded-full text-sm border ${theme.color} border-current/30 bg-current/10`}>
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {user.preferences.favoriteMovies.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <Film className="h-4 w-4" />
                    Favorite Movies
                  </h4>
                  <ul className="space-y-1">
                    {user.preferences.favoriteMovies.slice(0, 5).map((movie: string) => (
                      <li key={movie} className="text-foreground/80">{movie}</li>
                    ))}
                  </ul>
                </div>
              )}

              {user.preferences.favoriteActors.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Favorite Actors
                  </h4>
                  <ul className="space-y-1">
                    {user.preferences.favoriteActors.slice(0, 5).map((actor: string) => (
                      <li key={actor} className="text-foreground/80">{actor}</li>
                    ))}
                  </ul>
                </div>
              )}

              {user.preferences.favoriteActresses.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Favorite Actresses
                  </h4>
                  <ul className="space-y-1">
                    {user.preferences.favoriteActresses.slice(0, 5).map((actress: string) => (
                      <li key={actress} className="text-foreground/80">{actress}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content Tabs */}
        <div className="flex items-center gap-8 border-b border-border mb-8">
           <div className={`border-b-2 ${theme.color} border-current pb-2 font-medium`}>Reviews</div>
           <div className="pb-2 font-medium text-muted-foreground hover:text-foreground cursor-pointer">Watchlist</div>
           <div className="pb-2 font-medium text-muted-foreground hover:text-foreground cursor-pointer">Lists</div>
           <div className="pb-2 font-medium text-muted-foreground hover:text-foreground cursor-pointer">Likes</div>
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
           <div className="flex flex-col gap-6">
              {posts.length > 0 ? (
                 posts.map((post: any) => (
                    <PostCard key={post._id} post={post} />
                 ))
              ) : (
                 <div className="py-12 text-center text-muted-foreground">
                    No reviews yet.
                 </div>
              )}
           </div>
           
           <div className="hidden md:block">
              <div className="rounded-xl border border-border p-6 bg-card/50 backdrop-blur-sm">
                 <h3 className="font-semibold mb-4">Stats</h3>
                 <div className="space-y-3 text-sm">
                   <div className="flex justify-between">
                     <span className="text-muted-foreground">Reviews</span>
                     <span className="font-bold">{posts.length}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-muted-foreground">This Year</span>
                     <span className="font-bold">{posts.length}</span>
                   </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
