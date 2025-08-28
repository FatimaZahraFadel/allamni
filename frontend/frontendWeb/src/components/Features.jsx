import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  TrophyIcon,
  ChartBarIcon,
  LanguageIcon,
  ShieldCheckIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export default function Features() {
  const { t } = useTranslation();

  const features = [
    {
      icon: SparklesIcon,
      title: t('features.ai_feedback.title'),
      description: t('features.ai_feedback.description'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: TrophyIcon,
      title: t('features.gamification.title'),
      description: t('features.gamification.description'),
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      icon: ChartBarIcon,
      title: t('features.progress_tracking.title'),
      description: t('features.progress_tracking.description'),
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: LanguageIcon,
      title: t('features.multilingual.title'),
      description: t('features.multilingual.description'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: ShieldCheckIcon,
      title: t('features.safe_environment.title'),
      description: t('features.safe_environment.description'),
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      icon: AcademicCapIcon,
      title: t('features.teacher_tools.title'),
      description: t('features.teacher_tools.description'),
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  return (
    <section id="features" className="section-padding bg-white relative overflow-hidden">
      {/* Background decorations - subtle for white background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-100/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-100/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto container-padding relative">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full px-6 py-3 mb-6 border-2 border-blue-200 shadow-sm">
              <span className="text-2xl">✨</span>
              <span className="text-lg font-bold text-blue-700">Platform Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              {t('features.subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 hover:-translate-y-2"
            >
              <div className={`inline-flex p-4 rounded-2xl ${feature.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Student vs Teacher Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Student Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="group relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-300">🎮</div>
                <h3 className="text-3xl font-bold mb-3">
                  {t('features.student_title')}
                </h3>
                <p className="text-blue-100 text-lg">
                  {t('features.student_subtitle')}
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-lg"></div>
                  <span className="text-white font-medium">Interactive writing exercises</span>
                </div>
                <div className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg"></div>
                  <span className="text-white font-medium">Gamified learning with rewards</span>
                </div>
                <div className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="w-3 h-3 bg-pink-400 rounded-full shadow-lg"></div>
                  <span className="text-white font-medium">Instant AI feedback</span>
                </div>
                <div className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg"></div>
                  <span className="text-white font-medium">Progress tracking</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Teacher Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="group relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 -translate-x-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 translate-x-12"></div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-300">👩‍🏫</div>
                <h3 className="text-3xl font-bold mb-3">
                  {t('features.teacher_title')}
                </h3>
                <p className="text-emerald-100 text-lg">
                  {t('features.teacher_subtitle')}
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-lg"></div>
                  <span className="text-white font-medium">Classroom management</span>
                </div>
                <div className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="w-3 h-3 bg-orange-400 rounded-full shadow-lg"></div>
                  <span className="text-white font-medium">Assignment creation</span>
                </div>
                <div className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="w-3 h-3 bg-pink-400 rounded-full shadow-lg"></div>
                  <span className="text-white font-medium">Student analytics</span>
                </div>
                <div className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg"></div>
                  <span className="text-white font-medium">Bulk management tools</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
