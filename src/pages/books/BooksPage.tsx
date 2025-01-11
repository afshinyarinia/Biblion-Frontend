import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { BookFilters } from '../../services/bookService';
import bookService from '../../services/bookService';
import BookCard from '../../components/books/BookCard';

export default function BooksPage() {
  const [filters, setFilters] = useState<BookFilters>({
    page: 1,
    per_page: 12,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['books', filters],
    queryFn: () => bookService.getBooks(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      search: searchTerm,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading books. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search form */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="max-w-lg mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search books by title or author..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </form>
      </div>

      {/* Books grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-lg h-[400px]"
            />
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No books found. Try adjusting your search.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.data.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                showFavoriteButton={false}
              />
            ))}
          </div>

          {/* Pagination */}
          {data?.meta && data.meta.last_page > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {/* Previous Page */}
                <button
                  onClick={() => handlePageChange(data.meta.current_page - 1)}
                  disabled={data.meta.current_page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {[...Array(data.meta.last_page)].map((_, i) => {
                  const page = i + 1;
                  const isCurrentPage = page === data.meta.current_page;

                  // Show first page, last page, current page, and pages around current page
                  if (
                    page === 1 ||
                    page === data.meta.last_page ||
                    (page >= data.meta.current_page - 2 &&
                      page <= data.meta.current_page + 2)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        disabled={isCurrentPage}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          isCurrentPage
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }

                  // Show ellipsis for skipped pages
                  if (
                    page === data.meta.current_page - 3 ||
                    page === data.meta.current_page + 3
                  ) {
                    return (
                      <span
                        key={page}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                      >
                        ...
                      </span>
                    );
                  }

                  return null;
                })}

                {/* Next Page */}
                <button
                  onClick={() => handlePageChange(data.meta.current_page + 1)}
                  disabled={data.meta.current_page === data.meta.last_page}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
} 