import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import feedbackService, { StudentDashboardData, TeacherDashboardData } from '../services/feedback.service';
import Layout from '../components/Layout';
import './Dashboard.css';

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentData, setStudentData] = useState<StudentDashboardData | null>(null);
  const [teacherData, setTeacherData] = useState<TeacherDashboardData | null>(null);
  const navigate = useNavigate();
  
  const user = authService.getCurrentUserFromStorage();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        if (user.role === 'student') {
          const data = await feedbackService.getStudentDashboard();
          setStudentData(data);
        } else {
          const data = await feedbackService.getTeacherDashboard();
          setTeacherData(data);
        }
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading dashboard...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="error">Error: {error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard">
        <h2>{user?.role === 'student' ? 'Student' : 'Teacher'} Dashboard</h2>
        
        {user?.role === 'student' && studentData && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Feedback</h3>
                <p className="stat-number">{studentData.total_feedback}</p>
              </div>
              <div className="stat-card">
                <h3>Average Rating Given</h3>
                <p className="stat-number">{studentData.avg_rating_given.toFixed(1)}/5</p>
              </div>
            </div>
            
            <div className="recent-feedback">
              <h3>Recent Feedback</h3>
              {studentData.recent_feedback.length > 0 ? (
                <div className="feedback-list">
                  {studentData.recent_feedback.map((feedback) => (
                    <div key={feedback.id} className="feedback-item">
                      <div className="feedback-header">
                        <strong>{feedback.teacher_name}</strong> - {feedback.subject}
                        <span className="rating">Rating: {feedback.rating}/5</span>
                      </div>
                      {feedback.comments && (
                        <p className="feedback-comments">{feedback.comments}</p>
                      )}
                      <small className="feedback-date">
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No feedback submitted yet.</p>
              )}
            </div>
          </div>
        )}

        {user?.role === 'teacher' && teacherData && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Feedback Received</h3>
                <p className="stat-number">{teacherData.total_feedback_received}</p>
              </div>
              <div className="stat-card">
                <h3>Average Rating</h3>
                <p className="stat-number">{teacherData.avg_rating.toFixed(1)}/5</p>
              </div>
            </div>
            
            <div className="subject-feedback">
              <h3>Feedback by Subject</h3>
              {Object.keys(teacherData.feedback_by_subject).length > 0 ? (
                <div className="subject-list">
                  {Object.entries(teacherData.feedback_by_subject).map(([subject, data]) => (
                    <div key={subject} className="subject-item">
                      <h4>{subject}</h4>
                      <p>Count: {data.count} | Average: {data.avg_rating.toFixed(1)}/5</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No feedback received yet.</p>
              )}
            </div>
            
            <div className="recent-feedback">
              <h3>Recent Feedback</h3>
              {teacherData.recent_feedback.length > 0 ? (
                <div className="feedback-list">
                  {teacherData.recent_feedback.map((feedback) => (
                    <div key={feedback.id} className="feedback-item">
                      <div className="feedback-header">
                        <strong>{feedback.student_name}</strong> - {feedback.subject}
                        <span className="rating">Rating: {feedback.rating}/5</span>
                      </div>
                      {feedback.comments && (
                        <p className="feedback-comments">{feedback.comments}</p>
                      )}
                      <small className="feedback-date">
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No feedback received yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;
