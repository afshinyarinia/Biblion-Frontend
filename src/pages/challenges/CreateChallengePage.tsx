import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import readingChallengeService from '../../services/readingChallengeService';
import { ArrowLeftIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Requirement {
  key: string;
  value: number;
}

export default function CreateChallengePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [requirements, setRequirements] = useState<Requirement[]>([
    { key: 'fiction', value: 5 },
  ]);

  const createChallengeMutation = useMutation({
    mutationFn: readingChallengeService.createReadingChallenge,
    onSuccess: () => {
      navigate('/challenges');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requirementsObject = requirements.reduce(
      (acc, { key, value }) => ({ ...acc, [key]: value }),
      {}
    );

    createChallengeMutation.mutate({
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      requirements: requirementsObject,
      is_public: isPublic,
    });
  };

  const addRequirement = () => {
    setRequirements([...requirements, { key: '', value: 1 }]);
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const updateRequirement = (index: number, field: 'key' | 'value', value: string | number) => {
    const newRequirements = [...requirements];
    newRequirements[index] = {
      ...newRequirements[index],
      [field]: field === 'value' ? Number(value) : value,
    };
    setRequirements(newRequirements);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/challenges')}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Challenges
      </button>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Challenge</h1>

          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  min={startDate}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Requirements</label>
              <div className="space-y-4">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={requirement.key}
                        onChange={(e) => updateRequirement(index, 'key', e.target.value)}
                        placeholder="Category (e.g., fiction)"
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        value={requirement.value}
                        onChange={(e) => updateRequirement(index, 'value', e.target.value)}
                        min={1}
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    {requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addRequirement}
                className="mt-4 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Requirement
              </button>
            </div>

            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                  Make this challenge public
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Public challenges are visible to all users and anyone can join them.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/challenges')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createChallengeMutation.isPending}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {createChallengeMutation.isPending ? 'Creating...' : 'Create Challenge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 