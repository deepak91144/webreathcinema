"use client";

import { useRouter } from "next/navigation";
import { Settings, LogOut } from "lucide-react";
import { FollowButton } from "@/components/FollowButton";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileActionsProps {
  userId: string;
}

export function ProfileActions({ userId }: ProfileActionsProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    signOut();
    router.push('/');
  };

  // Determine if this is the current user's profile
  const isOwnProfile = user && user._id === userId;

  if (isOwnProfile) {
    return (
      <div className="mt-6 sm:mt-20 flex gap-2">
        <button className="flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
          <Settings className="h-4 w-4" />
          Edit Profile
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 sm:mt-20 flex gap-2">
      <FollowButton targetUserId={userId} />
    </div>
  );
}
