import api from '../config/api';
import type { Book } from './bookService';

export interface ReadingChallenge {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  requirements: {
    [key: string]: number;
  };
  is_public: boolean;
  participants_count: number;
  books: Book[];
  progress: {
    [key: string]: {
      required: number;
      completed: number;
    };
  };
  created_at: string;
  updated_at: string;
}

export interface CreateReadingChallengeData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  requirements: {
    [key: string]: number;
  };
  is_public: boolean;
}

export interface UpdateReadingChallengeData {
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  requirements?: {
    [key: string]: number;
  };
  is_public?: boolean;
}

const readingChallengeService = {
  getReadingChallenges: async (params?: { active_only?: boolean; featured?: boolean }) => {
    const response = await api.get('/reading-challenges', { params });
    return response.data as ReadingChallenge[];
  },

  getReadingChallenge: async (id: number) => {
    const response = await api.get(`/reading-challenges/${id}`);
    return response.data as ReadingChallenge;
  },

  createReadingChallenge: async (data: CreateReadingChallengeData) => {
    const response = await api.post('/reading-challenges', data);
    return response.data as ReadingChallenge;
  },

  updateReadingChallenge: async (id: number, data: UpdateReadingChallengeData) => {
    const response = await api.put(`/reading-challenges/${id}`, data);
    return response.data as ReadingChallenge;
  },

  joinChallenge: async (id: number) => {
    const response = await api.post(`/reading-challenges/${id}/join`);
    return response.data;
  },

  addBookToChallenge: async (challengeId: number, bookId: number, requirementKey: string) => {
    const response = await api.post(`/reading-challenges/${challengeId}/books/${bookId}`, {
      requirement_key: requirementKey,
    });
    return response.data;
  },

  removeBookFromChallenge: async (challengeId: number, bookId: number) => {
    await api.delete(`/reading-challenges/${challengeId}/books/${bookId}`);
  },

  getUserChallenges: async () => {
    const response = await api.get('/user/reading-challenges');
    return response.data as ReadingChallenge[];
  },
};

export default readingChallengeService; 