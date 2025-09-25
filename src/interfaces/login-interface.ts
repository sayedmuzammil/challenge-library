// TypeScript interfaces for login functionality
export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginError {
  email?: string;
  password?: string;
  general?: string;
}

export interface LoginState {
  isLoading: boolean;
  errors: LoginError;
}

// TypeScript interface for API response
export interface LoginApiResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      name?: string;
    };
  };
}
