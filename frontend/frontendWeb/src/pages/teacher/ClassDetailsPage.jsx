import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { classesAPI, assignmentsAPI } from '../../services/api';
import TeacherLayout from '../../components/teacher/TeacherLayout';
import {
  AcademicCapIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowLeftIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

export default function ClassDetailsPage() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [classData, setClassData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user || user.role !== 'teacher')) {
      navigate('/');
      return;
    }

    if (isAuthenticated && user && user.role === 'teacher' && classId) {
      fetchClassData();
    }
  }, [user, isAuthenticated, authLoading, classId, navigate]);

  const fetchClassData = async () => {
    try {
      setIsLoading(true);
      const [classResponse, assignmentsResponse] = await Promise.all([
        classesAPI.getClass(classId),
        assignmentsAPI.getAssignments()
      ]);
      
      setClassData(classResponse);
      // Filter assignments for this class
      const classAssignments = assignmentsResponse.filter(
        assignment => assignment.class_id === parseInt(classId)
      );
      setAssignments(classAssignments);
    } catch (err) {
      console.error('Failed to fetch class data:', err);
      setError('Failed to load class details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAssignment = (assignmentId) => {
    navigate(`/teacher/assignments/${assignmentId}/submissions`);
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

  if (!classData) {
    return (
      <TeacherLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Class not found</h3>
          <button
            onClick={() => navigate('/teacher/classes')}
            className="btn-primary"
          >
            Back to Classes
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
              onClick={() => navigate('/teacher/classes')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{classData.name}</h1>
              <p className="text-gray-600">{classData.description}</p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/teacher/assignments/create?classId=${classId}`)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Assignment
          </button>
        </div>

        {/* Class Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Students</p>
                <p className="text-2xl font-bold text-gray-900">{classData.students?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Grade Level</p>
                <p className="text-2xl font-bold text-gray-900">{classData.grade_level || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Students</h3>
          </div>
          <div className="p-6">
            {classData.students && classData.students.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classData.students.map((student) => (
                  <div key={student.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {student.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No students enrolled yet</p>
            )}
          </div>
        </div>

        {/* Assignments List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Assignments</h3>
          </div>
          <div className="p-6">
            {assignments.length > 0 ? (
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                      <p className="text-sm text-gray-500">{assignment.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No due date'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleViewAssignment(assignment.id)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center"
                    >
                      <EyeIcon className="h-4 w-4 mr-2" />
                      View Submissions
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No assignments created yet</p>
            )}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
