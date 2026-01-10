"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MessageCircle, Send, Loader2, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getConversations, fetchAllUsers } from "@/lib/api";
import { ChatWindow } from "@/components/ChatWindow";

interface Conversation {
  user: {
    _id: string;
    username: string;
    name: string;
    avatar: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
}

function ChatContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<Conversation['user'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadConversations();
      
      // Check if there's a 'with' query param to open chat with specific user
      const withUsername = searchParams.get('with');
      if (withUsername) {
        loadUserByUsername(withUsername);
      }
    }
  }, [user, searchParams]);

  const loadConversations = async () => {
    if (!user) return;
    try {
      const data = await getConversations(user._id);
      setConversations(data);
      
      // Auto-select first conversation if no specific user requested
      if (data.length > 0 && !selectedUser && !searchParams.get('with')) {
        setSelectedUser(data[0].user);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserByUsername = async (username: string) => {
    try {
      const users = await fetchAllUsers();
      const targetUser = users.find((u: any) => u.username === username);
      if (targetUser) {
        setSelectedUser({
          _id: targetUser._id,
          username: targetUser.username,
          name: targetUser.name,
          avatar: targetUser.avatar
        });
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  };

  if (!user) {
    return (
      <div className="container max-w-6xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please sign in to view messages</h1>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container max-w-6xl px-4 py-16">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <MessageCircle className="h-8 w-8 text-primary" />
        Messages
      </h1>

      <div className="grid md:grid-cols-[350px_1fr] gap-4 h-[calc(100vh-200px)] border border-border rounded-lg overflow-hidden bg-card">
        {/* Conversations List */}
        <div className="border-r border-border overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No conversations yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Start chatting with your mutual followers
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {conversations.map((conv) => (
                <button
                  key={conv.user._id}
                  onClick={() => setSelectedUser(conv.user)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-accent transition-colors ${
                    selectedUser?._id === conv.user._id ? 'bg-accent' : ''
                  }`}
                >
                  <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-border flex-shrink-0">
                    <img src={conv.user.avatar} alt={conv.user.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold truncate">{conv.user.name}</p>
                      {conv.unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage.content}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Window */}
        <div>
          {selectedUser ? (
            <ChatWindow otherUser={selectedUser} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="container max-w-6xl px-4 py-16">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
