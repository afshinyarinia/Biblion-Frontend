import { Link } from 'react-router-dom';
import { BookOpenIcon, TrashIcon, GlobeAltIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import type { Shelf } from '../../services/shelfService';

interface ShelfCardProps {
  shelf: Shelf;
  onDelete: () => void;
}

export default function ShelfCard({ shelf, onDelete }: ShelfCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              <Link to={`/shelves/${shelf.id}`} className="hover:text-indigo-600">
                {shelf.name}
              </Link>
            </h3>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              {shelf.is_public ? (
                <>
                  <GlobeAltIcon className="h-4 w-4 mr-1" />
                  <span>Public</span>
                </>
              ) : (
                <>
                  <LockClosedIcon className="h-4 w-4 mr-1" />
                  <span>Private</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-500"
            aria-label="Delete shelf"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {shelf.description || 'No description provided.'}
        </p>

        <div className="mt-4 flex items-center text-sm text-gray-500">
          <BookOpenIcon className="h-5 w-5 mr-1" />
          <span>{shelf.books?.length || 0} books</span>
        </div>
      </div>

      {shelf.books && shelf.books.length > 0 && (
        <div className="px-6 pb-6">
          <div className="mt-2 flex -space-x-2 overflow-hidden">
            {shelf.books.slice(0, 5).map((book) => (
              <img
                key={book.id}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                src={book.cover_image}
                alt={book.title}
              />
            ))}
            {shelf.books.length > 5 && (
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 ring-2 ring-white">
                <span className="text-xs text-gray-500">
                  +{shelf.books.length - 5}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 