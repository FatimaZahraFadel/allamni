import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { dashboardAPI, classesAPI, assignmentsAPI } from '../../services/api';
import TeacherLayout from '../../components/teacher/TeacherLayout';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function AnalyticsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [classPerformance, setClassPerformance] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user || user.role !== 'teacher')) {
      window.location.href = '/';
      return;
    }

    if (isAuthenticated && user && user.role === 'teacher') {
      fetchAnalyticsData();
    }
  }, [user, isAuthenticated, authLoading]);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const data = await dashboardAPI.getTeacherDashboard();
      setDashboardData(data);
      setClassPerformance(data.class_performance || []);
      setRecentActivities(data.recent_activities || []);
    } catch (err) {
      console.error('Failed to fetch analytics data:', err);
      setError('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPerformanceIcon = (percentage) => {
    if (percentage >= 70) {
      return <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />;
    } else {
      return <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />;
    }
  };

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
    return null;
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Track performance and insights across your classes</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="btn-secondary">
              Export Report
            </button>
            <button className="btn-primary">
              Generate Insights
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            {dashboardData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-blue-100">
                      <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Total Classes</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardData.total_classes}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-purple-100">
                      <UsersIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Total Students</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardData.total_students}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-orange-100">
                      <DocumentTextIcon className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Assignments</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardData.total_assignments}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-yellow-100">
                      <ClockIcon className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Pending Reviews</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardData.pending_submissions}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Class Performance */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ChartBarIcon className="h-6 w-6 mr-2 text-primary-600" />
                  Class Performance Overview
                </h3>
              </div>
              <div className="p-6">
                {classPerformance.length > 0 ? (
                  <div className="space-y-4">
                    {classPerformance.map((classData, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <AcademicCapIcon className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{classData.class_name}</h4>
                            <p className="text-sm text-gray-500">
                              {classData.student_count} students • {classData.assignment_count} assignments
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              {getPerformanceIcon(classData.average_score)}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(classData.average_score)}`}>
                                {classData.average_score}% avg
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {classData.completion_rate}% completion
                            </p>
                          </div>
                          <button className="btn-secondary text-sm">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No performance data available yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Data will appear as students complete assignments
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              </div>
              <div className="p-6">
                {recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-gray-900">{activity.class_name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No recent activities</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Activities will appear as you and your students interact with the platform
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Performance Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performing Classes */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <ArrowTrendingUpIcon className="h-6 w-6 mr-2 text-green-600" />
                    Top Performing Classes
                  </h3>
                </div>
                <div className="p-6">
                  {classPerformance.length > 0 ? (
                    <div className="space-y-3">
                      {classPerformance
                        .sort((a, b) => b.average_score - a.average_score)
                        .slice(0, 3)
                        .map((classData, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                index === 1 ? 'bg-gray-100 text-gray-800' :
                                'bg-orange-100 text-orange-800'
                              }`}>
                                {index + 1}
                              </div>
                              <span className="font-medium text-gray-900">{classData.class_name}</span>
                            </div>
                            <span className="text-sm font-medium text-green-600">
                              {classData.average_score}%
                            </span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No data available</p>
                  )}
                </div>
              </div>

              {/* Areas for Improvement */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <ArrowTrendingDownIcon className="h-6 w-6 mr-2 text-red-600" />
                    Areas for Improvement
                  </h3>
                </div>
                <div className="p-6">
                  {classPerformance.length > 0 ? (
                    <div className="space-y-3">
                      {classPerformance
                        .sort((a, b) => a.average_score - b.average_score)
                        .slice(0, 3)
                        .map((classData, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-red-100 text-red-800 flex items-center justify-center text-sm font-bold">
                                !
                              </div>
                              <span className="font-medium text-gray-900">{classData.class_name}</span>
                            </div>
                            <span className="text-sm font-medium text-red-600">
                              {classData.average_score}%
                            </span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No data available</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </TeacherLayout>
  );
}
