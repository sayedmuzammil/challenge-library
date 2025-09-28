import { BookCategory } from './book-category';

export interface CartItem {
  bookId: number;
  bookName: string;
  categoryName: string;
  authorName: string;
  bookImage: BookCategory | string;
}
