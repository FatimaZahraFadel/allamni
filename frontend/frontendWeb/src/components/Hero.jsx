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
              <span className="text-2xl">🤖</span>
              <span className="text-white font-medium">{t('hero.nextGenPlatform')}</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              {t('hero.title')}
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                {t('hero.titleHighlight')}
              </span>
            </h1>

            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* Stats Section */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-white/70 text-sm">{t('hero.activeStudents')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">95%</div>
                <div className="text-white/70 text-sm">{t('hero.successRate')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-white/70 text-sm">{t('hero.aiSupport')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">4</div>
                <div className="text-white/70 text-sm">{t('hero.languages')}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg px-12 py-4 rounded-full font-bold hover:scale-105 transform transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-3">
                <span>🚀</span>
                <span>{t('hero.cta')}</span>
                <span className="bg-white/20 px-2 py-1 rounded-full text-sm">AI-Powered</span>
              </button>

              <button className="glass-button text-white text-lg px-10 py-4 rounded-full font-bold flex items-center space-x-3 hover:scale-105 transform transition-all duration-300 border border-white/20">
                <PlayIcon className="h-6 w-6" />
                <span>{t('hero.cta_secondary')}</span>
                <span className="text-xs bg-green-500 px-2 py-1 rounded-full">2 min</span>
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 opacity-70">
              <div className="flex items-center space-x-2 text-white/60">
                <span className="text-green-400">✓</span>
                <span className="text-sm">{t('hero.noCreditCard')}</span>
              </div>
              <div className="flex items-center space-x-2 text-white/60">
                <span className="text-green-400">✓</span>
                <span className="text-sm">{t('hero.freeForever')}</span>
              </div>
              <div className="flex items-center space-x-2 text-white/60">
                <span className="text-green-400">✓</span>
                <span className="text-sm">{t('hero.setupIn30Seconds')}</span>
              </div>
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
              {/* Modern AI Dashboard Preview */}
              <div className="glass-card rounded-3xl mx-auto max-w-6xl h-[600px] flex items-center justify-center relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20"></div>

                {/* Animated background grid */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                  }}></div>
                </div>

                {/* Content */}
                <div className="relative text-white text-center z-10 w-full px-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="text-6xl mr-4 animate-pulse">🤖</div>
                    <div className="text-left">
                      <h3 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                        {t('hero.aiLearningEngine')}
                      </h3>
                      <p className="text-lg opacity-90">{t('hero.poweredByML')}</p>
                    </div>
                  </div>

                  {/* AI Features Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                    <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                      <div className="text-4xl mb-3">🧠</div>
                      <h4 className="font-bold mb-2">{t('hero.smartAnalysis')}</h4>
                      <p className="text-sm opacity-80">{t('hero.smartAnalysisDesc')}</p>
                      <div className="mt-3 bg-blue-500/20 rounded-full h-2">
                        <div className="bg-blue-400 h-2 rounded-full w-4/5 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                      <div className="text-4xl mb-3">🎯</div>
                      <h4 className="font-bold mb-2">{t('hero.personalized')}</h4>
                      <p className="text-sm opacity-80">{t('hero.personalizedDesc')}</p>
                      <div className="mt-3 bg-orange-500/20 rounded-full h-2">
                        <div className="bg-orange-400 h-2 rounded-full w-3/5 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                      <div className="text-4xl mb-3">⚡</div>
                      <h4 className="font-bold mb-2">{t('hero.realTime')}</h4>
                      <p className="text-sm opacity-80">{t('hero.realTimeDesc')}</p>
                      <div className="mt-3 bg-green-500/20 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full w-5/6 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                      <div className="text-4xl mb-3">📈</div>
                      <h4 className="font-bold mb-2">{t('hero.progress')}</h4>
                      <p className="text-sm opacity-80">{t('hero.progressDesc')}</p>
                      <div className="mt-3 bg-cyan-500/20 rounded-full h-2">
                        <div className="bg-cyan-400 h-2 rounded-full w-4/6 animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Live Demo Indicator */}
                  <div className="mt-8 flex items-center justify-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm opacity-80">{t('hero.aiEngineActive')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-sm opacity-80">{t('hero.processingWords')}</span>
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
