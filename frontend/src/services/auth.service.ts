import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  user_type: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  user_type: string;
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await axios.post(`${API_URL}/api/v1/auth/login`, 
      new URLSearchParams({
        username: email,
        password: password,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    if (response.data.access_token) {
      localStorage.setItem('user_token', response.data.access_token);
    }
    return response.data;
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('user_token');
    if (!token) return null;

    try {
      const response = await axios.get(`${API_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('user_token');
  }
  
  async register(email: string, password: string, full_name: string, user_type: string): Promise<User> {
    const response = await axios.post(`${API_URL}/api/v1/auth/register`, {
      email,
      password,
      full_name,
      user_type
    });
    return response.data;
  }
}

export const authService = new AuthService();
