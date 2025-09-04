import api from './api';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<User> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    const user = response.data;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

const authService = new AuthService();
export default authService;
