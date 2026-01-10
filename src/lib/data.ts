import { Plus, Star, MessageSquare, Heart, Share2 } from "lucide-react";

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  favorites: number[]; // Movie IDs
}

export interface Movie {
  id: number;
  title: string;
  year: string;
  posterUrl: string;
  rating: number;
  director?: string;
}

export interface Post {
  id: string;
  userId: string;
  movieId: number;
  rating: number;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export const USERS: User[] = [
  {
    id: "u1",
    username: "cinephile_jane",
    name: "Jane Doe",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    bio: "Obsessed with French New Wave and neon landscapes.",
    followers: 1243,
    following: 450,
    favorites: [2, 5],
  },
  {
    id: "u2",
    username: "film_buff_mike",
    name: "Mike Ross",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    bio: "Horror enthusiast. Practical effects over CGI.",
    followers: 890,
    following: 210,
    favorites: [1, 4],
  },
];

export const MOVIES: Movie[] = [
  { id: 1, title: "Dune: Part Two", year: "2024", rating: 8.8, posterUrl: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", director: "Denis Villeneuve" },
  { id: 2, title: "Poor Things", year: "2023", rating: 8.1, posterUrl: "https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c6Mrqcn.jpg", director: "Yorgos Lanthimos" },
  { id: 3, title: "Oppenheimer", year: "2023", rating: 8.6, posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", director: "Christopher Nolan" },
  { id: 4, title: "The Zone of Interest", year: "2023", rating: 7.9, posterUrl: "https://image.tmdb.org/t/p/w500/hUu9zyZmDD8VZegKi1iK1q0wfld.jpg", director: "Jonathan Glazer" },
  { id: 5, title: "Anatomy of a Fall", year: "2023", rating: 7.8, posterUrl: "https://image.tmdb.org/t/p/w500/k9r197E6u1T0Qd3k7XjM9f7d4.jpg", director: "Justine Triet" },
  { id: 6, title: "Past Lives", year: "2023", rating: 7.9, posterUrl: "https://image.tmdb.org/t/p/w500/k3waqVXSnvCZW5J9rQG98.jpg", director: "Celine Song" },
];

export const POSTS: Post[] = [
  {
    id: "p1",
    userId: "u1",
    movieId: 2,
    rating: 5,
    content: "Poor Things is a visual feast. Emma Stone's performance is transcendent. The production design is unlike anything I've seen in years.",
    likes: 342,
    comments: 45,
    timestamp: "2h ago",
  },
  {
    id: "p2",
    userId: "u2",
    movieId: 3,
    rating: 4.5,
    content: "Oppenheimer totally blew me away. The sound design alone deserves an Oscar. A haunting masterpiece.",
    likes: 892,
    comments: 120,
    timestamp: "5h ago",
  },
  {
    id: "p3",
    userId: "u1",
    movieId: 6,
    rating: 4,
    content: "Past Lives is so subtle yet heartbreaking. A beautiful meditation on destiny and what-ifs.",
    likes: 156,
    comments: 23,
    timestamp: "1d ago",
  },
];

export function getUser(id: string) {
  return USERS.find((u) => u.id === id);
}

export function getMovie(id: number) {
  return MOVIES.find((m) => m.id === id);
}

export function getPosts() {
  return POSTS;
}

export function getUserPosts(userId: string) {
  return POSTS.filter((p) => p.userId === userId);
}
