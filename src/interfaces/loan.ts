import { Book } from './book';

export interface Loan {
  id: number;
  userId: number;
  bookId: number;
  status: 'BORROWED' | 'RETURNED' | string;
  borrowedAt: string; // ISO string
  dueAt: string; // ISO string
  returnedAt: string | null;
  book: Book;
}
