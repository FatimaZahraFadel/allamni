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
    <section id="features" className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className={`inline-flex p-3 rounded-lg ${feature.bgColor} mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Student vs Teacher Section */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Student Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8"
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t('features.student_title')}
              </h3>
              <p className="text-gray-600">
                {t('features.student_subtitle')}
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Interactive writing exercises</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">Gamified learning with rewards</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Instant AI feedback</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-700">Progress tracking</span>
              </div>
            </div>
          </motion.div>

          {/* Teacher Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8"
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">👩‍🏫</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t('features.teacher_title')}
              </h3>
              <p className="text-gray-600">
                {t('features.teacher_subtitle')}
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Classroom management</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Assignment creation</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">Student analytics</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">Bulk management tools</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
