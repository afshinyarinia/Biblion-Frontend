import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(17, 24, 39, 0.7), rgba(17, 24, 39, 0.9)), url('/images/bookshelf-bg.jpg')`
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8">
            Discover books you'll love
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for genres, authors, or titles"
                className="w-full pl-12 pr-24 py-4 bg-gray-800/90 backdrop-blur-sm text-gray-100 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
              />
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
              </div>
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 