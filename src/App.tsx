import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import BooksPage from './pages/books/BooksPage';
import BookDetailsPage from './pages/books/BookDetailsPage';
import ShelvesPage from './pages/shelves/ShelvesPage';
import ReadingGoalsPage from './pages/goals/ReadingGoalsPage';
import ReadingChallengesPage from './pages/challenges/ReadingChallengesPage';
import CreateChallengePage from './pages/challenges/CreateChallengePage';
import ChallengeDetailsPage from './pages/challenges/ChallengeDetailsPage';
import ActivityFeedPage from './pages/feed/ActivityFeedPage';
import UserProfilePage from './pages/users/UserProfilePage';
import HomePage from './pages/HomePage';
import { AuthProvider, useAuth } from './context/AuthContext';

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<HomePage />} />
              <Route path="books" element={<BooksPage />} />
              <Route path="books/:id" element={<BookDetailsPage />} />
              <Route path="shelves" element={<ShelvesPage />} />
              <Route path="goals" element={<ReadingGoalsPage />} />
              <Route path="challenges" element={<ReadingChallengesPage />} />
              <Route path="challenges/new" element={<CreateChallengePage />} />
              <Route path="challenges/:id" element={<ChallengeDetailsPage />} />
              <Route path="feed" element={<ActivityFeedPage />} />
              <Route path="users/:id" element={<UserProfilePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
} 