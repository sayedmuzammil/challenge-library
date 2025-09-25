// TypeScript interfaces for register functionality
export interface RegisterFormData {
  name: string;
  email: string;
  handphone: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterError {
  name?: string;
  email?: string;
  handphone?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export interface RegisterState {
  isLoading: boolean;
  errors: RegisterError;
}

// TypeScript interface for API response
export interface RegisterApiResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    user: {
      id: string;
      name: string;
      email: string;
      handphone: string;
    };
  };
}
