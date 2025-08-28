import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  AcademicCapIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const getNavigation = (currentPath) => [
  { name: 'Dashboard', href: '/teacher', icon: HomeIcon, current: currentPath === '/teacher' },
  { name: 'Schools', href: '/teacher/schools', icon: BuildingOfficeIcon, current: currentPath === '/teacher/schools' },
  { name: 'Classes', href: '/teacher/classes', icon: AcademicCapIcon, current: currentPath === '/teacher/classes' },
  { name: 'Students', href: '/teacher/students', icon: UsersIcon, current: currentPath === '/teacher/students' },
  { name: 'Assignments', href: '/teacher/assignments', icon: DocumentTextIcon, current: currentPath === '/teacher/assignments' },
  { name: 'Submissions', href: '/teacher/submissions', icon: ClipboardDocumentListIcon, current: currentPath === '/teacher/submissions' },
  { name: 'Analytics', href: '/teacher/analytics', icon: ChartBarIcon, current: currentPath === '/teacher/analytics' },
  { name: 'Settings', href: '/teacher/settings', icon: CogIcon, current: currentPath === '/teacher/settings' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function TeacherLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigation = getNavigation(location.pathname);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`relative z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
        
        <div className="fixed inset-0 flex">
          <div className="relative mr-16 flex w-full max-w-xs flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button
                type="button"
                className="-m-2.5 p-2.5"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
              <div className="flex h-16 shrink-0 items-center">
                <h1 className="text-2xl font-bold gradient-text">3allamni</h1>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <Link
                            to={item.href}
                            className={classNames(
                              item.current
                                ? 'bg-primary-50 text-primary-600'
                                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50',
                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                            )}
                          >
                            <item.icon
                              className={classNames(
                                item.current ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600',
                                'h-6 w-6 shrink-0'
                              )}
                            />
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="-mx-6 mt-auto">
                    <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-medium">
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <span className="sr-only">Your profile</span>
                      <span>{user?.name}</span>
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-blue-50 via-purple-50 to-indigo-50 border-r border-blue-200 px-6 shadow-xl">
          <div className="flex h-16 shrink-0 items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">3allamni</h1>
              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Teacher Portal</span>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                            : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-500 hover:shadow-md hover:transform hover:scale-102',
                          'group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold transition-all duration-300 mx-1 my-1'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current ? 'text-white' : 'text-gray-500 group-hover:text-white',
                            'h-5 w-5 shrink-0'
                          )}
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="-mx-6 mt-auto">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 mx-4 mb-4 rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center gap-x-3">
                    <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30">
                      <span className="text-white font-bold text-lg">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{user?.name}</p>
                      <p className="text-xs text-blue-100 capitalize">{user?.role}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
                      title="Logout"
                    >
                      <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="h-6 w-px bg-gray-200 lg:hidden" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
              
              {/* Subscription status */}
              <div className="flex items-center gap-x-2">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Pro Plan Active</span>
              </div>
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
