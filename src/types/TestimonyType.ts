export type  TestimonyType= {
  id: number;
  name: string | null;
  description: string | null;
  rating: number | null;
  avatar:File|null;
  photo?: string | null;
  published_at: Date | string | null;
  created_at: Date | string | null;
};

