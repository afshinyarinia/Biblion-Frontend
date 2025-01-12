import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpenIcon,
  RectangleStackIcon,
  ChartBarIcon,
  TrophyIcon,
  RssIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Books', to: '/books', icon: BookOpenIcon },
    { name: 'Shelves', to: '/shelves', icon: RectangleStackIcon },
    { name: 'Reading Goals', to: '/goals', icon: ChartBarIcon },
    { name: 'Challenges', to: '/challenges', icon: TrophyIcon },
    { name: 'Activity Feed', to: '/feed', icon: RssIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-white">
                Biblion
              </Link>
              <div className="hidden md:block ml-10">
                <div className="flex space-x-4">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.name}
                        to={item.to}
                        className={({ isActive }) =>
                          classNames(
                            'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          )
                        }
                      >
                        <Icon className="h-5 w-5 mr-2" />
                        {item.name}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to={`/users/${user?.id}`}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors inline-flex items-center"
              >
                <UserIcon className="h-5 w-5 mr-2" />
                {user?.name}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
} 