import api from '../config/api';
import type { Book } from './bookService';

export type ReadingStatus = 'not_started' | 'in_progress' | 'completed';

export interface ReadingProgress {
  id: number;
  book: Book;
  status: ReadingStatus;
  current_page: number;
  reading_time_minutes: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ReadingStatistics {
  total_books_read: number;
  total_reading_time: number;
  books_in_progress: number;
  books_completed: number;
  average_reading_time: number;
}

export interface UpdateReadingProgressData {
  status: ReadingStatus;
  current_page: number;
  reading_time_minutes: number;
  notes?: string;
}

const readingProgressService = {
  getReadingProgress: async (status?: ReadingStatus) => {
    const response = await api.get('/reading-progress', {
      params: { status },
    });
    return response.data;
  },

  getReadingStatistics: async () => {
    const response = await api.get('/reading-progress/statistics');
    return response.data as ReadingStatistics;
  },

  getBookReadingProgress: async (bookId: number) => {
    const response = await api.get(`/reading-progress/books/${bookId}`);
    return response.data as ReadingProgress;
  },

  updateReadingProgress: async (bookId: number, data: UpdateReadingProgressData) => {
    const response = await api.put(`/reading-progress/books/${bookId}`, data);
    return response.data as ReadingProgress;
  },
};

export default readingProgressService; 