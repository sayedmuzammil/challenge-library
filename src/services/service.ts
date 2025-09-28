import axios from 'axios';
import { LoginFormData, LoginApiResponse } from '../interfaces/login-interface';
import {
  RegisterFormData,
  RegisterApiResponse,
} from '../interfaces/register-interface';

// TypeScript interfaces for home page data structures
interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Book {
  id: number;
  title: string;
  author: Author;
  rating?: number;
  image?: string;
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Author {
  id: number;
  name: string;
  bio?: string;
  avatar?: string;
  booksCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface CategoriesApiResponse {
  categories: Category[];
}

interface AuthorsApiResponse {
  authors: Author[];
}

interface BooksApiResponse {
  books: Book[];
}

interface PaginatedBooksApiResponse {
  books: Book[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Login service with proper error handling using Next.js API Routes
export const loginService = {
  login: async (credentials: LoginFormData): Promise<LoginApiResponse> => {
    try {
      const response = await axios.post<LoginApiResponse>(
        '/api/login',
        credentials
      );

      console.log('Login response received:', response.data);

      // Check if login was successful
      if (response.status === 200 && response.data?.success) {
        // Store token safely with null checks
        if (response.data?.data?.token) {
          localStorage.setItem('token', `Bearer ${response.data.data.token}`);
          console.log('Token saved to localStorage');
        } else {
          console.warn('No token found in response');
        }

        // Store user data safely with null checks
        if (response.data?.data?.user) {
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
          console.log('User data saved to localStorage');
        } else {
          console.warn('No user data found in response');
        }

        return response.data;
      } else {
        throw new Error('Login failed - invalid response');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
};

// Register service with proper error handling using Next.js API Routes
export const registerService = {
  register: async (
    userData: RegisterFormData
  ): Promise<RegisterApiResponse> => {
    try {
      const response = await axios.post<RegisterApiResponse>(
        '/api/register',
        userData
      );

      console.log('Register response received:', response.data);

      // Check if registration was successful
      if (response.status === 200 && response.data?.success) {
        // Store token safely with null checks
        if (response.data?.data?.token) {
          localStorage.setItem('token', response.data.data.token);
          console.log('Token saved to localStorage');
        } else {
          console.warn('No token found in response');
        }

        // Store user data safely with null checks
        if (response.data?.data?.user) {
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
          console.log('User data saved to localStorage');
        } else {
          console.warn('No user data found in response');
        }

        return response.data;
      } else {
        throw new Error('Registration failed - invalid response');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
};

// Home page data services using Next.js API Routes
export const homeService = {
  getCategories: async (): Promise<ApiResponse<CategoriesApiResponse>> => {
    try {
      const response = await axios.get<ApiResponse<CategoriesApiResponse>>(
        '/api/get-categories'
      );

      console.log('Categories fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  },

  getRecommendedBooks: async (): Promise<ApiResponse<BooksApiResponse>> => {
    try {
      const response = await axios.get<ApiResponse<BooksApiResponse>>(
        '/api/get-recommend-book'
      );

      console.log('Recommended books fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch recommended books:', error);
      throw error;
    }
  },

  getBooks: async (
    page: number,
    limit: number
  ): Promise<ApiResponse<PaginatedBooksApiResponse>> => {
    try {
      const response = await axios.get<ApiResponse<PaginatedBooksApiResponse>>(
        `/api/get-book?page=${page}&limit=${limit}`
      );

      console.log('Books fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch books:', error);
      throw error;
    }
  },

  getAuthors: async (): Promise<ApiResponse<AuthorsApiResponse>> => {
    try {
      const response = await axios.get<ApiResponse<AuthorsApiResponse>>(
        '/api/get-author'
      );

      console.log('Authors fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch authors:', error);
      throw error;
    }
  },

  // Combined method to fetch all home page data
  getAllHomeData: async (): Promise<{
    categories: Category[];
    books: Book[];
    authors: Author[];
  }> => {
    try {
      const [categoriesRes, booksRes, authorsRes] = await Promise.all([
        homeService.getCategories(),
        homeService.getRecommendedBooks(),
        homeService.getAuthors(),
      ]);

      // Safe data access with proper nested structure handling
      const categoriesArray = Array.isArray(categoriesRes?.data?.categories)
        ? categoriesRes.data.categories
        : Array.isArray(categoriesRes?.data)
        ? categoriesRes.data
        : Array.isArray(categoriesRes)
        ? categoriesRes
        : [];

      const booksArray = Array.isArray(booksRes?.data?.books)
        ? booksRes.data.books
        : Array.isArray(booksRes?.data)
        ? booksRes.data
        : Array.isArray(booksRes)
        ? booksRes
        : [];

      const authorsArray = Array.isArray(authorsRes?.data?.authors)
        ? authorsRes.data.authors
        : Array.isArray(authorsRes?.data)
        ? authorsRes.data
        : Array.isArray(authorsRes)
        ? authorsRes
        : [];

      return {
        categories: categoriesArray,
        books: booksArray,
        authors: authorsArray,
      };
    } catch (error) {
      console.error('Failed to fetch home page data:', error);
      throw new Error('Failed to load data. Please try again.');
    }
  },
};
