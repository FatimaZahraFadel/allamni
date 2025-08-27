import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import StudentLayout from '../../components/student/StudentLayout';

export default function AssignmentsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();

  // Authentication check
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
    window.location.href = '/';
    return null;
  }

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full px-6 py-3 mb-4 border-2 border-orange-200">
            <span className="text-2xl">📚</span>
            <span className="text-lg font-bold text-orange-700">
              {t('student.assignments')}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Your School Assignments
          </h1>
          <p className="text-gray-600 text-lg">
            Complete your homework and track your progress!
          </p>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-3xl p-12 border-2 border-gray-100 shadow-lg text-center">
          <div className="text-8xl mb-6">📝</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Assignment Center Coming Soon!</h2>
          <p className="text-gray-600 text-lg mb-8">
            Soon you'll be able to view and complete assignments from your teacher!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="font-bold text-orange-800 mb-2">View Assignments</h3>
              <p className="text-orange-600 text-sm">See all your homework in one place</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold text-green-800 mb-2">Submit Work</h3>
              <p className="text-green-600 text-sm">Upload your completed assignments</p>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
