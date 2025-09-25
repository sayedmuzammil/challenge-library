import { Author } from './author';

export interface BookRelated {
  id: number;
  title: string;
  author: Author;
  coverImage: string;
  rating: number;
}
