import { getAllBooks } from '@/lib/cms/catalog';
import { CatalogPage } from '@/components/catalog/CatalogPage';
import { JsonLd, breadcrumbSchema } from '@/lib/seo/json-ld';
import { pageMetadata } from '@/lib/seo/metadata';
import Link from 'next/link';

export const metadata = pageMetadata({
  title: 'აუდიოწიგნები ქართულად',
  description:
    'მოუსმინე ქართულ აუდიოწიგნებს ონლაინ. კლასიკა, ბიზნესი, ისტორია და თანამედროვე ლიტერატურა — Tsignebi.ge.',
  path: '/audiobooks',
});

export default async function AudiobooksPage() {
  const books = await getAllBooks();
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'მთავარი', href: '/' },
          { name: 'აუდიოწიგნები', href: '/audiobooks' },
        ])}
      />
      <CatalogPage
        title="აუდიოწიგნები"
        description="ყველა აუდიოწიგნი ერთ ადგილას — ისმენ ნებისმიერ მოწყობილობაზე, გააგრძელე იქიდან, სადაც გაჩერდი."
        books={books}
        breadcrumbs={[
          { name: 'მთავარი', href: '/' },
          { name: 'აუდიოწიგნები', href: '/audiobooks' },
        ]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/audiobooks/free" className="btn-secondary text-sm">
            უფასო აუდიოწიგნები
          </Link>
          <Link href="/audiobooks/premium" className="btn-secondary text-sm">
            პრემიუმ აუდიოწიგნები
          </Link>
          <Link href="/books/popular" className="link-muted text-sm">
            პოპულარული →
          </Link>
        </div>
      </CatalogPage>
    </>
  );
}
