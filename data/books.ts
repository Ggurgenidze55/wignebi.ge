import type { Book, Chapter } from '@/types/book';
import { authors, getAuthor } from '@/data/authors';
import { genres } from '@/data/genres';
import { AUDIO_DEMO, AUDIO_DEMO_2 } from '@/data/chapters';
import { bookCoverUrl } from '@/lib/site';

function makeChapters(count: number, prefix: string): Chapter[] {
  const titles = ['შესავალი', 'პირველი ნაწილი', 'მეორე ნაწილი', 'კულმინაცია', 'დასკვნა'];
  return Array.from({ length: Math.min(count, titles.length) }, (_, i) => ({
    id: `${prefix}-c${i + 1}`,
    title: titles[i] ?? `თავი ${i + 1}`,
    durationSec: 600 + i * 420,
    audioUrl: i % 2 === 0 ? AUDIO_DEMO : AUDIO_DEMO_2,
  }));
}

const featured: Book[] = [
  {
    id: '1',
    slug: 'vaja-pshavela-gogotur',
    title: 'გოგოტურ და გოდელი',
    author: 'ვაჟა-ფშაველა',
    authorSlug: 'vazha-pshavela',
    narrator: 'ნინო ბერიძე',
    description: 'ქართული ეპოსის კლასიკური ნაწყვეტები — ხმოვანი ვერსია სრული ტექსტით.',
    coverHue: 28,
    access: 'free',
    rating: 4.8,
    durationSec: 3600,
    genreSlugs: ['classics', 'poetry', 'fiction'],
    tags: ['კლასიკა', 'ეპოსი'],
    publishedAt: '2024-01-15',
    popularity: 98,
    isNew: false,
    chapters: [
      { id: 'c1', title: 'შესავალი', durationSec: 480, audioUrl: AUDIO_DEMO },
      { id: 'c2', title: 'პირველი ნაწილი', durationSec: 1200, audioUrl: AUDIO_DEMO_2 },
    ],
  },
  {
    id: '2',
    slug: 'rustaveli-vepkhistqaosani',
    title: 'ვეფხისტყაოსანი',
    author: 'შოთა რუსთაველი',
    authorSlug: 'shota-rustaveli',
    narrator: 'დავით კვირიკაშვილი',
    description: 'შედევრი ქართული ლიტერატურის — პროფესიონალური აუდიო ასახვა.',
    coverHue: 210,
    access: 'subscription',
    rating: 4.9,
    durationSec: 7200,
    genreSlugs: ['classics', 'poetry', 'fiction'],
    tags: ['კლასიკა', 'პოეზია'],
    publishedAt: '2023-06-01',
    popularity: 100,
    chapters: [
      { id: 'c1', title: 'ავტანდილისა და თამარის ნაწილი I', durationSec: 1800, audioUrl: AUDIO_DEMO },
      { id: 'c2', title: 'ნაწილი II', durationSec: 1800, audioUrl: AUDIO_DEMO_2 },
    ],
  },
  {
    id: '3',
    slug: 'business-mindset-2024',
    title: 'ბიზნეს აზროვნება',
    author: 'გიორგი მჭედლიძე',
    authorSlug: 'author-14',
    narrator: 'სალომე ჩ.',
    description: 'პრაქტიკული გზამკვლევი სტარტაპისა და მცირე ბიზნესისთვის.',
    coverHue: 145,
    access: 'subscription',
    durationSec: 5400,
    genreSlugs: ['business', 'self-help', 'productivity'],
    tags: ['ბიზნეს', 'თვითგანვითარება'],
    publishedAt: '2025-11-20',
    popularity: 76,
    isNew: true,
    chapters: [{ id: 'c1', title: 'სრული წიგნი', durationSec: 5400, audioUrl: AUDIO_DEMO }],
  },
  {
    id: '4',
    slug: 'tbilisi-nights',
    title: 'თბილისის ღამეები',
    author: 'ანა გვაზავა',
    authorSlug: 'author-13',
    narrator: 'მარიამ ლ.',
    description: 'თანამედროვე მოთხრობების კრებული — ექსკლუზიური პრემიუმ რელიზი.',
    coverHue: 320,
    access: 'premium',
    priceGel: 24,
    durationSec: 4200,
    genreSlugs: ['fiction', 'romance', 'drama'],
    tags: ['თანამედროვე', 'მოთხრობა'],
    publishedAt: '2025-09-01',
    popularity: 82,
    isNew: true,
    chapters: [
      { id: 'c1', title: 'პროლოგი', durationSec: 600, audioUrl: AUDIO_DEMO },
      { id: 'c2', title: 'ღამე №1', durationSec: 1800, audioUrl: AUDIO_DEMO_2 },
    ],
  },
  {
    id: '5',
    slug: 'kids-legends',
    title: 'ბავშვების ზღაპრები',
    author: 'ნიკა მელაძე',
    authorSlug: 'author-10',
    narrator: 'ნათია ბ.',
    description: 'უფასო კოლექცია პატარებისთვის — რბილი ხმა და მოკლე თავები.',
    coverHue: 55,
    access: 'free',
    durationSec: 2400,
    genreSlugs: ['kids', 'fiction'],
    tags: ['ბავშვები', 'უფასო'],
    publishedAt: '2025-03-10',
    popularity: 65,
    chapters: [{ id: 'c1', title: 'ორი ძმა', durationSec: 900, audioUrl: AUDIO_DEMO }],
  },
  {
    id: '6',
    slug: 'history-georgia',
    title: 'საქართველოს ისტორია',
    author: 'ლევან თავაძე',
    authorSlug: 'author-12',
    narrator: 'ლევან თ.',
    description: 'პრემიუმ დოკუმენტური აუდიო სერია — ცალკეული შეძენა.',
    coverHue: 15,
    access: 'premium',
    priceGel: 35,
    durationSec: 9000,
    genreSlugs: ['history', 'education', 'biography'],
    tags: ['ისტორია', 'პრემიუმ'],
    publishedAt: '2024-08-01',
    popularity: 71,
    chapters: [{ id: 'c1', title: 'წინასწარმეტყველება', durationSec: 1200, audioUrl: AUDIO_DEMO }],
  },
];

const genrePool = genres.map((g) => g.slug);
const accessCycle: Book['access'][] = ['free', 'subscription', 'subscription', 'premium'];

function generateBooks(): Book[] {
  const out: Book[] = [];
  let id = 100;

  for (let i = 0; i < 94; i++) {
    const author = authors[(i + 5) % authors.length];
    const g1 = genrePool[i % genrePool.length];
    const g2 = genrePool[(i + 7) % genrePool.length];
    const slug = `book-${author.slug}-${i + 1}`;
    const title = `${genres.find((g) => g.slug === g1)?.name ?? 'წიგნი'} №${i + 1}`;
    const access = accessCycle[i % accessCycle.length];
    const chapters = makeChapters(2 + (i % 3), slug);
    const durationSec = chapters.reduce((s, c) => s + c.durationSec, 0);
    const published = new Date(2023 + (i % 3), (i % 12) + 1, ((i * 3) % 27) + 1);

    out.push({
      id: String(id++),
      slug,
      title,
      author: author.name,
      authorSlug: author.slug,
      narrator: authors[(i + 3) % authors.length].name,
      description: `${title} — ${author.name}-ის წიგნი ჟანრში „${genres.find((g) => g.slug === g1)?.name}“. ხელმისაწვდომია აუდიოწიგნისა და ელწიგნის სახით.`,
      coverHue: (i * 37) % 360,
      coverUrl: bookCoverUrl(slug),
      access,
      priceGel: access === 'premium' ? 12 + (i % 20) : undefined,
      rating: 3.8 + (i % 12) * 0.1,
      durationSec,
      genreSlugs: Array.from(new Set([g1, g2])),
      tags: [g1, g2],
      publishedAt: published.toISOString().slice(0, 10),
      popularity: 20 + ((i * 13) % 75),
      isNew: i < 12,
      chapters,
    });
  }

  return out;
}

export const books: Book[] = [...featured, ...generateBooks()];

export function getBook(slug: string) {
  return books.find((b) => b.slug === slug);
}

export function booksByAccess(access: Book['access']) {
  return books.filter((b) => b.access === access);
}

export function booksByAuthor(authorSlug: string) {
  return books.filter((b) => b.authorSlug === authorSlug);
}

export function booksByGenre(genreSlug: string) {
  return books.filter((b) => b.genreSlugs.includes(genreSlug));
}

export function similarBooks(book: Book, limit = 4) {
  return books
    .filter((b) => b.id !== book.id && b.genreSlugs.some((g) => book.genreSlugs.includes(g)))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

export function newBooks(limit = 24) {
  return [...books].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, limit);
}

export function popularBooks(limit = 24) {
  return [...books].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}

export function resolveAuthor(book: Book) {
  return getAuthor(book.authorSlug);
}
