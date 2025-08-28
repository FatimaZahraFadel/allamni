import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { assignmentsAPI, submissionsAPI } from '../../services/api';
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
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user || user.role !== 'student')) {
      window.location.href = '/';
      return;
    }

    if (isAuthenticated && user && user.role === 'student') {
      fetchStatistics();
    }
  }, [user, isAuthenticated, authLoading]);

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch real data from backend
      const [assignments, submissions] = await Promise.all([
        assignmentsAPI.getStudentAssignments(),
        submissionsAPI.getSubmissions()
      ]);

      // Calculate statistics from real data
      const completedAssignments = submissions.filter(sub => sub.is_graded);
      const pendingAssignments = assignments.filter(assignment =>
        !submissions.some(sub => sub.assignment_id === assignment.id)
      );

      const totalPoints = completedAssignments.reduce((sum, sub) => sum + (sub.grade || 0), 0);
      const maxPossiblePoints = completedAssignments.reduce((sum, sub) => {
        const assignment = assignments.find(a => a.id === sub.assignment_id);
        return sum + (assignment?.max_points || 0);
      }, 0);

      const accuracyPercentage = maxPossiblePoints > 0
        ? Math.round((totalPoints / maxPossiblePoints) * 100)
        : 0;

      // Calculate weekly progress (mock for now, can be enhanced with real date-based data)
      const weeklyData = generateWeeklyProgress(submissions);

      const calculatedStats = {
          overview: {
            total_points: totalPoints,
            level: Math.floor(totalPoints / 100) + 1, // Simple level calculation
            assignments_completed: completedAssignments.length,
            assignments_pending: pendingAssignments.length,
            streak_days: calculateStreak(submissions),
            badges_earned: calculateBadges(completedAssignments, accuracyPercentage),
            time_spent_minutes: estimateTimeSpent(completedAssignments),
            accuracy_percentage: accuracyPercentage
          },
          weekly_progress: weeklyData,
          subject_performance: calculateSubjectPerformance(assignments, submissions),
          recent_achievements: generateAchievements(completedAssignments, accuracyPercentage),
          monthly_goals: {
            current_month: new Date().toLocaleDateString('en-US', { month: 'long' }),
            points_goal: 500,
            points_achieved: totalPoints,
            assignments_goal: 10,
            assignments_completed: completedAssignments.length,
            streak_goal: 7,
            current_streak: calculateStreak(submissions)
          }
        };

        setStatsData(calculatedStats);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setError('Failed to load statistics');
      } finally {
        setIsLoading(false);
      }
    };

  // Helper functions for calculations
  const calculateStreak = (submissions) => {
    if (!submissions.length) return 0;

    const sortedSubmissions = submissions
      .filter(sub => sub.submitted_at)
      .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) { // Check last 7 days
      const daySubmissions = sortedSubmissions.filter(sub => {
        const subDate = new Date(sub.submitted_at);
        subDate.setHours(0, 0, 0, 0);
        return subDate.getTime() === currentDate.getTime();
      });

      if (daySubmissions.length > 0) {
        streak++;
      } else {
        break;
      }

      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  };

  const calculateBadges = (completedAssignments, accuracy) => {
    let badges = 0;
    if (completedAssignments.length >= 5) badges++;
    if (completedAssignments.length >= 10) badges++;
    if (accuracy >= 80) badges++;
    if (accuracy >= 90) badges++;
    return badges;
  };

  const estimateTimeSpent = (completedAssignments) => {
    // Estimate 15 minutes per assignment
    return completedAssignments.length * 15;
  };

  const generateWeeklyProgress = (submissions) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const points = [];
    const timeSpent = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const daySubmissions = submissions.filter(sub => {
        const subDate = new Date(sub.submitted_at);
        subDate.setHours(0, 0, 0, 0);
        return subDate.getTime() === date.getTime();
      });

      const dayPoints = daySubmissions.reduce((sum, sub) => sum + (sub.grade || 0), 0);
      points.push(dayPoints);
      timeSpent.push(daySubmissions.length * 15); // 15 min per submission
    }

    return { days, points, time_spent: timeSpent };
  };

  const calculateSubjectPerformance = (assignments, submissions) => {
    const subjects = {};

    assignments.forEach(assignment => {
      const type = assignment.assignment_type || 'general';
      if (!subjects[type]) {
        subjects[type] = { total: 0, count: 0, submissions: [] };
      }

      const submission = submissions.find(sub => sub.assignment_id === assignment.id);
      if (submission && submission.is_graded) {
        const score = (submission.grade / assignment.max_points) * 100;
        subjects[type].total += score;
        subjects[type].count++;
        subjects[type].submissions.push(submission);
      }
    });

    const performance = {};
    Object.keys(subjects).forEach(subject => {
      if (subjects[subject].count > 0) {
        performance[subject] = {
          score: Math.round(subjects[subject].total / subjects[subject].count),
          exercises: subjects[subject].count,
          improvement: '+5%' // Placeholder - would need historical data
        };
      }
    });

    return performance;
  };

  const generateAchievements = (completedAssignments, accuracy) => {
    const achievements = [];

    if (completedAssignments.length >= 5) {
      achievements.push({
        id: 1,
        title: 'Assignment Master',
        emoji: '🎯',
        date: new Date().toISOString().split('T')[0],
        points: 50
      });
    }

    if (accuracy >= 90) {
      achievements.push({
        id: 2,
        title: 'Accuracy Expert',
        emoji: '🎯',
        date: new Date().toISOString().split('T')[0],
        points: 75
      });
    }

    if (completedAssignments.length >= 10) {
      achievements.push({
        id: 3,
        title: 'Dedicated Learner',
        emoji: '📚',
        date: new Date().toISOString().split('T')[0],
        points: 100
      });
    }

    return achievements;
  };

  if (authLoading || isLoading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('student.loadingStatistics')}</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <StudentLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('student.pleaseLoginToView')}</h2>
        </div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-red-800 mb-2">{t('student.errorLoadingStatistics')}</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchStatistics()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              {t('student.tryAgain')}
            </button>
          </div>
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
            {t('student.yourLearningJourney')}
          </h1>
          <p className="text-gray-600 text-lg">
            {t('student.trackProgressAndCelebrate')}
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
