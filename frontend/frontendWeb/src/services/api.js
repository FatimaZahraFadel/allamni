import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post('http://localhost:8000/api/v1/auth/refresh', {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

// Authentication API functions
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/api/v1/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/api/v1/auth/login', credentials);
    return response.data;
  },

  // Get current user info
  getCurrentUser: async () => {
    const response = await api.get('/api/v1/auth/me');
    return response.data;
  },

  // Refresh access token
  refreshToken: async (refreshToken) => {
    const response = await api.post('/api/v1/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.post('/api/v1/auth/change-password', passwordData);
    return response.data;
  },
};

// Dashboard API functions
export const dashboardAPI = {
  // Get student dashboard data
  getStudentDashboard: async () => {
    const response = await api.get('/api/v1/stats/dashboard/student');
    return response.data;
  },

  // Get teacher dashboard data
  getTeacherDashboard: async () => {
    const response = await api.get('/api/v1/stats/dashboard/teacher');
    return response.data;
  },

  // Get class dashboard data
  getClassDashboard: async (classId) => {
    const response = await api.get(`/api/v1/stats/dashboard/class/${classId}`);
    return response.data;
  },
};

// Schools API functions
export const schoolsAPI = {
  // Get all schools for teacher
  getSchools: async () => {
    const response = await api.get('/api/v1/schools/');
    return response.data;
  },

  // Get school with classes
  getSchool: async (schoolId) => {
    const response = await api.get(`/api/v1/schools/${schoolId}`);
    return response.data;
  },

  // Create new school
  createSchool: async (schoolData) => {
    const response = await api.post('/api/v1/schools/', schoolData);
    return response.data;
  },

  // Update school
  updateSchool: async (schoolId, schoolData) => {
    const response = await api.put(`/api/v1/schools/${schoolId}`, schoolData);
    return response.data;
  },

  // Delete school
  deleteSchool: async (schoolId) => {
    const response = await api.delete(`/api/v1/schools/${schoolId}`);
    return response.data;
  },
};

// Classes API functions
export const classesAPI = {
  // Get all classes for teacher
  getClasses: async () => {
    const response = await api.get('/api/v1/classes/');
    return response.data;
  },

  // Get class with students
  getClass: async (classId) => {
    const response = await api.get(`/api/v1/classes/${classId}`);
    return response.data;
  },

  // Create new class
  createClass: async (classData) => {
    const response = await api.post('/api/v1/classes/', classData);
    return response.data;
  },

  // Update class
  updateClass: async (classId, classData) => {
    const response = await api.put(`/api/v1/classes/${classId}`, classData);
    return response.data;
  },

  // Delete class
  deleteClass: async (classId) => {
    const response = await api.delete(`/api/v1/classes/${classId}`);
    return response.data;
  },

  // Enroll student in class
  enrollStudent: async (classId, studentId) => {
    const response = await api.post(`/api/v1/classes/${classId}/students`, {
      student_id: studentId,
      class_id: classId
    });
    return response.data;
  },

  // Remove student from class
  removeStudent: async (classId, studentId) => {
    const response = await api.delete(`/api/v1/classes/${classId}/students/${studentId}`);
    return response.data;
  },

  // Get class statistics
  getClassStats: async (classId) => {
    const response = await api.get(`/api/v1/classes/${classId}/stats`);
    return response.data;
  },
};

// Assignments API functions
export const assignmentsAPI = {
  // Get all assignments
  getAssignments: async () => {
    const response = await api.get('/api/v1/assignments/');
    return response.data;
  },

  // Get assignment details
  getAssignment: async (assignmentId) => {
    const response = await api.get(`/api/v1/assignments/${assignmentId}`);
    return response.data;
  },

  // Create new assignment
  createAssignment: async (assignmentData) => {
    const response = await api.post('/api/v1/assignments/', assignmentData);
    return response.data;
  },

  // Update assignment
  updateAssignment: async (assignmentId, assignmentData) => {
    const response = await api.put(`/api/v1/assignments/${assignmentId}`, assignmentData);
    return response.data;
  },

  // Delete assignment
  deleteAssignment: async (assignmentId) => {
    const response = await api.delete(`/api/v1/assignments/${assignmentId}`);
    return response.data;
  },

  // Get assignment statistics
  getAssignmentStats: async (assignmentId) => {
    const response = await api.get(`/api/v1/assignments/${assignmentId}/stats`);
    return response.data;
  },
};

// Submissions API functions
export const submissionsAPI = {
  // Get all submissions
  getSubmissions: async () => {
    const response = await api.get('/api/v1/submissions/');
    return response.data;
  },

  // Get submission details
  getSubmission: async (submissionId) => {
    const response = await api.get(`/api/v1/submissions/${submissionId}`);
    return response.data;
  },

  // Grade submission
  gradeSubmission: async (submissionId, gradeData) => {
    const response = await api.post(`/api/v1/submissions/${submissionId}/grade`, gradeData);
    return response.data;
  },
};

// Users API functions
export const usersAPI = {
  // Search students
  searchStudents: async (query) => {
    const response = await api.get(`/api/v1/users/search/students?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get all users (teachers only)
  getUsers: async () => {
    const response = await api.get('/api/v1/users/');
    return response.data;
  },

  // Get user by ID
  getUser: async (userId) => {
    const response = await api.get(`/api/v1/users/${userId}`);
    return response.data;
  },
};

export default api;
