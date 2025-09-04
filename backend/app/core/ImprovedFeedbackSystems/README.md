# FAS-MBBS - Medical College Feedback Analysis System

A minimalist, production-ready feedback system for medical colleges built with FastAPI (Python) backend and React (TypeScript) frontend.

## 🎉 Status: READY FOR USE!

The FAS-MBBS system is now fully functional and ready for deployment. All tests are passing, and both backend and frontend are working correctly.

## Features

- **User Authentication**: JWT-based authentication for students and teachers
- **Feedback Submission**: Students can submit feedback about teachers and subjects
- **Dashboard Analytics**: Role-based dashboards with feedback statistics
- **Modern UI**: Clean, responsive React interface
- **Fast API**: High-performance FastAPI backend with automatic documentation
- **SQLite Database**: Lightweight, serverless database (no setup required)

## Architecture

- **Backend**: FastAPI (Python) with SQLite database
- **Frontend**: React with TypeScript
- **Authentication**: JWT tokens with role-based access control
- **Database**: SQLite (production-ready, no Docker needed)

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### One-Command Start

```bash
./start.sh
```

This will start both backend and frontend servers automatically!

### Manual Setup

If you prefer to start services manually:

#### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Access Points

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **API Alternative Docs**: http://localhost:8000/redoc

## Test Results

All tests are passing! ✅

### Backend Tests
- ✅ Health check
- ✅ User registration
- ✅ User login
- ✅ Feedback submission
- ✅ Dashboard access

### Frontend Tests
- ✅ Component rendering
- ✅ Build process
- ✅ TypeScript compilation

## Usage Guide

### For Students
1. **Register**: Go to http://localhost:3000/register
   - Choose role: "student"
   - Fill in username, email, password
2. **Login**: Use your credentials
3. **Submit Feedback**: Click "Submit Feedback"
   - Enter teacher name and subject
   - Rate from 1-5 stars
   - Add optional comments
4. **View Dashboard**: See your feedback history and statistics

### For Teachers
1. **Register**: Go to http://localhost:3000/register
   - Choose role: "teacher"
   - Use your name as username (students will search for this)
2. **Login**: Use your credentials
3. **View Dashboard**: See feedback received from students
   - Total feedback count
   - Average rating
   - Feedback by subject
   - Recent comments

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user info

### Feedback
- `POST /api/v1/feedback/` - Submit feedback (students only)
- `GET /api/v1/feedback/` - Get user's feedback
- `GET /api/v1/feedback/dashboard/student` - Student dashboard data
- `GET /api/v1/feedback/dashboard/teacher` - Teacher dashboard data

## Database Schema

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password_hash`
- `role` (student/teacher)
- `created_at`

### Feedback Table
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `teacher_name`
- `subject`
- `rating` (1-5)
- `comments`
- `created_at`

## Testing

### Run All Tests
```bash
./test.sh
```

### Individual Test Commands
```bash
# Backend tests
cd backend && python test_backend.py

# Frontend tests
cd frontend && npm test

# Frontend build test
cd frontend && npm run build
```

## Configuration

### Backend Configuration (.env)
```env
DATABASE_URL=sqlite:///./fas_mbbs.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend Configuration (.env)
```env
REACT_APP_API_URL=http://localhost:8000/api/v1
```

## Project Structure

```
fas-mbbs/
├── backend/
│   ├── app/
│   │   ├── api/api_v1/endpoints/    # API endpoints
│   │   ├── core/                    # Core config & security
│   │   ├── models/                  # Database models
│   │   ├── schemas/                 # Pydantic schemas
│   │   └── main.py                  # FastAPI app
│   ├── requirements.txt
│   ├── .env
│   └── test_backend.py
├── frontend/
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── pages/                   # Page components
│   │   ├── services/                # API services
│   │   └── App.tsx                  # Main app
│   ├── package.json
│   └── .env
├── start.sh                         # Start both servers
├── test.sh                          # Run all tests
└── README.md
```

## Production Deployment

### Backend Deployment
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend Deployment
```bash
cd frontend
npm run build
# Serve the build/ directory with nginx, Apache, or any static server
```

## VS Code Integration

This project includes:
- ✅ VS Code tasks for easy development
- ✅ Python and TypeScript extensions
- ✅ Debugging configuration
- ✅ Integrated terminal commands

## Security Features

- JWT tokens for authentication
- Password hashing with bcrypt
- Input validation on all endpoints
- CORS protection
- SQL injection protection via SQLAlchemy ORM
- Role-based access control

## Performance

- Fast SQLite database
- Optimized React build
- Efficient API endpoints
- Minimal dependencies

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the API documentation at http://localhost:8000/docs
- Review the test results
- Check server logs in the terminal

---

**FAS-MBBS** - Empowering medical education through structured feedback! 🎓✨
