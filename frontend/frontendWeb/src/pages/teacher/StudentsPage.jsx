import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usersAPI, classesAPI } from '../../services/api';
import TeacherLayout from '../../components/teacher/TeacherLayout';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  CalendarIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

export default function StudentsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
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
      const classesData = await classesAPI.getClasses();
      setClasses(classesData);
      
      // Get all students from all classes
      const allStudents = [];
      for (const classItem of classesData) {
        try {
          const classWithStudents = await classesAPI.getClass(classItem.id);
          if (classWithStudents.students) {
            classWithStudents.students.forEach(student => {
              const existingStudent = allStudents.find(s => s.id === student.id);
              if (!existingStudent) {
                allStudents.push({
                  ...student,
                  classes: [classItem.name]
                });
              } else {
                existingStudent.classes.push(classItem.name);
              }
            });
          }
        } catch (err) {
          console.error(`Failed to fetch students for class ${classItem.id}:`, err);
        }
      }
      setStudents(allStudents);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchData();
      return;
    }

    try {
      setIsSearching(true);
      const results = await usersAPI.searchStudents(searchQuery);
      setStudents(results.map(student => ({ ...student, classes: [] })));
    } catch (err) {
      console.error('Failed to search students:', err);
      setError('Failed to search students');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
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
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="text-3xl">👥</div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Students</h1>
              </div>
              <p className="text-gray-600 text-lg">Manage and view all your students</p>
            </div>
            <div className="glass-card rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{students.length}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="glass-card rounded-3xl p-6 border border-white/20">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search students by name, email, or student ID..."
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSearching ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Searching...</span>
                </div>
              ) : (
                'Search'
              )}
            </button>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  fetchData();
                }}
                className="glass-button text-gray-700 hover:text-gray-900 px-4 py-3 rounded-xl font-medium transition-all duration-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Students Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : students.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div key={student.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <UsersIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Student ID:</span>
                      <span className="font-medium text-gray-900">#{student.id}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Language:</span>
                      <span className="font-medium text-gray-900 capitalize">
                        {student.language_preference || 'Arabic'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Joined:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(student.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {student.classes && student.classes.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-500 mb-2">Classes:</p>
                        <div className="flex flex-wrap gap-1">
                          {student.classes.map((className, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {className}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {student.parent_email && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Parent Contact:</p>
                        <p className="text-sm font-medium text-gray-900">{student.parent_email}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button className="flex-1 btn-secondary text-sm">
                        View Progress
                      </button>
                      <button className="flex-1 btn-primary text-sm">
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No students found' : 'No students yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Students will appear here when they enroll in your classes'
              }
            </p>
            {!searchQuery && (
              <a
                href="/teacher/classes"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <UserPlusIcon className="h-5 w-5 mr-2" />
                Manage Classes
              </a>
            )}
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
