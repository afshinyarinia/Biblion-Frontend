import api from '../config/api';
import type { Book } from './bookService';

export interface Shelf {
  id: number;
  name: string;
  description: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  books?: Book[];
}

export interface CreateShelfData {
  name: string;
  description: string;
  is_public: boolean;
}

export interface UpdateShelfData extends Partial<CreateShelfData> {}

const shelfService = {
  getShelves: async () => {
    const response = await api.get('/shelves');
    return response.data;
  },

  getShelf: async (id: number) => {
    const response = await api.get(`/shelves/${id}`);
    return response.data;
  },

  createShelf: async (data: CreateShelfData) => {
    const response = await api.post('/shelves', data);
    return response.data;
  },

  updateShelf: async (id: number, data: UpdateShelfData) => {
    const response = await api.put(`/shelves/${id}`, data);
    return response.data;
  },

  deleteShelf: async (id: number) => {
    await api.delete(`/shelves/${id}`);
  },

  addBookToShelf: async (shelfId: number, bookId: number) => {
    const response = await api.post(`/shelves/${shelfId}/books`, { book_id: bookId });
    return response.data;
  },

  removeBookFromShelf: async (shelfId: number, bookId: number) => {
    await api.delete(`/shelves/${shelfId}/books/${bookId}`);
  },
};

export default shelfService; 