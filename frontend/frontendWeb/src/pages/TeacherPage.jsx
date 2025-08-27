import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { dashboardAPI, schoolsAPI, classesAPI } from '../services/api';
import TeacherLayout from '../components/teacher/TeacherLayout';
import TeacherDashboard from '../components/teacher/TeacherDashboard';

export default function TeacherPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Only redirect if we're sure the user is not authenticated
    if (!authLoading && !isAuthenticated) {
      window.location.href = '/';
      return;
    }

    // If authenticated but not a teacher, redirect
    if (!authLoading && isAuthenticated && user && user.role !== 'teacher') {
      window.location.href = '/';
      return;
    }
  }, [user, authLoading, isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== 'teacher') {
    return null; // Will redirect
  }

  return (
    <TeacherLayout>
      <TeacherDashboard />
    </TeacherLayout>
  );
}
