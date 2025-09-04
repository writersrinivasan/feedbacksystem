import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface FeedbackFormData {
  teacher_id: number;
  subject: string;
  lecture_topic: string;
  content_rating: number;
  delivery_rating: number;
  engagement_rating: number;
  comments: string;
  is_anonymous: boolean;
}

export interface FilterParams {
  search?: string;
  subject?: string;
  dateFrom?: Date | null;
  dateTo?: Date | null;
  ratingMin?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

class FeedbackService {
  private getAuthHeader() {
    const token = localStorage.getItem('user_token');
    return { Authorization: `Bearer ${token}` };
  }

  async submitFeedback(feedback: FeedbackFormData): Promise<any> {
    const response = await axios.post(
      `${API_URL}/api/v1/feedback/`,
      feedback,
      { headers: this.getAuthHeader() }
    );
    return response.data;
  }

  async getFeedback(filters?: FilterParams): Promise<any[]> {
    // Note: filters will be used for future filtering functionality
    console.log('Filters applied:', filters);
    const response = await axios.get(
      `${API_URL}/api/v1/feedback/`,
      { headers: this.getAuthHeader() }
    );
    return response.data || [];
  }

  async getTeachers(): Promise<{ id: number; full_name: string }[]> {
    // Mock data for now since we don't have a teachers endpoint
    return [
      { id: 2, full_name: "Dr. Smith" },
      { id: 3, full_name: "Dr. Johnson" },
      { id: 4, full_name: "Dr. Brown" }
    ];
  }

  async getSubjects(): Promise<string[]> {
    // Mock subjects for now
    return [
      "Anatomy", 
      "Physiology", 
      "Biochemistry", 
      "Pathology", 
      "Pharmacology",
      "Microbiology"
    ];
  }
}

export const feedbackService = new FeedbackService();
