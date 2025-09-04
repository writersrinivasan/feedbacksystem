import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import feedbackService from '../services/feedback.service';
import Layout from '../components/Layout';
import './Feedback.css';

const SubmitFeedbackPage: React.FC = () => {
  const [formData, setFormData] = useState({
    teacher_name: '',
    subject: '',
    rating: 5,
    comments: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  
  const user = authService.getCurrentUserFromStorage();

  React.useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await feedbackService.submitFeedback(formData);
      setSuccess(true);
      setFormData({
        teacher_name: '',
        subject: '',
        rating: 5,
        comments: ''
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="feedback-container">
        <div className="feedback-card">
          <h2>Submit Feedback</h2>
          
          {success && (
            <div className="success-message">
              Feedback submitted successfully! Redirecting to dashboard...
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="teacher_name">Teacher Name</label>
              <input
                type="text"
                id="teacher_name"
                name="teacher_name"
                value={formData.teacher_name}
                onChange={handleChange}
                required
                placeholder="Enter teacher's name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Enter subject name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="rating">Rating (1-5)</label>
              <select
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                required
              >
                <option value={1}>1 - Poor</option>
                <option value={2}>2 - Fair</option>
                <option value={3}>3 - Good</option>
                <option value={4}>4 - Very Good</option>
                <option value={5}>5 - Excellent</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="comments">Comments (Optional)</label>
              <textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                rows={4}
                placeholder="Any additional comments about the teaching..."
              />
            </div>

            <button type="submit" disabled={loading || success} className="submit-btn">
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SubmitFeedbackPage;
