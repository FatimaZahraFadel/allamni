import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { assignmentsAPI, submissionsAPI } from '../../services/api';
import TeacherLayout from '../../components/teacher/TeacherLayout';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function AssignmentSubmissionsPage() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeData, setGradeData] = useState({ grade: '', feedback: '' });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user || user.role !== 'teacher')) {
      navigate('/');
      return;
    }

    if (isAuthenticated && user && user.role === 'teacher' && assignmentId) {
      fetchData();
    }
  }, [user, isAuthenticated, authLoading, assignmentId, navigate]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [assignmentResponse, submissionsResponse] = await Promise.all([
        assignmentsAPI.getAssignment(assignmentId),
        submissionsAPI.getSubmissionsByAssignment(assignmentId)
      ]);

      setAssignment(assignmentResponse);
      setSubmissions(submissionsResponse);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load assignment details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGradeSubmission = async (submissionId) => {
    try {
      await submissionsAPI.gradeSubmission(submissionId, gradeData);
      setGradingSubmission(null);
      setGradeData({ grade: '', feedback: '' });
      await fetchData(); // Refresh data
    } catch (err) {
      console.error('Failed to grade submission:', err);
      setError('Failed to grade submission');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'graded':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'late':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || isLoading) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </TeacherLayout>
    );
  }

  if (error) {
    return (
      <TeacherLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </TeacherLayout>
    );
  }

  if (!assignment) {
    return (
      <TeacherLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Assignment not found</h3>
          <button
            onClick={() => navigate('/teacher/assignments')}
            className="btn-primary"
          >
            Back to Assignments
          </button>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/teacher/assignments')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
              <p className="text-gray-600">{assignment.description}</p>
            </div>
          </div>
        </div>

        {/* Assignment Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Max Points</p>
                <p className="text-lg font-bold text-gray-900">{assignment.max_points}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CalendarIcon className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Due Date</p>
                <p className="text-lg font-bold text-gray-900">
                  {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No due date'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <UserIcon className="h-6 w-6 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Submissions</p>
                <p className="text-lg font-bold text-gray-900">{submissions.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Student Submissions</h3>
          </div>
          <div className="p-6">
            {submissions.length > 0 ? (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => navigate(`/teacher/submissions/${submission.id}`)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {submission.student?.name?.charAt(0)?.toUpperCase() || 'S'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{submission.student?.name || 'Unknown Student'}</p>
                          <p className="text-sm text-gray-500">
                            Submitted: {new Date(submission.submitted_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                          {getStatusIcon(submission.status)}
                          <span className="ml-1 capitalize">{submission.status}</span>
                        </span>
                        {submission.grade !== null && (
                          <span className="text-lg font-bold text-gray-900">
                            {submission.grade}/{assignment.max_points}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {submission.content && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Submission:</p>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-700">{submission.content}</p>
                        </div>
                      </div>
                    )}

                    {submission.feedback && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Feedback:</p>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-blue-700">{submission.feedback}</p>
                        </div>
                      </div>
                    )}

                    {gradingSubmission === submission.id ? (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Grade (out of {assignment.max_points})
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={assignment.max_points}
                              value={gradeData.grade}
                              onChange={(e) => setGradeData({ ...gradeData, grade: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Feedback
                            </label>
                            <textarea
                              value={gradeData.feedback}
                              onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter feedback for the student..."
                            />
                          </div>
                        </div>
                        <div className="flex space-x-3 mt-4">
                          <button
                            onClick={() => handleGradeSubmission(submission.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                          >
                            Save Grade
                          </button>
                          <button
                            onClick={() => {
                              setGradingSubmission(null);
                              setGradeData({ grade: '', feedback: '' });
                            }}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <button
                          onClick={() => {
                            setGradingSubmission(submission.id);
                            setGradeData({
                              grade: submission.grade || '',
                              feedback: submission.feedback || ''
                            });
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                        >
                          {submission.grade !== null ? 'Update Grade' : 'Grade Submission'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No submissions yet</p>
            )}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
