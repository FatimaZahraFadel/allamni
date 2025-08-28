import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import './i18n';

// Context
import { AuthProvider } from './contexts/AuthContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';

// Pages
import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import StudentPage from './pages/StudentPage';
import TeacherPage from './pages/TeacherPage';

// Teacher Pages
import SchoolsPage from './pages/teacher/SchoolsPage';
import ClassesPage from './pages/teacher/ClassesPage';
import ClassDetailsPage from './pages/teacher/ClassDetailsPage';
import StudentsPage from './pages/teacher/StudentsPage';
import TeacherAssignmentsPage from './pages/teacher/AssignmentsPage';
import CreateAssignmentPage from './pages/teacher/CreateAssignmentPage';
import AssignmentSubmissionsPage from './pages/teacher/AssignmentSubmissionsPage';
import SubmissionsPage from './pages/teacher/SubmissionsPage';
import SubmissionEvaluationPage from './pages/teacher/SubmissionEvaluationPage';
import AnalyticsPage from './pages/teacher/AnalyticsPage';
import TeacherSettingsPage from './pages/teacher/SettingsPage';

// Student Pages
import WriteFixPage from './pages/student/WriteFixPage';
import DictationPage from './pages/student/DictationPage';
import ReadingPage from './pages/student/ReadingPage';
import QuestsPage from './pages/student/QuestsPage';
import StudentAssignmentsPage from './pages/student/AssignmentsPage';
import StudentSettingsPage from './pages/student/SettingsPage';
import StudentStatisticsPage from './pages/student/StatisticsPage';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set document direction based on language
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <AccessibilityProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white dark:bg-gray-900">
            <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/student" element={<StudentPage />} />
            <Route path="/teacher" element={<TeacherPage />} />
            <Route path="/teacher/schools" element={<SchoolsPage />} />
            <Route path="/teacher/classes" element={<ClassesPage />} />
            <Route path="/teacher/classes/:classId" element={<ClassDetailsPage />} />
            <Route path="/teacher/students" element={<StudentsPage />} />
            <Route path="/teacher/assignments" element={<TeacherAssignmentsPage />} />
            <Route path="/teacher/assignments/create" element={<CreateAssignmentPage />} />
            <Route path="/teacher/assignments/:assignmentId/submissions" element={<AssignmentSubmissionsPage />} />
            <Route path="/teacher/submissions" element={<SubmissionsPage />} />
            <Route path="/teacher/submissions/:submissionId" element={<SubmissionEvaluationPage />} />
            <Route path="/teacher/analytics" element={<AnalyticsPage />} />
            <Route path="/teacher/settings" element={<TeacherSettingsPage />} />

            {/* Student Routes */}
            <Route path="/student/write-fix" element={<WriteFixPage />} />
            <Route path="/student/dictation" element={<DictationPage />} />
            <Route path="/student/reading" element={<ReadingPage />} />
            <Route path="/student/quests" element={<QuestsPage />} />
            <Route path="/student/assignments" element={<StudentAssignmentsPage />} />
            <Route path="/student/statistics" element={<StudentStatisticsPage />} />
            <Route path="/student/settings" element={<StudentSettingsPage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </AccessibilityProvider>
  );
}

export default App;
