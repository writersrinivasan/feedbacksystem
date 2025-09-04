import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { AuthService } from '../services/auth.service';

// Mock the auth service
jest.mock('../services/auth.service');
const MockedAuthService = AuthService as jest.Mocked<typeof AuthService>;

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

describe('LoginPage Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders all form elements correctly', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    // Check for form elements
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register here/i })).toBeInTheDocument();
  });

  test('validates empty form submission', async () => {
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
    await user.type(emailInput, 'invalid-email-format');
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });

  test('shows loading state during login', async () => {
    const user = userEvent.setup();
    MockedAuthService.login.mockImplementation(() => 
      new Promise((resolve) => setTimeout(resolve, 1000))
    );

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

    expect(screen.getByText(/logging in/i)).toBeInTheDocument();
    expect(loginButton).toBeDisabled();
  });

  test('handles successful login', async () => {
    const user = userEvent.setup();
    const mockLoginResponse = {
      access_token: 'mock-token-12345',
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
      expect(localStorage.getItem('token')).toBe('mock-token-12345');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockLoginResponse.user));
    });
  });

  test('handles login failure with error message', async () => {
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
      expect(screen.getByRole('alert')).toHaveClass('error');
    });
  });

  test('handles network errors gracefully', async () => {
    const user = userEvent.setup();
    MockedAuthService.login.mockRejectedValue(new Error('Network Error'));

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
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  test('clears error message when user starts typing', async () => {
    const user = userEvent.setup();
    MockedAuthService.login.mockRejectedValue(new Error('Login failed'));

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Trigger error
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/login failed/i)).toBeInTheDocument();
    });

    // Start typing again
    await user.clear(emailInput);
    await user.type(emailInput, 'new@example.com');

    expect(screen.queryByText(/login failed/i)).not.toBeInTheDocument();
  });

  test('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Tab through form elements
    await user.tab();
    expect(emailInput).toHaveFocus();

    await user.tab();
    expect(passwordInput).toHaveFocus();

    await user.tab();
    expect(loginButton).toHaveFocus();

    // Submit form with Enter key
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.keyboard('{Enter}');

    expect(MockedAuthService.login).toHaveBeenCalled();
  });

  test('has proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('autocomplete', 'email');
    expect(emailInput).toHaveAttribute('aria-required', 'true');

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
    expect(passwordInput).toHaveAttribute('aria-required', 'true');

    expect(loginButton).toHaveAttribute('type', 'submit');
  });

  test('remembers user preference for email', () => {
    localStorage.setItem('rememberedEmail', 'remembered@example.com');

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    expect(emailInput.value).toBe('remembered@example.com');
  });

  test('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
