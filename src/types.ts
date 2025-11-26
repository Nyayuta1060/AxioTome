export interface Book {
  id?: number;
  title: string;
  author?: string;
  file_path: string;
  added_date?: string;
  last_read?: string;
  current_page: number;
  total_pages: number;
}
