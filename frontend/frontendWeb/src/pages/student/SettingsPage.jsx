import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useLanguageSettings } from '../../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import StudentLayout from '../../components/student/StudentLayout';
import {
  EyeIcon,
  SpeakerWaveIcon,
  LanguageIcon,
  UserIcon,
  CogIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    dyslexiaFont,
    readingSpeed,
    highContrast,
    fontSize,
    toggleDyslexiaFont,
    changeReadingSpeed,
    toggleHighContrast,
    changeFontSize,
    resetToDefaults
  } = useAccessibility();
  const { t } = useTranslation();
  const {
    displayLanguage,
    learningLanguage,
    displayLanguages,
    learningLanguages,
    changeDisplayLanguage,
    changeLearningLanguage
  } = useLanguageSettings();
  const [showSaveMessage, setShowSaveMessage] = useState(false);

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

  // No need for useEffect or manual handlers - the context handles everything

  const handleSaveSettings = () => {
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };

  const readingSpeeds = [
    { value: 'slow', label: t('student.slow'), emoji: '🐌' },
    { value: 'normal', label: t('student.normal'), emoji: '🚶' },
    { value: 'fast', label: t('student.fast'), emoji: '🏃' }
  ];

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-3 mb-4 border-2 border-purple-200">
            <span className="text-2xl">⚙️</span>
            <span className="text-lg font-bold text-purple-700">
              {t('student.settings')}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
            Customize Your Learning
          </h1>
          <p className="text-gray-600 text-lg">
            Make learning comfortable and fun for you!
          </p>
        </div>

        {/* Save Message */}
        {showSaveMessage && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-center space-x-3">
            <CheckIcon className="h-6 w-6 text-green-600" />
            <span className="text-green-700 font-medium">{t('student.success')} Settings saved!</span>
          </div>
        )}

        {/* Student ID Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-200 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-3xl">🆔</div>
            <h2 className="text-2xl font-bold text-blue-800">Student ID</h2>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Your Student ID</h3>
                <p className="text-gray-600 text-sm">Share this ID with your teacher to join classes</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-xl px-4 py-2 border-2 border-blue-200">
                  <span className="text-xl font-mono font-bold text-blue-800">
                    {user?.id || 'STU001'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(user?.id || 'STU001');
                    setShowSaveMessage(true);
                    setTimeout(() => setShowSaveMessage(false), 3000);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-2 font-bold text-sm transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>📋</span>
                  <span>Copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility Settings */}
        <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="text-3xl">👁️</div>
            <h2 className="text-2xl font-bold text-gray-800">{t('student.accessibilitySettings')}</h2>
          </div>

          <div className="space-y-6">
            {/* Dyslexia-Friendly Font */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">📖</div>
                <div>
                  <h3 className="font-bold text-blue-800">{t('student.dyslexiaFriendlyFont')}</h3>
                  <p className="text-blue-600 text-sm">Easier to read font for better learning</p>
                </div>
              </div>
              <button
                onClick={toggleDyslexiaFont}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 ${
                  dyslexiaFont ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ${
                    dyslexiaFont ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Reading Speed */}
            <div className="p-4 bg-green-50 rounded-2xl border-2 border-green-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">⏱️</div>
                <div>
                  <h3 className="font-bold text-green-800">{t('student.readingSpeed')}</h3>
                  <p className="text-green-600 text-sm">Choose how fast text appears</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {readingSpeeds.map((speed) => (
                  <button
                    key={speed.value}
                    onClick={() => changeReadingSpeed(speed.value)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      readingSpeed === speed.value
                        ? 'bg-green-100 border-green-400 text-green-800'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-green-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{speed.emoji}</div>
                    <div className="font-medium text-sm">{speed.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl border-2 border-purple-200">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🌈</div>
                <div>
                  <h3 className="font-bold text-purple-800">{t('student.highContrast')}</h3>
                  <p className="text-purple-600 text-sm">Better colors for easier reading</p>
                </div>
              </div>
              <button
                onClick={toggleHighContrast}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 ${
                  highContrast ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ${
                    highContrast ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Font Size */}
            <div className="p-4 bg-indigo-50 rounded-2xl border-2 border-indigo-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">🔤</div>
                <div>
                  <h3 className="font-bold text-indigo-800">Font Size</h3>
                  <p className="text-indigo-600 text-sm">Choose comfortable text size</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { value: 'small', label: 'Small', size: 'text-sm' },
                  { value: 'normal', label: 'Normal', size: 'text-base' },
                  { value: 'large', label: 'Large', size: 'text-lg' },
                  { value: 'xlarge', label: 'X-Large', size: 'text-xl' }
                ].map((size) => (
                  <button
                    key={size.value}
                    onClick={() => changeFontSize(size.value)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      fontSize === size.value
                        ? 'bg-indigo-100 border-indigo-400 text-indigo-800'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-300'
                    }`}
                  >
                    <div className={`font-medium ${size.size}`}>Aa</div>
                    <div className="text-xs mt-1">{size.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="text-3xl">🌍</div>
            <h2 className="text-2xl font-bold text-gray-800">{t('student.languageSettings')}</h2>
          </div>

          {/* Display Language Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl">🖥️</div>
              <h3 className="text-xl font-bold text-gray-800">{t('student.displayLanguage')}</h3>
            </div>
            <p className="text-gray-600 mb-4">{t('student.interfaceLanguageDesc')}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {displayLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeDisplayLanguage(lang.code)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 transform hover:scale-105 ${
                    displayLanguage === lang.code
                      ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-blue-400 text-blue-800'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{lang.flag}</div>
                  <div className="font-bold text-sm">{lang.nativeName}</div>
                  {displayLanguage === lang.code && (
                    <div className="mt-2">
                      <CheckIcon className="h-5 w-5 text-blue-600 mx-auto" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Learning Language Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl">📚</div>
              <h3 className="text-xl font-bold text-gray-800">{t('student.learningLanguage')}</h3>
            </div>
            <p className="text-gray-600 mb-4">{t('student.targetLanguageDesc')}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLearningLanguage(lang.code)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 transform hover:scale-105 ${
                    learningLanguage === lang.code
                      ? 'bg-gradient-to-r from-green-100 to-blue-100 border-green-400 text-green-800'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  <div className="text-4xl mb-2">{lang.flag}</div>
                  <div className="font-bold text-lg">{lang.nativeName}</div>
                  <div className="text-sm text-gray-600 mt-1">{lang.name}</div>
                  {learningLanguage === lang.code && (
                    <div className="mt-2">
                      <CheckIcon className="h-6 w-6 text-green-600 mx-auto" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="text-3xl">👤</div>
            <h2 className="text-2xl font-bold text-gray-800">Your Profile</h2>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {user?.name?.charAt(0)?.toUpperCase() || '👤'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{user?.name || 'Student'}</h3>
              <p className="text-gray-600">Level 5 • 1,250 XP</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-500">Learning since:</span>
                <span className="text-sm font-medium text-gray-700">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleSaveSettings}
            className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-2xl py-4 px-8 font-bold text-lg hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <CheckIcon className="h-6 w-6" />
            <span>{t('student.save')} Settings</span>
          </button>

          <button
            onClick={resetToDefaults}
            className="inline-flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 rounded-2xl py-4 px-8 font-bold text-lg hover:bg-gray-200 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-gray-300"
          >
            <span className="text-xl">🔄</span>
            <span>Reset to Defaults</span>
          </button>
        </div>
      </div>
    </StudentLayout>
  );
}
