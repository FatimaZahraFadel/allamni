import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { schoolsAPI } from '../../services/api';
import TeacherLayout from '../../components/teacher/TeacherLayout';
import {
  BuildingOfficeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  UsersIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export default function SchoolsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);

  useEffect(() => {
    // Only redirect if we're sure the user is not authenticated
    if (!authLoading && (!isAuthenticated || !user || user.role !== 'teacher')) {
      window.location.href = '/';
      return;
    }

    // Only fetch schools if user is authenticated
    if (isAuthenticated && user && user.role === 'teacher') {
      fetchSchools();
    }
  }, [user, isAuthenticated, authLoading]);

  const fetchSchools = async () => {
    try {
      setIsLoading(true);
      const data = await schoolsAPI.getSchools();
      setSchools(data);
    } catch (err) {
      console.error('Failed to fetch schools:', err);
      setError('Failed to load schools');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSchool = () => {
    setEditingSchool(null);
    setShowCreateModal(true);
  };

  const handleEditSchool = (school) => {
    setEditingSchool(school);
    setShowCreateModal(true);
  };

  const handleDeleteSchool = async (schoolId) => {
    if (!confirm('Are you sure you want to delete this school? This action cannot be undone.')) {
      return;
    }

    try {
      await schoolsAPI.deleteSchool(schoolId);
      setSchools(schools.filter(school => school.id !== schoolId));
    } catch (err) {
      console.error('Failed to delete school:', err);
      setError('Failed to delete school');
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
            <h1 className="text-2xl font-bold text-gray-900">Schools</h1>
            <p className="text-gray-600">Manage your schools and educational institutions</p>
          </div>
          <button
            onClick={handleCreateSchool}
            className="btn-primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add School
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Schools Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : schools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
              <div key={school.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
                        {school.address && (
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            {school.address}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditSchool(school)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSchool(school.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {school.description && (
                    <p className="text-gray-600 mt-3 text-sm">{school.description}</p>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <AcademicCapIcon className="h-4 w-4 mr-1" />
                        {school.class_count || 0} classes
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <UsersIcon className="h-4 w-4 mr-1" />
                        {school.student_count || 0} students
                      </div>
                    </div>
                    <a
                      href={`/teacher/schools/${school.id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
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
            <BuildingOfficeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schools yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first school</p>
            <button
              onClick={handleCreateSchool}
              className="btn-primary"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create School
            </button>
          </div>
        )}

        {/* Create/Edit School Modal */}
        {showCreateModal && (
          <SchoolModal
            school={editingSchool}
            onClose={() => {
              setShowCreateModal(false);
              setEditingSchool(null);
            }}
            onSave={(school) => {
              if (editingSchool) {
                setSchools(schools.map(s => s.id === school.id ? school : s));
              } else {
                setSchools([...schools, school]);
              }
              setShowCreateModal(false);
              setEditingSchool(null);
            }}
          />
        )}
      </div>
    </TeacherLayout>
  );
}

// School Modal Component
function SchoolModal({ school, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: school?.name || '',
    address: school?.address || '',
    description: school?.description || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let savedSchool;
      if (school) {
        savedSchool = await schoolsAPI.updateSchool(school.id, formData);
      } else {
        savedSchool = await schoolsAPI.createSchool(formData);
      }
      onSave(savedSchool);
    } catch (err) {
      console.error('Failed to save school:', err);
      setError('Failed to save school');
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
            {school ? 'Edit School' : 'Create New School'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter school name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter school address"
              />
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
                placeholder="Enter school description"
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
                {isLoading ? 'Saving...' : (school ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
