import api from '../config/api';

export interface ReadingGoal {
  id: number;
  year: number;
  target_books: number;
  target_pages: number;
  books_read: number;
  pages_read: number;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface CreateReadingGoalData {
  year: number;
  target_books: number;
  target_pages: number;
}

export interface UpdateReadingGoalData {
  target_books: number;
  target_pages: number;
}

const readingGoalService = {
  getReadingGoals: async () => {
    const response = await api.get('/reading-goals');
    return response.data as ReadingGoal[];
  },

  getCurrentYearGoal: async () => {
    const response = await api.get('/reading-goals/current');
    return response.data as ReadingGoal;
  },

  createReadingGoal: async (data: CreateReadingGoalData) => {
    const response = await api.post('/reading-goals', data);
    return response.data as ReadingGoal;
  },

  updateReadingGoal: async (id: number, data: UpdateReadingGoalData) => {
    const response = await api.put(`/reading-goals/${id}`, data);
    return response.data as ReadingGoal;
  },

  deleteReadingGoal: async (id: number) => {
    await api.delete(`/reading-goals/${id}`);
  },
};

export default readingGoalService; 