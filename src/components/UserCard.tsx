"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { FollowButton } from "./FollowButton";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { canChat } from "@/lib/api";

interface UserCardProps {
  user: {
    _id: string;
    username: string;
    name: string;
    avatar: string;
    bio: string;
    followers: number;
    preferences?: {
      favoriteGenres: string[];
    };
  };
}

export function UserCard({ user }: UserCardProps) {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const primaryGenre = user.preferences?.favoriteGenres?.[0] || "Cinema";
  const [isMutualFollower, setIsMutualFollower] = useState(false);

  useEffect(() => {
    if (currentUser && user._id !== currentUser._id) {
      checkMutualFollow();
    }
  }, [currentUser, user._id]);

  const checkMutualFollow = async () => {
    if (!currentUser) return;
    try {
      const result = await canChat(currentUser._id, user._id);
      setIsMutualFollower(result.canChat);
    } catch (error) {
      console.error("Failed to check mutual follow:", error);
    }
  };

  const handleChatClick = () => {
    router.push(`/chat?with=${user.username}`);
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card/50 backdrop-blur-sm hover:bg-card transition-colors">
      <Link href={`/profile/${user.username}`} className="flex-shrink-0">
        <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-border">
          <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/profile/${user.username}`} className="hover:underline">
          <h3 className="font-semibold text-foreground truncate">{user.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span>{user.followers} followers</span>
          <span>•</span>
          <span className="text-primary">{primaryGenre} fan</span>
        </div>
      </div>

      {isMutualFollower ? (
        <button
          onClick={handleChatClick}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          Chat
        </button>
      ) : (
        <FollowButton targetUserId={user._id} />
      )}
    </div>
  );
}
