import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { dashboardAPI } from '../../services/api';
import {
  PencilIcon,
  MicrophoneIcon,
  TrophyIcon,
  DocumentTextIcon,
  StarIcon,
  FireIcon,
  SparklesIcon,
  HeartIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // For now, use mock data since we don't have student dashboard API yet
        const mockData = {
          total_points: 1250,
          level: 5,
          streak_days: 7,
          badges_earned: 12,
          assignments_completed: 8,
          assignments_pending: 3,
          weekly_goal: 1500,
          weekly_progress: 1250,
          next_level_points: 1500,
          recent_achievements: [
            { id: 1, title: t('student.writingMaster'), emoji: '✏️', earned_at: '2024-01-15', description: t('student.completedWritingExercises') },
            { id: 2, title: t('student.speedReader'), emoji: '📚', earned_at: '2024-01-14', description: t('student.readTextsInRecordTime') },
            { id: 3, title: t('student.grammarGuru'), emoji: '📝', earned_at: '2024-01-13', description: t('student.perfectGrammarScore') }
          ],
          daily_streak: {
            current: 7,
            best: 15,
            days: [
              t('student.monday').substring(0, 3),
              t('student.tuesday').substring(0, 3),
              t('student.wednesday').substring(0, 3),
              t('student.thursday').substring(0, 3),
              t('student.friday').substring(0, 3),
              t('student.saturday').substring(0, 3),
              t('student.sunday').substring(0, 3)
            ],
            completed: [true, true, true, true, true, true, true]
          }
        };
        setDashboardData(mockData);
        
        // Removed confetti animation on load for better UX
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium text-lg animate-pulse">Loading your adventure...</p>
          <div className="mt-4 text-4xl animate-bounce">🚀</div>
        </div>
      </div>
    );
  }

  const mainActivities = [
    {
      title: t('student.writeAndFix'),
      description: t('student.uploadImageAndGetFeedback'),
      emoji: '✏️',
      href: '/student/write-fix',
      gradient: 'from-blue-400 to-blue-600',
      hoverGradient: 'from-blue-500 to-blue-700',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      title: t('student.dictationAndReading'),
      description: t('student.practiceListeningAndSpeaking'),
      emoji: '🎤',
      href: '/student/dictation',
      gradient: 'from-green-400 to-green-600',
      hoverGradient: 'from-green-500 to-green-700',
      bgGradient: 'from-green-50 to-green-100'
    },
    {
      title: t('student.miniQuests'),
      description: t('student.completeShortLearningChallenges'),
      emoji: '🎯',
      href: '/student/quests',
      gradient: 'from-purple-400 to-purple-600',
      hoverGradient: 'from-purple-500 to-purple-700',
      bgGradient: 'from-purple-50 to-purple-100'
    },
    {
      title: t('student.assignments'),
      description: t('student.viewAndCompleteAssignments'),
      emoji: '📚',
      href: '/student/assignments',
      gradient: 'from-orange-400 to-orange-600',
      hoverGradient: 'from-orange-500 to-orange-700',
      bgGradient: 'from-orange-50 to-orange-100'
    }
  ];

  return (
    <div className="space-y-8">


      {/* Welcome Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full px-6 py-3 mb-4 border-2 border-yellow-200">
          <span className="text-2xl animate-pulse">👋</span>
          <span className="text-lg font-bold text-orange-700">
            {t('student.welcomeBack')}, {user?.name || 'Champion'}!
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          {t('student.readyForAdventure')}
        </h1>
        <p className="text-gray-600 text-lg">
          {t('student.chooseActivityToStart')}
        </p>
      </div>

      {/* Level Progress Bar */}
      {dashboardData && (
        <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl border-4 border-white shadow-lg">
                {dashboardData.level}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{t('student.level')} {dashboardData.level}</h3>
                <p className="text-gray-600">
                  {dashboardData.next_level_points - dashboardData.total_points} {t('student.xpToNextLevel')} {dashboardData.level + 1}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{dashboardData.total_points} XP</div>
              <div className="text-sm text-gray-500">{t('student.totalPointsLabel')}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${(dashboardData.total_points / dashboardData.next_level_points) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{t('student.level')} {dashboardData.level}</span>
              <span>{t('student.level')} {dashboardData.level + 1}</span>
            </div>
          </div>
        </div>
      )}

      {/* Progress Stats */}
      {dashboardData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-4 border-2 border-yellow-200 text-center transform hover:scale-105 transition-all duration-200 relative overflow-hidden">
            <div className="absolute top-1 right-1 text-yellow-300 opacity-50">
              <SparklesIcon className="h-6 w-6" />
            </div>
            <div className="text-3xl mb-2 animate-bounce">⭐</div>
            <div className="text-2xl font-bold text-yellow-700">{dashboardData.total_points}</div>
            <div className="text-sm text-yellow-600 font-medium">{t('student.totalPoints')}</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border-2 border-blue-200 text-center transform hover:scale-105 transition-all duration-200 relative overflow-hidden">
            <div className="absolute top-1 right-1 text-blue-300 opacity-50">
              <SparklesIcon className="h-6 w-6" />
            </div>
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-blue-700">{dashboardData.level}</div>
            <div className="text-sm text-blue-600 font-medium">{t('student.currentLevel')}</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 border-2 border-orange-200 text-center transform hover:scale-105 transition-all duration-200 relative overflow-hidden">
            <div className="absolute top-1 right-1 text-orange-300 opacity-50">
              <FireIcon className="h-6 w-6" />
            </div>
            <div className="text-3xl mb-2 animate-pulse">🔥</div>
            <div className="text-2xl font-bold text-orange-700">{dashboardData.streak_days}</div>
            <div className="text-sm text-orange-600 font-medium">{t('student.dayStreak')}</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border-2 border-purple-200 text-center transform hover:scale-105 transition-all duration-200 relative overflow-hidden">
            <div className="absolute top-1 right-1 text-purple-300 opacity-50">
              <SparklesIcon className="h-6 w-6" />
            </div>
            <div className="text-3xl mb-2">🎖️</div>
            <div className="text-2xl font-bold text-purple-700">{dashboardData.badges_earned}</div>
            <div className="text-sm text-purple-600 font-medium">{t('student.badgesEarned')}</div>
          </div>
        </div>
      )}

      {/* Weekly Goal Progress */}
      {dashboardData && (
        <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-3xl">🎯</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{t('student.weeklyGoal')}</h3>
              <p className="text-gray-600">{dashboardData.weekly_progress} / {dashboardData.weekly_goal} XP</p>
            </div>
          </div>

          <div className="relative mb-4">
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-6 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                style={{ width: `${Math.min((dashboardData.weekly_progress / dashboardData.weekly_goal) * 100, 100)}%` }}
              >
                <span className="text-white text-xs font-bold">
                  {Math.round((dashboardData.weekly_progress / dashboardData.weekly_goal) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Daily Streak Visualization */}
          <div className="grid grid-cols-7 gap-2">
            {dashboardData.daily_streak.days.map((day, index) => (
              <div key={day} className="flex flex-col items-center space-y-2">
                <div className="text-xs text-gray-500 font-medium">{day}</div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 mx-auto ${
                  dashboardData.daily_streak.completed[index]
                    ? 'bg-green-500 text-white shadow-lg transform scale-110'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {dashboardData.daily_streak.completed[index] ? '✓' : '○'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mainActivities.map((activity, index) => (
          <Link
            key={activity.href}
            to={activity.href}
            className={`group relative bg-gradient-to-br ${activity.bgGradient} rounded-3xl p-8 border-3 border-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden`}
          >
            {/* Background decoration */}
            <div className="absolute top-4 right-4 text-6xl opacity-20 group-hover:opacity-30 transition-opacity duration-300">
              {activity.emoji}
            </div>
            
            {/* Sparkle effects */}
            <div className="absolute top-2 left-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <SparklesIcon className="h-6 w-6 animate-pulse" />
            </div>
            <div className="absolute bottom-2 right-2 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              <SparklesIcon className="h-4 w-4 animate-pulse" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${activity.gradient} group-hover:bg-gradient-to-r group-hover:${activity.hoverGradient} rounded-2xl flex items-center justify-center text-3xl shadow-lg transform group-hover:rotate-12 transition-all duration-300`}>
                  {activity.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-200">
                    {activity.title}
                  </h3>
                  <div className="flex items-center space-x-1 mt-1">
                    <StarIcon className="h-4 w-4 text-yellow-500" />
                    <StarIcon className="h-4 w-4 text-yellow-500" />
                    <StarIcon className="h-4 w-4 text-yellow-500" />
                    <StarIcon className="h-4 w-4 text-gray-300" />
                    <StarIcon className="h-4 w-4 text-gray-300" />
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {activity.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BoltIcon className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">+50 XP</span>
                </div>
                <div className={`px-4 py-2 bg-gradient-to-r ${activity.gradient} text-white rounded-full text-sm font-bold shadow-md group-hover:shadow-lg transform group-hover:scale-110 transition-all duration-200`}>
                  {t('student.startNow')} →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Achievements */}
      {dashboardData?.recent_achievements && (
        <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="text-3xl animate-bounce">🏆</div>
            <h2 className="text-2xl font-bold text-gray-800">{t('student.recentAchievements')}</h2>
            <div className="flex-1"></div>
            <div className="flex space-x-1">
              <div className="text-2xl animate-pulse">✨</div>
              <div className="text-2xl animate-pulse delay-100">⭐</div>
              <div className="text-2xl animate-pulse delay-200">🌟</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dashboardData.recent_achievements.map((achievement, index) => (
              <div
                key={achievement.id}
                className="group bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl relative overflow-hidden cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Sparkle effect on hover */}
                <div className="absolute top-2 right-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <SparklesIcon className="h-5 w-5 animate-spin" />
                </div>
                <div className="absolute bottom-2 left-2 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  <SparklesIcon className="h-4 w-4 animate-ping" />
                </div>

                <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                  {achievement.emoji}
                </div>
                <h3 className="font-bold text-gray-800 mb-2 text-lg group-hover:text-yellow-700 transition-colors duration-200">
                  {achievement.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                  {achievement.description}
                </p>
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>{new Date(achievement.earned_at).toLocaleDateString()}</span>
                </div>

                {/* Badge glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* View All Achievements Button */}
          <div className="mt-6 text-center">
            <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl py-3 px-6 font-bold hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
              <TrophyIcon className="h-5 w-5" />
              <span>View All Achievements</span>
              <div className="text-lg">🏆</div>
            </button>
          </div>
        </div>
      )}

      {/* Daily Tip & Motivation */}
      <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 rounded-3xl p-6 border-2 border-pink-200 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-3xl animate-bounce">💡</div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {t('student.dailyLearningTip')}
          </h2>
          <div className="flex-1"></div>
          <div className="text-2xl animate-pulse">🌟</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border-2 border-purple-200 mb-4">
          <p className="text-gray-700 text-lg leading-relaxed">
            {t('student.dailyTipText')}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HeartIcon className="h-5 w-5 text-pink-500" />
            <span className="text-pink-600 font-medium">{t('student.youveGotThis')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-sm text-purple-600">{t('student.tipOfTheDay')}</span>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>

      {/* Assignments Summary */}
      {dashboardData && (
        <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="text-3xl">📚</div>
            <h2 className="text-2xl font-bold text-gray-800">{t('student.yourAssignments')}</h2>
            {dashboardData.assignments_pending > 0 && (
              <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                {dashboardData.assignments_pending} {t('student.newAssignments')}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200 transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="text-2xl animate-bounce">✅</div>
                <h3 className="text-lg font-bold text-green-700">{t('student.completed')}</h3>
              </div>
              <div className="text-3xl font-bold text-green-800">{dashboardData.assignments_completed}</div>
              <p className="text-sm text-green-600">{t('student.assignmentsCompleted')}</p>
              <div className="mt-2 flex items-center space-x-1">
                <div className="flex space-x-1">
                  {[...Array(Math.min(dashboardData.assignments_completed, 5))].map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200 transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="text-2xl">⏳</div>
                <h3 className="text-lg font-bold text-blue-700">{t('student.pending')}</h3>
              </div>
              <div className="text-3xl font-bold text-blue-800">{dashboardData.assignments_pending}</div>
              <p className="text-sm text-blue-600">{t('student.assignmentsPending')}</p>
              {dashboardData.assignments_pending > 0 && (
                <div className="mt-2 text-xs text-blue-500 font-medium animate-pulse">
                  {t('student.letsCompleteTogether')}
                </div>
              )}
            </div>
          </div>

          <Link
            to="/student/assignments"
            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl py-4 px-6 font-bold text-lg text-center block hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
            <div className="relative flex items-center justify-center space-x-2">
              <span>{t('student.viewAllAssignments')}</span>
              <div className="text-xl">📋</div>
              <BoltIcon className="h-5 w-5 animate-pulse" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
