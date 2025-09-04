import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { Layout } from './components/layout/Layout';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { authService } from './services/auth.service';
import type { User } from './services/auth.service';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SubmitFeedbackPage } from './pages/SubmitFeedbackPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';

// Create a client
const queryClient = new QueryClient();

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    };
    checkAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      await authService.login(email, password);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };
  
  const handleRegister = async (email: string, password: string, fullName: string, userType: string): Promise<void> => {
    try {
      await authService.register(email, password, fullName, userType);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                !user ? (
                  <LoginForm onLogin={handleLogin} />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />
            <Route
              path="/register"
              element={
                !user ? (
                  <RegisterForm onRegister={handleRegister} />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
            <Route
              path="/*"
              element={
                user ? (
                  <Layout userType={user.user_type} onLogout={handleLogout}>
                    <Routes>
                      <Route 
                        path="/dashboard" 
                        element={user?.user_type === 'student' ? <StudentDashboardPage /> : <TeacherDashboardPage />} 
                      />
                      <Route path="/submit-feedback" element={<SubmitFeedbackPage />} />
                      <Route path="/reports" element={<div>Reports</div>} />
                      <Route path="/profile" element={<div>Profile</div>} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
