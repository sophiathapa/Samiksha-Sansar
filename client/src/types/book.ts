export interface NewBook {
  title: string;
  author: string;
  publishedDate: string;
  publisher: string;
  description: string;
  genre: string[];
  averageRating: number;
  language: string;
  coverImg: string | File ;
}

export interface Book extends NewBook {
  _id: string;
  status: string;
  borrowerId: {};
  reservedBy: string[];
  totalLikes: number;
}