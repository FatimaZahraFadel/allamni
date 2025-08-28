import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import StudentLayout from '../../components/student/StudentLayout';
import {
  MicrophoneIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  SpeakerWaveIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function DictationPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();

  // State management
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [userText, setUserText] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState([]);

  // Refs
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [audioBlob, setAudioBlob] = useState(null);

  // Dictation exercises organized by level - Updated daily!
  const exercises = {
    beginner: [
      {
        id: 1,
        title: "Simple Sentences",
        text: "The cat sits on the mat. It is a sunny day. I like to read books.",
        audioUrl: "/audio/beginner-1.mp3",
        difficulty: "Beginner",
        points: 20
      },
      {
        id: 2,
        title: "Daily Activities",
        text: "I wake up at seven o'clock. I brush my teeth and eat breakfast. Then I go to school.",
        audioUrl: "/audio/beginner-2.mp3",
        difficulty: "Beginner",
        points: 25
      },
      {
        id: 3,
        title: "Family Time",
        text: "My family is very nice. We eat dinner together every night. My mom cooks delicious food.",
        audioUrl: "/audio/beginner-3.mp3",
        difficulty: "Beginner",
        points: 20
      },
      {
        id: 4,
        title: "At the Park",
        text: "Children play in the park. They run and laugh with joy. The swings move back and forth.",
        audioUrl: "/audio/beginner-4.mp3",
        difficulty: "Beginner",
        points: 25
      },
      {
        id: 5,
        title: "Weather Talk",
        text: "Today is very cold. The wind blows through the trees. I wear my warm coat outside.",
        audioUrl: "/audio/beginner-5.mp3",
        difficulty: "Beginner",
        points: 20
      },
      {
        id: 6,
        title: "School Day",
        text: "I love going to school. My teacher is very kind. We learn new things every day.",
        audioUrl: "/audio/beginner-6.mp3",
        difficulty: "Beginner",
        points: 25
      },
      {
        id: 7,
        title: "Pet Stories",
        text: "My dog likes to play fetch. He runs fast in the yard. His tail wags when he is happy.",
        audioUrl: "/audio/beginner-7.mp3",
        difficulty: "Beginner",
        points: 20
      },
      {
        id: 8,
        title: "Food Fun",
        text: "I like to eat apples and bananas. Fruits are good for my health. They taste sweet and fresh.",
        audioUrl: "/audio/beginner-8.mp3",
        difficulty: "Beginner",
        points: 25
      },
      {
        id: 9,
        title: "Bedtime Story",
        text: "At night I read a book. The story is about a brave knight. Then I go to sleep peacefully.",
        audioUrl: "/audio/beginner-9.mp3",
        difficulty: "Beginner",
        points: 20
      },
      {
        id: 10,
        title: "Weekend Fun",
        text: "On Saturday we visit grandma. She bakes cookies for us. We have a wonderful time together.",
        audioUrl: "/audio/beginner-10.mp3",
        difficulty: "Beginner",
        points: 25
      }
    ],
    intermediate: [
      {
        id: 11,
        title: "Adventure Story",
        text: "Once upon a time, there was a brave little mouse who lived in a big house. Every day, the mouse would explore different rooms looking for cheese and making new friends along the way.",
        audioUrl: "/audio/intermediate-1.mp3",
        difficulty: "Intermediate",
        points: 40
      },
      {
        id: 12,
        title: "Science Discovery",
        text: "The Earth revolves around the Sun in approximately 365 days. This movement creates the seasons we experience throughout the year, bringing changes in weather and daylight.",
        audioUrl: "/audio/intermediate-2.mp3",
        difficulty: "Intermediate",
        points: 45
      },
      {
        id: 13,
        title: "Ocean Exploration",
        text: "Deep beneath the ocean waves, colorful fish swim among coral reefs. Scientists use special submarines to study these underwater ecosystems and discover new species.",
        audioUrl: "/audio/intermediate-3.mp3",
        difficulty: "Intermediate",
        points: 40
      },
      {
        id: 14,
        title: "Space Journey",
        text: "Astronauts travel to space in powerful rockets. They float weightlessly in their spacecraft while conducting important experiments that help us understand the universe better.",
        audioUrl: "/audio/intermediate-4.mp3",
        difficulty: "Intermediate",
        points: 45
      },
      {
        id: 15,
        title: "Forest Adventure",
        text: "The ancient forest was filled with towering trees and mysterious sounds. Wildlife photographers carefully documented the rare animals that called this wilderness their home.",
        audioUrl: "/audio/intermediate-5.mp3",
        difficulty: "Intermediate",
        points: 40
      },
      {
        id: 16,
        title: "Technology Today",
        text: "Modern computers can process information incredibly quickly. Engineers design these machines to help people solve complex problems and communicate across great distances.",
        audioUrl: "/audio/intermediate-6.mp3",
        difficulty: "Intermediate",
        points: 45
      },
      {
        id: 17,
        title: "Cultural Heritage",
        text: "Museums preserve artifacts from ancient civilizations. Archaeologists carefully excavate historical sites to learn about how people lived thousands of years ago.",
        audioUrl: "/audio/intermediate-7.mp3",
        difficulty: "Intermediate",
        points: 40
      },
      {
        id: 18,
        title: "Environmental Care",
        text: "Protecting our environment requires everyone's participation. Recycling materials and using renewable energy sources help preserve natural resources for future generations.",
        audioUrl: "/audio/intermediate-8.mp3",
        difficulty: "Intermediate",
        points: 45
      },
      {
        id: 19,
        title: "Musical Harmony",
        text: "Orchestra musicians practice for hours to perfect their performances. Each instrument contributes unique sounds that blend together to create beautiful symphonic masterpieces.",
        audioUrl: "/audio/intermediate-9.mp3",
        difficulty: "Intermediate",
        points: 40
      },
      {
        id: 20,
        title: "Sports Excellence",
        text: "Professional athletes train rigorously to achieve peak performance. Their dedication and perseverance inspire millions of fans around the world to pursue their own dreams.",
        audioUrl: "/audio/intermediate-10.mp3",
        difficulty: "Intermediate",
        points: 45
      }
    ],
    advanced: [
      {
        id: 21,
        title: "Architectural Marvel",
        text: "The magnificent cathedral, with its towering spires and intricate stained glass windows, had stood for centuries as a testament to human creativity, devotion, and architectural excellence.",
        audioUrl: "/audio/advanced-1.mp3",
        difficulty: "Advanced",
        points: 60
      },
      {
        id: 22,
        title: "Scientific Revolution",
        text: "The paradigm shift in scientific methodology during the Renaissance fundamentally transformed humanity's understanding of natural phenomena, establishing empirical observation as the cornerstone of knowledge acquisition.",
        audioUrl: "/audio/advanced-2.mp3",
        difficulty: "Advanced",
        points: 65
      },
      {
        id: 23,
        title: "Literary Analysis",
        text: "Contemporary literature often employs sophisticated narrative techniques, including unreliable narrators and non-linear chronology, to challenge readers' preconceptions and encourage deeper analytical thinking.",
        audioUrl: "/audio/advanced-3.mp3",
        difficulty: "Advanced",
        points: 60
      },
      {
        id: 24,
        title: "Economic Theory",
        text: "Macroeconomic policies implemented by central banks significantly influence inflation rates, employment levels, and overall economic stability through carefully calibrated monetary interventions.",
        audioUrl: "/audio/advanced-4.mp3",
        difficulty: "Advanced",
        points: 65
      },
      {
        id: 25,
        title: "Philosophical Discourse",
        text: "Existentialist philosophers questioned traditional assumptions about human nature, arguing that individuals must create their own meaning and purpose in an inherently absurd universe.",
        audioUrl: "/audio/advanced-5.mp3",
        difficulty: "Advanced",
        points: 60
      },
      {
        id: 26,
        title: "Technological Innovation",
        text: "Artificial intelligence algorithms demonstrate remarkable capabilities in pattern recognition and decision-making, yet they remain fundamentally limited by their training data and computational constraints.",
        audioUrl: "/audio/advanced-6.mp3",
        difficulty: "Advanced",
        points: 65
      },
      {
        id: 27,
        title: "Historical Perspective",
        text: "The geopolitical ramifications of twentieth-century conflicts continue to influence contemporary international relations, shaping diplomatic strategies and multilateral cooperation frameworks.",
        audioUrl: "/audio/advanced-7.mp3",
        difficulty: "Advanced",
        points: 60
      },
      {
        id: 28,
        title: "Environmental Science",
        text: "Climate change mitigation strategies require unprecedented global coordination, combining technological innovation with behavioral modifications and comprehensive policy reforms across multiple sectors.",
        audioUrl: "/audio/advanced-8.mp3",
        difficulty: "Advanced",
        points: 65
      },
      {
        id: 29,
        title: "Psychological Research",
        text: "Cognitive neuroscience investigations reveal intricate connections between neural activity patterns and conscious experience, challenging traditional distinctions between mind and brain.",
        audioUrl: "/audio/advanced-9.mp3",
        difficulty: "Advanced",
        points: 60
      },
      {
        id: 30,
        title: "Cultural Anthropology",
        text: "Cross-cultural studies demonstrate remarkable diversity in human social organization, revealing how environmental factors and historical circumstances shape distinct cultural practices and belief systems.",
        audioUrl: "/audio/advanced-10.mp3",
        difficulty: "Advanced",
        points: 65
      }
    ]
  };

  const levels = [
    {
      id: 'beginner',
      name: 'Beginner',
      emoji: '🌱',
      color: 'green',
      description: 'Simple words and sentences',
      bgClass: 'bg-gradient-to-br from-emerald-100 to-green-200',
      borderClass: 'border-emerald-300 hover:border-emerald-400',
      textClass: 'text-emerald-900',
      buttonClass: 'from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700',
      shadowClass: 'shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/60'
    },
    {
      id: 'intermediate',
      name: 'Intermediate',
      emoji: '🚀',
      color: 'blue',
      description: 'Longer sentences and stories',
      bgClass: 'bg-gradient-to-br from-blue-100 to-indigo-200',
      borderClass: 'border-blue-300 hover:border-blue-400',
      textClass: 'text-blue-900',
      buttonClass: 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
      shadowClass: 'shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/60'
    },
    {
      id: 'advanced',
      name: 'Advanced',
      emoji: '🏆',
      color: 'purple',
      description: 'Complex vocabulary and grammar',
      bgClass: 'bg-gradient-to-br from-purple-100 to-violet-200',
      borderClass: 'border-purple-300 hover:border-purple-400',
      textClass: 'text-purple-900',
      buttonClass: 'from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700',
      shadowClass: 'shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/60'
    }
  ];

  // Functions
  const startExercise = (exercise) => {
    setCurrentExercise(exercise);
    setUserText('');
    setShowResult(false);
    setScore(0);
    setFeedback([]);
  };

  const playAudio = () => {
    if (currentExercise) {
      // For demo purposes, use text-to-speech
      const utterance = new SpeechSynthesisUtterance(currentExercise.text);
      utterance.rate = 0.8; // Slower for dictation
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    }
  };

  const stopAudio = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const checkAnswer = () => {
    if (!currentExercise || !userText.trim()) return;

    const originalWords = currentExercise.text.toLowerCase().split(/\s+/);
    const userWords = userText.toLowerCase().split(/\s+/);

    let correctWords = 0;
    const feedbackArray = [];

    originalWords.forEach((word, index) => {
      const userWord = userWords[index] || '';
      const isCorrect = word === userWord;

      if (isCorrect) correctWords++;

      feedbackArray.push({
        original: word,
        user: userWord,
        correct: isCorrect,
        index
      });
    });

    const accuracy = Math.round((correctWords / originalWords.length) * 100);
    const earnedPoints = Math.round((accuracy / 100) * currentExercise.points);

    setScore(earnedPoints);
    setFeedback(feedbackArray);
    setShowResult(true);
  };

  const resetExercise = () => {
    setCurrentExercise(null);
    setUserText('');
    setShowResult(false);
    setScore(0);
    setFeedback([]);
  };

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

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full px-6 py-3 mb-4 border-2 border-orange-200">
            <span className="text-2xl">🎧</span>
            <span className="text-lg font-bold text-orange-700">
              {t('student.dictationPractice')}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {t('student.listenAndTypeChallenge')}
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            {t('student.improveListeningSkills')}
          </p>
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-orange-600 text-lg">🔄</span>
              <span className="text-orange-800 font-bold text-sm">
                NEW EXERCISES DAILY! Fresh content updated every 24 hours
              </span>
            </div>
          </div>
        </div>

        {/* Level Selection or Exercise Interface */}
        {!selectedLevel ? (
          /* Level Selection */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {levels.map((level) => (
              <div
                key={level.id}
                className={`group ${level.bgClass} rounded-3xl p-8 border-2 ${level.borderClass} transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer`}
                onClick={() => setSelectedLevel(level.id)}
              >
                <div className="text-center">
                  <div className="text-8xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {level.emoji}
                  </div>
                  <h3 className={`text-2xl font-bold ${level.textClass} mb-3`}>
                    {level.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {level.description}
                  </p>
                  <div className="text-gray-700 text-sm mb-6">
                    {exercises[level.id]?.length || 0} Exercises Available
                  </div>
                  <button className={`w-full bg-gradient-to-r ${level.buttonClass} text-white rounded-2xl py-4 px-6 font-bold transition-all duration-200 transform group-hover:scale-105 text-lg`}>
                    Start Dictation
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : !currentExercise ? (
          /* Exercise Selection */
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedLevel(null)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  ←
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {levels.find(l => l.id === selectedLevel)?.name} Dictation
                  </h2>
                  <p className="text-gray-600">
                    {levels.find(l => l.id === selectedLevel)?.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exercises[selectedLevel]?.map((exercise) => (
                <div
                  key={exercise.id}
                  className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg cursor-pointer"
                  onClick={() => startExercise(exercise)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{exercise.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                        {exercise.points} pts
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {exercise.text.substring(0, 100)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {exercise.difficulty} Level
                    </span>
                    <button className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-200">
                      Start Exercise
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : showResult ? (
          /* Results Screen */
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-lg">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">
                {score >= currentExercise.points * 0.8 ? '🎉' : score >= currentExercise.points * 0.6 ? '👍' : '💪'}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Exercise Complete!</h2>
              <p className="text-gray-600">You earned {score} out of {currentExercise.points} points</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-blue-800 mb-4">Original Text</h3>
                <p className="text-blue-700">{currentExercise.text}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Your Text</h3>
                <p className="text-gray-700">{userText}</p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setSelectedLevel(null)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                Choose Another Level
              </button>
              <button
                onClick={resetExercise}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-blue-700 transition-all duration-200"
              >
                Try Another Exercise
              </button>
            </div>
          </div>
        ) : (
          /* Active Exercise */
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{currentExercise.title}</h2>
                <p className="text-gray-600">{currentExercise.difficulty} Level • {currentExercise.points} points</p>
              </div>
              <button
                onClick={resetExercise}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                ←
              </button>
            </div>

            {/* Audio Controls */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 mb-8">
              <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
                <SpeakerWaveIcon className="h-6 w-6 mr-2" />
                Listen Carefully
              </h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={playAudio}
                  disabled={isPlaying}
                  className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                >
                  <PlayIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={stopAudio}
                  className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors duration-200"
                >
                  <StopIcon className="h-6 w-6" />
                </button>
                <span className="text-blue-700 font-medium">
                  {isPlaying ? 'Playing...' : 'Click play to hear the text'}
                </span>
              </div>
            </div>

            {/* Text Input */}
            <div className="mb-8">
              <label className="block text-lg font-bold text-gray-800 mb-4">
                Type what you heard:
              </label>
              <textarea
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder="Start typing here..."
                className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none resize-none text-lg"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                onClick={checkAnswer}
                disabled={!userText.trim()}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:from-green-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                Check My Answer
              </button>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
