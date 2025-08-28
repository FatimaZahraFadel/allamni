import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { submissionsAPI } from '../../services/api';
import TeacherLayout from '../../components/teacher/TeacherLayout';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

export default function SubmissionEvaluationPage() {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [submission, setSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [gradeData, setGradeData] = useState({ grade: '', feedback: '' });
  const [isGrading, setIsGrading] = useState(false);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user || user.role !== 'teacher')) {
      navigate('/');
      return;
    }

    if (isAuthenticated && user && user.role === 'teacher' && submissionId) {
      fetchSubmission();
    }
  }, [user, isAuthenticated, authLoading, submissionId, navigate]);

  const fetchSubmission = async () => {
    try {
      setIsLoading(true);
      const submissionData = await submissionsAPI.getSubmission(submissionId);
      setSubmission(submissionData);
      setGradeData({
        grade: submissionData.grade || '',
        feedback: submissionData.feedback || ''
      });
    } catch (err) {
      console.error('Failed to fetch submission:', err);
      setError('Failed to load submission details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGradeSubmission = async () => {
    try {
      setIsGrading(true);
      const updatedSubmission = await submissionsAPI.gradeSubmission(submissionId, {
        grade: parseFloat(gradeData.grade),
        feedback: gradeData.feedback
      });
      setSubmission(updatedSubmission);
      setError('');
      // Show success message or redirect
      setTimeout(() => {
        navigate('/teacher/submissions');
      }, 2000);
    } catch (err) {
      console.error('Failed to grade submission:', err);
      setError('Failed to save grade');
    } finally {
      setIsGrading(false);
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

  if (error && !submission) {
    return (
      <TeacherLayout>
        <div className="text-center py-12">
          <XCircleIcon className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/teacher/submissions')}
              className="btn-primary"
            >
              Back to Submissions
            </button>
          </div>
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
              onClick={() => navigate('/teacher/submissions')}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Evaluate Submission</h1>
              <p className="text-gray-600">Review and grade student work</p>
            </div>
          </div>
        </div>

        {submission && (
          <>
            {/* Submission Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Student</p>
                    <p className="text-lg font-bold text-gray-900">{submission.student_name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Assignment</p>
                    <p className="text-lg font-bold text-gray-900">{submission.assignment_title}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-6 w-6 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Submitted</p>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(submission.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submission Content */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Submission Content</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{submission.text_content}</p>
                </div>
              </div>

              {/* Grading Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Submission</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade (out of {submission.assignment_max_points})
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={submission.assignment_max_points}
                      value={gradeData.grade}
                      onChange={(e) => setGradeData({ ...gradeData, grade: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter grade"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Feedback
                    </label>
                    <textarea
                      value={gradeData.feedback}
                      onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter feedback for the student..."
                    />
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleGradeSubmission}
                    disabled={isGrading || !gradeData.grade}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isGrading ? 'Saving...' : 'Save Grade'}
                  </button>
                  <button
                    onClick={() => navigate('/teacher/submissions')}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </TeacherLayout>
  );
}
