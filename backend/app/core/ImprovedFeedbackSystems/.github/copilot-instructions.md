# Copilot Instructions for FAS-MBBS

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is the FAS-MBBS (Medical College Feedback Analysis System) project - a production-ready, minimalist feedback system for medical colleges.

## Architecture
- **Backend**: FastAPI (Python) with SQLite database
- **Frontend**: React with TypeScript
- **Authentication**: JWT-based auth system
- **Database**: SQLite (no Docker, no PostgreSQL, no migrations)

## Code Style Guidelines
- Use TypeScript for all frontend code
- Follow FastAPI best practices for backend
- Use proper error handling and validation
- Keep code simple and maintainable
- Use environment variables for configuration
- Write comprehensive tests

## Key Features
1. User authentication (login/register) for students and teachers
2. Feedback submission system
3. Dashboard for viewing feedback analytics
4. Role-based access control

## Database Models
- User (id, username, email, password_hash, role, created_at)
- Feedback (id, user_id, teacher_name, subject, rating, comments, created_at)

## API Endpoints
- POST /auth/register - User registration
- POST /auth/login - User login
- POST /feedback/ - Submit feedback
- GET /feedback/ - Get user's feedback
- GET /dashboard/student - Student dashboard data
- GET /dashboard/teacher - Teacher dashboard data

## Development Guidelines
- Always use absolute imports
- Include proper error handling
- Add input validation for all endpoints
- Use consistent naming conventions
- Keep functions small and focused
- Add appropriate logging
