import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dashboardAPI, schoolsAPI, classesAPI, assignmentsAPI } from '../../services/api';
import {
  BuildingOfficeIcon,
  AcademicCapIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [recentClasses, setRecentClasses] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch dashboard stats
        const [stats, classes, assignments] = await Promise.all([
          dashboardAPI.getTeacherDashboard(),
          classesAPI.getClasses(),
          assignmentsAPI.getAssignments()
        ]);

        setDashboardData(stats);
        setRecentClasses(classes.slice(0, 5)); // Show 5 most recent classes
        setRecentAssignments(assignments.slice(0, 5)); // Show 5 most recent assignments
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Schools',
      value: dashboardData?.total_schools || 0,
      icon: BuildingOfficeIcon,
      color: 'bg-blue-500',
      href: '/teacher/schools'
    },
    {
      name: 'Classes',
      value: dashboardData?.total_classes || 0,
      icon: AcademicCapIcon,
      color: 'bg-green-500',
      href: '/teacher/classes'
    },
    {
      name: 'Students',
      value: dashboardData?.total_students || 0,
      icon: UsersIcon,
      color: 'bg-purple-500',
      href: '/teacher/students'
    },
    {
      name: 'Assignments',
      value: dashboardData?.total_assignments || 0,
      icon: DocumentTextIcon,
      color: 'bg-orange-500',
      href: '/teacher/assignments'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your classes today.
            </p>
          </div>
          <div className="flex space-x-3">
            <Link to="/teacher/classes" className="btn-secondary">
              <PlusIcon className="h-5 w-5 mr-2" />
              New Class
            </Link>
            <Link to="/teacher/assignments" className="btn-primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              New Assignment
            </Link>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to={stat.href}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
              >
                View all
                <EyeIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Classes */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Classes</h3>
              <Link to="/teacher/classes" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentClasses.length > 0 ? (
              <div className="space-y-4">
                {recentClasses.map((classItem) => (
                  <div key={classItem.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <AcademicCapIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{classItem.name}</p>
                        <p className="text-sm text-gray-500">{classItem.school_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{classItem.student_count || 0} students</p>
                      <p className="text-xs text-gray-500">Grade {classItem.grade_level}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No classes yet</p>
                <Link to="/teacher/classes" className="mt-2 text-primary-600 hover:text-primary-700 font-medium">
                  Create your first class
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Assignments</h3>
              <Link to="/teacher/assignments" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentAssignments.length > 0 ? (
              <div className="space-y-4">
                {recentAssignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <DocumentTextIcon className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{assignment.title}</p>
                        <p className="text-sm text-gray-500">{assignment.class_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        {assignment.status === 'active' ? (
                          <ClockIcon className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        )}
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {assignment.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Due: {new Date(assignment.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No assignments yet</p>
                <Link to="/teacher/assignments" className="mt-2 text-primary-600 hover:text-primary-700 font-medium">
                  Create your first assignment
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/teacher/schools" className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200 text-center block">
            <BuildingOfficeIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Add School</p>
            <p className="text-sm text-gray-500">Create a new school</p>
          </Link>

          <Link to="/teacher/classes" className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200 text-center block">
            <AcademicCapIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Add Class</p>
            <p className="text-sm text-gray-500">Create a new class</p>
          </Link>

          <Link to="/teacher/assignments" className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200 text-center block">
            <DocumentTextIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="font-medium text-gray-900">New Assignment</p>
            <p className="text-sm text-gray-500">Create assignment</p>
          </Link>

          <Link to="/teacher/analytics" className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200 text-center block">
            <ChartBarIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="font-medium text-gray-900">View Analytics</p>
            <p className="text-sm text-gray-500">Check performance</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
