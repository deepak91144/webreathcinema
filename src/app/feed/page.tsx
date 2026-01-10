import { PostCard } from "@/components/PostCard";
import { fetchFeed } from "@/lib/api";
import { Post } from "@/lib/data"; // Keeping types for now, eventually share types

export default async function FeedPage() {
  let posts: any[] = [];
  try {
      posts = await fetchFeed();
  } catch (e) {
      console.error(e);
  }

  return (
    <div className="container max-w-2xl px-4 py-8 md:px-6">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Activity Feed</h1>
      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
        {posts.length === 0 && <p className="text-muted-foreground">No posts yet. Be the first!</p>}
      </div>
    </div>
  );
}
