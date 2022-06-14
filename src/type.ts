export interface IBookInfo {
  bookTitle?: string | null;
  bookPrice?: string | null;
  imageUrl?: string | null;
  bookDescription?: string | null;
  upc?: string | null;
  noAvailable?: string | null;
}

export interface IBookMap {
  [key: string]: IBookInfo[];
}
