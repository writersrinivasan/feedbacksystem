import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface DashboardStats {
  total_feedback: number;
  recent_feedback: any[];
}

class DashboardService {
  private getAuthHeader() {
    const token = localStorage.getItem('user_token');
    return { Authorization: `Bearer ${token}` };
  }

  async getStudentStats(): Promise<DashboardStats> {
    try {
      // Get feedback for current user
      const response = await axios.get(
        `${API_URL}/api/v1/feedback/`,
        { headers: this.getAuthHeader() }
      );
      
      const feedback = response.data || [];
      return {
        total_feedback: feedback.length,
        recent_feedback: feedback.slice(0, 5)
      };
    } catch (error) {
      console.error('Error fetching student stats:', error);
      return {
        total_feedback: 0,
        recent_feedback: []
      };
    }
  }

  async getRecentFeedback(): Promise<any[]> {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/feedback/`,
        { headers: this.getAuthHeader() }
      );
      return response.data?.slice(0, 5) || [];
    } catch (error) {
      console.error('Error fetching recent feedback:', error);
      return [];
    }
  }

  async getFeedbackHistory(page: number = 1, limit: number = 10): Promise<{
    data: any[];
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/feedback/`,
        { headers: this.getAuthHeader() }
      );
      
      const feedback = response.data || [];
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = feedback.slice(startIndex, endIndex);
      
      return {
        data: paginatedData,
        total: feedback.length,
        page: page,
        pages: Math.ceil(feedback.length / limit)
      };
    } catch (error) {
      console.error('Error fetching feedback history:', error);
      return {
        data: [],
        total: 0,
        page: 1,
        pages: 1
      };
    }
  }
}

export const dashboardService = new DashboardService();
