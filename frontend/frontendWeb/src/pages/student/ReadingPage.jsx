import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import StudentLayout from '../../components/student/StudentLayout';
import {
  BookOpenIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function ReadingPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();
  
  // State management
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentStory, setCurrentStory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [startTime, setStartTime] = useState(null);

  // Reading stories organized by level
  const stories = {
    beginner: [
      {
        id: 1,
        title: "The Friendly Cat",
        content: "Luna is a friendly cat. She has soft, gray fur and bright green eyes. Every morning, Luna sits by the window and watches the birds outside. She likes to play with a red ball and sleep in sunny spots. Luna's favorite food is fish, and she purrs loudly when she's happy.",
        difficulty: "Beginner",
        readingTime: 2,
        points: 30,
        questions: [
          {
            question: "What color are Luna's eyes?",
            options: ["Blue", "Green", "Brown", "Yellow"],
            correct: 1
          },
          {
            question: "What does Luna like to watch?",
            options: ["Cars", "Birds", "Dogs", "People"],
            correct: 1
          },
          {
            question: "What is Luna's favorite food?",
            options: ["Chicken", "Milk", "Fish", "Cheese"],
            correct: 2
          }
        ]
      },
      {
        id: 2,
        title: "A Day at the Park",
        content: "Tom and Sarah went to the park on a sunny day. They brought a picnic basket with sandwiches and juice. First, they played on the swings and went down the slide. Then they had their lunch under a big oak tree. After eating, they fed the ducks in the pond with bread crumbs. It was a perfect day!",
        difficulty: "Beginner",
        readingTime: 3,
        points: 35,
        questions: [
          {
            question: "What did Tom and Sarah bring to the park?",
            options: ["A ball", "A picnic basket", "A book", "A kite"],
            correct: 1
          },
          {
            question: "Where did they eat lunch?",
            options: ["On a bench", "Under a tree", "By the pond", "On the grass"],
            correct: 1
          },
          {
            question: "What did they feed the ducks?",
            options: ["Seeds", "Fish", "Bread crumbs", "Vegetables"],
            correct: 2
          }
        ]
      }
    ],
    intermediate: [
      {
        id: 3,
        title: "The Magic Garden",
        content: "Behind the old cottage, there was a secret garden that nobody had visited for years. When Emma discovered it, she found it overgrown with weeds and thorns. But as she began to clean and care for it, something magical happened. The flowers started to bloom in colors she had never seen before - purple roses that sparkled like diamonds and golden sunflowers that glowed in the moonlight. Emma realized that the garden responded to kindness and love.",
        difficulty: "Intermediate",
        readingTime: 4,
        points: 50,
        questions: [
          {
            question: "How long had the garden been unvisited?",
            options: ["Months", "Years", "Weeks", "Days"],
            correct: 1
          },
          {
            question: "What made the garden magical?",
            options: ["Special seeds", "Kindness and love", "Magic spells", "Fairy dust"],
            correct: 1
          },
          {
            question: "What color were the sparkling roses?",
            options: ["Red", "White", "Purple", "Pink"],
            correct: 2
          }
        ]
      }
    ],
    advanced: [
      {
        id: 4,
        title: "The Time Traveler's Dilemma",
        content: "Dr. Elizabeth Chen had spent decades perfecting her time machine, but she never anticipated the moral complexities that would arise from its use. When she successfully traveled back to 1885, she witnessed events that history books had recorded incorrectly. She faced an impossible choice: correct the historical record and potentially alter the timeline, or preserve the natural flow of events despite knowing the truth. The weight of this decision would haunt her for the rest of her scientific career.",
        difficulty: "Advanced",
        readingTime: 5,
        points: 75,
        questions: [
          {
            question: "What was Dr. Chen's profession?",
            options: ["Historian", "Scientist", "Teacher", "Writer"],
            correct: 1
          },
          {
            question: "What year did she travel back to?",
            options: ["1885", "1895", "1875", "1865"],
            correct: 0
          },
          {
            question: "What was her main dilemma?",
            options: ["Getting back to her time", "Finding the truth", "Correcting history vs preserving timeline", "Fixing her machine"],
            correct: 2
          }
        ]
      }
    ]
  };

  const levels = [
    {
      id: 'beginner',
      name: 'Beginner',
      emoji: '📖',
      color: 'green',
      description: 'Simple stories with basic vocabulary',
      bgClass: 'bg-gradient-to-br from-emerald-100 to-green-200',
      borderClass: 'border-emerald-300 hover:border-emerald-400',
      textClass: 'text-emerald-900',
      buttonClass: 'from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700',
      shadowClass: 'shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/60'
    },
    {
      id: 'intermediate',
      name: 'Intermediate',
      emoji: '📚',
      color: 'blue',
      description: 'Engaging stories with richer language',
      bgClass: 'bg-gradient-to-br from-blue-100 to-indigo-200',
      borderClass: 'border-blue-300 hover:border-blue-400',
      textClass: 'text-blue-900',
      buttonClass: 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
      shadowClass: 'shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/60'
    },
    {
      id: 'advanced',
      name: 'Advanced',
      emoji: '📜',
      color: 'purple',
      description: 'Complex narratives and themes',
      bgClass: 'bg-gradient-to-br from-purple-100 to-violet-200',
      borderClass: 'border-purple-300 hover:border-purple-400',
      textClass: 'text-purple-900',
      buttonClass: 'from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700',
      shadowClass: 'shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/60'
    }
  ];

  // Functions
  const startStory = (story) => {
    setCurrentStory(story);
    setCurrentQuestion(-1); // -1 means showing story content
    setUserAnswers([]);
    setShowResults(false);
    setScore(0);
    setStartTime(Date.now());
  };

  const startQuestions = () => {
    setCurrentQuestion(0);
  };

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...userAnswers, answerIndex];
    setUserAnswers(newAnswers);

    if (currentQuestion < currentStory.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate results
      const correctAnswers = newAnswers.filter((answer, index) =>
        answer === currentStory.questions[index].correct
      ).length;
      const finalScore = Math.round((correctAnswers / currentStory.questions.length) * currentStory.points);
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      
      setScore(finalScore);
      setReadingTime(timeSpent);
      setShowResults(true);
    }
  };

  const resetStory = () => {
    setCurrentStory(null);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setShowResults(false);
    setScore(0);
    setReadingTime(0);
    setStartTime(null);
  };

  // Authentication check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium text-lg animate-pulse">Loading your reading adventure...</p>
          <div className="mt-4 text-4xl animate-bounce">📚</div>
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
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 mb-4 border-2 border-blue-200">
            <span className="text-2xl">📚</span>
            <span className="text-lg font-bold text-blue-700">
              {t('student.readingComprehension')}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {t('student.discoverAmazingStories')}
          </h1>
          <p className="text-gray-600 text-lg">
            {t('student.readEngagingStories')}
          </p>
        </div>

        {/* Level Selection or Story Interface */}
        {!selectedLevel ? (
          /* Level Selection */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {levels.map((level) => (
              <div
                key={level.id}
                className={`group ${level.bgClass} rounded-3xl p-8 border-2 ${level.borderClass} ${level.shadowClass} transition-all duration-300 hover:-translate-y-2 cursor-pointer transform`}
                onClick={() => setSelectedLevel(level.id)}
              >
                <div className="text-center">
                  <div className="text-8xl mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                    {level.emoji}
                  </div>
                  <h3 className={`text-2xl font-bold ${level.textClass} mb-3 drop-shadow-sm`}>
                    {level.name}
                  </h3>
                  <p className="text-gray-700 mb-6 font-medium">
                    {level.description}
                  </p>
                  <div className="text-gray-700 text-sm mb-6">
                    {stories[level.id]?.length || 0} Stories Available
                  </div>
                  <button className={`w-full bg-gradient-to-r ${level.buttonClass} text-white rounded-2xl py-4 px-6 font-bold transition-all duration-200 transform group-hover:scale-105 text-lg`}>
                    Start Reading
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : !currentStory ? (
          /* Story Selection */
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
                    {levels.find(l => l.id === selectedLevel)?.name} Stories
                  </h2>
                  <p className="text-gray-600">
                    {levels.find(l => l.id === selectedLevel)?.description}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stories[selectedLevel]?.map((story) => (
                <div
                  key={story.id}
                  className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg cursor-pointer"
                  onClick={() => startStory(story)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{story.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                        {story.points} pts
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {story.content.substring(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{story.readingTime} min read</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>{story.questions.length} questions</span>
                      </div>
                    </div>
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
                      Read Story
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : showResults ? (
          /* Results Screen */
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-lg">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">
                {score >= currentStory.points * 0.8 ? '🎉' : score >= currentStory.points * 0.6 ? '👍' : '💪'}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Story Complete!</h2>
              <p className="text-gray-600">You earned {score} out of {currentStory.points} points</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 rounded-xl p-4 border border-green-200 text-center">
                <div className="text-2xl text-green-600 mb-2">✅</div>
                <div className="text-green-800 font-bold">
                  {userAnswers.filter((answer, index) => answer === currentStory.questions[index].correct).length}
                </div>
                <div className="text-green-600 text-sm">Correct Answers</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 text-center">
                <div className="text-2xl text-blue-600 mb-2">📊</div>
                <div className="text-blue-800 font-bold">
                  {Math.round((userAnswers.filter((answer, index) => answer === currentStory.questions[index].correct).length / currentStory.questions.length) * 100)}%
                </div>
                <div className="text-blue-600 text-sm">Accuracy</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 text-center">
                <div className="text-2xl text-purple-600 mb-2">⏱️</div>
                <div className="text-purple-800 font-bold">{readingTime}s</div>
                <div className="text-purple-600 text-sm">Reading Time</div>
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
                onClick={resetStory}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-blue-700 transition-all duration-200"
              >
                Read Another Story
              </button>
            </div>
          </div>
        ) : currentQuestion === -1 ? (
          /* Story Reading Screen */
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{currentStory.title}</h2>
                <p className="text-gray-600">{currentStory.difficulty} Level • {currentStory.points} points</p>
              </div>
              <button
                onClick={resetStory}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                ←
              </button>
            </div>

            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200 mb-8">
              <div className="flex items-center mb-4">
                <BookOpenIcon className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-bold text-blue-800">Read the story carefully</h3>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {currentStory.content}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startQuestions}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:from-green-600 hover:to-blue-700 transition-all duration-200 text-lg"
              >
                Start Questions ({currentStory.questions.length} questions)
              </button>
            </div>
          </div>
        ) : (
          /* Questions Screen */
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{currentStory.title}</h2>
                <p className="text-gray-600">Question {currentQuestion + 1} of {currentStory.questions.length}</p>
              </div>
              <button
                onClick={resetStory}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                ←
              </button>
            </div>

            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / currentStory.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {currentStory.questions[currentQuestion].question}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {currentStory.questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="text-left p-4 rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-gray-800 font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
