import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useLanguageSettings } from '../../contexts/LanguageContext';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  PencilIcon,
  MicrophoneIcon,
  TrophyIcon,
  DocumentTextIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon,
  LanguageIcon,
  StarIcon,
  FireIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const getNavigation = (currentPath, t) => [
  {
    name: t('student.dashboard'),
    href: '/student',
    icon: HomeIcon,
    current: currentPath === '/student',
    emoji: '🏠'
  },
  {
    name: t('student.writeAndFix'),
    href: '/student/write-fix',
    icon: PencilIcon,
    current: currentPath === '/student/write-fix',
    emoji: '✏️'
  },
  {
    name: t('student.dictationAndReading'),
    href: '/student/dictation',
    icon: MicrophoneIcon,
    current: currentPath === '/student/dictation',
    emoji: '🎤'
  },
  {
    name: t('student.miniQuests'),
    href: '/student/quests',
    icon: TrophyIcon,
    current: currentPath === '/student/quests',
    emoji: '🎯'
  },
  {
    name: t('student.assignments'),
    href: '/student/assignments',
    icon: DocumentTextIcon,
    current: currentPath === '/student/assignments',
    emoji: '📚'
  },
  {
    name: t('student.statistics'),
    href: '/student/statistics',
    icon: ChartBarIcon,
    current: currentPath === '/student/statistics',
    emoji: '📊'
  },
  {
    name: t('student.settings'),
    href: '/student/settings',
    icon: CogIcon,
    current: currentPath === '/student/settings',
    emoji: '⚙️'
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function StudentLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const {
    displayLanguage,
    changeDisplayLanguage,
    displayLanguages,
    isRTL
  } = useLanguageSettings();
  const location = useLocation();
  const navigation = getNavigation(location.pathname, t);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Mobile sidebar */}
      <div className={`relative z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
        
        <div className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50 w-72 overflow-y-auto bg-white px-4 py-4 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 student-sidebar`}>
          <div className={`flex items-center ${isRTL ? 'justify-start' : 'justify-between'}`}>
            <Link to="/student" className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              <div className="text-2xl">🌟</div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                3allamni
              </span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="mt-8">
            <ul role="list" className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-2 border-blue-200'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-2 border-transparent',
                      'group flex gap-x-3 rounded-2xl p-3 text-sm font-semibold transition-all duration-200 transform hover:scale-105'
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span className="flex-1">{item.name}</span>
                    {item.current && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* User info and logout */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || '👤'}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-900">{user?.name || 'Student'}</p>
                <div className="flex items-center space-x-1">
                  <FireIcon className="h-4 w-4 text-orange-500" />
                  <span className="text-xs text-gray-500">Lvl 5</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-red-600 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors duration-200 border-2 border-gray-200 hover:border-red-200"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              <span className="font-medium">{t('student.logout')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-80 lg:flex-col ${isRTL ? 'lg:right-0' : 'lg:left-0'}`}>
        <div className="flex grow flex-col gap-y-3 overflow-y-auto bg-white px-4 py-4 shadow-xl student-sidebar">
          <div className="flex flex-col space-y-3">
            <Link to="/student" className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              <div className="text-3xl">🌟</div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                3allamni
              </span>
            </Link>

            {/* Language Switcher - Moved under app name */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-full p-1 w-fit">
              {displayLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeDisplayLanguage(lang.code)}
                  className={classNames(
                    displayLanguage === lang.code ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-blue-600',
                    'px-2 py-1 rounded-full text-xs font-medium transition-all duration-200'
                  )}
                >
                  {lang.code === 'en' ? 'EN' :
                   lang.code === 'fr' ? 'FR' :
                   lang.code === 'ar' ? 'عر' :
                   lang.code === 'tzm' ? 'ⵜⵎ' : lang.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-3">
              <li>
                <ul role="list" className="space-y-2">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-2 border-blue-200 shadow-md'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-2 border-transparent hover:border-blue-200',
                          'group flex gap-x-4 rounded-2xl p-4 text-lg font-semibold transition-all duration-200 transform hover:scale-105'
                        )}
                      >
                        <span className="text-3xl">{item.emoji}</span>
                        <span className="flex-1">{item.name}</span>
                        {item.current && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* User info and logout */}
              <li className="mt-auto">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border-2 border-blue-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {user?.name?.charAt(0)?.toUpperCase() || '👤'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{user?.name || 'Student'}</p>
                      <div className="flex items-center space-x-1">
                        <FireIcon className="h-4 w-4 text-orange-500" />
                        <span className="text-xs text-gray-600 font-medium">Level 5 • 1,250 XP</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-red-600 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors duration-200 border-2 border-gray-200 hover:border-red-200"
                  >
                    <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                    <span className="font-medium">{t('student.logout')}</span>
                  </button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className={`${isRTL ? 'lg:pr-80' : 'lg:pl-80'}`}>
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 hover:bg-gray-100 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🌟</div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                3allamni
              </span>
            </div>
            
            {/* Mobile Language Switcher */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-full p-1">
              {displayLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeDisplayLanguage(lang.code)}
                  className={classNames(
                    displayLanguage === lang.code ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600',
                    'px-2 py-1 rounded-full text-xs font-medium'
                  )}
                >
                  {lang.code === 'en' ? 'EN' :
                   lang.code === 'fr' ? 'FR' :
                   lang.code === 'ar' ? 'عر' :
                   lang.code === 'tzm' ? 'ⵜⵎ' : lang.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
