import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { submissionsAPI, assignmentsAPI } from '../../services/api';
import TeacherLayout from '../../components/teacher/TeacherLayout';
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  EyeIcon,
  StarIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export default function SubmissionsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user || user.role !== 'teacher')) {
      window.location.href = '/';
      return;
    }

    if (isAuthenticated && user && user.role === 'teacher') {
      fetchData();
    }
  }, [user, isAuthenticated, authLoading]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [submissionsData, assignmentsData] = await Promise.all([
        submissionsAPI.getSubmissions(),
        assignmentsAPI.getAssignments()
      ]);
      setSubmissions(submissionsData);
      setAssignments(assignmentsData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const assignmentMatch = selectedAssignment === 'all' || submission.assignment_id === parseInt(selectedAssignment);
    const statusMatch = selectedStatus === 'all' || 
      (selectedStatus === 'graded' && submission.is_graded) ||
      (selectedStatus === 'pending' && !submission.is_graded);
    
    return assignmentMatch && statusMatch;
  });

  const getStatusIcon = (submission) => {
    if (submission.is_graded) {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    } else {
      return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = (submission) => {
    return submission.is_graded ? 'Graded' : 'Pending';
  };

  const getStatusColor = (submission) => {
    return submission.is_graded 
      ? 'text-green-600 bg-green-100' 
      : 'text-yellow-600 bg-yellow-100';
  };

  const getGradeDisplay = (submission) => {
    if (!submission.is_graded) return 'Not graded';
    return `${submission.points_earned || 0}/${submission.assignment_max_points || 0}`;
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
            <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
            <p className="text-gray-600">Review and grade student submissions</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">
              {filteredSubmissions.length} submission{filteredSubmissions.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Assignment
              </label>
              <select
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Assignments</option>
                {assignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Review</option>
                <option value="graded">Graded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Submissions List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredSubmissions.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-2 bg-purple-100 rounded-lg mr-3">
                            <UserIcon className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {submission.student_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: #{submission.student_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {submission.assignment_title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {submission.assignment_type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {new Date(submission.submitted_at).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(submission.submitted_at).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(submission)}
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission)}`}>
                            {getStatusText(submission)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {getGradeDisplay(submission)}
                        </div>
                        {submission.is_graded && submission.feedback && (
                          <div className="flex items-center text-sm text-gray-500">
                            <StarIcon className="h-4 w-4 mr-1" />
                            Feedback given
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-primary-600 hover:text-primary-900">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          {!submission.is_graded && (
                            <button className="text-green-600 hover:text-green-900">
                              <CheckCircleIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <ClipboardDocumentListIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedAssignment !== 'all' || selectedStatus !== 'all' 
                ? 'No submissions match your filters' 
                : 'No submissions yet'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedAssignment !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your filter settings'
                : 'Submissions will appear here when students complete assignments'
              }
            </p>
            {(selectedAssignment !== 'all' || selectedStatus !== 'all') && (
              <button
                onClick={() => {
                  setSelectedAssignment('all');
                  setSelectedStatus('all');
                }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Summary Stats */}
        {filteredSubmissions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-100">
                  <ClockIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredSubmissions.filter(s => !s.is_graded).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Graded</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredSubmissions.filter(s => s.is_graded).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredSubmissions.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
