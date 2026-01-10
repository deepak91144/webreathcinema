"use client";

import { useEffect, useState, useRef } from "react";
import { MessageCircle, Send, Loader2, Image as ImageIcon, Video, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { getMessages, markMessagesAsRead } from "@/lib/api";
import Link from "next/link";

interface Message {
  _id: string;
  from: { _id: string; username: string; name: string; avatar: string };
  to: { _id: string; username: string; name: string; avatar: string };
  content?: string;
  attachment?: {
    type: 'image' | 'video';
    url: string;
    filename: string;
  };
  read: boolean;
  createdAt: string;
}

interface ChatWindowProps {
  otherUser: {
    _id: string;
    username: string;
    name: string;
    avatar: string;
  };
}

export function ChatWindow({ otherUser }: ChatWindowProps) {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [otherUserOnline, setOtherUserOnline] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user || !otherUser) return;

    loadMessages();
    
    if (socket) {
      // Register current user as online
      socket.emit('register_user', { userId: user._id });

      // Join room
      socket.emit('join_room', {
        currentUserId: user._id,
        otherUserId: otherUser._id
      });

      // Listen for room joined confirmation
      socket.on('room_joined', ({ otherUserOnline: isOnline }) => {
        setOtherUserOnline(isOnline);
      });

      // Listen for new messages
      socket.on('new_message', (message: Message) => {
        setMessages(prev => [...prev, message]);
        // Mark as read if it's from the other user
        if (message.from._id === otherUser._id && user) {
          markMessagesAsRead(user._id, otherUser._id);
        }
      });

      // Typing indicators
      socket.on('user_typing', () => setTyping(true));
      socket.on('user_stop_typing', () => setTyping(false));

      // Presence tracking
      socket.on('user_online', ({ userId }) => {
        if (userId === otherUser._id) {
          setOtherUserOnline(true);
        }
      });

      socket.on('user_offline', ({ userId }) => {
        if (userId === otherUser._id) {
          setOtherUserOnline(false);
        }
      });

      return () => {
        socket.off('room_joined');
        socket.off('new_message');
        socket.off('user_typing');
        socket.off('user_stop_typing');
        socket.off('user_online');
        socket.off('user_offline');
      };
    }
  }, [user, otherUser, socket]);

  const loadMessages = async () => {
    if (!user) return;
    try {
      const data = await getMessages(user._id, otherUser._id);
      setMessages(data);
      await markMessagesAsRead(user._id, otherUser._id);
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    if ((!newMessage.trim() && !selectedFile) || !socket || !user) return;

    try {
      let attachment = null;

      // Upload file if selected
      if (selectedFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await fetch('http://localhost:8000/api/upload', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          attachment = await response.json();
        }
        setUploading(false);
      }

      // Send message via socket
      socket.emit('send_message', {
        from: user._id,
        to: otherUser._id,
        content: newMessage.trim() || undefined,
        attachment
      });

      setNewMessage("");
      handleClearFile();
      socket.emit('stop_typing', { from: user._id, to: otherUser._id });
    } catch (error) {
      console.error("Failed to send message:", error);
      setUploading(false);
    }
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);
    
    if (socket && value.length > 0) {
      socket.emit('typing', { from:user._id, to: otherUser._id });
    } else if (socket) {
      socket.emit('stop_typing', { from: user._id, to: otherUser._id });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b border-border p-4 flex items-center gap-3">
        <Link href={`/profile/${otherUser.username}`}>
          <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-border">
            <img src={otherUser.avatar} alt={otherUser.name} className="h-full w-full object-cover" />
          </div>
        </Link>
        <div>
          <Link href={`/profile/${otherUser.username}`} className="font-semibold hover:underline">
            {otherUser.name}
          </Link>
          <p className="text-xs text-muted-foreground">
            {otherUserOnline ? (typing ? 'typing...' : 'online') : 'offline'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground">Send a message to start the conversation</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.from._id === user?._id;
            return (
              <div key={message._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  isOwn 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  {/* Attachment */}
                  {message.attachment && (
                    <div className="mb-2">
                      {message.attachment.type === 'image' ? (
                        <img 
                          src={`http://localhost:8000${message.attachment.url}`}
                          alt={message.attachment.filename}
                          className="rounded max-w-full max-h-64 object-contain"
                        />
                      ) : (
                        <video 
                          src={`http://localhost:8000${message.attachment.url}`}
                          controls
                          className="rounded max-w-full max-h-64"
                        />
                      )}
                    </div>
                  )}
                  {message.content && <p className="text-sm">{message.content}</p>}
                  <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        {/* File preview */}
        {filePreview && (
          <div className="mb-2 relative inline-block">
            <button
              onClick={handleClearFile}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 z-10"
            >
              <X className="h-4 w-4" />
            </button>
            {selectedFile?.type.startsWith('image/') ? (
              <img src={filePreview} alt="Preview" className="h-20 w-20 object-cover rounded border-2 border-border" />
            ) : (
              <div className="h-20 w-20 flex items-center justify-center bg-muted rounded border-2 border-border">
                <Video className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,video/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 p-2 rounded-md border border-input hover:bg-accent transition-colors"
            title="Attach image or video"
          >
            <ImageIcon className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !uploading && handleSend()}
            placeholder="Type a message..."
            disabled={uploading}
            className="flex-1 min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={(!newMessage.trim() && !selectedFile) || uploading}
            className="flex-shrink-0 p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
