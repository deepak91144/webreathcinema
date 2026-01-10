"use client";

import { useState, useEffect } from "react";
import { UserPlus, UserCheck, Clock, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { sendFollowRequest, unfollowUser, getFollowStatus } from "@/lib/api";

interface FollowButtonProps {
  targetUserId: string;
  onFollowChange?: () => void;
}

export function FollowButton({ targetUserId, onFollowChange }: FollowButtonProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState<'not_following' | 'pending' | 'following'>('not_following');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && targetUserId) {
      loadFollowStatus();
    }
  }, [user, targetUserId]);

  const loadFollowStatus = async () => {
    if (!user) return;
    try {
      const result = await getFollowStatus(user._id, targetUserId);
      setStatus(result.status);
    } catch (error) {
      console.error("Failed to load follow status:", error);
    }
  };

  const handleFollow = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      if (status === 'following') {
        await unfollowUser(user._id, targetUserId);
        setStatus('not_following');
      } else if (status === 'not_following') {
        await sendFollowRequest(user._id, targetUserId);
        setStatus('pending');
      }
      onFollowChange?.();
    } catch (error) {
      console.error("Follow action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user._id === targetUserId) {
    return null; // Don't show button on own profile or when not logged in
  }

  const buttonConfig = {
    not_following: {
      text: "Follow",
      icon: UserPlus,
      className: "bg-primary hover:bg-primary/90 text-primary-foreground",
    },
    pending: {
      text: "Pending",
      icon: Clock,
      className: "bg-muted hover:bg-muted text-muted-foreground cursor-not-allowed",
    },
    following: {
      text: "Following",
      icon: UserCheck,
      className: "bg-primary/20 hover:bg-destructive hover:text-destructive-foreground border border-primary/30 hover:border-destructive",
    },
  };

  const config = buttonConfig[status];
  const Icon = config.icon;

  return (
    <button
      onClick={handleFollow}
      disabled={loading || status === 'pending'}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${config.className} disabled:opacity-50`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Icon className="h-4 w-4" />
      )}
      {config.text}
    </button>
  );
}
