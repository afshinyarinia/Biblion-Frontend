import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HeartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import bookService from '../../services/bookService';

export default function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const { data: book, isLoading, error } = useQuery({
    queryKey: ['book', id],
    queryFn: () => bookService.getBook(Number(id)),
    enabled: !!id,
  });

  const handleFavoriteToggle = async () => {
    if (!book || isTogglingFavorite) return;

    setIsTogglingFavorite(true);
    try {
      if (isFavorited) {
        await bookService.removeFromFavorites(book.id);
      } else {
        await bookService.addToFavorites(book.id);
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-[2/3] bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Error loading book details
          </h2>
          <p className="mt-2 text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to books
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={book.cover_image}
            alt={`Cover of ${book.title}`}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
          <p className="mt-2 text-xl text-gray-600">{book.author}</p>
          <p className="mt-1 text-gray-500">
            Published: {book.published_year}
          </p>
          <p className="mt-1 text-gray-500">ISBN: {book.isbn}</p>

          <div className="mt-6 prose prose-indigo">
            <h2 className="text-xl font-semibold text-gray-900">Description</h2>
            <p className="mt-2 text-gray-600">{book.description}</p>
          </div>

          <div className="mt-8 flex space-x-4">
            <button
              onClick={handleFavoriteToggle}
              disabled={isTogglingFavorite}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFavorited ? (
                <HeartSolid className="h-5 w-5 mr-2" />
              ) : (
                <HeartIcon className="h-5 w-5 mr-2" />
              )}
              {isTogglingFavorite
                ? 'Loading...'
                : isFavorited
                ? 'Remove from Favorites'
                : 'Add to Favorites'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 