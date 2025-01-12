import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import bookService from '../../services/bookService';
import { MagnifyingGlassIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['books', currentPage, searchQuery],
    queryFn: () => bookService.getBooks({ page: currentPage, search: searchQuery }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const books = data?.data ?? [];
  const totalPages = data?.meta?.last_page ?? 1;

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative mb-12">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books by title or author"
              className="w-full pl-12 pr-4 py-3 bg-gray-800 text-gray-100 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </form>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-gray-800 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {books.map((book) => (
                <div key={book.id} className="group h-[28rem] [perspective:1000px]">
                  <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    {/* Front of the card */}
                    <div className="absolute inset-0 [backface-visibility:hidden]">
                      <div className="h-[22rem] relative rounded-lg overflow-hidden">
                        <img
                          src={book.cover_image}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="mt-4 font-medium text-gray-100 text-lg truncate">{book.title}</h3>
                    </div>

                    {/* Back of the card */}
                    <div className="absolute inset-0 h-full w-full [transform:rotateY(180deg)] [backface-visibility:hidden]">
                      <div className="h-full p-6 bg-gray-800 rounded-lg">
                        <div className="flex flex-col h-full">
                          <h3 className="font-medium text-gray-100 text-lg mb-2 line-clamp-2">{book.title}</h3>
                          <div className="flex items-center text-gray-400 text-sm mb-2">
                            <UserIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{book.author}</span>
                          </div>
                          <div className="flex items-center text-gray-400 text-sm mb-4">
                            <CalendarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span>{new Date(book.publication_date).getFullYear()}</span>
                          </div>
                          {book.description && (
                            <p className="text-gray-300 text-sm line-clamp-6 flex-grow">
                              {book.description}
                            </p>
                          )}
                          <Link
                            to={`/books/${book.id}`}
                            className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {books.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No books found matching your search.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  const isCurrentPage = page === currentPage;

                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        disabled={isCurrentPage}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          isCurrentPage
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }

                  if (page === currentPage - 3 || page === currentPage + 3) {
                    return (
                      <span
                        key={page}
                        className="px-4 py-2 text-gray-400 text-sm font-medium"
                      >
                        ...
                      </span>
                    );
                  }

                  return null;
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 