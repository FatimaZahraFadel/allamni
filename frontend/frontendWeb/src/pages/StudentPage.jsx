import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import StudentLayout from '../components/student/StudentLayout';
import StudentDashboard from '../components/student/StudentDashboard';

export default function StudentPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    // Only redirect if we're sure the user is not authenticated
    if (!authLoading && !isAuthenticated) {
      window.location.href = '/';
      return;
    }

    // If authenticated but not a student, redirect
    if (!authLoading && isAuthenticated && user && user.role !== 'student') {
      window.location.href = '/';
      return;
    }
  }, [user, authLoading, isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium text-lg animate-pulse">Loading your adventure...</p>
          <div className="mt-4 text-4xl animate-bounce">🚀</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== 'student') {
    return null; // Will redirect
  }

  return (
    <StudentLayout>
      <StudentDashboard />
    </StudentLayout>
  );
}


