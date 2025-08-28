import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');

  // Mock assignments data
  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoading(true);
      // Simulate API call with mock data
      setTimeout(() => {
        const mockAssignments = [
          {
            id: 1,
            title: "Creative Writing: My Summer Adventure",
            description: "Write a short story about an exciting adventure you had or would like to have during summer vacation. Use descriptive language and include dialogue.",
            teacher: "Ms. Johnson",
            subject: "English",
            dueDate: "2024-02-15",
            status: "pending",
            points: 100,
            instructions: "Your story should be 300-500 words long. Include at least 3 characters and describe the setting clearly. Use proper grammar and punctuation.",
            submittedAt: null,
            grade: null,
            feedback: null
          },
          {
            id: 2,
            title: "Grammar Practice: Sentence Structure",
            description: "Complete the grammar exercises focusing on compound and complex sentences.",
            teacher: "Ms. Johnson",
            subject: "English",
            dueDate: "2024-02-10",
            status: "submitted",
            points: 50,
            instructions: "Complete all 20 exercises in the worksheet. Pay attention to proper comma usage and sentence variety.",
            submittedAt: "2024-02-08",
            grade: 45,
            feedback: "Great work! Just watch out for comma splices in questions 15-17."
          },
          {
            id: 3,
            title: "Reading Comprehension: The Secret Garden",
            description: "Read Chapter 5 of 'The Secret Garden' and answer the comprehension questions.",
            teacher: "Ms. Johnson",
            subject: "English",
            dueDate: "2024-02-20",
            status: "pending",
            points: 75,
            instructions: "Read the chapter carefully and answer all 10 questions in complete sentences. Support your answers with evidence from the text.",
            submittedAt: null,
            grade: null,
            feedback: null
          },
          {
            id: 4,
            title: "Vocabulary Building: Week 3",
            description: "Learn and practice this week's vocabulary words through various exercises.",
            teacher: "Ms. Johnson",
            subject: "English",
            dueDate: "2024-02-05",
            status: "overdue",
            points: 25,
            instructions: "Complete the vocabulary worksheet and write sentences using each word correctly.",
            submittedAt: null,
            grade: null,
            feedback: null
          }
        ];
        setAssignments(mockAssignments);
        setIsLoading(false);
      }, 1000);
    };

    fetchAssignments();
  }, []);

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
    // Simulate submission
    setAssignments(prev => prev.map(assignment =>
      assignment.id === assignmentId
        ? { ...assignment, status: 'submitted', submittedAt: new Date().toISOString().split('T')[0] }
        : assignment
    ));
    setSelectedAssignment(null);
    setSubmissionText('');
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
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Submit Your Work</h3>
                      <textarea
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        placeholder="Type your assignment submission here..."
                        className="w-full h-40 p-4 border-2 border-gray-200 rounded-2xl focus:border-blue-400 focus:outline-none resize-none"
                      />
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-gray-500">
                          {submissionText.length} characters
                        </div>
                        <button
                          onClick={() => handleSubmit(selectedAssignment.id)}
                          disabled={!submissionText.trim()}
                          className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-2xl py-3 px-6 font-bold hover:from-green-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <PaperAirplaneIcon className="h-5 w-5" />
                          <span>Submit Assignment</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedAssignment.status === 'submitted' && selectedAssignment.feedback && (
                    <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                      <h3 className="text-lg font-bold text-green-800 mb-2">Teacher Feedback</h3>
                      <p className="text-green-700">{selectedAssignment.feedback}</p>
                      {selectedAssignment.grade && (
                        <div className="mt-4 flex items-center space-x-2">
                          <span className="text-green-800 font-bold">Grade:</span>
                          <span className="text-2xl font-bold text-green-600">
                            {selectedAssignment.grade}/{selectedAssignment.points}
                          </span>
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
                      <UserIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Teacher: {selectedAssignment.teacher}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DocumentTextIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Subject: {selectedAssignment.subject}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Due: {formatDate(selectedAssignment.dueDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Points: {selectedAssignment.points}</span>
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
                  {selectedAssignment.submittedAt && (
                    <p className={`text-${getStatusColor(selectedAssignment.status)}-600 text-sm`}>
                      Submitted on {formatDate(selectedAssignment.submittedAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Assignments Grid */
          <div className="space-y-4">
            {assignments.map((assignment) => {
              const StatusIcon = getStatusIcon(assignment.status);
              const statusColor = getStatusColor(assignment.status);
              const overdue = isOverdue(assignment.dueDate, assignment.status);

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
                          <UserIcon className="h-4 w-4" />
                          <span>{assignment.teacher}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>Due {formatDate(assignment.dueDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>{assignment.points} points</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {assignment.grade && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {assignment.grade}/{assignment.points}
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
