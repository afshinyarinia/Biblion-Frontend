import api from '../config/api';
import type { User } from '../context/AuthContext';
import type { Book } from './bookService';

export interface Activity {
  id: number;
  user: User;
  type: 'book_read' | 'review_added' | 'challenge_joined' | 'challenge_completed' | 'goal_achieved' | 'following';
  data: {
    book?: Book;
    review?: {
      rating: number;
      content: string;
    };
    challenge?: {
      id: number;
      title: string;
    };
    goal?: {
      year: number;
      type: 'books' | 'pages';
      target: number;
    };
    followed_user?: User;
  };
  created_at: string;
}

const socialService = {
  // Followers
  getFollowers: async (userId: number) => {
    const response = await api.get(`/users/${userId}/followers`);
    return response.data as User[];
  },

  getFollowing: async (userId: number) => {
    const response = await api.get(`/users/${userId}/following`);
    return response.data as User[];
  },

  followUser: async (userId: number) => {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
  },

  unfollowUser: async (userId: number) => {
    await api.delete(`/users/${userId}/unfollow`);
  },

  // Activity Feed
  getActivityFeed: async () => {
    const response = await api.get('/feed');
    return response.data as Activity[];
  },

  getUserActivities: async (userId: number) => {
    const response = await api.get(`/users/${userId}/activities`);
    return response.data as Activity[];
  },
};

export default socialService; 