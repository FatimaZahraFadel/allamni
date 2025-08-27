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
    { name: t('nav.home'), href: '/' },
    { name: t('nav.features'), href: '#features' },
    { name: t('nav.pricing'), href: '/pricing' },
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.contact'), href: '#contact' },
  ];

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
            <div className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-gray-900 font-medium px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right side - Auth buttons and Language switcher */}
            <div className="hidden md:flex items-center space-x-3">
              <LanguageSwitcher />
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 glass-button px-4 py-2 rounded-xl">
                    <UserIcon className="h-5 w-5 text-gray-700" />
                    <span className="font-medium text-gray-700">{user?.name}</span>
                    <span className="text-sm text-gray-500 capitalize">({user?.role})</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="glass-button text-gray-700 hover:text-gray-900 px-4 py-2 rounded-xl font-medium transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="glass-button text-gray-700 hover:text-gray-900 px-4 py-2 rounded-xl font-medium transition-all duration-300"
                  >
                    {t('nav.login')}
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg glow"
                  >
                    {t('nav.signup')}
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <LanguageSwitcher />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 p-2"
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
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 space-y-2">
                  {isAuthenticated ? (
                    <>
                      <div className="px-3 py-2 text-gray-700">
                        <div className="flex items-center space-x-2">
                          <UserIcon className="h-5 w-5" />
                          <span className="font-medium">{user?.name}</span>
                        </div>
                        <span className="text-sm text-gray-500 capitalize">({user?.role})</span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 font-medium"
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
                        className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 font-medium"
                      >
                        {t('nav.login')}
                      </button>
                      <button
                        onClick={() => {
                          openAuthModal('signup');
                          setIsMenuOpen(false);
                        }}
                        className="block w-full btn-primary"
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
