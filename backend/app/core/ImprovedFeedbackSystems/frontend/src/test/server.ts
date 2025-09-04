import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Mock API responses
export const handlers = [
  // Health check endpoints
  rest.get('/health', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ status: 'healthy' }));
  }),

  rest.get('/', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'FAS-MBBS API is running' }));
  }),

  // Authentication endpoints
  rest.post('/api/v1/auth/register', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'student',
        access_token: 'mock-token-12345'
      })
    );
  }),

  rest.post('/api/v1/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        access_token: 'mock-token-12345',
        token_type: 'bearer',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          role: 'student'
        }
      })
    );
  }),

  rest.get('/api/v1/auth/me', (req, res, ctx) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.includes('Bearer')) {
      return res(ctx.status(401), ctx.json({ detail: 'Not authenticated' }));
    }

    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'student'
      })
    );
  }),

  // Feedback endpoints
  rest.post('/api/v1/feedback/', (req, res, ctx) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.includes('Bearer')) {
      return res(ctx.status(401), ctx.json({ detail: 'Not authenticated' }));
    }

    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        teacher_name: 'Dr. Smith',
        subject: 'Anatomy',
        rating: 4,
        comments: 'Great teaching!',
        created_at: '2024-01-01T10:00:00Z'
      })
    );
  }),

  rest.get('/api/v1/feedback/', (req, res, ctx) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.includes('Bearer')) {
      return res(ctx.status(401), ctx.json({ detail: 'Not authenticated' }));
    }

    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          teacher_name: 'Dr. Smith',
          subject: 'Anatomy',
          rating: 4,
          comments: 'Great teaching!',
          created_at: '2024-01-01T10:00:00Z'
        },
        {
          id: 2,
          teacher_name: 'Dr. Johnson',
          subject: 'Physiology',
          rating: 5,
          comments: 'Excellent explanations!',
          created_at: '2024-01-02T10:00:00Z'
        }
      ])
    );
  }),

  // Dashboard endpoints
  rest.get('/api/v1/feedback/dashboard/student', (req, res, ctx) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.includes('Bearer')) {
      return res(ctx.status(401), ctx.json({ detail: 'Not authenticated' }));
    }

    return res(
      ctx.status(200),
      ctx.json({
        total_feedback: 5,
        average_rating: 4.2,
        recent_feedback: [
          {
            id: 1,
            teacher_name: 'Dr. Smith',
            subject: 'Anatomy',
            rating: 4,
            created_at: '2024-01-01T10:00:00Z'
          }
        ]
      })
    );
  }),

  rest.get('/api/v1/feedback/dashboard/teacher', (req, res, ctx) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.includes('Bearer')) {
      return res(ctx.status(401), ctx.json({ detail: 'Not authenticated' }));
    }

    return res(
      ctx.status(200),
      ctx.json({
        total_feedback_received: 10,
        average_rating: 4.3,
        feedback_by_subject: {
          'Anatomy': 5,
          'Physiology': 5
        },
        recent_feedback: [
          {
            id: 1,
            teacher_name: 'Dr. Teacher',
            subject: 'Anatomy',
            rating: 4,
            comments: 'Good teaching',
            created_at: '2024-01-01T10:00:00Z'
          }
        ]
      })
    );
  }),

  // Error handlers for testing error scenarios
  rest.post('/api/v1/auth/login', (req, res, ctx) => {
    const body = req.body as any;
    if (body?.username === 'error@example.com') {
      return res(ctx.status(401), ctx.json({ detail: 'Invalid credentials' }));
    }
    // Default success response
    return res(
      ctx.status(200),
      ctx.json({
        access_token: 'mock-token-12345',
        token_type: 'bearer',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          role: 'student'
        }
      })
    );
  })
];

export const server = setupServer(...handlers);
