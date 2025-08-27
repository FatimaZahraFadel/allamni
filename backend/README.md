# 3allamni Backend API

Kid-Safe AI Tutor & Teacher Workspace Backend built with FastAPI and MySQL.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- MySQL Server running on localhost:3306
- MySQL database named `education` (will be created automatically)

### Setup & Run

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Run the startup script:**
   ```bash
   python start.py
   ```

   This will:
   - Install all dependencies
   - Initialize the database with tables
   - Seed sample data
   - Start the development server

3. **Access the API:**
   - API Documentation: http://localhost:8000/docs
   - Redoc Documentation: http://localhost:8000/redoc
   - Health Check: http://localhost:8000/health

## 🔑 Demo Credentials

### Teachers
- **Email:** ahmed.hassan@3allamni.com | **Password:** teacher123
- **Email:** fatima.benali@3allamni.com | **Password:** teacher123

### Students
- **Email:** youssef.alami@student.com | **Password:** student123
- **Email:** aicha.benali@student.com | **Password:** student123
- **Email:** omar.tazi@student.com | **Password:** student123
- **Email:** salma.idrissi@student.com | **Password:** student123
- **Email:** karim.benjelloun@student.com | **Password:** student123
- **Email:** nour.alaoui@student.com | **Password:** student123

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user info
- `POST /api/v1/auth/change-password` - Change password

### Users
- `GET /api/v1/users/` - Get all users (teachers only)
- `GET /api/v1/users/{user_id}` - Get user by ID
- `PUT /api/v1/users/{user_id}` - Update user
- `GET /api/v1/users/search/students` - Search students

### Schools (Teachers Only)
- `POST /api/v1/schools/` - Create school
- `GET /api/v1/schools/` - Get teacher's schools
- `GET /api/v1/schools/{school_id}` - Get school with classes
- `PUT /api/v1/schools/{school_id}` - Update school
- `DELETE /api/v1/schools/{school_id}` - Delete school

### Classes (Teachers Only)
- `POST /api/v1/classes/` - Create class
- `GET /api/v1/classes/` - Get classes
- `GET /api/v1/classes/{class_id}` - Get class with students
- `PUT /api/v1/classes/{class_id}` - Update class
- `DELETE /api/v1/classes/{class_id}` - Delete class
- `POST /api/v1/classes/{class_id}/students` - Enroll student
- `DELETE /api/v1/classes/{class_id}/students/{student_id}` - Remove student
- `GET /api/v1/classes/{class_id}/stats` - Get class statistics

### Assignments
- `POST /api/v1/assignments/` - Create assignment (teachers)
- `GET /api/v1/assignments/` - Get assignments
- `GET /api/v1/assignments/{assignment_id}` - Get assignment details
- `PUT /api/v1/assignments/{assignment_id}` - Update assignment (teachers)
- `DELETE /api/v1/assignments/{assignment_id}` - Delete assignment (teachers)
- `GET /api/v1/assignments/{assignment_id}/stats` - Get assignment stats

### Submissions
- `POST /api/v1/submissions/` - Create submission (students)
- `POST /api/v1/submissions/upload` - Upload file submission (students)
- `GET /api/v1/submissions/` - Get submissions
- `GET /api/v1/submissions/{submission_id}` - Get submission details
- `PUT /api/v1/submissions/{submission_id}` - Update submission (students)
- `POST /api/v1/submissions/{submission_id}/grade` - Grade submission (teachers)

### Quests & Learning Activities
- `POST /api/v1/quests/` - Create quest (teachers)
- `GET /api/v1/quests/` - Get available quests
- `GET /api/v1/quests/{quest_id}` - Get quest details
- `POST /api/v1/quests/attempt` - Attempt quest (students)
- `GET /api/v1/quests/attempts` - Get quest attempts (students)
- `GET /api/v1/quests/progress` - Get quest progress (students)

### Write & Fix Feature
- `POST /api/v1/quests/write-fix/upload` - Upload image for OCR correction
- `POST /api/v1/quests/write-fix/text` - Submit text for correction
- `POST /api/v1/quests/dictation` - Check dictation
- `GET /api/v1/quests/corrections` - Get correction history

### Statistics & Dashboards
- `GET /api/v1/stats/dashboard/student` - Student dashboard
- `GET /api/v1/stats/dashboard/teacher` - Teacher dashboard
- `GET /api/v1/stats/dashboard/class/{class_id}` - Class dashboard
- `GET /api/v1/stats/parent/{student_id}` - Parent statistics
- `GET /api/v1/stats/progress` - Student progress
- `GET /api/v1/stats/leaderboard` - Student leaderboard

### Subscriptions (Teachers Only)
- `POST /api/v1/subscriptions/` - Create subscription
- `GET /api/v1/subscriptions/` - Get subscription
- `PUT /api/v1/subscriptions/` - Update subscription
- `POST /api/v1/subscriptions/payment` - Process payment
- `POST /api/v1/subscriptions/cancel` - Cancel subscription
- `POST /api/v1/subscriptions/renew` - Renew subscription
- `GET /api/v1/subscriptions/status` - Get subscription status

## 🏗️ Architecture

### Tech Stack
- **Framework:** FastAPI
- **Database:** MySQL with SQLAlchemy ORM
- **Authentication:** JWT with role-based access control
- **Validation:** Pydantic schemas
- **Migrations:** Alembic

### Project Structure
```
backend/
├── app/
│   ├── core/           # Core configuration and utilities
│   ├── models/         # SQLAlchemy database models
│   ├── schemas/        # Pydantic schemas
│   ├── routers/        # API route handlers
│   └── services/       # Business logic services
├── scripts/            # Database initialization scripts
├── tests/              # Unit tests
├── alembic/            # Database migrations
├── main.py             # FastAPI application entry point
└── requirements.txt    # Python dependencies
```

### Database Schema
- **Users:** Students and teachers with role-based access
- **Schools:** Teacher-owned educational institutions
- **Classes:** Subject-specific groups within schools
- **Assignments:** Tasks created by teachers
- **Submissions:** Student responses to assignments
- **Quests:** Interactive learning mini-games
- **Progress:** Student learning statistics
- **Subscriptions:** Teacher payment management

## 🔒 Security Features
- JWT-based authentication with access and refresh tokens
- Role-based access control (Student/Teacher)
- Password hashing with bcrypt
- Input validation with Pydantic
- SQL injection prevention with SQLAlchemy ORM

## 🧪 Testing

Run tests:
```bash
pytest tests/
```

## 🚀 Production Deployment

1. Set environment variables:
   ```bash
   export DATABASE_URL="mysql+pymysql://user:password@host:port/database"
   export SECRET_KEY="your-production-secret-key"
   export DEBUG=false
   ```

2. Run migrations:
   ```bash
   alembic upgrade head
   ```

3. Start with production server:
   ```bash
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

## 📝 API Features

### For Students:
- ✅ Dashboard with progress tracking
- ✅ Write & Fix: OCR text correction with AI feedback
- ✅ Dictation exercises with spell checking
- ✅ Interactive mini-quests and games
- ✅ Assignment submission and tracking
- ✅ Parent progress reports

### For Teachers:
- ✅ School and class management
- ✅ Student enrollment and tracking
- ✅ Assignment creation and grading
- ✅ Class performance analytics
- ✅ Individual student progress monitoring
- ✅ Subscription management (189 MAD/month)

### AI Features (Mocked for MVP):
- ✅ OCR text extraction from images
- ✅ Automated spelling and grammar correction
- ✅ AI-powered feedback generation
- ✅ Automatic assignment grading
- ✅ Personalized learning recommendations

## 🌍 Multilingual Support
- Arabic (ar) - Primary language
- French (fr) - Secondary language  
- English (en) - Additional language

## 💰 Subscription Model
- **Teachers:** 189 MAD/month or yearly with 10% discount
- **Students:** Free access to all learning features
- **Payment:** Mock implementation for MVP (ready for real payment gateway integration)

## 📞 Support
For technical support or questions about the API, please refer to the interactive documentation at `/docs` or contact the development team.
