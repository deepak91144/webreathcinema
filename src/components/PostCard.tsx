"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Star, MessageSquare, Heart, Share2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleLike, fetchComments, addComment } from "@/lib/api";

interface PostCardProps {
  post: any;
}

export function PostCard({ post }: PostCardProps) {
  const { user, movie } = post;
  
  if (!user || !movie || typeof user === 'string' || typeof movie === 'string') return null;

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (showComments) {
      fetchComments(post._id).then(setComments).catch(console.error);
    }
  }, [showComments, post._id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount((prev: number) => newLikedState ? prev + 1 : prev - 1);

    try {
        await toggleLike(post._id, newLikedState);
    } catch (error) {
        setIsLiked(!newLikedState);
        setLikeCount((prev: number) => !newLikedState ? prev + 1 : prev - 1);
        console.error("Failed to toggle like:", error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
        const currentUser = await fetch("http://localhost:8000/api/users/cinephile_jane").then(r => r.json());
        const comment = await addComment(post._id, currentUser.user._id, newComment);
        setComments(prev => [...prev, comment]);
        setNewComment("");
    } catch (error) {
        console.error("Failed to add comment:", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm transition-all hover:bg-card/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${user.username}`}>
            <div className="h-10 w-10 overflow-hidden rounded-full border border-border ring-1 ring-border p-0.5">
              <img src={user.avatar} alt={user.username} className="h-full w-full object-cover rounded-full" />
            </div>
          </Link>
          <div>
            <Link href={`/profile/${user.username}`} className="font-semibold hover:underline">
              {user.name}
            </Link>
            <p className="text-xs text-muted-foreground">@{user.username} • {new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex gap-4 mb-4">
        <Link href={`/movie/${movie.tmdbId}`} className="shrink-0 w-28 aspect-[2/3] rounded-md overflow-hidden bg-muted hover:ring-2 hover:ring-primary/50 transition-all shadow-md">
          <img src={movie.posterUrl} alt={movie.title} className="h-full w-full object-cover" />
        </Link>
        <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg leading-tight mb-1 truncate">
                Watched <span className="text-primary">{movie.title}</span> <span className="text-muted-foreground font-normal text-sm">({movie.year})</span>
            </h3>
            <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                    <Star 
                        key={i} 
                        className={cn("h-4 w-4", i < Math.floor(post.rating) ? "fill-primary text-primary" : "text-muted-foreground/30")} 
                    />
                ))}
            </div>

            {post.sceneHighlight && (
              <div className="inline-flex items-center gap-2 px-2 py-1 bg-primary/10 border border-primary/20 rounded-lg mb-3">
                <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Scene Highlight:</span>
                <span className="text-xs italic text-foreground/80">{post.sceneHighlight}</span>
              </div>
            )}

            <p className="text-muted-foreground/90 leading-relaxed max-w-2xl text-sm italic border-l-2 border-border/40 pl-3">
                "{post.content}"
            </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 pt-4 border-t border-border/50">
        <button 
            onClick={handleLike}
            className={cn("flex items-center gap-2 text-sm transition-colors group", isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500")}
        >
            <Heart className={cn("h-4 w-4 transition-transform group-hover:scale-110", isLiked && "fill-current")} />
            <span>{likeCount}</span>
        </button>
        <button 
            onClick={() => setShowComments(!showComments)}
            className={cn("flex items-center gap-2 text-sm transition-colors group", showComments ? "text-primary" : "text-muted-foreground hover:text-primary")}
        >
            <MessageSquare className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>{comments.length || post.comments || 0}</span>
        </button>
         <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group ml-auto">
            <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-border/30 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-3">
                <div className="h-7 w-7 rounded-full overflow-hidden border border-border shrink-0">
                  <img src={comment.user.avatar} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 bg-muted/30 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-xs">{comment.user.name}</span>
                    <span className="text-[10px] text-muted-foreground">@{comment.user.username}</span>
                  </div>
                  <p className="text-xs text-muted-foreground/90">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleCommentSubmit} className="flex gap-3 pt-2">
            <div className="h-7 w-7 rounded-full overflow-hidden border border-border shrink-0 bg-muted">
              <img src="https://ui-avatars.com/api/?name=Jane+Doe&background=random" className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 relative">
                <input 
                    type="text"
                    placeholder="Add to the discussion..."
                    className="w-full bg-muted/40 border border-border/50 rounded-lg pl-3 pr-10 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={isSubmitting}
                />
                <button 
                    type="submit"
                    disabled={isSubmitting || !newComment.trim()}
                    className="absolute right-2 top-1.5 text-primary hover:text-primary/80 disabled:text-muted-foreground"
                >
                    <Share2 className="h-3.5 w-3.5 rotate-90" />
                </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
