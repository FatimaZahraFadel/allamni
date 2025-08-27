import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

export default function AuthModal({ isOpen, onClose, mode, setMode }) {
  const { t } = useTranslation();
  const { login, register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let result;

      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }

        const signupData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          language_preference: 'en' // Default language
        };

        result = await register(signupData);
      } else {
        const loginData = {
          email: formData.email,
          password: formData.password
        };

        result = await login(loginData);
      }

      if (result.success) {
        onClose();
        // Redirect based on user role
        const userRole = result.user.role;
        if (userRole === 'student') {
          window.location.href = '/student';
        } else if (userRole === 'teacher') {
          window.location.href = '/teacher';
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'student'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Enhanced backdrop with gradient and blur */}
        <div
          className="fixed inset-0 bg-gradient-to-br from-purple-900/60 via-blue-900/60 to-pink-900/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modern glassmorphism modal */}
        <div className="relative glass-card rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/20 overflow-hidden">
          {/* Floating background elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-pink-400/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 -left-5 w-16 h-16 bg-purple-400/15 rounded-full blur-lg"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 z-10"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {/* Header */}
          <div className="mb-8 text-center relative z-10">
            <div className="text-4xl mb-4">
              {mode === 'login' ? '🔐' : '🌟'}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {mode === 'login' ? t('auth.login_title') : t('auth.signup_title')}
            </h2>
            <p className="text-white/80">
              {mode === 'login' ? 'Welcome back to your learning journey!' : 'Start your amazing learning adventure!'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
                  {t('auth.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 backdrop-blur-sm transition-all duration-300"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                {t('auth.email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 backdrop-blur-sm transition-all duration-300"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                {t('auth.password')}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 backdrop-blur-sm transition-all duration-300"
                placeholder="Enter your password"
              />
            </div>

            {mode === 'signup' && (
              <>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90 mb-2">
                    {t('auth.confirm_password')}
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 backdrop-blur-sm transition-all duration-300"
                    placeholder="Confirm your password"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-white/90 mb-2">
                    {t('auth.role')}
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="student" className="bg-gray-800 text-white">{t('auth.student')}</option>
                    <option value="teacher" className="bg-gray-800 text-white">{t('auth.teacher')}</option>
                  </select>
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 text-red-200 text-sm p-3 rounded-xl backdrop-blur-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full glass-button text-white font-bold py-4 px-6 rounded-xl hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 glow"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>{mode === 'login' ? t('auth.login_button') : t('auth.signup_button')}</span>
                  <span>{mode === 'login' ? '🚀' : '✨'}</span>
                </span>
              )}
            </button>
          </form>

          {/* Switch mode */}
          <div className="mt-8 text-center relative z-10">
            <p className="text-sm text-white/80">
              {mode === 'login' ? t('auth.no_account') : t('auth.have_account')}
              {' '}
              <button
                onClick={switchMode}
                className="text-white font-medium hover:text-white/80 underline underline-offset-2 transition-colors"
              >
                {mode === 'login' ? t('auth.switch_to_signup') : t('auth.switch_to_login')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
