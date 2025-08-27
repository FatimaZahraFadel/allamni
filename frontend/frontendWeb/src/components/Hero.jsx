import { useTranslation } from 'react-i18next';
import { PlayIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden gradient-bg-hero min-h-screen flex items-center">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-pink-300/30 rounded-full blur-2xl float-delay"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-blue-300/30 rounded-full blur-xl float"></div>
        <div className="absolute bottom-40 right-1/3 w-16 h-16 bg-purple-300/30 rounded-full blur-xl float-delay"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 glass-card rounded-full px-6 py-3 mb-8">
              <span className="text-2xl">🚀</span>
              <span className="text-white font-medium">AI-Powered Learning Platform</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                Learning Journey
              </span>
            </h1>

            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="glass-button text-white text-lg px-10 py-4 rounded-full font-bold hover:scale-105 transform transition-all duration-300 glow">
                {t('hero.cta')}
              </button>

              <button className="glass-button text-white text-lg px-10 py-4 rounded-full font-bold flex items-center space-x-3 hover:scale-105 transform transition-all duration-300">
                <PlayIcon className="h-6 w-6" />
                <span>{t('hero.cta_secondary')}</span>
              </button>
            </div>
          </motion.div>

          {/* Hero Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20"
          >
            <div className="relative">
              {/* Modern glassmorphism card */}
              <div className="glass-card rounded-3xl mx-auto max-w-5xl h-[500px] flex items-center justify-center relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20"></div>

                {/* Content */}
                <div className="relative text-white text-center z-10">
                  <div className="text-8xl mb-6 float">🎓</div>
                  <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    3allamni Platform
                  </h3>
                  <p className="text-xl opacity-90 mb-8">AI-Powered Learning Experience</p>

                  {/* Feature highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="glass-card rounded-2xl p-6">
                      <div className="text-3xl mb-3">✏️</div>
                      <h4 className="font-bold mb-2">Smart Writing</h4>
                      <p className="text-sm opacity-80">AI-powered feedback</p>
                    </div>
                    <div className="glass-card rounded-2xl p-6">
                      <div className="text-3xl mb-3">🎤</div>
                      <h4 className="font-bold mb-2">Voice Learning</h4>
                      <p className="text-sm opacity-80">Interactive dictation</p>
                    </div>
                    <div className="glass-card rounded-2xl p-6">
                      <div className="text-3xl mb-3">🏆</div>
                      <h4 className="font-bold mb-2">Gamified</h4>
                      <p className="text-sm opacity-80">Fun achievements</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -left-4 bg-yellow-400 rounded-full p-4 shadow-lg"
              >
                <span className="text-2xl">⭐</span>
              </motion.div>
              
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -top-4 -right-4 bg-green-400 rounded-full p-4 shadow-lg"
              >
                <span className="text-2xl">🏆</span>
              </motion.div>
              
              <motion.div
                animate={{ y: [-5, 15, -5] }}
                transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                className="absolute -bottom-4 left-1/4 bg-blue-400 rounded-full p-4 shadow-lg"
              >
                <span className="text-2xl">📚</span>
              </motion.div>
              
              <motion.div
                animate={{ y: [15, -5, 15] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute -bottom-4 right-1/4 bg-purple-400 rounded-full p-4 shadow-lg"
              >
                <span className="text-2xl">✨</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
    </section>
  );
}
