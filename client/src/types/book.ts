export interface NewBook {
  title: string;
  author: string;
  publishedDate: string;
  publisher: string;
  description: string;
  genre: string[];
  averageRating: number;
  language: string;
  coverImg: File | string ;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  publishedDate: string;
  publisher: string;
  description: string;
  genre: string[];
  averageRating: number;
  language: string;
  coverImg: string ;
  status: string;
  borrowerId: {};
  reservedBy: string[];
  totalLikes: number;
}

export interface Notification {
  _id: string;
  message: string;
  read: boolean;
  sender: string;
  recipient: string;
  type: string;
  createdAt: string;
}