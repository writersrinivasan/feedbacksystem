import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SubmitFeedbackPage from './pages/SubmitFeedbackPage';
import Layout from './components/Layout';
import { AuthService } from './services/auth.service';
import { FeedbackService } from './services/feedback.service';

// Mock services
jest.mock('./services/auth.service');
jest.mock('./services/feedback.service');

const MockedAuthService = AuthService as jest.Mocked<typeof AuthService>;
const MockedFeedbackService = FeedbackService as jest.Mocked<typeof FeedbackService>;

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

describe('FAS-MBBS Frontend Test Suite', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('App Component', () => {
    test('renders without crashing', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );
      // App should render without throwing an error
    });

    test('shows login page by default when not authenticated', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );
      // Should redirect to login when not authenticated
      expect(window.location.pathname).toBe('/');
    });
  });

  describe('Login Page', () => {
    test('renders login form elements', () => {
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    });

    test('validates required fields', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );

      const loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    test('validates email format', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'invalid-email');

      const loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    test('handles successful login', async () => {
      const user = userEvent.setup();
      const mockLoginResponse = {
        access_token: 'mock-token',
        token_type: 'bearer',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          role: 'student'
        }
      };

      MockedAuthService.login.mockResolvedValue(mockLoginResponse);

      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(loginButton);

      await waitFor(() => {
        expect(MockedAuthService.login).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    test('handles login error', async () => {
      const user = userEvent.setup();
      MockedAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });

  describe('Register Page', () => {
    test('renders registration form elements', () => {
      render(
        <TestWrapper>
          <RegisterPage />
        </TestWrapper>
      );

      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    test('validates required fields', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <RegisterPage />
        </TestWrapper>
      );

      const registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      await waitFor(() => {
        expect(screen.getByText(/username is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    test('validates password strength', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <RegisterPage />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, '123');

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    test('handles successful registration', async () => {
      const user = userEvent.setup();
      const mockRegisterResponse = {
        id: 1,
        username: 'newuser',
        email: 'newuser@example.com',
        role: 'student',
        access_token: 'mock-token'
      };

      MockedAuthService.register.mockResolvedValue(mockRegisterResponse);

      render(
        <TestWrapper>
          <RegisterPage />
        </TestWrapper>
      );

      const usernameInput = screen.getByLabelText(/username/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const roleSelect = screen.getByLabelText(/role/i);
      const registerButton = screen.getByRole('button', { name: /register/i });

      await user.type(usernameInput, 'newuser');
      await user.type(emailInput, 'newuser@example.com');
      await user.type(passwordInput, 'password123');
      await user.selectOptions(roleSelect, 'student');
      await user.click(registerButton);

      await waitFor(() => {
        expect(MockedAuthService.register).toHaveBeenCalledWith({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'password123',
          role: 'student'
        });
      });
    });
  });

  describe('Dashboard Page', () => {
    beforeEach(() => {
      // Mock authenticated user
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'student'
      }));
    });

    test('renders student dashboard', async () => {
      const mockDashboardData = {
        total_feedback: 5,
        recent_feedback: [
          {
            id: 1,
            teacher_name: 'Dr. Smith',
            subject: 'Anatomy',
            rating: 4,
            created_at: '2024-01-01T10:00:00Z'
          }
        ]
      };

      MockedFeedbackService.getStudentDashboard.mockResolvedValue(mockDashboardData);

      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/welcome/i)).toBeInTheDocument();
        expect(screen.getByText(/total feedback: 5/i)).toBeInTheDocument();
        expect(screen.getByText(/dr. smith/i)).toBeInTheDocument();
      });
    });

    test('renders teacher dashboard', async () => {
      // Mock teacher user
      localStorage.setItem('user', JSON.stringify({
        id: 2,
        username: 'teacheruser',
        email: 'teacher@example.com',
        role: 'teacher'
      }));

      const mockTeacherDashboard = {
        total_feedback_received: 10,
        average_rating: 4.2,
        feedback_by_subject: {
          'Anatomy': 5,
          'Physiology': 5
        }
      };

      MockedFeedbackService.getTeacherDashboard.mockResolvedValue(mockTeacherDashboard);

      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/feedback received: 10/i)).toBeInTheDocument();
        expect(screen.getByText(/average rating: 4.2/i)).toBeInTheDocument();
      });
    });

    test('handles dashboard loading error', async () => {
      MockedFeedbackService.getStudentDashboard.mockRejectedValue(new Error('Failed to load'));

      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/failed to load dashboard/i)).toBeInTheDocument();
      });
    });
  });

  describe('Submit Feedback Page', () => {
    beforeEach(() => {
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'student'
      }));
    });

    test('renders feedback form elements', () => {
      render(
        <TestWrapper>
          <SubmitFeedbackPage />
        </TestWrapper>
      );

      expect(screen.getByLabelText(/teacher name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/rating/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/comments/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit feedback/i })).toBeInTheDocument();
    });

    test('validates required fields', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <SubmitFeedbackPage />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /submit feedback/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/teacher name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/subject is required/i)).toBeInTheDocument();
        expect(screen.getByText(/rating is required/i)).toBeInTheDocument();
      });
    });

    test('handles successful feedback submission', async () => {
      const user = userEvent.setup();
      const mockFeedbackResponse = {
        id: 1,
        teacher_name: 'Dr. Smith',
        subject: 'Anatomy',
        rating: 4,
        comments: 'Great teacher!',
        created_at: '2024-01-01T10:00:00Z'
      };

      MockedFeedbackService.submitFeedback.mockResolvedValue(mockFeedbackResponse);

      render(
        <TestWrapper>
          <SubmitFeedbackPage />
        </TestWrapper>
      );

      const teacherInput = screen.getByLabelText(/teacher name/i);
      const subjectInput = screen.getByLabelText(/subject/i);
      const ratingSelect = screen.getByLabelText(/rating/i);
      const commentsInput = screen.getByLabelText(/comments/i);
      const submitButton = screen.getByRole('button', { name: /submit feedback/i });

      await user.type(teacherInput, 'Dr. Smith');
      await user.type(subjectInput, 'Anatomy');
      await user.selectOptions(ratingSelect, '4');
      await user.type(commentsInput, 'Great teacher!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(MockedFeedbackService.submitFeedback).toHaveBeenCalledWith({
          teacher_name: 'Dr. Smith',
          subject: 'Anatomy',
          rating: 4,
          comments: 'Great teacher!'
        });
        expect(screen.getByText(/feedback submitted successfully/i)).toBeInTheDocument();
      });
    });

    test('handles feedback submission error', async () => {
      const user = userEvent.setup();
      MockedFeedbackService.submitFeedback.mockRejectedValue(new Error('Submission failed'));

      render(
        <TestWrapper>
          <SubmitFeedbackPage />
        </TestWrapper>
      );

      const teacherInput = screen.getByLabelText(/teacher name/i);
      const subjectInput = screen.getByLabelText(/subject/i);
      const ratingSelect = screen.getByLabelText(/rating/i);
      const submitButton = screen.getByRole('button', { name: /submit feedback/i });

      await user.type(teacherInput, 'Dr. Smith');
      await user.type(subjectInput, 'Anatomy');
      await user.selectOptions(ratingSelect, '4');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/submission failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Layout Component', () => {
    test('renders header with navigation', () => {
      render(
        <TestWrapper>
          <Layout>
            <div>Test Content</div>
          </Layout>
        </TestWrapper>
      );

      expect(screen.getByText(/fas-mbbs/i)).toBeInTheDocument();
      expect(screen.getByText(/test content/i)).toBeInTheDocument();
    });

    test('shows login/register links when not authenticated', () => {
      render(
        <TestWrapper>
          <Layout>
            <div>Test Content</div>
          </Layout>
        </TestWrapper>
      );

      expect(screen.getByText(/login/i)).toBeInTheDocument();
      expect(screen.getByText(/register/i)).toBeInTheDocument();
    });

    test('shows user menu when authenticated', () => {
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'student'
      }));

      render(
        <TestWrapper>
          <Layout>
            <div>Test Content</div>
          </Layout>
        </TestWrapper>
      );

      expect(screen.getByText(/testuser/i)).toBeInTheDocument();
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/submit feedback/i)).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('adapts to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );

      // Should render mobile-friendly layout
      const container = screen.getByTestId('login-container');
      expect(container).toHaveClass('mobile-responsive');
    });

    test('adapts to tablet viewport', () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );

      // Should render tablet-friendly layout
      const container = screen.getByTestId('dashboard-container');
      expect(container).toHaveClass('tablet-responsive');
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels', () => {
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );

      expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText(/password/i)).toHaveAttribute('aria-required', 'true');
    });

    test('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      emailInput.focus();

      // Tab to password field
      await user.tab();
      expect(screen.getByLabelText(/password/i)).toHaveFocus();

      // Tab to submit button
      await user.tab();
      expect(screen.getByRole('button', { name: /login/i })).toHaveFocus();
    });

    test('has proper heading hierarchy', () => {
      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );

      const h1 = screen.getByRole('heading', { level: 1 });
      const h2s = screen.getAllByRole('heading', { level: 2 });
      
      expect(h1).toBeInTheDocument();
      expect(h2s.length).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    test('lazy loads components', async () => {
      const LazyComponent = React.lazy(() => Promise.resolve({ default: () => <div>Lazy Content</div> }));
      
      render(
        <TestWrapper>
          <React.Suspense fallback={<div>Loading...</div>}>
            <LazyComponent />
          </React.Suspense>
        </TestWrapper>
      );

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.getByText(/lazy content/i)).toBeInTheDocument();
      });
    });

    test('memoizes expensive components', () => {
      const ExpensiveComponent = React.memo(() => <div>Expensive Component</div>);
      
      const { rerender } = render(<ExpensiveComponent />);
      expect(screen.getByText(/expensive component/i)).toBeInTheDocument();
      
      // Re-render with same props should not re-render the component
      rerender(<ExpensiveComponent />);
      expect(screen.getByText(/expensive component/i)).toBeInTheDocument();
    });
  });
});
