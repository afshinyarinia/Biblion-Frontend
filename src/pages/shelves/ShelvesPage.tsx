import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon } from '@heroicons/react/24/outline';
import shelfService, { type Shelf, type CreateShelfData } from '../../services/shelfService';
import CreateShelfModal from '../../components/shelves/CreateShelfModal';
import ShelfCard from '../../components/shelves/ShelfCard';

interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export default function ShelvesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: paginatedResponse, isLoading, error } = useQuery<PaginatedResponse<Shelf>>({
    queryKey: ['shelves'],
    queryFn: shelfService.getShelves,
  });

  // Get the shelves array from the paginated response
  const shelves = paginatedResponse?.data ?? [];

  const createShelfMutation = useMutation({
    mutationFn: (data: CreateShelfData) => shelfService.createShelf(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shelves'] });
      setIsCreateModalOpen(false);
    },
  });

  const deleteShelfMutation = useMutation({
    mutationFn: (shelfId: number) => shelfService.deleteShelf(shelfId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shelves'] });
    },
  });

  if (error) {
    console.error('Error loading shelves:', error);
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading shelves. Please try again later.</p>
        <p className="text-sm text-gray-500 mt-2">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Shelves</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create New Shelf
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-lg h-48"
            />
          ))}
        </div>
      ) : shelves.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">You haven't created any shelves yet.</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
          >
            Create your first shelf
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shelves.map((shelf: Shelf) => (
            <ShelfCard
              key={shelf.id}
              shelf={shelf}
              onDelete={() => deleteShelfMutation.mutate(shelf.id)}
            />
          ))}
        </div>
      )}

      <CreateShelfModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => createShelfMutation.mutate(data)}
        isLoading={createShelfMutation.isPending}
      />
    </div>
  );
}