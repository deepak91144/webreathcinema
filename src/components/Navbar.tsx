"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Film, Compass, Home, PlusSquare, LogIn, Bell, MessageCircle, PenTool } from "lucide-react";
import { CreatePostModal } from "@/components/CreatePostModal";
import { SignInModal } from "@/components/SignInModal";
import { PreferencesModal } from "@/components/PreferencesModal";
import { useAuth } from "@/contexts/AuthContext";
import { getFollowRequests } from "@/lib/api";

export function Navbar() {
  const { user, isLoading } = useAuth();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadRequestCount();
    }
  }, [user]);

  const loadRequestCount = async () => {
    if (!user) return;
    try {
      const requests = await getFollowRequests(user._id);
      setRequestCount(requests.length);
    } catch (error) {
      console.error("Failed to load request count:", error);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center space-x-2">
            <Film className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">We Breath Cinema</span>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
            <Link href="/feed" className="flex items-center gap-2 transition-colors hover:text-foreground/80 text-foreground/60">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Feed</span>
            </Link>
            <Link href="/discover" className="flex items-center gap-2 transition-colors hover:text-foreground/80 text-foreground/60">
              <Compass className="h-4 w-4" />
              <span className="hidden sm:inline">Discover</span>
            </Link>
            
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <Link href="/requests" className="flex items-center gap-2 transition-colors hover:text-foreground/80 text-foreground/60 relative">
                      <Bell className="h-4 w-4" />
                      {requestCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                          {requestCount}
                        </span>
                      )}
                      <span className="hidden sm:inline">Requests</span>
                    </Link>
                    
                    <Link href="/chat" className="flex items-center gap-2 transition-colors hover:text-foreground/80 text-foreground/60">
                      <MessageCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">Messages</span>
                    </Link>
                    
                    <button 
                      onClick={() => setIsPostModalOpen(true)}
                      className="flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors"
                    >
                      <PenTool className="h-5 w-5" />
                      <span className="hidden sm:inline">Post</span>
                    </button>

                    <Link href={`/profile/${user.username}`} className="flex items-center gap-2 transition-colors hover:text-foreground/80 text-foreground/60">
                      <div className="h-6 w-6 overflow-hidden rounded-full border border-border">
                          <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
                      </div>
                      <span className="hidden sm:inline">Profile</span>
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => setIsSignInModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors border border-primary/30"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </button>
                )}
              </>
            )}
          </nav>
        </div>
      </header>
      {user && <CreatePostModal open={isPostModalOpen} onOpenChange={setIsPostModalOpen} />}
      <SignInModal 
        open={isSignInModalOpen} 
        onOpenChange={setIsSignInModalOpen}
        onShowPreferences={() => setIsPreferencesModalOpen(true)}
      />
      <PreferencesModal 
        open={isPreferencesModalOpen} 
        onOpenChange={setIsPreferencesModalOpen}
      />
    </>
  );
}
