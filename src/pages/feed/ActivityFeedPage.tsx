import React from 'react';
import { useQuery } from '@tanstack/react-query';
import socialService, { Activity } from '../../services/socialService';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  BookOpenIcon,
  StarIcon,
  TrophyIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

function ActivityItem({ activity }: { activity: Activity }) {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'book_read':
        return <BookOpenIcon className="h-6 w-6 text-green-500" />;
      case 'review_added':
        return <StarIcon className="h-6 w-6 text-yellow-500" />;
      case 'challenge_joined':
      case 'challenge_completed':
        return <TrophyIcon className="h-6 w-6 text-purple-500" />;
      case 'goal_achieved':
        return <ChartBarIcon className="h-6 w-6 text-blue-500" />;
      case 'following':
        return <UserGroupIcon className="h-6 w-6 text-indigo-500" />;
      default:
        return null;
    }
  };

  const getActivityContent = () => {
    const userName = (
      <Link to={`/users/${activity.user.id}`} className="font-medium text-gray-900 hover:underline">
        {activity.user.name}
      </Link>
    );

    switch (activity.type) {
      case 'book_read':
        return (
          <>
            {userName} finished reading{' '}
            <Link to={`/books/${activity.data.book?.id}`} className="font-medium hover:underline">
              {activity.data.book?.title}
            </Link>
          </>
        );
      case 'review_added':
        return (
          <>
            {userName} reviewed{' '}
            <Link to={`/books/${activity.data.book?.id}`} className="font-medium hover:underline">
              {activity.data.book?.title}
            </Link>
            <div className="mt-2 text-sm">
              <div className="flex items-center">
                {[...Array(activity.data.review?.rating || 0)].map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                ))}
              </div>
              <p className="mt-1 text-gray-600">{activity.data.review?.content}</p>
            </div>
          </>
        );
      case 'challenge_joined':
        return (
          <>
            {userName} joined the challenge{' '}
            <Link
              to={`/challenges/${activity.data.challenge?.id}`}
              className="font-medium hover:underline"
            >
              {activity.data.challenge?.title}
            </Link>
          </>
        );
      case 'challenge_completed':
        return (
          <>
            {userName} completed the challenge{' '}
            <Link
              to={`/challenges/${activity.data.challenge?.id}`}
              className="font-medium hover:underline"
            >
              {activity.data.challenge?.title}
            </Link>
          </>
        );
      case 'goal_achieved':
        return (
          <>
            {userName} achieved their {activity.data.goal?.year} reading goal of{' '}
            {activity.data.goal?.target} {activity.data.goal?.type}!
          </>
        );
      case 'following':
        return (
          <>
            {userName} started following{' '}
            <Link
              to={`/users/${activity.data.followed_user?.id}`}
              className="font-medium hover:underline"
            >
              {activity.data.followed_user?.name}
            </Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex space-x-4 py-4">
      <div className="flex-shrink-0">{getActivityIcon()}</div>
      <div className="flex-grow">
        <div className="text-sm">{getActivityContent()}</div>
        <div className="mt-1 text-xs text-gray-500">
          {format(new Date(activity.created_at), 'MMM d, yyyy h:mm a')}
        </div>
      </div>
    </div>
  );
}

export default function ActivityFeedPage() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['activity-feed'],
    queryFn: socialService.getActivityFeed,
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activityList = Array.isArray(activities) ? activities : [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Activity Feed</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-200">
          {activityList.map((activity) => (
            <div key={activity.id} className="px-6">
              <ActivityItem activity={activity} />
            </div>
          ))}
        </div>

        {activityList.length === 0 && (
          <div className="p-6 text-center text-gray-500">No activities to show yet.</div>
        )}
      </div>
    </div>
  );
} 