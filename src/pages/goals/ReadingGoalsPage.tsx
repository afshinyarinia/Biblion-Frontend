import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import readingGoalService, { ReadingGoal } from '../../services/readingGoalService';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface GoalFormData {
  year: number;
  target_books: number;
  target_pages: number;
}

export default function ReadingGoalsPage() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingGoal, setEditingGoal] = useState<ReadingGoal | null>(null);
  const [formData, setFormData] = useState<GoalFormData>({
    year: new Date().getFullYear(),
    target_books: 12,
    target_pages: 3600,
  });

  const { data: goals, isLoading } = useQuery({
    queryKey: ['reading-goals'],
    queryFn: readingGoalService.getReadingGoals,
  });

  const createMutation = useMutation({
    mutationFn: readingGoalService.createReadingGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reading-goals'] });
      setIsCreating(false);
      setFormData({
        year: new Date().getFullYear(),
        target_books: 12,
        target_pages: 3600,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<GoalFormData, 'year'> }) =>
      readingGoalService.updateReadingGoal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reading-goals'] });
      setEditingGoal(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: readingGoalService.deleteReadingGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reading-goals'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGoal) {
      updateMutation.mutate({
        id: editingGoal.id,
        data: {
          target_books: formData.target_books,
          target_pages: formData.target_pages,
        },
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reading Goals</h1>
        {!isCreating && !editingGoal && (
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Goal
          </button>
        )}
      </div>

      {(isCreating || editingGoal) && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingGoal ? 'Edit Goal' : 'Create New Goal'}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {!editingGoal && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <input
                  type="number"
                  min={2000}
                  max={2100}
                  value={formData.year}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, year: parseInt(e.target.value) }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Target Books</label>
              <input
                type="number"
                min={1}
                value={formData.target_books}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, target_books: parseInt(e.target.value) }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Target Pages</label>
              <input
                type="number"
                min={1}
                value={formData.target_pages}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, target_pages: parseInt(e.target.value) }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingGoal(null);
                setFormData({
                  year: new Date().getFullYear(),
                  target_books: 12,
                  target_pages: 3600,
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {editingGoal ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {goals?.map((goal) => (
          <div
            key={goal.id}
            className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center space-x-8">
              <div className="w-24 h-24">
                <CircularProgressbar
                  value={goal.progress_percentage}
                  text={`${Math.round(goal.progress_percentage)}%`}
                  styles={buildStyles({
                    textSize: '16px',
                    pathColor: '#4f46e5',
                    textColor: '#4f46e5',
                  })}
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{goal.year} Reading Goal</h3>
                <p className="text-gray-500">
                  Books: {goal.books_read} / {goal.target_books}
                </p>
                <p className="text-gray-500">
                  Pages: {goal.pages_read} / {goal.target_pages}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setEditingGoal(goal);
                  setFormData({
                    year: goal.year,
                    target_books: goal.target_books,
                    target_pages: goal.target_pages,
                  });
                }}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this goal?')) {
                    deleteMutation.mutate(goal.id);
                  }
                }}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 