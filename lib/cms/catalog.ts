import type { Book } from '@/types/book';
import type { Author, Genre } from '@/types/catalog';
import {
  books as staticBooks,
  getBook as staticGetBook,
  booksByAccess as staticByAccess,
  booksByGenre as staticByGenre,
  booksByAuthor as staticByAuthor,
  newBooks as staticNew,
  popularBooks as staticPopular,
  similarBooks as staticSimilar,
} from '@/data/books';
import { authors as staticAuthors, getAuthor as staticGetAuthor } from '@/data/authors';
import { genres as staticGenres, getGenre as staticGetGenre } from '@/data/genres';
import { getReadingParagraphs as staticReading } from '@/data/chapters';
import { cmsFetch } from './fetch';

type BookFilters = {
  access?: string;
  genre?: string;
  author?: string;
  isNew?: boolean;
  sort?: 'popular' | 'new';
  limit?: number;
};

function bookQuery(filters?: BookFilters): string {
  if (!filters) return '/books';
  const q = new URLSearchParams();
  if (filters.access) q.set('access', filters.access);
  if (filters.genre) q.set('genre', filters.genre);
  if (filters.author) q.set('author', filters.author);
  if (filters.isNew) q.set('isNew', 'true');
  if (filters.sort) q.set('sort', filters.sort);
  if (filters.limit) q.set('limit', String(filters.limit));
  const s = q.toString();
  return s ? `/books?${s}` : '/books';
}

export async function getAllBooks(filters?: BookFilters): Promise<Book[]> {
  const remote = await cmsFetch<Book[]>(bookQuery(filters));
  if (remote?.length) return remote;
  if (filters?.access) return staticByAccess(filters.access as Book['access']);
  if (filters?.genre) return staticByGenre(filters.genre);
  if (filters?.author) return staticByAuthor(filters.author);
  if (filters?.isNew) return staticNew(filters?.limit);
  if (filters?.sort === 'popular') return staticPopular(filters?.limit);
  if (filters?.sort === 'new') return staticNew(filters?.limit);
  return staticBooks;
}

export async function getBookBySlug(slug: string): Promise<Book | undefined> {
  const remote = await cmsFetch<Book>(`/books/${slug}`);
  if (remote) return remote;
  return staticGetBook(slug);
}

export async function getFeaturedBooks(): Promise<Book[]> {
  const remote = await getAllBooks({ sort: 'popular', limit: 6 });
  if (remote.length) return remote;
  return staticBooks.slice(0, 6);
}

export async function getPopularBooks(limit?: number): Promise<Book[]> {
  const remote = await getAllBooks({ sort: 'popular', limit });
  if (remote.length) return remote;
  return staticPopular(limit);
}

export async function getNewBooks(limit?: number): Promise<Book[]> {
  const remote = await getAllBooks({ isNew: true, sort: 'new', limit });
  if (remote.length) return remote;
  return staticNew(limit);
}

export async function getBooksByAccess(access: Book['access']): Promise<Book[]> {
  return getAllBooks({ access });
}

export async function getBooksByGenre(slug: string): Promise<Book[]> {
  return getAllBooks({ genre: slug });
}

export async function getBooksByAuthor(slug: string): Promise<Book[]> {
  return getAllBooks({ author: slug });
}

export async function getSimilarBooks(book: Book, limit = 4): Promise<Book[]> {
  const remote = await getAllBooks({ genre: book.genreSlugs[0], limit: limit + 1 });
  const filtered = remote.filter((b) => b.slug !== book.slug).slice(0, limit);
  if (filtered.length) return filtered;
  return staticSimilar(book, limit);
}

export async function getAllAuthors(): Promise<Author[]> {
  const remote = await cmsFetch<Author[]>('/authors');
  if (remote?.length) return remote;
  return staticAuthors;
}

export async function getAuthorBySlug(slug: string): Promise<Author | undefined> {
  const remote = await cmsFetch<Author>(`/authors/${slug}`);
  if (remote) return remote;
  return staticGetAuthor(slug);
}

export async function getAllGenres(): Promise<Genre[]> {
  const remote = await cmsFetch<Genre[]>('/genres');
  if (remote?.length) return remote;
  return staticGenres;
}

export async function getGenreBySlug(slug: string): Promise<Genre | undefined> {
  const remote = await cmsFetch<Genre>(`/genres/${slug}`);
  if (remote) return remote;
  return staticGetGenre(slug);
}

export async function getReadingParagraphs(
  bookSlug: string,
  chapterId: string,
  chapterTitle: string,
): Promise<string[]> {
  const remote = await cmsFetch<{ paragraphs: string[] }>(
    `/books/${bookSlug}/reading/${chapterId}`,
  );
  if (remote?.paragraphs?.length) return remote.paragraphs;
  return staticReading(bookSlug, chapterId, chapterTitle);
}

/** Sitemap / static params */
export async function getAllBookSlugs(): Promise<string[]> {
  const books = await getAllBooks();
  return books.map((b) => b.slug);
}

export async function getAllAuthorSlugs(): Promise<string[]> {
  const authors = await getAllAuthors();
  return authors.map((a) => a.slug);
}

export async function getAllGenreSlugs(): Promise<string[]> {
  const genres = await getAllGenres();
  return genres.map((g) => g.slug);
}
