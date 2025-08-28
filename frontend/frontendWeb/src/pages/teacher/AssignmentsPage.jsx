import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { assignmentsAPI, classesAPI } from '../../services/api';
import TeacherLayout from '../../components/teacher/TeacherLayout';
import {
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  CheckCircleIcon,
  CalendarIcon,
  AcademicCapIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

export default function AssignmentsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

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
      setError('');

      const [assignmentsData, classesData] = await Promise.all([
        assignmentsAPI.getAssignments(),
        classesAPI.getClasses()
      ]);

      setAssignments(assignmentsData);
      setClasses(classesData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAssignment = () => {
    setEditingAssignment(null);
    setShowCreateModal(true);
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setShowCreateModal(true);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
      return;
    }

    try {
      await assignmentsAPI.deleteAssignment(assignmentId);
      setAssignments(assignments.filter(a => a.id !== assignmentId));
    } catch (err) {
      console.error('Failed to delete assignment:', err);
      setError('Failed to delete assignment');
    }
  };

  const getStatusColor = (assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.due_date);
    
    if (dueDate < now) {
      return 'text-red-600 bg-red-100';
    } else if (dueDate - now < 24 * 60 * 60 * 1000) { // Due within 24 hours
      return 'text-yellow-600 bg-yellow-100';
    } else {
      return 'text-green-600 bg-green-100';
    }
  };

  const getStatusText = (assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.due_date);
    
    if (dueDate < now) {
      return 'Overdue';
    } else if (dueDate - now < 24 * 60 * 60 * 1000) {
      return 'Due Soon';
    } else {
      return 'Active';
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
            <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
            <p className="text-gray-600">Create and manage assignments for your classes</p>
          </div>
          <button
            onClick={handleCreateAssignment}
            className="btn-primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Assignment
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchData}
              className="mt-2 text-red-600 hover:text-red-800 font-medium underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Assignments Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : assignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <DocumentTextIcon className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <AcademicCapIcon className="h-4 w-4 mr-1" />
                          {assignment.class_name}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditAssignment(assignment)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {assignment.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{assignment.description}</p>
                  )}

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium text-gray-900 capitalize">{assignment.assignment_type}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Max Points:</span>
                      <span className="font-medium text-gray-900">{assignment.max_points}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Due Date:</span>
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {new Date(assignment.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment)}`}>
                        {getStatusText(assignment)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <button
                      onClick={() => navigate(`/teacher/assignments/${assignment.id}/submissions`)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 text-sm flex items-center justify-center"
                    >
                      <EyeIcon className="h-4 w-4 mr-2" />
                      View Submissions
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first assignment</p>
            <button
              onClick={handleCreateAssignment}
              className="btn-primary"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Assignment
            </button>
          </div>
        )}

        {/* Create/Edit Assignment Modal */}
        {showCreateModal && (
          <AssignmentModal
            assignment={editingAssignment}
            classes={classes}
            onClose={() => {
              setShowCreateModal(false);
              setEditingAssignment(null);
            }}
            onSave={(assignment) => {
              if (editingAssignment) {
                setAssignments(assignments.map(a => a.id === assignment.id ? assignment : a));
              } else {
                setAssignments([...assignments, assignment]);
              }
              setShowCreateModal(false);
              setEditingAssignment(null);
            }}
          />
        )}
      </div>
    </TeacherLayout>
  );
}

// Assignment Modal Component
function AssignmentModal({ assignment, classes, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: assignment?.title || '',
    description: assignment?.description || '',
    assignment_type: assignment?.assignment_type || 'homework',
    instructions: assignment?.instructions || '',
    due_date: assignment?.due_date ? assignment.due_date.split('T')[0] : '',
    max_points: assignment?.max_points || 100,
    class_id: assignment?.class_id || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const assignmentTypes = [
    { value: 'homework', label: 'Homework' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'essay', label: 'Essay' },
    { value: 'project', label: 'Project' },
    { value: 'exercise', label: 'Exercise' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
        max_points: parseInt(formData.max_points)
      };

      let savedAssignment;
      if (assignment) {
        savedAssignment = await assignmentsAPI.updateAssignment(assignment.id, submitData);
      } else {
        savedAssignment = await assignmentsAPI.createAssignment(submitData);
      }
      onSave(savedAssignment);
    } catch (err) {
      console.error('Failed to save assignment:', err);
      setError('Failed to save assignment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />

        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 border-2 border-gray-100 max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {assignment ? 'Edit Assignment' : 'Create New Assignment'}
            </h3>
            <p className="text-gray-600 mt-2">
              {assignment ? 'Update your assignment details' : 'Set up a new assignment for your students'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 bg-gray-50/50"
                  placeholder="Enter assignment title"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Class *
                </label>
                <select
                  value={formData.class_id}
                  onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 bg-gray-50/50"
                >
                  <option value="">Select a class</option>
                  {classes.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  value={formData.assignment_type}
                  onChange={(e) => setFormData({ ...formData, assignment_type: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 bg-gray-50/50"
                >
                  {assignmentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Max Points *
                </label>
                <input
                  type="number"
                  value={formData.max_points}
                  onChange={(e) => setFormData({ ...formData, max_points: e.target.value })}
                  required
                  min="1"
                  max="1000"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 bg-gray-50/50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 bg-gray-50/50 resize-none"
                  placeholder="Enter assignment description"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Instructions
                </label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 bg-gray-50/50 resize-none"
                  placeholder="Enter detailed instructions for students"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-2xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoading ? 'Saving...' : (assignment ? 'Update Assignment' : 'Create Assignment')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
