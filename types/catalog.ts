export type Author = {
  id: string;
  slug: string;
  name: string;
  bio: string;
  imageUrl?: string;
  relatedSlugs: string[];
};

export type Genre = {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  relatedSlugs: string[];
};
