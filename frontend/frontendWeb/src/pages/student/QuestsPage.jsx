import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import StudentLayout from '../../components/student/StudentLayout';
import {
  TrophyIcon,
  StarIcon,
  CheckCircleIcon,
  XMarkIcon,
  LightBulbIcon,
  FireIcon
} from '@heroicons/react/24/outline';

export default function QuestsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [questCompleted, setQuestCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Quest data
  const quests = [
    {
      id: 1,
      title: "Spelling Champion",
      description: "Fix the spelling mistakes in these words",
      difficulty: "Easy",
      points: 50,
      emoji: "📝",
      color: "blue",
      questions: [
        {
          question: "Which spelling is correct?",
          options: ["recieve", "receive", "recive", "receeve"],
          correct: 1,
          explanation: "Remember: 'i' before 'e' except after 'c', but 'receive' is an exception!"
        },
        {
          question: "Choose the correct spelling:",
          options: ["seperate", "separate", "seperete", "separete"],
          correct: 1,
          explanation: "'Separate' has 'a' in the middle - think 'there's A RAT in separate!'"
        },
        {
          question: "Which is spelled correctly?",
          options: ["definately", "definetly", "definitely", "definitly"],
          correct: 2,
          explanation: "'Definitely' has 'finite' in the middle - it's definitely finite!"
        }
      ]
    },
    {
      id: 2,
      title: "Grammar Detective",
      description: "Solve grammar mysteries and fix sentences",
      difficulty: "Medium",
      points: 75,
      emoji: "🔍",
      color: "green",
      questions: [
        {
          question: "Choose the correct sentence:",
          options: [
            "Me and my friend went to the store",
            "My friend and I went to the store",
            "I and my friend went to the store",
            "My friend and me went to the store"
          ],
          correct: 1,
          explanation: "Use 'I' when you're the subject. Try removing 'my friend and' - you'd say 'I went' not 'me went'!"
        },
        {
          question: "Which sentence uses the apostrophe correctly?",
          options: [
            "The dog wagged it's tail",
            "The dog wagged its tail",
            "The dog wagged its' tail",
            "The dog wagged it's' tail"
          ],
          correct: 1,
          explanation: "'Its' (without apostrophe) shows possession. 'It's' means 'it is'!"
        }
      ]
    },
    {
      id: 3,
      title: "Punctuation Master",
      description: "Master the art of punctuation marks",
      difficulty: "Hard",
      points: 100,
      emoji: "🎯",
      color: "purple",
      questions: [
        {
          question: "Where should the comma go?",
          options: [
            "Before we eat let's wash our hands",
            "Before we eat, let's wash our hands",
            "Before, we eat let's wash our hands",
            "Before we, eat let's wash our hands"
          ],
          correct: 1,
          explanation: "Use a comma after introductory phrases like 'Before we eat'!"
        }
      ]
    }
  ];

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

  const startQuest = (quest) => {
    setSelectedQuest(quest);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setQuestCompleted(false);
    setScore(0);
  };

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...userAnswers, answerIndex];
    setUserAnswers(newAnswers);

    if (currentQuestion < selectedQuest.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quest completed
      const correctAnswers = newAnswers.filter((answer, index) =>
        answer === selectedQuest.questions[index].correct
      ).length;
      const finalScore = Math.round((correctAnswers / selectedQuest.questions.length) * selectedQuest.points);
      setScore(finalScore);
      setQuestCompleted(true);
    }
  };

  const resetQuest = () => {
    setSelectedQuest(null);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setQuestCompleted(false);
    setScore(0);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'green';
      case 'medium': return 'yellow';
      case 'hard': return 'red';
      default: return 'blue';
    }
  };

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-3 mb-4 border-2 border-purple-200">
            <span className="text-2xl">🎯</span>
            <span className="text-lg font-bold text-purple-700">
              {t('student.miniQuests')}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
            Learning Adventures Await!
          </h1>
          <p className="text-gray-600 text-lg">
            Complete fun challenges and earn amazing rewards!
          </p>
        </div>

        {/* Quest Selection or Active Quest */}
        {!selectedQuest ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quests.map((quest) => (
              <div
                key={quest.id}
                className={`group bg-gradient-to-br from-${quest.color}-50 to-${quest.color}-100 rounded-3xl p-6 border-2 border-${quest.color}-200 hover:border-${quest.color}-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 cursor-pointer`}
                onClick={() => startQuest(quest)}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {quest.emoji}
                  </div>
                  <h3 className={`text-xl font-bold text-${quest.color}-800 mb-2`}>
                    {quest.title}
                  </h3>
                  <p className={`text-${quest.color}-600 text-sm mb-4`}>
                    {quest.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-${getDifficultyColor(quest.difficulty)}-500`}>
                      {quest.difficulty}
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrophyIcon className="h-4 w-4 text-yellow-500" />
                      <span className="text-yellow-600 font-bold text-sm">{quest.points} XP</span>
                    </div>
                  </div>

                  <div className={`text-${quest.color}-600 text-sm mb-4`}>
                    {quest.questions.length} Questions
                  </div>

                  <button className={`w-full bg-gradient-to-r from-${quest.color}-500 to-${quest.color}-600 text-white rounded-2xl py-3 px-6 font-bold hover:from-${quest.color}-600 hover:to-${quest.color}-700 transition-all duration-200 transform group-hover:scale-105`}>
                    Start Quest
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : questCompleted ? (
          /* Quest Completion Screen */
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-lg text-center">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Quest Completed!</h2>
            <p className="text-gray-600 text-lg mb-6">
              Congratulations! You've completed "{selectedQuest.title}"
            </p>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200 mb-6">
              <div className="flex items-center justify-center space-x-4">
                <TrophyIcon className="h-12 w-12 text-yellow-500" />
                <div>
                  <div className="text-3xl font-bold text-yellow-600">{score} XP</div>
                  <div className="text-yellow-500">Points Earned</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="text-2xl text-green-600 mb-2">✅</div>
                <div className="text-green-800 font-bold">
                  {userAnswers.filter((answer, index) => answer === selectedQuest.questions[index].correct).length}
                </div>
                <div className="text-green-600 text-sm">Correct Answers</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="text-2xl text-blue-600 mb-2">📊</div>
                <div className="text-blue-800 font-bold">
                  {Math.round((userAnswers.filter((answer, index) => answer === selectedQuest.questions[index].correct).length / selectedQuest.questions.length) * 100)}%
                </div>
                <div className="text-blue-600 text-sm">Accuracy</div>
              </div>
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={resetQuest}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl py-3 px-6 font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                Try Another Quest
              </button>
              <button
                onClick={() => startQuest(selectedQuest)}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-2xl py-3 px-6 font-bold hover:from-green-600 hover:to-blue-700 transition-all duration-200"
              >
                Retry This Quest
              </button>
            </div>
          </div>
        ) : (
          /* Active Quest Screen */
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedQuest.title}</h2>
                <p className="text-gray-600">Question {currentQuestion + 1} of {selectedQuest.questions.length}</p>
              </div>
              <button
                onClick={resetQuest}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / selectedQuest.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {selectedQuest.questions[currentQuestion].question}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {selectedQuest.questions[currentQuestion].options.map((option, index) => (
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
