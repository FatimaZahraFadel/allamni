import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import StudentLayout from '../../components/student/StudentLayout';
import {
  PhotoIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

export default function WriteFixPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showMiniLesson, setShowMiniLesson] = useState(false);

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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    
    // Simulate API call with mock data
    setTimeout(() => {
      const mockResult = {
        extractedText: "I like to play football with my frends after school. Its realy fun and I enjoy it alot.",
        correctedText: "I like to play football with my friends after school. It's really fun and I enjoy it a lot.",
        errors: [
          {
            original: "frends",
            corrected: "friends",
            type: "spelling",
            explanation: "The correct spelling is 'friends' with an 'i' before 'e'. Remember: 'i' before 'e' except after 'c'!",
            position: { start: 35, end: 41 },
            difficulty: "easy",
            points: 10
          },
          {
            original: "Its",
            corrected: "It's",
            type: "grammar",
            explanation: "Use 'It's' (with apostrophe) when you mean 'It is'. 'Its' (without apostrophe) shows possession.",
            position: { start: 50, end: 53 },
            difficulty: "medium",
            points: 15
          },
          {
            original: "realy",
            corrected: "really",
            type: "spelling",
            explanation: "The word 'really' has two 'l's. Think of it as 'real' + 'ly'!",
            position: { start: 54, end: 59 },
            difficulty: "easy",
            points: 10
          },
          {
            original: "alot",
            corrected: "a lot",
            type: "spelling",
            explanation: "'A lot' is always written as two separate words, never as one word 'alot'.",
            position: { start: 80, end: 84 },
            difficulty: "medium",
            points: 15
          }
        ],
        score: 85,
        totalPoints: 50,
        encouragement: "Fantastic work! You're improving so much! 🌟",
        level: "Beginner Writer",
        nextLevel: "Skilled Writer",
        progressToNext: 75
      };
      
      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  const showMiniLessonModal = (error) => {
    setShowMiniLesson(error);
  };

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 mb-4 border-2 border-blue-200">
            <span className="text-2xl">✏️</span>
            <span className="text-lg font-bold text-blue-700">
              {t('student.writeAndFix')}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {t('student.uploadImageAndGetFeedback')}
          </h1>
          <p className="text-gray-600 text-lg">
            Take a photo of your handwriting and get instant AI feedback!
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-lg">
          <div className="text-center">
            {!imagePreview ? (
              <div className="border-3 border-dashed border-blue-300 rounded-2xl p-12 hover:border-blue-400 transition-colors duration-200">
                <PhotoIcon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {t('student.uploadImage')}
                </h3>
                <p className="text-gray-600 mb-6">
                  Take a clear photo of your handwritten text
                </p>
                <label className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl py-3 px-6 font-bold text-lg cursor-pointer hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                  <PhotoIcon className="h-6 w-6" />
                  <span>Choose Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Uploaded handwriting"
                    className="max-w-full max-h-96 rounded-2xl shadow-lg border-2 border-gray-200"
                  />
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setSelectedImage(null);
                      setAnalysisResult(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200"
                  >
                    ✕
                  </button>
                </div>
                
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-2xl py-4 px-8 font-bold text-lg hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-6 w-6" />
                      <span>{t('student.analyzeText')}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Score and Encouragement with Confetti */}
            <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-3xl p-8 border-2 border-green-200 relative overflow-hidden">
              {/* Confetti Animation */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-2 left-4 text-2xl animate-bounce">🎉</div>
                <div className="absolute top-4 right-8 text-2xl animate-bounce delay-100">⭐</div>
                <div className="absolute top-6 left-1/3 text-2xl animate-bounce delay-200">✨</div>
                <div className="absolute top-3 right-1/3 text-2xl animate-bounce delay-300">🌟</div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-6xl animate-pulse">🏆</div>
                    <div>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        Score: {analysisResult.score}%
                      </h3>
                      <p className="text-lg text-green-600 font-medium">{analysisResult.encouragement}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <BoltIcon className="h-5 w-5 text-yellow-500" />
                        <span className="text-yellow-600 font-bold">+{analysisResult.totalPoints} XP earned!</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="bg-white rounded-2xl p-4 border-2 border-blue-200 shadow-lg">
                      <div className="text-sm text-gray-600 mb-1">Current Level</div>
                      <div className="text-lg font-bold text-blue-600">{analysisResult.level}</div>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${analysisResult.progressToNext}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{analysisResult.progressToNext}% to {analysisResult.nextLevel}</div>
                    </div>
                  </div>
                </div>

                {/* Achievement Badges */}
                <div className="flex justify-center space-x-4">
                  {analysisResult.score >= 90 && (
                    <div className="bg-yellow-100 border-2 border-yellow-300 rounded-full px-4 py-2 flex items-center space-x-2">
                      <span className="text-2xl">🥇</span>
                      <span className="text-yellow-700 font-bold">Excellent!</span>
                    </div>
                  )}
                  {analysisResult.score >= 80 && analysisResult.score < 90 && (
                    <div className="bg-gray-100 border-2 border-gray-300 rounded-full px-4 py-2 flex items-center space-x-2">
                      <span className="text-2xl">🥈</span>
                      <span className="text-gray-700 font-bold">Great Job!</span>
                    </div>
                  )}
                  {analysisResult.errors.length === 0 && (
                    <div className="bg-green-100 border-2 border-green-300 rounded-full px-4 py-2 flex items-center space-x-2">
                      <span className="text-2xl">✨</span>
                      <span className="text-green-700 font-bold">Perfect!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Extracted Text */}
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">📝</span>
                {t('student.extractedText')}
              </h3>
              <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                <p className="text-gray-800 text-lg leading-relaxed">
                  {analysisResult.extractedText}
                </p>
              </div>
            </div>

            {/* Corrected Text */}
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">✅</span>
                {t('student.correctedText')}
              </h3>
              <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
                <p className="text-gray-800 text-lg leading-relaxed">
                  {analysisResult.correctedText}
                </p>
              </div>
            </div>

            {/* Errors Found */}
            {analysisResult.errors.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <span className="text-2xl mr-2">🔍</span>
                    {t('student.errorsFound')} ({analysisResult.errors.length})
                  </h3>
                  <div className="text-sm text-gray-500">
                    Click 💡 for mini-lessons!
                  </div>
                </div>

                <div className="space-y-4">
                  {analysisResult.errors.map((error, index) => (
                    <div
                      key={index}
                      className={`rounded-2xl p-6 border-2 transform hover:scale-105 transition-all duration-200 ${
                        error.difficulty === 'easy'
                          ? 'bg-green-50 border-green-200'
                          : error.difficulty === 'medium'
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                              error.difficulty === 'easy'
                                ? 'bg-green-500'
                                : error.difficulty === 'medium'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <span className={`font-bold capitalize ${
                                error.difficulty === 'easy'
                                  ? 'text-green-700'
                                  : error.difficulty === 'medium'
                                  ? 'text-yellow-700'
                                  : 'text-red-700'
                              }`}>
                                {error.type} Error
                              </span>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  error.difficulty === 'easy'
                                    ? 'bg-green-100 text-green-600'
                                    : error.difficulty === 'medium'
                                    ? 'bg-yellow-100 text-yellow-600'
                                    : 'bg-red-100 text-red-600'
                                }`}>
                                  {error.difficulty}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <BoltIcon className="h-4 w-4 text-yellow-500" />
                                  <span className="text-yellow-600 font-bold text-sm">+{error.points} XP</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-xl p-4 border border-gray-200 mb-3">
                            <p className="text-gray-700 text-lg">
                              <span className="line-through text-red-600 font-medium bg-red-100 px-2 py-1 rounded">
                                {error.original}
                              </span>
                              <span className="mx-3 text-2xl">→</span>
                              <span className="text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                                {error.corrected}
                              </span>
                            </p>
                          </div>

                          <p className="text-gray-600 leading-relaxed">{error.explanation}</p>
                        </div>

                        <button
                          onClick={() => showMiniLessonModal(error)}
                          className="ml-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-3 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-110 shadow-lg hover:shadow-xl"
                        >
                          <LightBulbIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border-2 border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">📊</div>
                      <div>
                        <h4 className="font-bold text-blue-700">Learning Summary</h4>
                        <p className="text-blue-600 text-sm">
                          You found {analysisResult.errors.length} areas to improve!
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">+{analysisResult.totalPoints}</div>
                      <div className="text-sm text-purple-500">Total XP</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mini Lesson Modal */}
        {showMiniLesson && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full border-2 border-blue-200 shadow-2xl relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 text-yellow-300 opacity-50">
                <SparklesIcon className="h-8 w-8 animate-spin" />
              </div>
              <div className="absolute bottom-4 left-4 text-blue-300 opacity-50">
                <SparklesIcon className="h-6 w-6 animate-pulse" />
              </div>

              <div className="relative z-10">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-3 animate-bounce">💡</div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {t('student.miniLesson')}
                  </h3>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <BoltIcon className="h-5 w-5 text-yellow-500" />
                    <span className="text-yellow-600 font-bold">+{showMiniLesson.points} XP for learning!</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Error Type Badge */}
                  <div className="text-center">
                    <span className={`inline-block px-4 py-2 rounded-full font-bold text-white ${
                      showMiniLesson.difficulty === 'easy'
                        ? 'bg-green-500'
                        : showMiniLesson.difficulty === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}>
                      {showMiniLesson.type.toUpperCase()} • {showMiniLesson.difficulty.toUpperCase()}
                    </span>
                  </div>

                  {/* Rule Explanation */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
                    <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                      <span className="text-2xl mr-2">📚</span>
                      The Rule
                    </h4>
                    <p className="text-blue-700 leading-relaxed text-lg">{showMiniLesson.explanation}</p>
                  </div>

                  {/* Before and After */}
                  <div className="bg-gradient-to-r from-red-50 to-green-50 rounded-2xl p-6 border-2 border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                      <span className="text-2xl mr-2">✨</span>
                      Before & After
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-red-100 rounded-xl p-4 border-2 border-red-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-red-600 font-bold">❌ Before:</span>
                        </div>
                        <p className="text-red-700 font-medium text-lg">{showMiniLesson.original}</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl">⬇️</div>
                      </div>
                      <div className="bg-green-100 rounded-xl p-4 border-2 border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-green-600 font-bold">✅ After:</span>
                        </div>
                        <p className="text-green-700 font-medium text-lg">{showMiniLesson.corrected}</p>
                      </div>
                    </div>
                  </div>

                  {/* Memory Tip */}
                  <div className="bg-yellow-50 rounded-2xl p-4 border-2 border-yellow-200">
                    <h4 className="font-bold text-yellow-800 mb-2 flex items-center">
                      <span className="text-xl mr-2">🧠</span>
                      Memory Tip
                    </h4>
                    <p className="text-yellow-700 text-sm">
                      {showMiniLesson.type === 'spelling' && "Try saying the word slowly and breaking it into parts!"}
                      {showMiniLesson.type === 'grammar' && "Remember the rule and practice with similar examples!"}
                      {showMiniLesson.type === 'punctuation' && "Think about what the punctuation is trying to show!"}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 mt-8">
                  <button
                    onClick={() => setShowMiniLesson(false)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl py-4 px-6 font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Got it! 👍
                  </button>
                  <button
                    onClick={() => {
                      // Could add practice exercises here
                      setShowMiniLesson(false);
                    }}
                    className="px-6 py-4 bg-yellow-100 text-yellow-700 rounded-2xl font-bold hover:bg-yellow-200 transition-all duration-200 border-2 border-yellow-300"
                  >
                    🎯 Practice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
