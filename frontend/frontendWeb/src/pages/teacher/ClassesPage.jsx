import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { classesAPI, schoolsAPI, usersAPI } from '../../services/api';
import TeacherLayout from '../../components/teacher/TeacherLayout';
import {
  AcademicCapIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
  BuildingOfficeIcon,
  UserPlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function ClassesPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [classes, setClasses] = useState([]);
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

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
      const [classesData, schoolsData] = await Promise.all([
        classesAPI.getClasses(),
        schoolsAPI.getSchools()
      ]);
      setClasses(classesData);
      setSchools(schoolsData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClass = () => {
    setEditingClass(null);
    setShowCreateModal(true);
  };

  const handleEditClass = (classItem) => {
    setEditingClass(classItem);
    setShowCreateModal(true);
  };

  const handleDeleteClass = async (classId) => {
    if (!confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      return;
    }

    try {
      await classesAPI.deleteClass(classId);
      setClasses(classes.filter(c => c.id !== classId));
    } catch (err) {
      console.error('Failed to delete class:', err);
      setError('Failed to delete class');
    }
  };

  const handleManageStudents = (classItem) => {
    setSelectedClass(classItem);
    setShowStudentModal(true);
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
            <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
            <p className="text-gray-600">Manage your classes and students</p>
          </div>
          <button
            onClick={handleCreateClass}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg glow flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Class
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Classes Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <div key={classItem.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <AcademicCapIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{classItem.name}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                          {classItem.school_name}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClass(classItem)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(classItem.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Grade Level:</span>
                      <span className="font-medium text-gray-900">{classItem.grade_level}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Subject:</span>
                      <span className="font-medium text-gray-900">{classItem.subject}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Students:</span>
                      <span className="font-medium text-gray-900">{classItem.student_count || 0}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleManageStudents(classItem)}
                      className="flex-1 glass-button text-gray-700 hover:text-gray-900 px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm flex items-center justify-center"
                    >
                      <UserPlusIcon className="h-4 w-4 mr-1" />
                      Manage Students
                    </button>
                    <a
                      href={`/teacher/classes/${classItem.id}`}
                      className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-xl font-bold hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 text-sm text-center flex items-center justify-center"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <AcademicCapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No classes yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first class</p>
            <button
              onClick={handleCreateClass}
              className="btn-primary"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Class
            </button>
          </div>
        )}

        {/* Create/Edit Class Modal */}
        {showCreateModal && (
          <ClassModal
            classItem={editingClass}
            schools={schools}
            onClose={() => {
              setShowCreateModal(false);
              setEditingClass(null);
            }}
            onSave={(savedClass) => {
              if (editingClass) {
                setClasses(classes.map(c => c.id === savedClass.id ? savedClass : c));
              } else {
                setClasses([...classes, savedClass]);
              }
              setShowCreateModal(false);
              setEditingClass(null);
            }}
          />
        )}

        {/* Manage Students Modal */}
        {showStudentModal && selectedClass && (
          <StudentsModal
            classItem={selectedClass}
            onClose={() => {
              setShowStudentModal(false);
              setSelectedClass(null);
            }}
            onUpdate={(updatedClass) => {
              setClasses(classes.map(c => c.id === updatedClass.id ? updatedClass : c));
            }}
          />
        )}
      </div>
    </TeacherLayout>
  );
}

// Class Modal Component
function ClassModal({ classItem, schools, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: classItem?.name || '',
    school_id: classItem?.school_id || '',
    grade_level: classItem?.grade_level || '',
    subject: classItem?.subject || '',
    description: classItem?.description || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let savedClass;
      if (classItem) {
        savedClass = await classesAPI.updateClass(classItem.id, formData);
      } else {
        savedClass = await classesAPI.createClass(formData);
      }
      onSave(savedClass);
    } catch (err) {
      console.error('Failed to save class:', err);
      setError('Failed to save class');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {classItem ? 'Edit Class' : 'Create New Class'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., French 4ème primaire groupe A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School *
              </label>
              <select
                value={formData.school_id}
                onChange={(e) => setFormData({ ...formData, school_id: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a school</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade Level *
                </label>
                <input
                  type="text"
                  value={formData.grade_level}
                  onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 4ème"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., French"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter class description"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : (classItem ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Students Modal Component
function StudentsModal({ classItem, onClose, onUpdate }) {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchClassStudents();
  }, []);

  const fetchClassStudents = async () => {
    try {
      const classData = await classesAPI.getClass(classItem.id);
      setStudents(classData.students || []);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      const results = await usersAPI.searchStudents(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error('Failed to search students:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddStudent = async (studentId) => {
    try {
      await classesAPI.enrollStudent(classItem.id, studentId);
      await fetchClassStudents();
      setSearchResults([]);
      setSearchQuery('');
    } catch (err) {
      console.error('Failed to add student:', err);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      await classesAPI.removeStudent(classItem.id, studentId);
      setStudents(students.filter(s => s.id !== studentId));
    } catch (err) {
      console.error('Failed to remove student:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Manage Students - {classItem.name}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Add Student Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Student by ID or Email
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter student ID or email"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="btn-primary"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 border border-gray-200 rounded-lg">
                {searchResults.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                    <button
                      onClick={() => handleAddStudent(student.id)}
                      className="btn-primary text-sm"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Students */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Current Students ({students.length})
            </h4>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : students.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveStudent(student.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No students enrolled yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
