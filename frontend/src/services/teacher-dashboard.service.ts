import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface TeacherStats {
  total_feedback: number;
  average_rating: number;
  recent_feedback: any[];
  feedback_by_subject: any[];
}

class TeacherDashboardService {
  private getAuthHeader() {
    const token = localStorage.getItem('user_token');
    return { Authorization: `Bearer ${token}` };
  }

  async getTeacherStats(): Promise<TeacherStats> {
    try {
      // Get feedback for current teacher
      const response = await axios.get(
        `${API_URL}/api/v1/feedback/`,
        { headers: this.getAuthHeader() }
      );
      
      const feedback = response.data || [];
      const avgRating = feedback.length > 0 
        ? feedback.reduce((sum: number, f: any) => sum + (f.content_rating || 0), 0) / feedback.length
        : 0;
      
      return {
        total_feedback: feedback.length,
        average_rating: avgRating,
        recent_feedback: feedback.slice(0, 5),
        feedback_by_subject: []
      };
    } catch (error) {
      console.error('Error fetching teacher stats:', error);
      return {
        total_feedback: 0,
        average_rating: 0,
        recent_feedback: [],
        feedback_by_subject: []
      };
    }
  }

  async getFeedbackAnalysis(): Promise<any> {
    try {
      // For now, return mock data since we don't have AI analysis endpoints yet
      return {
        sentiment_distribution: { positive: 60, neutral: 30, negative: 10 },
        common_themes: ['Clear explanations', 'Good examples', 'Needs more time'],
        improvement_suggestions: ['Slow down pace', 'More practical sessions']
      };
    } catch (error) {
      console.error('Error fetching feedback analysis:', error);
      return {
        sentiment_distribution: { positive: 0, neutral: 0, negative: 0 },
        common_themes: [],
        improvement_suggestions: []
      };
    }
  }
}

export const teacherDashboardService = new TeacherDashboardService();
