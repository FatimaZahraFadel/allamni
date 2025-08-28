# 3allamni - Technical Documentation

## Overview
3allamni is a comprehensive AI-powered educational platform designed for Arabic-speaking students and teachers. The platform combines modern web technologies with AI capabilities to provide personalized learning experiences, teacher management tools, and student progress tracking.

## Architecture

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React/Vite)  │◄──►│   (FastAPI)     │◄──►│   (MySQL)       │
│   Port: 5173    │    │   Port: 8000    │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Frontend
- **Framework**: React 18.2.0 with Vite
- **Styling**: Tailwind CSS 3.3.0
- **Icons**: Heroicons
- **Routing**: React Router DOM 6.8.1
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Build Tool**: Vite 4.1.0

#### Backend
- **Framework**: FastAPI 0.104.1
- **Database ORM**: SQLAlchemy 2.0.23
- **Authentication**: JWT (PyJWT 2.8.0)
- **Password Hashing**: Passlib with bcrypt
- **Database Driver**: PyMySQL 1.1.0
- **Validation**: Pydantic 2.5.0
- **CORS**: FastAPI CORS Middleware

#### Database
- **Database**: MySQL 8.0+
- **Connection Pool**: SQLAlchemy Engine
- **Migrations**: Alembic (planned)

## Project Structure

### Frontend Structure
```
frontend/frontendWeb/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Shared components
│   │   ├── student/        # Student-specific components
│   │   └── teacher/        # Teacher-specific components
│   ├── pages/              # Page components
│   │   ├── student/        # Student dashboard pages
│   │   ├── teacher/        # Teacher dashboard pages
│   │   └── common/         # Shared pages (login, landing)
│   ├── contexts/           # React contexts
│   ├── services/           # API services
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Utility functions
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

### Backend Structure
```
backend/
├── app/
│   ├── core/              # Core functionality
│   │   ├── config.py      # Configuration settings
│   │   ├── database.py    # Database connection
│   │   └── security.py    # Authentication & authorization
│   ├── models/            # SQLAlchemy models
│   │   ├── user.py        # User model
│   │   ├── school.py      # School model
│   │   ├── class_model.py # Class and StudentClass models
│   │   ├── assignment.py  # Assignment model
│   │   ├── submission.py  # Submission model
│   │   └── ...           # Other models
│   ├── schemas/           # Pydantic schemas
│   │   ├── user.py        # User schemas
│   │   ├── school.py      # School schemas
│   │   └── ...           # Other schemas
│   ├── routers/           # API route handlers
│   │   ├── auth.py        # Authentication routes
│   │   ├── users.py       # User management
│   │   ├── schools.py     # School management
│   │   ├── classes.py     # Class management
│   │   ├── assignments.py # Assignment management
│   │   └── ...           # Other routes
│   └── main.py           # FastAPI application entry point
├── seed_database.py      # Database seeding script
└── requirements.txt      # Python dependencies
```

## Database Design

### Entity Relationship Diagram
```
Users (teachers/students)
├── id (PK)
├── name
├── email (unique)
├── password_hash
├── role (TEACHER/STUDENT)
├── language_preference (ENGLISH/FRENCH/ARABIC)
└── is_active

Schools
├── id (PK)
├── teacher_id (FK → Users.id)
├── name
└── description

Classes
├── id (PK)
├── school_id (FK → Schools.id)
├── name
├── subject
└── grade_level

StudentClass (Many-to-Many)
├── id (PK)
├── student_id (FK → Users.id)
├── class_id (FK → Classes.id)
└── enrolled_at

Assignments
├── id (PK)
├── class_id (FK → Classes.id)
├── created_by_teacher_id (FK → Users.id)
├── title
├── description
├── assignment_type (ENUM)
├── due_date
└── max_points

Submissions
├── id (PK)
├── assignment_id (FK → Assignments.id)
├── student_id (FK → Users.id)
├── text_content
├── submitted_at
├── is_graded
├── grade
└── feedback
```

### Key Relationships
- **One-to-Many**: Teacher → Schools → Classes → Assignments
- **Many-to-Many**: Students ↔ Classes (via StudentClass)
- **One-to-Many**: Assignment → Submissions
- **One-to-Many**: Student → Submissions

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Token refresh

### User Management
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/me` - Update current user
- `GET /api/v1/users/students` - Get students (teacher only)

### School Management
- `GET /api/v1/schools/` - Get teacher's schools
- `POST /api/v1/schools/` - Create school
- `PUT /api/v1/schools/{id}` - Update school
- `DELETE /api/v1/schools/{id}` - Delete school

### Class Management
- `GET /api/v1/classes/` - Get classes with student counts
- `POST /api/v1/classes/` - Create class
- `PUT /api/v1/classes/{id}` - Update class
- `DELETE /api/v1/classes/{id}` - Delete class

### Assignment Management
- `GET /api/v1/assignments/` - Get assignments
- `POST /api/v1/assignments/` - Create assignment
- `GET /api/v1/assignments/{id}` - Get assignment with submissions
- `PUT /api/v1/assignments/{id}` - Update assignment
- `DELETE /api/v1/assignments/{id}` - Delete assignment

### Submission Management
- `GET /api/v1/submissions/` - Get submissions
- `POST /api/v1/submissions/` - Create submission
- `PUT /api/v1/submissions/{id}` - Update/grade submission

### Analytics
- `GET /api/v1/stats/dashboard/teacher` - Teacher dashboard stats
- `GET /api/v1/stats/dashboard/student` - Student dashboard stats

## Security

### Authentication
- **JWT Tokens**: Access tokens (30 min) + Refresh tokens (7 days)
- **Password Hashing**: bcrypt with salt
- **Role-based Access**: Teacher/Student role separation

### Authorization
- **Route Protection**: Role-based middleware
- **Resource Ownership**: Users can only access their own resources
- **CORS**: Configured for cross-origin requests

### Data Validation
- **Input Validation**: Pydantic schemas
- **SQL Injection Prevention**: SQLAlchemy ORM
- **XSS Protection**: React's built-in escaping

## Development Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- MySQL 8.0+

### Frontend Setup
```bash
cd frontend/frontendWeb
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python seed_database.py  # Initialize database
uvicorn app.main:app --reload
```

### Database Setup
```sql
CREATE DATABASE allamni_db;
CREATE USER 'allamni_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON allamni_db.* TO 'allamni_user'@'localhost';
```

## Deployment

### Environment Variables
```bash
# Backend
DATABASE_URL=mysql+pymysql://user:pass@localhost/allamni_db
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=["http://localhost:5173"]

# Frontend
VITE_API_BASE_URL=http://localhost:8000
```

### Production Considerations
- **Database**: Use connection pooling
- **Security**: Environment-specific secret keys
- **Monitoring**: Add logging and error tracking
- **Caching**: Redis for session management
- **CDN**: Static asset delivery

## Features Implementation

### Student Features
- **Dashboard**: Progress overview, recent activities
- **Learning Modules**: Dictation, Reading, Mini Quests
- **Progress Tracking**: Completion rates, scores
- **Multilingual Support**: Arabic, French, English

### Teacher Features
- **School Management**: Create and manage multiple schools
- **Class Management**: Organize students into classes
- **Assignment Creation**: Various types (homework, projects, quizzes)
- **Grading System**: Score submissions with feedback
- **Analytics Dashboard**: Student performance insights

### AI Integration (Planned)
- **Speech Recognition**: For dictation exercises
- **Text Analysis**: Automated essay scoring
- **Personalized Learning**: Adaptive difficulty
- **Language Processing**: Multi-language support

## Testing

### Frontend Testing
```bash
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run lint          # Code linting
```

### Backend Testing
```bash
pytest                # Run all tests
pytest tests/unit/    # Unit tests only
pytest tests/integration/  # Integration tests
```

### Test Coverage
- **Unit Tests**: Component and function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user workflow testing

## Performance Optimization

### Frontend
- **Code Splitting**: Route-based lazy loading
- **Bundle Optimization**: Vite's built-in optimization
- **Image Optimization**: WebP format, lazy loading
- **Caching**: Browser caching strategies

### Backend
- **Database Queries**: Optimized with proper indexing
- **Response Caching**: Redis for frequently accessed data
- **Connection Pooling**: Efficient database connections
- **Async Operations**: FastAPI's async capabilities

## Monitoring and Logging

### Application Monitoring
- **Health Checks**: `/health` endpoint
- **Performance Metrics**: Response times, error rates
- **User Analytics**: Feature usage tracking

### Error Handling
- **Global Error Boundaries**: React error boundaries
- **API Error Responses**: Standardized error format
- **Logging**: Structured logging with levels

## Contributing

### Code Standards
- **Frontend**: ESLint + Prettier configuration
- **Backend**: Black + isort for Python formatting
- **Git**: Conventional commit messages
- **Documentation**: Inline comments and docstrings

### Development Workflow
1. Feature branch from main
2. Implement changes with tests
3. Code review process
4. Merge to main after approval

## Troubleshooting

### Common Issues
1. **CORS Errors**: Check ALLOWED_HOSTS configuration
2. **Database Connection**: Verify MySQL service and credentials
3. **JWT Errors**: Check SECRET_KEY and token expiration
4. **Build Failures**: Clear node_modules and reinstall

### Debug Mode
```bash
# Frontend
npm run dev -- --debug

# Backend
uvicorn app.main:app --reload --log-level debug
```

## License
MIT License - See LICENSE file for details

## Support
For technical support, please create an issue in the repository or contact the development team.
