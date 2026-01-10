"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { UserCard } from "./UserCard";
import { fetchAllUsers } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export function SuggestedUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await fetchAllUsers();
      // Filter out current user
      const filteredUsers = currentUser 
        ? allUsers.filter((u: any) => u._id !== currentUser._id)
        : allUsers;
      setUsers(filteredUsers.slice(0, 6)); // Show max 6 users
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-border p-6 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Connect with Cinephiles</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border p-6 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Connect with Cinephiles</h2>
      </div>
      <div className="space-y-3">
        {users.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
}
