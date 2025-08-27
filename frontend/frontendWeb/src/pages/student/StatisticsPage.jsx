import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import StudentLayout from '../../components/student/StudentLayout';
import {
  ChartBarIcon,
  TrophyIcon,
  ClockIcon,
  StarIcon,
  FireIcon,
  AcademicCapIcon,
  CalendarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function StatisticsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        // Mock data for now - replace with actual API call
        const mockStats = {
          overview: {
            total_points: 1250,
            level: 5,
            assignments_completed: 15,
            assignments_pending: 3,
            streak_days: 7,
            badges_earned: 12,
            time_spent_minutes: 420,
            accuracy_percentage: 87
          },
          weekly_progress: {
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            points: [120, 150, 80, 200, 180, 90, 130],
            time_spent: [45, 60, 30, 75, 65, 35, 50]
          },
          subject_performance: {
            writing: { score: 85, exercises: 25, improvement: '+12%' },
            reading: { score: 92, exercises: 18, improvement: '+8%' },
            grammar: { score: 78, exercises: 22, improvement: '+15%' },
            vocabulary: { score: 89, exercises: 20, improvement: '+5%' }
          },
          recent_achievements: [
            { id: 1, title: 'Writing Master', emoji: '✏️', date: '2024-01-15', points: 100 },
            { id: 2, title: 'Speed Reader', emoji: '📚', date: '2024-01-14', points: 75 },
            { id: 3, title: 'Grammar Guru', emoji: '📝', date: '2024-01-13', points: 50 }
          ],
          monthly_goals: {
            current_month: 'January',
            points_goal: 2000,
            points_achieved: 1250,
            assignments_goal: 20,
            assignments_completed: 15,
            streak_goal: 15,
            current_streak: 7
          }
        };
        
        setStatsData(mockStats);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchStatistics();
    }
  }, [isAuthenticated, user, selectedPeriod]);

  if (authLoading || isLoading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your statistics...</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <StudentLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to view statistics</h2>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 mb-4 border-2 border-blue-200">
            <ChartBarIcon className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold text-blue-700">
              {t('student.statistics')}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Your Learning Journey
          </h1>
          <p className="text-gray-600 text-lg">
            Track your progress and celebrate your achievements!
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl p-2 border-2 border-gray-200 shadow-sm">
            {['week', 'month', 'all'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedPeriod === period
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Stats */}
        {statsData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-4 border-2 border-yellow-200 text-center">
              <StarIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-700">{statsData.overview.total_points}</div>
              <div className="text-sm text-yellow-600 font-medium">Total Points</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border-2 border-blue-200 text-center">
              <TrophyIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">{statsData.overview.level}</div>
              <div className="text-sm text-blue-600 font-medium">Current Level</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border-2 border-green-200 text-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">{statsData.overview.assignments_completed}</div>
              <div className="text-sm text-green-600 font-medium">Completed</div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 border-2 border-orange-200 text-center">
              <FireIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-700">{statsData.overview.streak_days}</div>
              <div className="text-sm text-orange-600 font-medium">Day Streak</div>
            </div>
          </div>
        )}

        {/* Subject Performance */}
        {statsData && (
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <AcademicCapIcon className="h-8 w-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">Subject Performance</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(statsData.subject_performance).map(([subject, data]) => (
                <div key={subject} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-purple-800 capitalize mb-2">{subject}</h3>
                    <div className="text-3xl font-bold text-purple-700 mb-1">{data.score}%</div>
                    <div className="text-sm text-purple-600 mb-2">{data.exercises} exercises</div>
                    <div className="inline-flex items-center space-x-1 bg-green-100 rounded-full px-3 py-1">
                      <span className="text-green-600 text-xs font-bold">{data.improvement}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Goals */}
        {statsData && (
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <CalendarIcon className="h-8 w-8 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-800">Monthly Goals - {statsData.monthly_goals.current_month}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Points Goal */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border-2 border-indigo-200">
                <h3 className="text-lg font-bold text-indigo-800 mb-4">Points Goal</h3>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-blue-600 h-4 rounded-full transition-all duration-1000"
                      style={{ width: `${(statsData.monthly_goals.points_achieved / statsData.monthly_goals.points_goal) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-indigo-600">
                    <span>{statsData.monthly_goals.points_achieved}</span>
                    <span>{statsData.monthly_goals.points_goal}</span>
                  </div>
                </div>
              </div>

              {/* Assignments Goal */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                <h3 className="text-lg font-bold text-green-800 mb-4">Assignments Goal</h3>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-4 rounded-full transition-all duration-1000"
                      style={{ width: `${(statsData.monthly_goals.assignments_completed / statsData.monthly_goals.assignments_goal) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>{statsData.monthly_goals.assignments_completed}</span>
                    <span>{statsData.monthly_goals.assignments_goal}</span>
                  </div>
                </div>
              </div>

              {/* Streak Goal */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
                <h3 className="text-lg font-bold text-orange-800 mb-4">Streak Goal</h3>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-600 h-4 rounded-full transition-all duration-1000"
                      style={{ width: `${(statsData.monthly_goals.current_streak / statsData.monthly_goals.streak_goal) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-orange-600">
                    <span>{statsData.monthly_goals.current_streak}</span>
                    <span>{statsData.monthly_goals.streak_goal}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Achievements */}
        {statsData && (
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <TrophyIcon className="h-8 w-8 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-800">Recent Achievements</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {statsData.recent_achievements.map((achievement) => (
                <div key={achievement.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200 text-center">
                  <div className="text-4xl mb-3">{achievement.emoji}</div>
                  <h3 className="font-bold text-yellow-800 mb-1">{achievement.title}</h3>
                  <div className="text-sm text-yellow-600 mb-2">{new Date(achievement.date).toLocaleDateString()}</div>
                  <div className="inline-flex items-center space-x-1 bg-yellow-100 rounded-full px-3 py-1">
                    <StarIcon className="h-4 w-4 text-yellow-600" />
                    <span className="text-yellow-700 text-sm font-bold">+{achievement.points} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
