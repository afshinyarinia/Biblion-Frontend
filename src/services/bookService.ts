import api from '../config/api';

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  description: string;
  cover_image: string;
  total_pages: number;
  publisher: string;
  publication_date: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface BookFilters {
  search?: string;
  author?: string;
  year?: number;
  page?: number;
  per_page?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface CreateBookData {
  title: string;
  author: string;
  isbn: string;
  description: string;
  total_pages: number;
  cover_image: string;
  publisher: string;
  publication_date: string;
  language: string;
}

export interface UpdateBookData extends Partial<CreateBookData> {}

const bookService = {
  getBooks: async (filters: BookFilters = {}): Promise<PaginatedResponse<Book>> => {
    const response = await api.get('/books', { params: filters });
    return response.data;
  },

  searchBooks: async (query: string): Promise<PaginatedResponse<Book>> => {
    const response = await api.get('/books/search', { params: { search: query } });
    return response.data;
  },

  getBook: async (id: number): Promise<Book> => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  createBook: async (data: CreateBookData): Promise<Book> => {
    const response = await api.post('/books', data);
    return response.data;
  },

  updateBook: async (id: number, data: UpdateBookData): Promise<Book> => {
    const response = await api.put(`/books/${id}`, data);
    return response.data;
  },

  deleteBook: async (id: number): Promise<void> => {
    await api.delete(`/books/${id}`);
  },

  // Reviews
  getBookReviews: async (bookId: number, includeSpoilers = false) => {
    const response = await api.get(`/books/${bookId}/reviews`, {
      params: { spoilers: includeSpoilers },
    });
    return response.data;
  },

  createBookReview: async (bookId: number, data: {
    rating: number;
    review: string;
    contains_spoilers: boolean;
  }) => {
    const response = await api.post(`/books/${bookId}/reviews`, data);
    return response.data;
  },

  updateBookReview: async (
    bookId: number,
    reviewId: number,
    data: {
      rating: number;
      review: string;
      contains_spoilers: boolean;
    }
  ) => {
    const response = await api.put(`/books/${bookId}/reviews/${reviewId}`, data);
    return response.data;
  },

  deleteBookReview: async (bookId: number, reviewId: number) => {
    await api.delete(`/books/${bookId}/reviews/${reviewId}`);
  },

  getUserReviews: async () => {
    const response = await api.get('/user/reviews');
    return response.data;
  },

  // Reading Progress
  getReadingProgress: async (status?: 'not_started' | 'in_progress' | 'completed') => {
    const response = await api.get('/reading-progress', {
      params: { status },
    });
    return response.data;
  },

  getReadingStatistics: async () => {
    const response = await api.get('/reading-progress/statistics');
    return response.data;
  },

  getBookReadingProgress: async (bookId: number) => {
    const response = await api.get(`/reading-progress/books/${bookId}`);
    return response.data;
  },

  updateReadingProgress: async (
    bookId: number,
    data: {
      status: 'not_started' | 'in_progress' | 'completed';
      current_page: number;
      reading_time_minutes: number;
      notes?: string;
    }
  ) => {
    const response = await api.put(`/reading-progress/books/${bookId}`, data);
    return response.data;
  },
};

export default bookService; 