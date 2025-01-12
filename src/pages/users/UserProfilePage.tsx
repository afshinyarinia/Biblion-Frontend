import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import socialService from '../../services/socialService';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import {
  BookOpenIcon,
  StarIcon,
  TrophyIcon,
  ChartBarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Tab } from '@headlessui/react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState(0);

  const { data: activities } = useQuery({
    queryKey: ['user-activities', id],
    queryFn: () => socialService.getUserActivities(Number(id)),
    enabled: !!id,
  });

  const { data: followers } = useQuery({
    queryKey: ['followers', id],
    queryFn: () => socialService.getFollowers(Number(id)),
    enabled: !!id,
  });

  const { data: following } = useQuery({
    queryKey: ['following', id],
    queryFn: () => socialService.getFollowing(Number(id)),
    enabled: !!id,
  });

  const followMutation = useMutation({
    mutationFn: socialService.followUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers', id] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: socialService.unfollowUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers', id] });
    },
  });

  const isFollowing = followers?.some((follower) => follower.id === currentUser?.id);
  const isOwnProfile = currentUser?.id === Number(id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                <UserGroupIcon className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activities?.[0]?.user.name || 'Loading...'}
                </h1>
                <div className="flex space-x-4 text-sm text-gray-500">
                  <span>{followers?.length || 0} followers</span>
                  <span>{following?.length || 0} following</span>
                </div>
              </div>
            </div>
            {!isOwnProfile && (
              <button
                onClick={() => {
                  if (isFollowing) {
                    unfollowMutation.mutate(Number(id));
                  } else {
                    followMutation.mutate(Number(id));
                  }
                }}
                className={classNames(
                  'px-4 py-2 border rounded-md text-sm font-medium',
                  isFollowing
                    ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'border-transparent bg-indigo-600 text-white hover:bg-indigo-700'
                )}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>

          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex space-x-4 border-b border-gray-200">
              <Tab
                className={({ selected }) =>
                  classNames(
                    'py-4 px-1 text-sm font-medium border-b-2 focus:outline-none',
                    selected
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )
                }
              >
                Activities
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'py-4 px-1 text-sm font-medium border-b-2 focus:outline-none',
                    selected
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )
                }
              >
                Followers
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'py-4 px-1 text-sm font-medium border-b-2 focus:outline-none',
                    selected
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )
                }
              >
                Following
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-6">
              <Tab.Panel>
                <div className="space-y-6">
                  {activities?.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {activity.type === 'book_read' && (
                          <BookOpenIcon className="h-6 w-6 text-green-500" />
                        )}
                        {activity.type === 'review_added' && (
                          <StarIcon className="h-6 w-6 text-yellow-500" />
                        )}
                        {(activity.type === 'challenge_joined' ||
                          activity.type === 'challenge_completed') && (
                          <TrophyIcon className="h-6 w-6 text-purple-500" />
                        )}
                        {activity.type === 'goal_achieved' && (
                          <ChartBarIcon className="h-6 w-6 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="text-sm text-gray-900">
                          {activity.type === 'book_read' && (
                            <>Finished reading {activity.data.book?.title}</>
                          )}
                          {activity.type === 'review_added' && (
                            <>
                              Reviewed {activity.data.book?.title}
                              <div className="mt-1">
                                <div className="flex items-center">
                                  {[...Array(activity.data.review?.rating || 0)].map((_, i) => (
                                    <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                                  ))}
                                </div>
                                <p className="mt-1 text-gray-600">
                                  {activity.data.review?.content}
                                </p>
                              </div>
                            </>
                          )}
                          {activity.type === 'challenge_joined' && (
                            <>Joined the challenge {activity.data.challenge?.title}</>
                          )}
                          {activity.type === 'challenge_completed' && (
                            <>Completed the challenge {activity.data.challenge?.title}</>
                          )}
                          {activity.type === 'goal_achieved' && (
                            <>
                              Achieved {activity.data.goal?.year} reading goal of{' '}
                              {activity.data.goal?.target} {activity.data.goal?.type}
                            </>
                          )}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {format(new Date(activity.created_at), 'MMM d, yyyy h:mm a')}
                        </div>
                      </div>
                    </div>
                  ))}
                  {activities?.length === 0 && (
                    <div className="text-center text-gray-500">No activities to show.</div>
                  )}
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {followers?.map((follower) => (
                    <div
                      key={follower.id}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserGroupIcon className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium text-gray-900">{follower.name}</div>
                        <div className="text-sm text-gray-500">
                          Joined {format(new Date(follower.created_at), 'MMM yyyy')}
                        </div>
                      </div>
                    </div>
                  ))}
                  {followers?.length === 0 && (
                    <div className="col-span-full text-center text-gray-500">
                      No followers yet.
                    </div>
                  )}
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {following?.map((followed) => (
                    <div
                      key={followed.id}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserGroupIcon className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium text-gray-900">{followed.name}</div>
                        <div className="text-sm text-gray-500">
                          Joined {format(new Date(followed.created_at), 'MMM yyyy')}
                        </div>
                      </div>
                    </div>
                  ))}
                  {following?.length === 0 && (
                    <div className="col-span-full text-center text-gray-500">
                      Not following anyone yet.
                    </div>
                  )}
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
} 