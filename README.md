# 3allamni - AI-Powered Learning Platform

## 🌟 Overview

3allamni is a comprehensive educational platform that helps children improve their writing and reading skills through personalized AI feedback and gamified learning experiences. The platform supports both students and teachers with modern, accessible interfaces.

## 🎯 Core Concept

- **AI-Powered Learning**: Intelligent feedback for writing and reading exercises
- **Gamified Experience**: Points, levels, badges, and achievements to motivate learning
- **Multi-Role Support**: Separate interfaces for students, teachers, and parents
- **Multilingual**: Full support for English, French, Arabic (RTL), and Tamazight
- **Accessibility First**: Dyslexia-friendly fonts, high contrast, and reading speed controls

## 🚀 Key Features

### Student Features
- **Interactive Dashboard**: Progress tracking, achievements, and daily streaks
- **Write & Fix**: AI-powered handwriting analysis and feedback
- **Dictation & Reading**: Voice-based learning exercises
- **Mini Quests**: Gamified learning challenges
- **Statistics**: Comprehensive performance analytics
- **Assignments**: View and complete teacher-assigned tasks
- **Settings**: Accessibility options and profile management

### Teacher Features
- **School Management**: Create and manage educational institutions
- **Class Management**: Organize students into classes
- **Student Management**: Add, remove, and track student progress
- **Assignment Creation**: Design and distribute learning tasks
- **Analytics Dashboard**: Monitor class and individual performance
- **Progress Tracking**: Real-time insights into student development

### Platform Features
- **Modern UI/UX**: Glassmorphism design with smooth animations
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Real-time Updates**: Live progress tracking and notifications
- **Secure Authentication**: JWT-based auth with role-based access control
- **API Integration**: RESTful backend with comprehensive endpoints

## 🏗️ Architecture

### Frontend (React + Vite)
```
frontend/frontendWeb/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── student/         # Student-specific components
│   │   ├── teacher/         # Teacher-specific components
│   │   └── common/          # Shared components
│   ├── pages/               # Route-based page components
│   │   ├── student/         # Student pages
│   │   ├── teacher/         # Teacher pages
│   │   └── common/          # Shared pages
│   ├── contexts/            # React contexts (Auth, Accessibility)
│   ├── services/            # API services and utilities
│   ├── locales/             # Internationalization files
│   └── styles/              # CSS and styling
```

### Backend (FastAPI + MySQL)
```
backend/
├── app/
│   ├── models/              # SQLAlchemy database models
│   ├── schemas/             # Pydantic request/response schemas
│   ├── routers/             # API route handlers
│   ├── services/            # Business logic layer
│   ├── core/                # Configuration and utilities
│   └── database/            # Database connection and setup
├── alembic/                 # Database migrations
└── requirements.txt         # Python dependencies
```

### Technology Stack
- **Frontend**: React 18, Vite, TailwindCSS, Framer Motion
- **Backend**: FastAPI, SQLAlchemy, Alembic, MySQL
- **Authentication**: JWT with role-based access control
- **Internationalization**: react-i18next
- **UI Components**: Heroicons, Custom glassmorphism components
- **Database**: MySQL with Alembic migrations

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- MySQL 8.0+
- Git

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd 3allamni
```

2. **Navigate to backend directory**
```bash
cd backend
```

3. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

4. **Install dependencies**
```bash
pip install -r requirements.txt
```

5. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials and settings
```

6. **Setup database**
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE education;
exit

# Run migrations
alembic upgrade head
```

7. **Seed database with comprehensive test data (RECOMMENDED)**
```bash
# This creates a complete educational environment with:
# - 1 Teacher: ahmed.hassan@3allamni.com
# - 10 Students: alice.johnson@student.com to jack.anderson@student.com
# - 2 Schools with 3 classes total
# - 9 assignments with student submissions and grades
# - All passwords: password123

python seed_database.py
```

8. **Start the backend server**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend/frontendWeb
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your API base URL (default: http://localhost:8000)
```

4. **Start the development server**
```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## 🚀 Running the Application

### Development Mode
1. Start the backend server (port 8000)
2. Start the frontend development server (port 5173)
3. Access the application at `http://localhost:5173`

### Production Build
```bash
# Frontend
cd frontend/frontendWeb
npm run build

# Backend
cd backend
# Use production WSGI server like Gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## 📱 User Roles & Access

### Student Access
- Register as a student
- Access dashboard, exercises, and assignments
- Track progress and achievements
- Customize accessibility settings

### Teacher Access
- Register as a teacher
- Create schools and classes
- Manage students and assignments
- View analytics and progress reports

### Demo Accounts
- Student: `student@demo.com` / `password123`
- Teacher: `teacher@demo.com` / `password123`

## 🌍 Internationalization

The platform supports three languages:
- **English** (en) - Default
- **French** (fr) - Full translation
- **Arabic** (ar) - RTL support with full translation

## 🎨 Design Features

- **Glassmorphism UI**: Modern glass-like effects with backdrop blur
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Dark/Light Themes**: Automatic theme detection and manual switching
- **Accessibility**: WCAG 2.1 compliant with dyslexia-friendly options
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions

## 📊 API Endpoints

Key API routes:
- `/auth/*` - Authentication and user management
- `/students/*` - Student-specific operations
- `/teachers/*` - Teacher-specific operations
- `/schools/*` - School management
- `/classes/*` - Class management
- `/assignments/*` - Assignment operations
- `/analytics/*` - Performance analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation at `/docs`

---

**3allamni** - Transforming education through AI-powered learning experiences 🌟
