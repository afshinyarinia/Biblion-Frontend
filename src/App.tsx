import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import BooksPage from './pages/books/BooksPage';
import BookDetailsPage from './pages/books/BookDetailsPage';
import ShelvesPage from './pages/shelves/ShelvesPage';
import ShelfDetailsPage from './pages/shelves/ShelfDetailsPage';
import ReadingGoalsPage from './pages/goals/ReadingGoalsPage';
import ReadingChallengesPage from './pages/challenges/ReadingChallengesPage';
import ChallengeDetailsPage from './pages/challenges/ChallengeDetailsPage';
import CreateChallengePage from './pages/challenges/CreateChallengePage';
import ActivityFeedPage from './pages/feed/ActivityFeedPage';
import UserProfilePage from './pages/users/UserProfilePage';

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function App() {
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
              <Route index element={<Navigate to="/books" replace />} />
              <Route path="books" element={<BooksPage />} />
              <Route path="books/:id" element={<BookDetailsPage />} />
              <Route path="shelves" element={<ShelvesPage />} />
              <Route path="shelves/:id" element={<ShelfDetailsPage />} />
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

export default App; 