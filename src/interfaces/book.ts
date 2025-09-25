import { Author } from './author';

export interface Book {
  id: number;
  title: string;
  author: Author;
  description?: string;
  rating?: number;
  image?: string;
  coverImage?: string;
  category?: string;
  pages?: number;
  ratingCount?: number;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
