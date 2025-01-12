import React from 'react';
import { useQuery } from '@tanstack/react-query';
import socialService from '../services/socialService';
import { Link } from 'react-router-dom';
import {
  BookOpenIcon,
  StarIcon,
  ChatBubbleLeftIcon,
  TrophyIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

function getActivityIcon(type: string) {
  switch (type) {
    case 'book_read':
      return <BookOpenIcon className="h-5 w-5" />;
    case 'review_added':
      return <StarIcon className="h-5 w-5" />;
    case 'comment_added':
      return <ChatBubbleLeftIcon className="h-5 w-5" />;
    case 'challenge_completed':
      return <TrophyIcon className="h-5 w-5" />;
    case 'followed_user':
      return <UserGroupIcon className="h-5 w-5" />;
    default:
      return <BookOpenIcon className="h-5 w-5" />;
  }
}

function getActivityContent(activity: any) {
  const { type, user, data } = activity;
  const userName = <Link to={`/users/${user.id}`} className="font-medium text-indigo-600 hover:text-indigo-500">{user.name}</Link>;

  switch (type) {
    case 'book_read':
      return (
        <>
          {userName} finished reading{' '}
          <Link to={`/books/${data.book.id}`} className="font-medium text-gray-900 hover:text-gray-700">
            {data.book.title}
          </Link>
        </>
      );
    case 'review_added':
      return (
        <>
          {userName} reviewed{' '}
          <Link to={`/books/${data.book.id}`} className="font-medium text-gray-900 hover:text-gray-700">
            {data.book.title}
          </Link>
        </>
      );
    case 'challenge_completed':
      return (
        <>
          {userName} completed the challenge{' '}
          <Link to={`/challenges/${data.challenge.id}`} className="font-medium text-gray-900 hover:text-gray-700">
            {data.challenge.title}
          </Link>
        </>
      );
    case 'followed_user':
      return (
        <>
          {userName} started following{' '}
          <Link to={`/users/${data.followed_user.id}`} className="font-medium text-gray-900 hover:text-gray-700">
            {data.followed_user.name}
          </Link>
        </>
      );
    default:
      return null;
  }
}

export default function ActivityFeedPage() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['activity-feed'],
    queryFn: () => socialService.getActivityFeed(),
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const activityList = Array.isArray(activities) ? activities : [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Activity Feed</h1>

      <div className="space-y-4">
        {activityList.map((activity) => (
          <div
            key={activity.id}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1 text-gray-400">
                {getActivityIcon(activity.type)}
              </div>
              <div>
                <div className="text-gray-700">
                  {getActivityContent(activity)}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {new Date(activity.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}

        {activityList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No activities found. Follow more users or join some reading challenges!</p>
          </div>
        )}
      </div>
    </div>
  );
} 