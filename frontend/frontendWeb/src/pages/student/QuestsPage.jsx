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
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [questCompleted, setQuestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes

  // Level definitions with enhanced contrast and modern design
  const levels = [
    {
      id: 'beginner',
      name: 'Beginner',
      description: 'Perfect for starting your learning journey',
      emoji: '🌱',
      color: 'green',
      bgClass: 'bg-gradient-to-br from-emerald-100 to-green-200',
      borderClass: 'border-emerald-300 hover:border-emerald-400',
      textClass: 'text-emerald-900',
      buttonClass: 'from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700',
      shadowClass: 'shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/60'
    },
    {
      id: 'intermediate',
      name: 'Intermediate',
      description: 'Ready for more challenging content',
      emoji: '🚀',
      color: 'blue',
      bgClass: 'bg-gradient-to-br from-blue-100 to-indigo-200',
      borderClass: 'border-blue-300 hover:border-blue-400',
      textClass: 'text-blue-900',
      buttonClass: 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
      shadowClass: 'shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/60'
    },
    {
      id: 'advanced',
      name: 'Advanced',
      description: 'Master level challenges await',
      emoji: '🏆',
      color: 'purple',
      bgClass: 'bg-gradient-to-br from-purple-100 to-violet-200',
      borderClass: 'border-purple-300 hover:border-purple-400',
      textClass: 'text-purple-900',
      buttonClass: 'from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700',
      shadowClass: 'shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/60'
    }
  ];

  // Quest data organized by level
  const questsByLevel = {
    beginner: [
      {
        id: 1,
        title: "Basic Spelling",
        description: "Learn to spell common words correctly",
        points: 30,
        emoji: "📝",
        color: "green",
        timeLimit: 180,
        questions: [
          {
            question: "Which spelling is correct?",
            options: ["cat", "kat", "catt", "cet"],
            correct: 0,
            explanation: "Cat is spelled C-A-T. It's a simple three-letter word!"
          },
          {
            question: "Choose the correct spelling:",
            options: ["dog", "dogg", "doge", "dag"],
            correct: 0,
            explanation: "Dog is spelled D-O-G. Remember, most simple animal names are short!"
          },
          {
            question: "Which is spelled correctly?",
            options: ["hous", "house", "howse", "houes"],
            correct: 1,
            explanation: "House is spelled H-O-U-S-E. The 'ou' makes the 'ow' sound!"
          },
          {
            question: "Pick the right spelling:",
            options: ["tre", "tree", "trea", "trei"],
            correct: 1,
            explanation: "Tree has two 'e's at the end. Trees are tall and have leaves!"
          },
          {
            question: "Which spelling is right?",
            options: ["buk", "book", "bouk", "bok"],
            correct: 1,
            explanation: "Book has two 'o's in the middle. Books help us learn!"
          }
        ]
      },
      {
        id: 2,
        title: "Simple Grammar",
        description: "Learn basic grammar rules",
        points: 35,
        emoji: "📚",
        color: "blue",
        timeLimit: 180,
        questions: [
          {
            question: "Which sentence is correct?",
            options: ["I am happy", "I are happy", "I is happy", "I be happy"],
            correct: 0,
            explanation: "Use 'am' with 'I'. I am, you are, he/she is!"
          },
          {
            question: "Choose the right sentence:",
            options: ["The cat are sleeping", "The cat is sleeping", "The cat am sleeping", "The cat be sleeping"],
            correct: 1,
            explanation: "Use 'is' with singular nouns like 'cat'. The cat is sleeping."
          },
          {
            question: "Which is correct?",
            options: ["I like apple", "I like apples", "I likes apple", "I likes apples"],
            correct: 1,
            explanation: "Use 'like' with 'I' and add 's' to make 'apple' plural: 'apples'!"
          },
          {
            question: "Pick the correct sentence:",
            options: ["She have a book", "She has a book", "She haves a book", "She having a book"],
            correct: 1,
            explanation: "Use 'has' with 'she', 'he', or 'it'. She has, he has, it has!"
          },
          {
            question: "Which sentence is right?",
            options: ["We goes to school", "We go to school", "We going to school", "We gone to school"],
            correct: 1,
            explanation: "Use 'go' with 'we'. We go, they go, but he/she goes!"
          }
        ]
      },
      {
        id: 3,
        title: "Animal Names",
        description: "Learn to spell animal names",
        points: 25,
        emoji: "🐾",
        color: "yellow",
        timeLimit: 120,
        questions: [
          {
            question: "How do you spell this animal?",
            options: ["elefant", "elephant", "eliphant", "elephent"],
            correct: 1,
            explanation: "Elephant is spelled E-L-E-P-H-A-N-T. Remember the 'ph' sound!"
          },
          {
            question: "Choose the correct spelling:",
            options: ["rabit", "rabbit", "rabitt", "rabbitt"],
            correct: 1,
            explanation: "Rabbit has double 'b' in the middle: R-A-B-B-I-T!"
          },
          {
            question: "Which is correct?",
            options: ["giraff", "girafe", "giraffe", "giraf"],
            correct: 2,
            explanation: "Giraffe ends with double 'f' and 'e': G-I-R-A-F-F-E!"
          }
        ]
      },
      {
        id: 4,
        title: "Colors & Shapes",
        description: "Spell colors and shapes correctly",
        points: 30,
        emoji: "🌈",
        color: "pink",
        timeLimit: 150,
        questions: [
          {
            question: "How do you spell this color?",
            options: ["purpel", "purple", "purpal", "perpul"],
            correct: 1,
            explanation: "Purple is spelled P-U-R-P-L-E. Remember the 'ur' sound!"
          },
          {
            question: "Choose the correct spelling:",
            options: ["orenge", "orange", "ornge", "orang"],
            correct: 1,
            explanation: "Orange is spelled O-R-A-N-G-E. Don't forget the 'a'!"
          },
          {
            question: "Which shape is spelled correctly?",
            options: ["circul", "circle", "circel", "circl"],
            correct: 1,
            explanation: "Circle is spelled C-I-R-C-L-E. It ends with 'le'!"
          }
        ]
      },
      {
        id: 5,
        title: "Family Words",
        description: "Learn to spell family member names",
        points: 25,
        emoji: "👨‍👩‍👧‍👦",
        color: "purple",
        timeLimit: 120,
        questions: [
          {
            question: "How do you spell this family member?",
            options: ["mother", "mothar", "mothur", "mothor"],
            correct: 0,
            explanation: "Mother is spelled M-O-T-H-E-R. Simple and sweet!"
          },
          {
            question: "Choose the correct spelling:",
            options: ["fathar", "father", "fathur", "fathor"],
            correct: 1,
            explanation: "Father is spelled F-A-T-H-E-R. Just like mother but with 'f'!"
          },
          {
            question: "Which is correct?",
            options: ["sister", "sistur", "sistir", "sistar"],
            correct: 0,
            explanation: "Sister is spelled S-I-S-T-E-R. Easy to remember!"
          }
        ]
      },
      {
        id: 6,
        title: "Food Words",
        description: "Spell your favorite foods",
        points: 30,
        emoji: "🍎",
        color: "red",
        timeLimit: 150,
        questions: [
          {
            question: "How do you spell this fruit?",
            options: ["aple", "apple", "apel", "appel"],
            correct: 1,
            explanation: "Apple has double 'p': A-P-P-L-E. An apple a day!"
          },
          {
            question: "Choose the correct spelling:",
            options: ["bananna", "banana", "bannana", "bananna"],
            correct: 1,
            explanation: "Banana is spelled B-A-N-A-N-A. Three 'a's and two 'n's!"
          },
          {
            question: "Which is correct?",
            options: ["bred", "bread", "braid", "bredd"],
            correct: 1,
            explanation: "Bread is spelled B-R-E-A-D. The 'ea' makes the 'e' sound!"
          }
        ]
      },
      {
        id: 7,
        title: "Action Words",
        description: "Learn to spell simple verbs",
        points: 35,
        emoji: "🏃‍♂️",
        color: "orange",
        timeLimit: 180,
        questions: [
          {
            question: "How do you spell this action?",
            options: ["runing", "running", "runing", "runnig"],
            correct: 1,
            explanation: "Running has double 'n': R-U-N-N-I-N-G. Keep running!"
          },
          {
            question: "Choose the correct spelling:",
            options: ["jumping", "jumpping", "jumpeng", "jumpig"],
            correct: 0,
            explanation: "Jumping is spelled J-U-M-P-I-N-G. Simple and fun!"
          },
          {
            question: "Which is correct?",
            options: ["swiming", "swimming", "swimeng", "swimmig"],
            correct: 1,
            explanation: "Swimming has double 'm': S-W-I-M-M-I-N-G. Dive in!"
          }
        ]
      },
      {
        id: 8,
        title: "Number Words",
        description: "Spell numbers from one to ten",
        points: 25,
        emoji: "🔢",
        color: "blue",
        timeLimit: 120,
        questions: [
          {
            question: "How do you spell this number?",
            options: ["thre", "three", "tree", "threa"],
            correct: 1,
            explanation: "Three is spelled T-H-R-E-E. Don't confuse it with tree!"
          },
          {
            question: "Choose the correct spelling:",
            options: ["ate", "eight", "eght", "eigth"],
            correct: 1,
            explanation: "Eight is spelled E-I-G-H-T. The 'eigh' makes the long 'a' sound!"
          },
          {
            question: "Which is correct?",
            options: ["nien", "nine", "nyne", "nin"],
            correct: 1,
            explanation: "Nine is spelled N-I-N-E. Simple and fine!"
          }
        ]
      },
      {
        id: 9,
        title: "Weather Words",
        description: "Learn to spell weather terms",
        points: 30,
        emoji: "🌤️",
        color: "cyan",
        timeLimit: 150,
        questions: [
          {
            question: "How do you spell this weather?",
            options: ["suny", "sunny", "sunni", "suni"],
            correct: 1,
            explanation: "Sunny has double 'n': S-U-N-N-Y. A bright sunny day!"
          },
          {
            question: "Choose the correct spelling:",
            options: ["rainy", "raini", "rainey", "rani"],
            correct: 0,
            explanation: "Rainy is spelled R-A-I-N-Y. When it rains, it's rainy!"
          },
          {
            question: "Which is correct?",
            options: ["snowy", "snowi", "snowey", "snoy"],
            correct: 0,
            explanation: "Snowy is spelled S-N-O-W-Y. When it snows, it's snowy!"
          }
        ]
      },
      {
        id: 10,
        title: "School Words",
        description: "Spell words you use at school",
        points: 35,
        emoji: "🏫",
        color: "indigo",
        timeLimit: 180,
        questions: [
          {
            question: "How do you spell this school item?",
            options: ["pensil", "pencil", "pencl", "pensul"],
            correct: 1,
            explanation: "Pencil is spelled P-E-N-C-I-L. Write with a pencil!"
          },
          {
            question: "Choose the correct spelling:",
            options: ["techer", "teacher", "teachur", "techr"],
            correct: 1,
            explanation: "Teacher is spelled T-E-A-C-H-E-R. Your teacher helps you learn!"
          },
          {
            question: "Which is correct?",
            options: ["studant", "student", "studunt", "studint"],
            correct: 1,
            explanation: "Student is spelled S-T-U-D-E-N-T. You are a student!"
          }
        ]
      }
    ],
    intermediate: [
      {
        id: 3,
        title: "Spelling Challenge",
        description: "Master tricky spelling patterns",
        points: 50,
        emoji: "🎯",
        color: "orange",
        timeLimit: 180,
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
          },
          {
            question: "Pick the correct spelling:",
            options: ["occured", "occurred", "ocurred", "occureed"],
            correct: 1,
            explanation: "'Occurred' doubles the 'r' before adding '-ed'. It occurred yesterday!"
          },
          {
            question: "Which is right?",
            options: ["necesary", "necessary", "neccessary", "necessery"],
            correct: 1,
            explanation: "'Necessary' has one 'c' and two 's's. It's necessary to remember!"
          }
        ]
      },
      {
        id: 4,
        title: "Grammar Rules",
        description: "Master complex grammar patterns",
        points: 55,
        emoji: "⚡",
        color: "purple",
        timeLimit: 180,
        questions: [
          {
            question: "Choose the correct sentence:",
            options: [
              "Between you and I, this is wrong",
              "Between you and me, this is correct",
              "Between you and myself, this works",
              "Between you and us, this fits"
            ],
            correct: 1,
            explanation: "Use 'me' after prepositions like 'between'. Between you and me!"
          },
          {
            question: "Which sentence is correct?",
            options: [
              "Who did you give the book to?",
              "Whom did you give the book to?",
              "Who did you gave the book to?",
              "Whom did you gave the book to?"
            ],
            correct: 1,
            explanation: "Use 'whom' when it's the object. 'Whom did you give it to?'"
          },
          {
            question: "Pick the right sentence:",
            options: [
              "If I was rich, I would travel",
              "If I were rich, I would travel",
              "If I am rich, I would travel",
              "If I will be rich, I would travel"
            ],
            correct: 1,
            explanation: "Use 'were' in hypothetical situations. 'If I were rich...' (subjunctive mood)"
          },
          {
            question: "Choose correctly:",
            options: [
              "Neither of the books are good",
              "Neither of the books is good",
              "Neither of the books were good",
              "Neither of the books have been good"
            ],
            correct: 1,
            explanation: "'Neither' is singular, so use 'is'. Neither of the books is good."
          },
          {
            question: "Which is correct?",
            options: [
              "I could care less about that",
              "I couldn't care less about that",
              "I could care fewer about that",
              "I couldn't care fewer about that"
            ],
            correct: 1,
            explanation: "'Couldn't care less' means you care so little that you couldn't care any less!"
          }
        ]
      },
      {
        id: 11,
        title: "Punctuation Master",
        description: "Learn proper punctuation usage",
        points: 45,
        emoji: "📍",
        color: "green",
        timeLimit: 180,
        questions: [
          {
            question: "Which sentence is punctuated correctly?",
            options: [
              "Its a beautiful day outside.",
              "It's a beautiful day outside.",
              "Its' a beautiful day outside.",
              "It's a beautiful day outside"
            ],
            correct: 1,
            explanation: "Use 'it's' (with apostrophe) for 'it is'. 'Its' is possessive without apostrophe."
          },
          {
            question: "Choose the correct punctuation:",
            options: [
              "I bought apples, oranges, and bananas.",
              "I bought apples oranges and bananas.",
              "I bought apples, oranges and, bananas.",
              "I bought apples; oranges; and bananas."
            ],
            correct: 0,
            explanation: "Use commas to separate items in a list. The Oxford comma before 'and' is recommended."
          },
          {
            question: "Which is correct?",
            options: [
              "She said 'Hello' to me.",
              "She said, 'Hello' to me.",
              "She said \"Hello\" to me.",
              "She said, \"Hello\" to me."
            ],
            correct: 3,
            explanation: "Use a comma before quoted speech and double quotes for dialogue."
          }
        ]
      },
      {
        id: 12,
        title: "Word Confusion",
        description: "Master commonly confused words",
        points: 50,
        emoji: "🤔",
        color: "yellow",
        timeLimit: 180,
        questions: [
          {
            question: "Choose the correct word: 'The weather will _____ our picnic plans.'",
            options: ["affect", "effect", "infect", "defect"],
            correct: 0,
            explanation: "'Affect' is a verb meaning to influence. 'Effect' is a noun meaning result."
          },
          {
            question: "Which is correct: 'I need to _____ down for a nap.'",
            options: ["lay", "lie", "laid", "lied"],
            correct: 1,
            explanation: "'Lie' means to recline. 'Lay' means to place something down and needs an object."
          },
          {
            question: "Pick the right word: 'She gave good _____ about studying.'",
            options: ["advise", "advice", "devise", "device"],
            correct: 1,
            explanation: "'Advice' is a noun (what you give). 'Advise' is a verb (what you do)."
          }
        ]
      },
      {
        id: 13,
        title: "Sentence Structure",
        description: "Build complex sentences correctly",
        points: 55,
        emoji: "🏗️",
        color: "blue",
        timeLimit: 200,
        questions: [
          {
            question: "Which sentence has correct parallel structure?",
            options: [
              "I like swimming, running, and to bike.",
              "I like swimming, running, and biking.",
              "I like to swim, running, and biking.",
              "I like swim, run, and bike."
            ],
            correct: 1,
            explanation: "Parallel structure uses the same grammatical form: swimming, running, and biking."
          },
          {
            question: "Choose the sentence without a dangling modifier:",
            options: [
              "Walking to school, the rain started falling.",
              "Walking to school, I got caught in the rain.",
              "Walking to school, my backpack got wet.",
              "Walking to school, the weather turned bad."
            ],
            correct: 1,
            explanation: "The modifier 'walking to school' should clearly refer to 'I', not rain or backpack."
          },
          {
            question: "Which sentence is a complete thought?",
            options: [
              "Because I was tired.",
              "When the bell rang.",
              "Although it was raining.",
              "I went home early."
            ],
            correct: 3,
            explanation: "A complete sentence needs a subject and predicate. The others are fragments."
          }
        ]
      },
      {
        id: 14,
        title: "Verb Tenses",
        description: "Master past, present, and future tenses",
        points: 50,
        emoji: "⏰",
        color: "red",
        timeLimit: 180,
        questions: [
          {
            question: "Which sentence uses the correct past perfect tense?",
            options: [
              "I had went to the store before you called.",
              "I had gone to the store before you called.",
              "I have went to the store before you called.",
              "I went to the store before you called."
            ],
            correct: 1,
            explanation: "Past perfect uses 'had' + past participle. 'Gone' is the past participle of 'go'."
          },
          {
            question: "Choose the correct future tense:",
            options: [
              "I will going to the party tomorrow.",
              "I am going to go to the party tomorrow.",
              "I will go to the party tomorrow.",
              "I going to the party tomorrow."
            ],
            correct: 2,
            explanation: "Simple future tense uses 'will' + base verb: 'will go'."
          },
          {
            question: "Which shows correct present perfect?",
            options: [
              "I have saw that movie before.",
              "I have seen that movie before.",
              "I had saw that movie before.",
              "I seen that movie before."
            ],
            correct: 1,
            explanation: "Present perfect uses 'have/has' + past participle. 'Seen' is the past participle of 'see'."
          }
        ]
      },
      {
        id: 15,
        title: "Advanced Spelling",
        description: "Spell challenging words correctly",
        points: 60,
        emoji: "🎓",
        color: "purple",
        timeLimit: 200,
        questions: [
          {
            question: "Which spelling is correct?",
            options: ["accomodate", "accommodate", "acomodate", "acommodate"],
            correct: 1,
            explanation: "'Accommodate' has double 'c' and double 'm'. Remember: it accommodates two of each!"
          },
          {
            question: "Choose the correct spelling:",
            options: ["embarass", "embarras", "embarrass", "embaress"],
            correct: 2,
            explanation: "'Embarrass' has double 'r' and double 's'. Don't be embarrassed to remember!"
          },
          {
            question: "Which is spelled correctly?",
            options: ["mischievous", "mischievious", "mischevious", "mischevous"],
            correct: 0,
            explanation: "'Mischievous' has no 'i' after 'v'. It's pronounced MIS-chi-vous, not mis-CHEE-vi-ous."
          }
        ]
      },
      {
        id: 16,
        title: "Reading Comprehension",
        description: "Understand complex texts",
        points: 55,
        emoji: "📖",
        color: "indigo",
        timeLimit: 240,
        questions: [
          {
            question: "What does 'ubiquitous' mean in: 'Smartphones have become ubiquitous in modern society'?",
            options: ["expensive", "everywhere", "unnecessary", "advanced"],
            correct: 1,
            explanation: "'Ubiquitous' means present everywhere. Smartphones are found everywhere in modern society."
          },
          {
            question: "In 'The author's tone was sardonic', what does 'sardonic' suggest?",
            options: ["cheerful", "serious", "mocking", "confused"],
            correct: 2,
            explanation: "'Sardonic' means grimly mocking or cynical. The author was being sarcastic or scornful."
          },
          {
            question: "What is the main idea of: 'Despite initial setbacks, the project ultimately succeeded due to team perseverance'?",
            options: ["The project failed", "Setbacks are common", "Perseverance leads to success", "Teams work well"],
            correct: 2,
            explanation: "The main idea is that perseverance (not giving up) led to success despite early problems."
          }
        ]
      },
      {
        id: 17,
        title: "Figurative Language",
        description: "Understand metaphors and similes",
        points: 45,
        emoji: "🎭",
        color: "pink",
        timeLimit: 180,
        questions: [
          {
            question: "What type of figurative language is 'Time is money'?",
            options: ["simile", "metaphor", "personification", "alliteration"],
            correct: 1,
            explanation: "A metaphor directly compares two things without 'like' or 'as'. Time is compared to money."
          },
          {
            question: "Identify the simile: 'Her voice was like music to my ears.'",
            options: ["Her voice was music", "like music", "to my ears", "voice was like music"],
            correct: 3,
            explanation: "A simile compares using 'like' or 'as'. 'Voice was like music' is the complete simile."
          },
          {
            question: "What does 'The wind whispered through the trees' show?",
            options: ["metaphor", "simile", "personification", "hyperbole"],
            correct: 2,
            explanation: "Personification gives human qualities to non-human things. Wind can't actually whisper."
          }
        ]
      },
      {
        id: 18,
        title: "Context Clues",
        description: "Figure out word meanings from context",
        points: 50,
        emoji: "🔍",
        color: "orange",
        timeLimit: 200,
        questions: [
          {
            question: "In 'The cacophony of car horns made it impossible to sleep', what does 'cacophony' mean?",
            options: ["silence", "harsh noise", "music", "rhythm"],
            correct: 1,
            explanation: "Context clues: car horns making it impossible to sleep suggests harsh, loud noise."
          },
          {
            question: "What does 'meticulous' mean in 'She was meticulous about cleaning, checking every corner twice'?",
            options: ["careless", "very careful", "quick", "lazy"],
            correct: 1,
            explanation: "Checking every corner twice shows extreme care and attention to detail."
          },
          {
            question: "In 'His gregarious nature made him popular at parties', what does 'gregarious' suggest?",
            options: ["shy", "sociable", "rude", "intelligent"],
            correct: 1,
            explanation: "Being popular at parties suggests someone who is sociable and enjoys being with others."
          }
        ]
      }
    ],
    advanced: [
      {
        id: 5,
        title: "Advanced Vocabulary",
        description: "Master sophisticated word usage",
        points: 75,
        emoji: "🧠",
        color: "indigo",
        timeLimit: 180,
        questions: [
          {
            question: "Choose the word that best fits: 'The politician's speech was full of _____ designed to mislead voters.'",
            options: ["euphemisms", "hyperbole", "rhetoric", "sophistry"],
            correct: 3,
            explanation: "Sophistry refers to clever but misleading arguments. Perfect for deceptive political speech!"
          },
          {
            question: "Which word means 'existing in name only'?",
            options: ["nominal", "titular", "ostensible", "perfunctory"],
            correct: 0,
            explanation: "Nominal means existing in name only, not in reality. A nominal fee is very small."
          },
          {
            question: "Select the word meaning 'to make less severe':",
            options: ["exacerbate", "mitigate", "perpetuate", "vindicate"],
            correct: 1,
            explanation: "Mitigate means to make less severe or serious. We mitigate problems to solve them."
          },
          {
            question: "Which word describes someone who is 'stubbornly refusing to change'?",
            options: ["malleable", "obstinate", "gregarious", "sanguine"],
            correct: 1,
            explanation: "Obstinate means stubbornly refusing to change opinion or course of action."
          },
          {
            question: "Choose the word meaning 'characterized by vulgar display of wealth':",
            options: ["ostentatious", "parsimonious", "magnanimous", "ubiquitous"],
            correct: 0,
            explanation: "Ostentatious means characterized by vulgar or pretentious display designed to impress."
          }
        ]
      },
      {
        id: 6,
        title: "Complex Grammar",
        description: "Navigate the trickiest grammar rules",
        points: 80,
        emoji: "🎓",
        color: "red",
        timeLimit: 180,
        questions: [
          {
            question: "Choose the correct sentence:",
            options: [
              "The data shows a clear trend",
              "The data show a clear trend",
              "The data is showing a clear trend",
              "The data are showing a clear trend"
            ],
            correct: 1,
            explanation: "'Data' is plural (singular: datum), so use 'show'. The data show a clear trend."
          },
          {
            question: "Which sentence uses the subjunctive mood correctly?",
            options: [
              "I wish I was taller",
              "I wish I were taller",
              "I wish I am taller",
              "I wish I will be taller"
            ],
            correct: 1,
            explanation: "Use 'were' in wishes and hypothetical situations. 'I wish I were taller.'"
          },
          {
            question: "Select the sentence with correct parallel structure:",
            options: [
              "She likes reading, writing, and to paint",
              "She likes reading, writing, and painting",
              "She likes to read, writing, and painting",
              "She likes to read, to write, and painting"
            ],
            correct: 1,
            explanation: "Parallel structure requires the same grammatical form: reading, writing, and painting."
          },
          {
            question: "Choose the correct use of 'lay' vs 'lie':",
            options: [
              "I'm going to lay down for a nap",
              "I'm going to lie down for a nap",
              "I'm going to laid down for a nap",
              "I'm going to lying down for a nap"
            ],
            correct: 1,
            explanation: "'Lie' means to recline (no object needed). 'Lay' means to place something down."
          },
          {
            question: "Which sentence correctly uses 'fewer' vs 'less'?",
            options: [
              "There are less people here today",
              "There are fewer people here today",
              "There is less people here today",
              "There is fewer people here today"
            ],
            correct: 1,
            explanation: "Use 'fewer' with countable nouns (people). Use 'less' with uncountable nouns (water)."
          }
        ]
      },
      {
        id: 19,
        title: "Literary Analysis",
        description: "Analyze literary devices and themes",
        points: 85,
        emoji: "📚",
        color: "purple",
        timeLimit: 240,
        questions: [
          {
            question: "What literary device is used in 'The classroom was a zoo'?",
            options: ["simile", "metaphor", "personification", "alliteration"],
            correct: 1,
            explanation: "A metaphor directly compares two unlike things without 'like' or 'as'. The classroom is compared to a zoo."
          },
          {
            question: "In 'The old oak tree stood sentinel over the graveyard', what technique is used?",
            options: ["metaphor", "simile", "personification", "hyperbole"],
            correct: 2,
            explanation: "Personification gives human qualities to non-human things. The tree is given the human role of a sentinel (guard)."
          },
          {
            question: "What does the 'green light' symbolize in The Great Gatsby?",
            options: ["money", "hope and dreams", "jealousy", "nature"],
            correct: 1,
            explanation: "The green light symbolizes Gatsby's hopes and dreams, particularly his longing for Daisy and the American Dream."
          }
        ]
      },
      {
        id: 20,
        title: "Etymology & Word Origins",
        description: "Understand how words evolved",
        points: 70,
        emoji: "🌍",
        color: "green",
        timeLimit: 200,
        questions: [
          {
            question: "The word 'telephone' comes from Greek roots meaning:",
            options: ["far sound", "voice machine", "distant call", "speaking device"],
            correct: 0,
            explanation: "'Tele' means far/distant and 'phone' means sound/voice. Telephone = far sound."
          },
          {
            question: "What does the Latin root 'bene' mean in words like 'benefit' and 'benevolent'?",
            options: ["good", "bad", "many", "one"],
            correct: 0,
            explanation: "'Bene' means good or well. Benefit = good result, benevolent = good-willed."
          },
          {
            question: "The word 'democracy' comes from Greek words meaning:",
            options: ["people rule", "fair government", "equal rights", "free choice"],
            correct: 0,
            explanation: "'Demos' means people and 'kratos' means rule/power. Democracy = people rule."
          }
        ]
      },
      {
        id: 21,
        title: "Advanced Rhetoric",
        description: "Master persuasive language techniques",
        points: 80,
        emoji: "🎯",
        color: "orange",
        timeLimit: 220,
        questions: [
          {
            question: "What rhetorical device is 'Ask not what your country can do for you'?",
            options: ["chiasmus", "anaphora", "epistrophe", "zeugma"],
            correct: 0,
            explanation: "Chiasmus reverses the structure of phrases. 'Ask not what your country can do for you—ask what you can do for your country.'"
          },
          {
            question: "Which appeal does 'Studies show that 90% of doctors recommend this treatment' use?",
            options: ["ethos", "pathos", "logos", "kairos"],
            correct: 2,
            explanation: "Logos appeals to logic and reason through statistics, facts, and evidence."
          },
          {
            question: "What technique repeats the same word at the beginning of successive clauses?",
            options: ["epistrophe", "anaphora", "chiasmus", "polysyndeton"],
            correct: 1,
            explanation: "Anaphora repeats words at the beginning. Example: 'We shall fight... We shall never surrender...'"
          }
        ]
      },
      {
        id: 22,
        title: "Critical Thinking",
        description: "Analyze arguments and logic",
        points: 90,
        emoji: "🧩",
        color: "blue",
        timeLimit: 250,
        questions: [
          {
            question: "What logical fallacy is 'Everyone else is doing it, so it must be right'?",
            options: ["ad hominem", "bandwagon", "straw man", "false dilemma"],
            correct: 1,
            explanation: "Bandwagon fallacy assumes something is correct because it's popular or widely accepted."
          },
          {
            question: "Which fallacy attacks the person rather than their argument?",
            options: ["ad hominem", "red herring", "slippery slope", "circular reasoning"],
            correct: 0,
            explanation: "Ad hominem attacks the person making the argument instead of addressing the argument itself."
          },
          {
            question: "What fallacy presents only two options when more exist?",
            options: ["false cause", "false dilemma", "hasty generalization", "appeal to authority"],
            correct: 1,
            explanation: "False dilemma (false dichotomy) presents only two choices when other options are available."
          }
        ]
      },
      {
        id: 23,
        title: "Academic Writing",
        description: "Master formal writing conventions",
        points: 75,
        emoji: "✍️",
        color: "indigo",
        timeLimit: 200,
        questions: [
          {
            question: "Which thesis statement is most effective?",
            options: [
              "This essay will discuss social media.",
              "Social media is bad for teenagers.",
              "Social media negatively impacts teenage mental health through increased anxiety and decreased self-esteem.",
              "I think social media has some problems."
            ],
            correct: 2,
            explanation: "An effective thesis is specific, arguable, and clearly states the main claim with supporting points."
          },
          {
            question: "What makes a strong topic sentence?",
            options: [
              "It introduces the paragraph's main idea",
              "It connects to the thesis",
              "It's specific and focused",
              "All of the above"
            ],
            correct: 3,
            explanation: "A strong topic sentence introduces the main idea, connects to the thesis, and is specific and focused."
          },
          {
            question: "Which transition word shows contrast?",
            options: ["furthermore", "however", "therefore", "similarly"],
            correct: 1,
            explanation: "'However' shows contrast or opposition. 'Furthermore' adds information, 'therefore' shows result, 'similarly' shows comparison."
          }
        ]
      },
      {
        id: 24,
        title: "Language Evolution",
        description: "Understand how language changes",
        points: 65,
        emoji: "🔄",
        color: "pink",
        timeLimit: 180,
        questions: [
          {
            question: "What process created the word 'brunch' from 'breakfast' and 'lunch'?",
            options: ["borrowing", "blending", "clipping", "acronym"],
            correct: 1,
            explanation: "Blending combines parts of two words. 'Brunch' blends 'br(eakfast)' and '(l)unch'."
          },
          {
            question: "The word 'phone' from 'telephone' is an example of:",
            options: ["blending", "clipping", "borrowing", "coinage"],
            correct: 1,
            explanation: "Clipping shortens a longer word. 'Phone' is clipped from 'telephone'."
          },
          {
            question: "What linguistic process borrowed 'kindergarten' from German?",
            options: ["calque", "borrowing", "folk etymology", "semantic shift"],
            correct: 1,
            explanation: "Borrowing takes words from other languages. English borrowed 'kindergarten' directly from German."
          }
        ]
      },
      {
        id: 25,
        title: "Syntax Mastery",
        description: "Master complex sentence structures",
        points: 85,
        emoji: "🏗️",
        color: "red",
        timeLimit: 220,
        questions: [
          {
            question: "Identify the sentence type: 'Although it was raining, we went to the park, and we had fun.'",
            options: ["simple", "compound", "complex", "compound-complex"],
            correct: 3,
            explanation: "Compound-complex has multiple independent clauses and at least one dependent clause."
          },
          {
            question: "What is the function of 'that I bought yesterday' in 'The book that I bought yesterday is excellent'?",
            options: ["noun clause", "adjective clause", "adverb clause", "independent clause"],
            correct: 1,
            explanation: "The adjective clause 'that I bought yesterday' modifies the noun 'book'."
          },
          {
            question: "In 'Running quickly, she caught the bus', what is 'Running quickly'?",
            options: ["gerund phrase", "participial phrase", "infinitive phrase", "prepositional phrase"],
            correct: 1,
            explanation: "A participial phrase begins with a participle (running) and modifies the subject (she)."
          }
        ]
      },
      {
        id: 26,
        title: "Semantic Analysis",
        description: "Understand meaning and connotation",
        points: 80,
        emoji: "🎭",
        color: "cyan",
        timeLimit: 200,
        questions: [
          {
            question: "What's the difference between 'childish' and 'childlike'?",
            options: [
              "No difference",
              "Childish is positive, childlike is negative",
              "Childish is negative, childlike is positive",
              "They refer to different ages"
            ],
            correct: 2,
            explanation: "'Childish' has negative connotations (immature), while 'childlike' has positive connotations (innocent, pure)."
          },
          {
            question: "Which word has the most positive connotation?",
            options: ["skinny", "thin", "slender", "scrawny"],
            correct: 2,
            explanation: "'Slender' has positive connotations suggesting grace and attractiveness, while others can be negative."
          },
          {
            question: "What semantic relationship exists between 'hot' and 'cold'?",
            options: ["synonyms", "antonyms", "homonyms", "hyponyms"],
            correct: 1,
            explanation: "Antonyms are words with opposite meanings. Hot and cold are opposite temperatures."
          }
        ]
      }
    ]
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

  const startQuest = (quest) => {
    setSelectedQuest(quest);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setQuestCompleted(false);
    setScore(0);
    setShowResults(false);
    setTimeLeft(quest.timeLimit || 180);
  };

  const selectLevel = (level) => {
    setSelectedLevel(level);
  };

  const backToLevels = () => {
    setSelectedLevel(null);
    setSelectedQuest(null);
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
      setShowResults(true);
    }
  };

  const resetQuest = () => {
    setSelectedQuest(null);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setQuestCompleted(false);
    setScore(0);
    setShowResults(false);
  };

  const backToQuests = () => {
    setSelectedQuest(null);
    setQuestCompleted(false);
    setShowResults(false);
  };

  // Enhanced helper function for quest color classes with better contrast
  const getQuestColorClasses = (color) => {
    const colorMap = {
      green: {
        bgClass: 'bg-gradient-to-br from-emerald-100 to-green-200',
        borderClass: 'border-emerald-300 hover:border-emerald-400',
        textClass: 'text-emerald-900',
        buttonClass: 'from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700',
        shadowClass: 'shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/60'
      },
      blue: {
        bgClass: 'bg-gradient-to-br from-blue-100 to-sky-200',
        borderClass: 'border-blue-300 hover:border-blue-400',
        textClass: 'text-blue-900',
        buttonClass: 'from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700',
        shadowClass: 'shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/60'
      },
      orange: {
        bgClass: 'bg-gradient-to-br from-orange-100 to-amber-200',
        borderClass: 'border-orange-300 hover:border-orange-400',
        textClass: 'text-orange-900',
        buttonClass: 'from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700',
        shadowClass: 'shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/60'
      },
      purple: {
        bgClass: 'bg-gradient-to-br from-purple-100 to-violet-200',
        borderClass: 'border-purple-300 hover:border-purple-400',
        textClass: 'text-purple-900',
        buttonClass: 'from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700',
        shadowClass: 'shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/60'
      },
      indigo: {
        bgClass: 'bg-gradient-to-br from-indigo-100 to-blue-200',
        borderClass: 'border-indigo-300 hover:border-indigo-400',
        textClass: 'text-indigo-900',
        buttonClass: 'from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700',
        shadowClass: 'shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/60'
      },
      red: {
        bgClass: 'bg-gradient-to-br from-red-100 to-rose-200',
        borderClass: 'border-red-300 hover:border-red-400',
        textClass: 'text-red-900',
        buttonClass: 'from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
        shadowClass: 'shadow-lg shadow-red-200/50 hover:shadow-xl hover:shadow-red-300/60'
      },
      yellow: {
        bgClass: 'bg-gradient-to-br from-yellow-100 to-amber-200',
        borderClass: 'border-yellow-300 hover:border-yellow-400',
        textClass: 'text-yellow-900',
        buttonClass: 'from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700',
        shadowClass: 'shadow-lg shadow-yellow-200/50 hover:shadow-xl hover:shadow-yellow-300/60'
      },
      pink: {
        bgClass: 'bg-gradient-to-br from-pink-100 to-rose-200',
        borderClass: 'border-pink-300 hover:border-pink-400',
        textClass: 'text-pink-900',
        buttonClass: 'from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700',
        shadowClass: 'shadow-lg shadow-pink-200/50 hover:shadow-xl hover:shadow-pink-300/60'
      },
      cyan: {
        bgClass: 'bg-gradient-to-br from-cyan-100 to-teal-200',
        borderClass: 'border-cyan-300 hover:border-cyan-400',
        textClass: 'text-cyan-900',
        buttonClass: 'from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700',
        shadowClass: 'shadow-lg shadow-cyan-200/50 hover:shadow-xl hover:shadow-cyan-300/60'
      }
    };
    return colorMap[color] || colorMap.blue;
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
            Lightning Learning Quests
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            Complete fun challenges and earn amazing rewards!
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-purple-600 text-lg">⚡</span>
              <span className="text-purple-800 font-bold text-sm">
                DAILY QUEST REFRESH! New challenges every day
              </span>
            </div>
          </div>
        </div>

        {/* Level Selection, Quest Selection, or Active Quest */}
        {!selectedLevel ? (
          /* Level Selection */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {levels.map((level) => (
              <div
                key={level.id}
                className={`group ${level.bgClass} rounded-3xl p-8 border-2 ${level.borderClass} ${level.shadowClass} transition-all duration-300 hover:-translate-y-2 cursor-pointer transform`}
                onClick={() => selectLevel(level.id)}
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
                    {questsByLevel[level.id]?.length || 0} Quests Available
                  </div>
                  <button className={`w-full bg-gradient-to-r ${level.buttonClass} text-white rounded-2xl py-4 px-6 font-bold transition-all duration-200 transform group-hover:scale-105 text-lg`}>
                    Choose Level
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : !selectedQuest ? (
          /* Quest Selection for Selected Level */
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <button
                  onClick={backToLevels}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  ←
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {levels.find(l => l.id === selectedLevel)?.name} Level
                  </h2>
                  <p className="text-gray-600">
                    {levels.find(l => l.id === selectedLevel)?.description}
                  </p>
                </div>
              </div>
              <div className="text-4xl">
                {levels.find(l => l.id === selectedLevel)?.emoji}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {questsByLevel[selectedLevel]?.map((quest) => {
                const colorClasses = getQuestColorClasses(quest.color);
                return (
                  <div
                    key={quest.id}
                    className={`group ${colorClasses.bgClass} rounded-3xl p-6 border-2 ${colorClasses.borderClass} ${colorClasses.shadowClass} transition-all duration-300 hover:-translate-y-2 cursor-pointer transform`}
                    onClick={() => startQuest(quest)}
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                        {quest.emoji}
                      </div>
                      <h3 className={`text-xl font-bold ${colorClasses.textClass} mb-2 drop-shadow-sm`}>
                        {quest.title}
                      </h3>
                      <p className="text-gray-700 text-sm mb-4 font-medium">
                        {quest.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          <TrophyIcon className="h-4 w-4 text-yellow-500" />
                          <span className="text-yellow-600 font-bold text-sm">{quest.points} XP</span>
                        </div>
                        <div className="text-gray-600 text-sm">
                          ⏱️ {Math.floor(quest.timeLimit / 60)}min
                        </div>
                      </div>

                      <div className="text-gray-600 text-sm mb-4">
                        {quest.questions.length} Questions
                      </div>

                      <button className={`w-full bg-gradient-to-r ${colorClasses.buttonClass} text-white rounded-2xl py-3 px-6 font-bold transition-all duration-200 transform group-hover:scale-105`}>
                        Start Quest
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="text-2xl text-green-600 mb-2">✅</div>
                <div className="text-green-800 font-bold">
                  {userAnswers.filter((answer, index) => answer === selectedQuest.questions[index].correct).length}
                </div>
                <div className="text-green-600 text-sm">Correct Answers</div>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="text-2xl text-red-600 mb-2">❌</div>
                <div className="text-red-800 font-bold">
                  {userAnswers.filter((answer, index) => answer !== selectedQuest.questions[index].correct).length}
                </div>
                <div className="text-red-600 text-sm">Incorrect Answers</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="text-2xl text-blue-600 mb-2">📊</div>
                <div className="text-blue-800 font-bold">
                  {Math.round((userAnswers.filter((answer, index) => answer === selectedQuest.questions[index].correct).length / selectedQuest.questions.length) * 100)}%
                </div>
                <div className="text-blue-600 text-sm">Accuracy</div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <LightBulbIcon className="h-6 w-6 text-yellow-500 mr-2" />
                Review Your Answers
              </h3>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {selectedQuest.questions.map((question, index) => {
                  const isCorrect = userAnswers[index] === question.correct;
                  return (
                    <div key={index} className={`p-4 rounded-xl border-2 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 mb-2">{question.question}</p>
                          <div className="space-y-1 text-sm">
                            <p className={`${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                              Your answer: {question.options[userAnswers[index]]}
                            </p>
                            {!isCorrect && (
                              <p className="text-green-700">
                                Correct answer: {question.options[question.correct]}
                              </p>
                            )}
                            <p className="text-gray-600 italic mt-2">
                              💡 {question.explanation}
                            </p>
                          </div>
                        </div>
                        <div className="text-2xl">
                          {isCorrect ? '✅' : '❌'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={backToQuests}
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
              <button
                onClick={backToLevels}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl py-3 px-6 font-bold hover:from-gray-600 hover:to-gray-700 transition-all duration-200"
              >
                Change Level
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
