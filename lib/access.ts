import type { Book, UserPlan } from '@/types/book';

export function canListen(book: Book, plan: UserPlan, purchasedIds: string[]): boolean {
  if (book.access === 'free') return true;
  if (book.access === 'subscription' && (plan === 'subscriber' || plan === 'premium_buyer')) return true;
  if (book.access === 'premium' && purchasedIds.includes(book.id)) return true;
  return false;
}

export function accessLabel(book: Book): string {
  if (book.access === 'free') return 'უფასო';
  if (book.access === 'subscription') return 'საბსკრიფშენი';
  return `${book.priceGel} ₾`;
}

export function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}სთ ${m}წთ`;
  return `${m} წთ`;
}

export function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
