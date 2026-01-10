// const API_URL = "https://cinephile-backend-ji5r.onrender.com/api";  
// const API_URL = "http://localhost:8000/api";
const API_URL = "https://cinephile-backend-ji5r.onrender.com/api";

export async function fetchFeed() {
  const res = await fetch(`${API_URL}/posts`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch feed');
  return res.json();
}

export async function fetchUserProfile(username: string) {
  try {
    const res = await fetch(`${API_URL}/users/${username}`, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Failed to fetch user profile for ${username}:`, res.status, res.statusText);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error(`Error fetching profile for ${username}:`, error);
    return null;
  }
}

export async function fetchAllUsers() {
  const res = await fetch(`${API_URL}/users`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export async function createPost(postData: any) {
  const res = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  if (!res.ok) throw new Error('Failed to create post');
  return res.json();
}

export async function toggleLike(postId: string, increment: boolean) {
  const res = await fetch(`${API_URL}/posts/${postId}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ increment }),
  });
  if (!res.ok) throw new Error('Failed to toggle like');
  return res.json();
}

export async function fetchMovies() {
    const res = await fetch(`${API_URL}/movies`);
    if(!res.ok) return [];
    return res.json();
}

export async function fetchComments(postId: string) {
    const res = await fetch(`${API_URL}/posts/${postId}/comments`);
    if (!res.ok) throw new Error('Failed to fetch comments');
    return res.json();
}

export async function addComment(postId: string, userId: string, content: string) {
    const res = await fetch(`${API_URL}/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, content }),
    });
    if (!res.ok) throw new Error('Failed to add comment');
    return res.json();
}

// --- Follow System ---
export async function sendFollowRequest(currentUserId: string, targetUserId: string) {
  const res = await fetch(`${API_URL}/users/${targetUserId}/follow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentUserId }),
  });
  if (!res.ok) throw new Error('Failed to send follow request');
  return res.json();
}

export async function unfollowUser(currentUserId: string, targetUserId: string) {
  const res = await fetch(`${API_URL}/users/${targetUserId}/unfollow`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentUserId }),
  });
  if (!res.ok) throw new Error('Failed to unfollow');
  return res.json();
}

export async function getFollowStatus(currentUserId: string, targetUserId: string) {
  const res = await fetch(`${API_URL}/users/${targetUserId}/follow-status?currentUserId=${currentUserId}`);
  if (!res.ok) return { status: 'not_following' };
  return res.json();
}

export async function getFollowRequests(userId: string) {
  const res = await fetch(`${API_URL}/follow-requests?userId=${userId}`);
  if (!res.ok) return [];
  return res.json();
}

export async function acceptFollowRequest(requestId: string) {
  const res = await fetch(`${API_URL}/follow-requests/${requestId}/accept`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Failed to accept request');
  return res.json();
}

export async function rejectFollowRequest(requestId: string) {
  const res = await fetch(`${API_URL}/follow-requests/${requestId}/reject`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Failed to reject request');
  return res.json();
}

// --- Chat System ---
export async function getMessages(currentUserId: string, otherUserId: string) {
  const res = await fetch(`${API_URL}/messages/${otherUserId}?currentUserId=${currentUserId}`);
  if (!res.ok) return [];
  return res.json();
}

export async function getConversations(userId: string) {
  const res = await fetch(`${API_URL}/conversations?userId=${userId}`);
  if (!res.ok) return [];
  return res.json();
}

export async function canChat(currentUserId: string, otherUserId: string) {
  const res = await fetch(`${API_URL}/chat/can-chat/${otherUserId}?currentUserId=${currentUserId}`);
  if (!res.ok) return { canChat: false };
  return res.json();
}

export async function markMessagesAsRead(currentUserId: string, otherUserId: string) {
  const res = await fetch(`${API_URL}/messages/mark-read`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentUserId, otherUserId }),
  });
  if (!res.ok) throw new Error('Failed to mark as read');
  return res.json();
}
