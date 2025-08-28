import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { assignmentsAPI, submissionsAPI } from '../../services/api';
import StudentLayout from '../../components/student/StudentLayout';
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  UserIcon,
  EyeIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

export default function AssignmentsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user || user.role !== 'student')) {
      window.location.href = '/';
      return;
    }

    if (isAuthenticated && user && user.role === 'student') {
      fetchAssignments();
    }
  }, [user, isAuthenticated, authLoading]);

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Get assignments for student's classes and their submissions
      const [assignmentsData, submissionsData] = await Promise.all([
        assignmentsAPI.getStudentAssignments(),
        submissionsAPI.getSubmissions()
      ]);

      // Enhance assignments with submission status
      const enhancedAssignments = assignmentsData.map(assignment => {
        const submission = submissionsData.find(sub => sub.assignment_id === assignment.id);
        return {
          ...assignment,
          submission,
          status: getAssignmentStatus(assignment, submission)
        };
      });

      setAssignments(enhancedAssignments);
      setSubmissions(submissionsData);
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
      setError(`Failed to load assignments: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getAssignmentStatus = (assignment, submission) => {
    if (submission) {
      if (submission.is_graded) return 'graded';
      return 'submitted';
    }
    if (assignment.due_date && new Date(assignment.due_date) < new Date()) {
      return 'overdue';
    }
    return 'pending';
  };

  const handleSubmitAssignment = async (assignmentId) => {
    try {
      setIsSubmitting(true);
      setError('');

      if (selectedFile) {
        // Handle file upload
        const formData = new FormData();
        formData.append('file', selectedFile);
        await submissionsAPI.uploadSubmission(assignmentId, formData);
      } else if (submissionText.trim()) {
        // Handle text submission
        await submissionsAPI.submitAssignment(assignmentId, {
          content: submissionText
        });
      } else {
        setError('Please provide either text content or upload a file');
        return;
      }

      setSelectedAssignment(null);
      setSubmissionText('');
      setSelectedFile(null);
      await fetchAssignments(); // Refresh assignments
    } catch (err) {
      console.error('Failed to submit assignment:', err);
      setError('Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'blue';
      case 'submitted': return 'green';
      case 'overdue': return 'red';
      case 'graded': return 'purple';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return ClockIcon;
      case 'submitted': return CheckCircleIcon;
      case 'overdue': return ExclamationTriangleIcon;
      case 'graded': return CheckCircleIcon;
      default: return DocumentTextIcon;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate, status) => {
    return new Date(dueDate) < new Date() && status === 'pending';
  };

  const handleSubmit = (assignmentId) => {
    handleSubmitAssignment(assignmentId);
  };

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

        {/* Assignment Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200 text-center">
            <div className="text-3xl mb-2">📋</div>
            <div className="text-2xl font-bold text-blue-700">{assignments.length}</div>
            <div className="text-sm text-blue-600 font-medium">Total Assignments</div>
          </div>
          <div className="bg-yellow-50 rounded-2xl p-4 border-2 border-yellow-200 text-center">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-2xl font-bold text-yellow-700">
              {assignments.filter(a => a.status === 'pending').length}
            </div>
            <div className="text-sm text-yellow-600 font-medium">Pending</div>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200 text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-700">
              {assignments.filter(a => a.status === 'submitted').length}
            </div>
            <div className="text-sm text-green-600 font-medium">Submitted</div>
          </div>
          <div className="bg-red-50 rounded-2xl p-4 border-2 border-red-200 text-center">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="text-2xl font-bold text-red-700">
              {assignments.filter(a => a.status === 'overdue').length}
            </div>
            <div className="text-sm text-red-600 font-medium">Overdue</div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Assignments List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : selectedAssignment ? (
          /* Assignment Detail View */
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{selectedAssignment.title}</h2>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="text-gray-500 hover:text-gray-700 font-medium"
              >
                ← Back to assignments
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedAssignment.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Instructions</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedAssignment.instructions}</p>
                  </div>

                  {selectedAssignment.status === 'pending' && (
                    <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <PaperAirplaneIcon className="h-6 w-6 text-blue-600 mr-2" />
                        Submit Your Work
                      </h3>

                      {/* Text Submission */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Written Response
                        </label>
                        <textarea
                          value={submissionText}
                          onChange={(e) => setSubmissionText(e.target.value)}
                          placeholder="Type your assignment submission here..."
                          className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none resize-none"
                        />
                        <div className="text-sm text-gray-500 mt-1">
                          {submissionText.length} characters
                        </div>
                      </div>

                      {/* File Upload */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload File (Optional)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                          <input
                            type="file"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                          />
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex flex-col items-center"
                          >
                            <DocumentTextIcon className="h-12 w-12 text-gray-400 mb-2" />
                            <span className="text-sm font-medium text-gray-600">
                              Click to upload a file
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              PDF, DOC, TXT, or Image files
                            </span>
                          </label>
                        </div>
                        {selectedFile && (
                          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-700">
                              Selected: {selectedFile.name}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          {submissionText.trim() || selectedFile ? 'Ready to submit' : 'Please provide text or upload a file'}
                        </div>
                        <button
                          onClick={() => handleSubmit(selectedAssignment.id)}
                          disabled={!submissionText.trim() && !selectedFile || isSubmitting}
                          className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl py-3 px-6 font-bold hover:from-green-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              <span>Submitting...</span>
                            </>
                          ) : (
                            <>
                              <PaperAirplaneIcon className="h-5 w-5" />
                              <span>Submit Assignment</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {(selectedAssignment.status === 'submitted' || selectedAssignment.status === 'graded') && selectedAssignment.submission && (
                    <div className="space-y-4">
                      {/* Submission Status */}
                      <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                        <h3 className="text-lg font-bold text-blue-800 mb-2 flex items-center">
                          <CheckCircleIcon className="h-6 w-6 text-blue-600 mr-2" />
                          Your Submission
                        </h3>
                        <p className="text-blue-700 mb-2">
                          Submitted on: {new Date(selectedAssignment.submission?.submitted_at).toLocaleDateString()}
                        </p>
                        {selectedAssignment.submission?.text_content && (
                          <div className="bg-white rounded-lg p-4 border border-blue-200">
                            <p className="text-gray-700">{selectedAssignment.submission.text_content}</p>
                          </div>
                        )}
                        {selectedAssignment.submission?.file_url && (
                          <div className="bg-white rounded-lg p-4 border border-blue-200 mt-2">
                            <p className="text-gray-700">📎 File submitted</p>
                          </div>
                        )}
                      </div>

                      {/* Teacher Feedback */}
                      {selectedAssignment.submission?.is_graded && (
                        <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                          <h3 className="text-lg font-bold text-green-800 mb-2 flex items-center">
                            <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
                            Teacher Evaluation
                          </h3>

                          {selectedAssignment.submission?.grade !== null && selectedAssignment.submission?.grade !== undefined && (
                            <div className="mb-4 flex items-center space-x-2">
                              <span className="text-green-800 font-bold">Grade:</span>
                              <span className="text-3xl font-bold text-green-600">
                                {selectedAssignment.submission?.grade}/{selectedAssignment.max_points}
                              </span>
                              <span className="text-green-700">
                                ({Math.round((selectedAssignment.submission?.grade / selectedAssignment.max_points) * 100)}%)
                              </span>
                            </div>
                          )}

                          {selectedAssignment.submission?.feedback && (
                            <div className="bg-white rounded-lg p-4 border border-green-200">
                              <h4 className="font-medium text-green-800 mb-2">Feedback:</h4>
                              <p className="text-green-700">{selectedAssignment.submission.feedback}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-3">Assignment Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <DocumentTextIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Type: {selectedAssignment.assignment_type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        Due: {selectedAssignment.due_date
                          ? formatDate(selectedAssignment.due_date)
                          : 'No due date'
                        }
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Points: {selectedAssignment.max_points}</span>
                    </div>
                  </div>
                </div>

                <div className={`bg-${getStatusColor(selectedAssignment.status)}-50 rounded-2xl p-4 border-2 border-${getStatusColor(selectedAssignment.status)}-200`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {(() => {
                      const StatusIcon = getStatusIcon(selectedAssignment.status);
                      return <StatusIcon className={`h-5 w-5 text-${getStatusColor(selectedAssignment.status)}-600`} />;
                    })()}
                    <span className={`font-bold text-${getStatusColor(selectedAssignment.status)}-800 capitalize`}>
                      {selectedAssignment.status}
                    </span>
                  </div>
                  {selectedAssignment.submission?.submitted_at && (
                    <p className={`text-${getStatusColor(selectedAssignment.status)}-600 text-sm`}>
                      Submitted on {formatDate(selectedAssignment.submission?.submitted_at)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : assignments.length === 0 ? (
          /* No Assignments */
          <div className="text-center py-12">
            <div className="text-8xl mb-6">📚</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Assignments Yet</h2>
            <p className="text-gray-600 mb-8">
              Your teacher hasn't assigned any homework yet. Check back later!
            </p>
            <button
              onClick={fetchAssignments}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Refresh
            </button>
          </div>
        ) : (
          /* Assignments Grid */
          <div className="space-y-4">
            {assignments.map((assignment) => {
              const StatusIcon = getStatusIcon(assignment.status);
              const statusColor = getStatusColor(assignment.status);
              const overdue = isOverdue(assignment.due_date, assignment.status);

              return (
                <div
                  key={assignment.id}
                  className={`bg-white rounded-2xl p-6 border-2 ${overdue ? 'border-red-200 bg-red-50' : 'border-gray-100'} shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer`}
                  onClick={() => setSelectedAssignment(assignment)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{assignment.title}</h3>
                        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full bg-${statusColor}-100 border border-${statusColor}-200`}>
                          <StatusIcon className={`h-4 w-4 text-${statusColor}-600`} />
                          <span className={`text-${statusColor}-700 font-medium text-sm capitalize`}>
                            {assignment.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">{assignment.description}</p>

                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>
                            {assignment.due_date
                              ? `Due ${formatDate(assignment.due_date)}`
                              : 'No due date'
                            }
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>{assignment.max_points} points</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="capitalize">{assignment.assignment_type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {assignment.submission?.grade !== null && assignment.submission?.grade !== undefined && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {assignment.submission?.grade}/{assignment.max_points}
                          </div>
                          <div className="text-xs text-gray-500">Grade</div>
                        </div>
                      )}
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
