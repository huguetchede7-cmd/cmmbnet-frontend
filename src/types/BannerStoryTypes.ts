export interface BannerStoryTypes {
  id?: number;
  title?: string|null;
  description?: string|null;
  img_full: string;
  position: number;
  view_counter: number;
  click_counter: number;
  date_from?: Date | null;
  date_to?: Date | null;
  redirection_link: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string | null;
}