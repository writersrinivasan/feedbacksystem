# FAS-MBBS - Medical College Feedback Analysis System (Minimalist)

A simple React + FastAPI application for collecting student feedback for medical college faculty.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+

### 1. One-Command Setup & Start

```bash
git clone <your-repo>
cd FAS-MBBS
chmod +x start.sh
./start.sh
```

That's it! The script will:
- Create Python virtual environment
- Install all dependencies
- Initialize SQLite database with sample data
- Start both backend and frontend servers

### 2. Manual Setup (if needed)

#### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy pydantic python-jose passlib python-multipart email-validator pydantic-settings
python init_db.py
uvicorn app.main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📱 Access

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 👤 Test Accounts

- **Student**: student1@example.com / password123
- **Teacher**: teacher1@example.com / password123
- **Admin**: admin@example.com / admin123

## ✨ Features

- ✅ Simple SQLite database (no PostgreSQL setup needed)
- ✅ JWT Authentication
- ✅ Student feedback submission
- ✅ Teacher feedback viewing
- ✅ Admin dashboard
- ✅ Responsive React UI with Material-UI
- ✅ RESTful API with automatic documentation

## 🛑 Stop Application

```bash
./stop.sh
```

Or press `Ctrl+C` if running with `./start.sh`

## 🔧 API Endpoints

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration  
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/feedback/` - Submit feedback
- `GET /api/v1/feedback/` - Get feedback (filtered by role)

## 🐛 Troubleshooting

1. **Port already in use**: The start script automatically kills existing processes
2. **Database issues**: Delete `backend/fas_mbbs.db` and run `python init_db.py`
3. **Dependencies**: Make sure you have Python 3.8+ and Node.js 16+

## 🎯 What's Removed for Simplicity

- ❌ Docker & Docker Compose
- ❌ PostgreSQL (using SQLite instead)
- ❌ Alembic migrations (direct SQLAlchemy table creation)
- ❌ Complex AI analysis features
- ❌ Data visualization libraries
- ❌ OpenAI integration

This is a minimal, production-ready version that you can extend as needed!
