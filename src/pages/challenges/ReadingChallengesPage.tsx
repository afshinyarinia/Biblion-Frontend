import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import readingChallengeService, { ReadingChallenge } from '../../services/readingChallengeService';
import { PlusIcon, UserGroupIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function ReadingChallengesPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    active_only: true,
    featured: false,
  });

  const { data: challenges, isLoading } = useQuery({
    queryKey: ['reading-challenges', filters],
    queryFn: () => readingChallengeService.getReadingChallenges(filters),
  });

  const joinChallengeMutation = useMutation({
    mutationFn: readingChallengeService.joinChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reading-challenges'] });
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const challengesList = Array.isArray(challenges) ? challenges : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reading Challenges</h1>
          <p className="mt-2 text-gray-600">Join challenges and track your reading progress</p>
        </div>
        <button
          onClick={() => navigate('/challenges/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Challenge
        </button>
      </div>

      <div className="mb-8 flex space-x-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={filters.active_only}
            onChange={(e) => setFilters((prev) => ({ ...prev, active_only: e.target.checked }))}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="ml-2 text-gray-700">Active Only</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={filters.featured}
            onChange={(e) => setFilters((prev) => ({ ...prev, featured: e.target.checked }))}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="ml-2 text-gray-700">Featured</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challengesList.map((challenge) => (
          <div
            key={challenge.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{challenge.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{challenge.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  {challenge.participants_count} participants
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <BookOpenIcon className="h-5 w-5 mr-2" />
                  {Object.entries(challenge.requirements).map(([key, value]) => (
                    <span key={key} className="mr-2">
                      {value} {key}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  {format(new Date(challenge.start_date), 'MMM d, yyyy')} -{' '}
                  {format(new Date(challenge.end_date), 'MMM d, yyyy')}
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => navigate(`/challenges/${challenge.id}`)}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  View Details
                </button>
                <button
                  onClick={() => joinChallengeMutation.mutate(challenge.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Join Challenge
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {challengesList.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No challenges found. Try adjusting your filters or create a new one.</p>
        </div>
      )}
    </div>
  );
} 