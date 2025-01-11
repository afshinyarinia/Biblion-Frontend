import api from '../config/api';

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  description: string;
  cover_image: string;
  published_year: number;
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

const bookService = {
  getBooks: async (filters: BookFilters = {}): Promise<PaginatedResponse<Book>> => {
    const response = await api.get('/books', { params: filters });
    return response.data;
  },

  getBook: async (id: number): Promise<Book> => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  addToFavorites: async (bookId: number): Promise<void> => {
    await api.post(`/books/${bookId}/favorite`);
  },

  removeFromFavorites: async (bookId: number): Promise<void> => {
    await api.delete(`/books/${bookId}/favorite`);
  },

  addToShelf: async (bookId: number, shelfId: number): Promise<void> => {
    await api.post(`/shelves/${shelfId}/books`, { book_id: bookId });
  },

  removeFromShelf: async (bookId: number, shelfId: number): Promise<void> => {
    await api.delete(`/shelves/${shelfId}/books/${bookId}`);
  },
};

export default bookService; 