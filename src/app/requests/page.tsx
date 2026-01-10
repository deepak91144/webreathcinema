"use client";

import { useEffect, useState } from "react";
import { UserCheck, UserX, Users, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getFollowRequests, acceptFollowRequest, rejectFollowRequest } from "@/lib/api";
import Link from "next/link";

export default function RequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    if (!user) return;
    try {
      const data = await getFollowRequests(user._id);
      setRequests(data);
    } catch (error) {
      console.error("Failed to load requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      await acceptFollowRequest(requestId);
      setRequests(requests.filter(r => r._id !== requestId));
    } catch (error) {
      console.error("Failed to accept request:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      await rejectFollowRequest(requestId);
      setRequests(requests.filter(r => r._id !== requestId));
    } catch (error) {
      console.error("Failed to reject request:", error);
    } finally {
      setProcessingId(null);
    }
  };

  if (!user) {
    return (
      <div className="container max-w-4xl px-4 py-16 md:px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please sign in to view follow requests</h1>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container max-w-4xl px-4 py-16 md:px-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl px-4 py-8 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          Follow Requests
        </h1>
        <p className="text-muted-foreground mt-2">Manage who can follow you</p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-border bg-card/50">
          <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No pending requests</h2>
          <p className="text-muted-foreground">When someone wants to follow you, you'll see them here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card/50 backdrop-blur-sm hover:bg-card transition-colors"
            >
              <Link href={`/profile/${request.from.username}`} className="flex-shrink-0">
                <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-border">
                  <img src={request.from.avatar} alt={request.from.name} className="h-full w-full object-cover" />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/profile/${request.from.username}`} className="hover:underline">
                  <h3 className="font-semibold text-foreground truncate">{request.from.name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground truncate">@{request.from.username}</p>
                {request.from.bio && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{request.from.bio}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(request._id)}
                  disabled={processingId === request._id}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {processingId === request._id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserCheck className="h-4 w-4" />
                  )}
                  Accept
                </button>
                <button
                  onClick={() => handleReject(request._id)}
                  disabled={processingId === request._id}
                  className="flex items-center gap-2 px-4 py-2 rounded-md border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {processingId === request._id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserX className="h-4 w-4" />
                  )}
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
