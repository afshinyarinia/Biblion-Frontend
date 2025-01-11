import api from '../config/api';
import type { Book } from './bookService';

export interface Review {
  id: number;
  book: Book;
  rating: number;
  review: string;
  contains_spoilers: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewData {
  rating: number;
  review: string;
  contains_spoilers: boolean;
}

export interface UpdateReviewData extends CreateReviewData {}

const reviewService = {
  getBookReviews: async (bookId: number, includeSpoilers = false) => {
    const response = await api.get(`/books/${bookId}/reviews`, {
      params: { spoilers: includeSpoilers },
    });
    return response.data;
  },

  createBookReview: async (bookId: number, data: CreateReviewData) => {
    const response = await api.post(`/books/${bookId}/reviews`, data);
    return response.data;
  },

  updateBookReview: async (bookId: number, reviewId: number, data: UpdateReviewData) => {
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
};

export default reviewService; 