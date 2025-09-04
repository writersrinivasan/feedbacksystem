import api from './api';

export interface Feedback {
  id: number;
  user_id: number;
  teacher_name: string;
  subject: string;
  rating: number;
  comments?: string;
  created_at: string;
}

export interface FeedbackRequest {
  teacher_name: string;
  subject: string;
  rating: number;
  comments?: string;
}

export interface StudentDashboardData {
  total_feedback: number;
  recent_feedback: Feedback[];
  avg_rating_given: number;
}

export interface TeacherDashboardData {
  total_feedback_received: number;
  avg_rating: number;
  feedback_by_subject: Record<string, { count: number; avg_rating: number }>;
  recent_feedback: Array<{
    id: number;
    student_name: string;
    subject: string;
    rating: number;
    comments?: string;
    created_at: string;
  }>;
}

class FeedbackService {
  async submitFeedback(feedback: FeedbackRequest): Promise<Feedback> {
    const response = await api.post('/feedback/', feedback);
    return response.data;
  }

  async getUserFeedback(): Promise<Feedback[]> {
    const response = await api.get('/feedback/');
    return response.data;
  }

  async getStudentDashboard(): Promise<StudentDashboardData> {
    const response = await api.get('/feedback/dashboard/student');
    return response.data;
  }

  async getTeacherDashboard(): Promise<TeacherDashboardData> {
    const response = await api.get('/feedback/dashboard/teacher');
    return response.data;
  }
}

const feedbackService = new FeedbackService();
export default feedbackService;
