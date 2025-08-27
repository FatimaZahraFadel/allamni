import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import StudentLayout from '../../components/student/StudentLayout';

export default function QuestsPage() {
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
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-3 mb-4 border-2 border-purple-200">
            <span className="text-2xl">🎯</span>
            <span className="text-lg font-bold text-purple-700">
              {t('student.miniQuests')}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
            Learning Adventures Await!
          </h1>
          <p className="text-gray-600 text-lg">
            Complete fun challenges and earn amazing rewards!
          </p>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-3xl p-12 border-2 border-gray-100 shadow-lg text-center">
          <div className="text-8xl mb-6">🏗️</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Epic Quests Coming Soon!</h2>
          <p className="text-gray-600 text-lg mb-8">
            Get ready for exciting learning adventures with badges, stars, and rewards!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200">
              <div className="text-4xl mb-3">🧩</div>
              <h3 className="font-bold text-yellow-800 mb-2">Word Puzzles</h3>
              <p className="text-yellow-600 text-sm">Solve fun word challenges</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
              <div className="text-4xl mb-3">🎮</div>
              <h3 className="font-bold text-green-800 mb-2">Grammar Games</h3>
              <p className="text-green-600 text-sm">Learn grammar through play</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="font-bold text-blue-800 mb-2">Daily Challenges</h3>
              <p className="text-blue-600 text-sm">New quests every day</p>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
