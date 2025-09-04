import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const user = authService.getCurrentUserFromStorage();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1>FAS-MBBS</h1>
          <p>Medical College Feedback Analysis System</p>
          {user && (
            <div className="user-info">
              <span>Welcome, {user.username} ({user.role})</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      
      {user && (
        <nav className="navigation">
          <button onClick={() => navigate('/dashboard')} className="nav-btn">
            Dashboard
          </button>
          {user.role === 'student' && (
            <button onClick={() => navigate('/submit-feedback')} className="nav-btn">
              Submit Feedback
            </button>
          )}
        </nav>
      )}
      
      <main className="main-content">
        {children}
      </main>
      
      <footer className="footer">
        <p>&copy; 2024 FAS-MBBS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
