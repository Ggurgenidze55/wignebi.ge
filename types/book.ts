export type AccessTier = 'free' | 'subscription' | 'premium';

export type Chapter = {
  id: string;
  title: string;
  durationSec: number;
  audioUrl: string;
};

export type Book = {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  author: string;
  authorSlug: string;
  narrator: string;
  description: string;
  coverHue: number;
  coverUrl?: string;
  rating?: number;
  access: AccessTier;
  priceGel?: number;
  durationSec: number;
  chapters: Chapter[];
  genreSlugs: string[];
  tags: string[];
  publishedAt: string;
  popularity: number;
  isNew?: boolean;
};

export type UserPlan = 'guest' | 'free' | 'subscriber' | 'premium_buyer';

export type PlaybackProgress = {
  bookId: string;
  chapterId: string;
  positionSec: number;
  updatedAt: number;
};

export type ReadingProgress = {
  bookSlug: string;
  chapterId: string;
  scrollPercent: number;
  updatedAt: number;
};
