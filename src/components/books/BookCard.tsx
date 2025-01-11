import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import type { Book } from '../../services/bookService';
import bookService from '../../services/bookService';

interface BookCardProps {
  book: Book;
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
  showFavoriteButton?: boolean;
}

export default function BookCard({
  book,
  isFavorited = false,
  onFavoriteToggle,
  showFavoriteButton = true,
}: BookCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteClick = async () => {
    if (isLoading || !onFavoriteToggle) return;

    setIsLoading(true);
    try {
      if (isFavorited) {
        await bookService.removeFromFavorites(book.id);
      } else {
        await bookService.addToFavorites(book.id);
      }
      onFavoriteToggle();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <Link to={`/books/${book.id}`} className="block">
        <div className="aspect-[2/3] relative">
          <img
            src={book.cover_image}
            alt={`Cover of ${book.title}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{book.author}</p>
          <p className="text-sm text-gray-500 mt-1">
            Published: {book.published_year}
          </p>
        </div>
      </Link>
      {showFavoriteButton && (
        <div className="px-4 pb-4">
          <button
            onClick={handleFavoriteClick}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorited ? (
              <HeartSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartOutline className="h-5 w-5 text-gray-400" />
            )}
            <span className="ml-2">
              {isLoading
                ? 'Loading...'
                : isFavorited
                ? 'Favorited'
                : 'Add to Favorites'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
} 