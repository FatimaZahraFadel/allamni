import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import AuthModal from './AuthModal';

export default function Navbar() {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  const navigation = [
    { name: t('nav.home'), href: '/', type: 'link' },
    { name: t('nav.features'), href: '#features', type: 'scroll' },
    { name: t('nav.pricing'), href: '/pricing', type: 'link' },
    { name: t('nav.about'), href: '#features', type: 'scroll' }, // Redirect to features as requested
    { name: t('nav.contact'), href: '/contact', type: 'link' },
  ];

  const handleNavClick = (item, e) => {
    if (item.type === 'scroll') {
      e.preventDefault();
      const targetId = item.href.substring(1); // Remove the #
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
    setIsMenuOpen(false);
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="glass-navbar sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="text-3xl transform group-hover:scale-110 transition-transform duration-300">🌟</div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  3allamni
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                item.type === 'scroll' ? (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(item, e)}
                    className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-50/50 relative group cursor-pointer"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-50/50 relative group"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                  </Link>
                )
              ))}
            </div>

            {/* Right side - Auth buttons and Language switcher */}
            <div className="hidden md:flex items-center space-x-4">
              <LanguageSwitcher />
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-sm">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-800">{user?.name}</span>
                    <span className="text-sm text-gray-500 capitalize">({user?.role})</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-600 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-red-50/50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-blue-50/50"
                  >
                    {t('nav.login')}
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {t('nav.signup')}
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-3">
              <LanguageSwitcher />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-300"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="lg:hidden">
              <div className="px-4 pt-4 pb-6 space-y-3 bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-lg">
                {navigation.map((item) => (
                  item.type === 'scroll' ? (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => handleNavClick(item, e)}
                      className="block px-4 py-3 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-blue-50/50 transition-all duration-300 cursor-pointer"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block px-4 py-3 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-blue-50/50 transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                ))}
                <div className="pt-4 border-t border-gray-200/50 space-y-3">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 bg-gray-50/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <UserIcon className="h-5 w-5 text-gray-600" />
                          <div>
                            <span className="font-medium text-gray-800 block">{user?.name}</span>
                            <span className="text-sm text-gray-500 capitalize">({user?.role})</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-red-600 hover:text-red-700 font-medium rounded-lg hover:bg-red-50/50 transition-all duration-300"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          openAuthModal('login');
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-blue-50/50 transition-all duration-300"
                      >
                        {t('nav.login')}
                      </button>
                      <button
                        onClick={() => {
                          openAuthModal('signup');
                          setIsMenuOpen(false);
                        }}
                        className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md"
                      >
                        {t('nav.signup')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={closeAuthModal}
        mode={authMode}
        setMode={setAuthMode}
      />
    </>
  );
}
