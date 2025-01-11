import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import shelfService from '../../services/shelfService';
import BookCard from '../../components/books/BookCard';

export default function ShelfDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: shelf, isLoading, error } = useQuery({
    queryKey: ['shelf', id],
    queryFn: () => shelfService.getShelf(Number(id)),
    enabled: !!id,
  });

  const removeBookMutation = useMutation({
    mutationFn: ({ shelfId, bookId }: { shelfId: number; bookId: number }) =>
      shelfService.removeBookFromShelf(shelfId, bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shelf', id] });
    },
  });

  const deleteShelfMutation = useMutation({
    mutationFn: (shelfId: number) => shelfService.deleteShelf(shelfId),
    onSuccess: () => {
      navigate('/shelves');
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-[400px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !shelf) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Error loading shelf
          </h2>
          <p className="mt-2 text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <button
            onClick={() => navigate('/shelves')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to shelves
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{shelf.name}</h1>
          <p className="mt-2 text-gray-600">{shelf.description}</p>
          <div className="mt-2 text-sm text-gray-500">
            {shelf.is_public ? 'Public shelf' : 'Private shelf'} •{' '}
            {shelf.books?.length || 0} books
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this shelf?')) {
                deleteShelfMutation.mutate(shelf.id);
              }
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {shelf.books?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No books in this shelf yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {shelf.books?.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              showFavoriteButton={false}
              onRemove={() =>
                removeBookMutation.mutate({
                  shelfId: shelf.id,
                  bookId: book.id,
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
} 