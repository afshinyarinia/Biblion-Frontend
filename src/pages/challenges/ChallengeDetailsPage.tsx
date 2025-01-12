import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import readingChallengeService from '../../services/readingChallengeService';
import { format } from 'date-fns';
import {
  ArrowLeftIcon,
  BookOpenIcon,
  CalendarIcon,
  UserGroupIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import type { Book } from '../../services/bookService';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (book: Book, requirementKey: string) => void;
  requirements: { [key: string]: number };
}

function AddBookModal({ isOpen, onClose, onAddBook, requirements }: AddBookModalProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedRequirement, setSelectedRequirement] = useState<string>('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Add Book to Challenge</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Requirement</label>
            <select
              value={selectedRequirement}
              onChange={(e) => setSelectedRequirement(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select a requirement</option>
              {Object.entries(requirements).map(([key, value]) => (
                <option key={key} value={key}>
                  {key} ({value} required)
                </option>
              ))}
            </select>
          </div>

          {/* Book selection would go here - this would typically be integrated with your book search functionality */}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (selectedBook && selectedRequirement) {
                onAddBook(selectedBook, selectedRequirement);
                onClose();
              }
            }}
            disabled={!selectedBook || !selectedRequirement}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            Add Book
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChallengeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);

  const { data: challenge, isLoading } = useQuery({
    queryKey: ['reading-challenge', id],
    queryFn: () => readingChallengeService.getReadingChallenge(Number(id)),
    enabled: !!id,
  });

  const addBookMutation = useMutation({
    mutationFn: ({ bookId, requirementKey }: { bookId: number; requirementKey: string }) =>
      readingChallengeService.addBookToChallenge(Number(id), bookId, requirementKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reading-challenge', id] });
    },
  });

  const removeBookMutation = useMutation({
    mutationFn: (bookId: number) =>
      readingChallengeService.removeBookFromChallenge(Number(id), bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reading-challenge', id] });
    },
  });

  if (isLoading || !challenge) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/challenges')}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Challenges
      </button>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{challenge.title}</h1>
          <p className="text-gray-600 mb-6">{challenge.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center text-gray-500">
              <CalendarIcon className="h-5 w-5 mr-2" />
              <span>
                {format(new Date(challenge.start_date), 'MMM d, yyyy')} -{' '}
                {format(new Date(challenge.end_date), 'MMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center text-gray-500">
              <UserGroupIcon className="h-5 w-5 mr-2" />
              <span>{challenge.participants_count} participants</span>
            </div>
            <div className="flex items-center text-gray-500">
              <BookOpenIcon className="h-5 w-5 mr-2" />
              <span>
                {Object.entries(challenge.requirements)
                  .map(([key, value]) => `${value} ${key}`)
                  .join(', ')}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Progress</h2>
              <button
                onClick={() => setIsAddBookModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Book
              </button>
            </div>

            {Object.entries(challenge.progress).map(([key, { required, completed }]) => (
              <div key={key} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {key} ({completed}/{required})
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round((completed / required) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${Math.min((completed / required) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Books Added</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenge.books.map((book) => (
                  <div
                    key={book.id}
                    className="border border-gray-200 rounded-lg p-4 flex justify-between items-start"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{book.title}</h4>
                      <p className="text-sm text-gray-500">{book.author}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm('Remove this book from the challenge?')) {
                          removeBookMutation.mutate(book.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddBookModal
        isOpen={isAddBookModalOpen}
        onClose={() => setIsAddBookModalOpen(false)}
        onAddBook={(book, requirementKey) => {
          addBookMutation.mutate({ bookId: book.id, requirementKey });
        }}
        requirements={challenge.requirements}
      />
    </div>
  );
} 