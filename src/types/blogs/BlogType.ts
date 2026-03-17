export type BlogType = {
  id: number | null;
  title: string;
  content: string;
  short_description: string;
  cover_image: string;
  author: string;
  tags: string;
  category: '*' | '1' | '2' | '3';
  views_count: number;
  created_at: string;
};