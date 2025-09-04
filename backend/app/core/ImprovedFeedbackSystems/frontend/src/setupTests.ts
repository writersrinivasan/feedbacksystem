// Test setup configuration for FAS-MBBS frontend
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
});

// Mock window.location
delete (window as any).location;
window.location = {
  ...window.location,
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  host: 'localhost:3000',
  hostname: 'localhost',
  port: '3000',
  pathname: '/',
  search: '',
  hash: ''
};

// Mock window.alert, confirm, prompt
window.alert = jest.fn();
window.confirm = jest.fn();
window.prompt = jest.fn();

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

// Mock IntersectionObserver
class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver = IntersectionObserver;

// Mock fetch API
global.fetch = jest.fn();

// Set up fetch to return successful responses by default
beforeEach(() => {
  (fetch as jest.Mock).mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
  });
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
});

// Global test utilities
export const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  role: 'student'
};

export const mockToken = 'mock-jwt-token-12345';

export const setupAuthenticatedUser = () => {
  localStorageMock.setItem('token', mockToken);
  localStorageMock.setItem('user', JSON.stringify(mockUser));
  localStorageMock.getItem.mockImplementation((key: string) => {
    if (key === 'token') return mockToken;
    if (key === 'user') return JSON.stringify(mockUser);
    return null;
  });
};

export const setupUnauthenticatedUser = () => {
  localStorageMock.getItem.mockReturnValue(null);
};

// Mock API responses
export const mockApiResponses = {
  login: {
    access_token: mockToken,
    token_type: 'bearer',
    user: mockUser
  },
  register: {
    ...mockUser,
    access_token: mockToken
  },
  feedback: {
    id: 1,
    teacher_name: 'Dr. Smith',
    subject: 'Anatomy',
    rating: 4,
    comments: 'Great teaching!',
    created_at: '2024-01-01T10:00:00Z'
  },
  feedbackList: [
    {
      id: 1,
      teacher_name: 'Dr. Smith',
      subject: 'Anatomy',
      rating: 4,
      comments: 'Great teaching!',
      created_at: '2024-01-01T10:00:00Z'
    },
    {
      id: 2,
      teacher_name: 'Dr. Johnson',
      subject: 'Physiology',
      rating: 5,
      comments: 'Excellent!',
      created_at: '2024-01-02T10:00:00Z'
    }
  ],
  studentDashboard: {
    total_feedback: 5,
    average_rating: 4.2,
    recent_feedback: [
      {
        id: 1,
        teacher_name: 'Dr. Smith',
        subject: 'Anatomy',
        rating: 4,
        created_at: '2024-01-01T10:00:00Z'
      }
    ]
  },
  teacherDashboard: {
    total_feedback_received: 10,
    average_rating: 4.3,
    feedback_by_subject: {
      'Anatomy': 5,
      'Physiology': 5
    }
  }
};

// Helper function to setup fetch mocks
export const setupFetchMock = (responses: Record<string, any>) => {
  (fetch as jest.Mock).mockImplementation((url: string, options?: any) => {
    const method = options?.method || 'GET';
    const key = `${method} ${url}`;
    
    if (responses[key]) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(responses[key]),
        text: () => Promise.resolve(JSON.stringify(responses[key])),
      });
    }
    
    // Default response
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve('{}'),
    });
  });
};

// Helper function to setup fetch error
export const setupFetchError = (error: Error | string) => {
  (fetch as jest.Mock).mockRejectedValue(
    typeof error === 'string' ? new Error(error) : error
  );
};

// Console error suppression for known warnings
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
