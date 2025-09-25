import { UserData } from './user';

export interface BookReview {
  id: string;
  user: UserData;
  avatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}
