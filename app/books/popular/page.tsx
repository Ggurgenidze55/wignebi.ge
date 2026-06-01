import { getPopularBooks } from '@/lib/cms/catalog';
import { CatalogPage } from '@/components/catalog/CatalogPage';
import { JsonLd, breadcrumbSchema } from '@/lib/seo/json-ld';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata = pageMetadata({
  title: 'პოპულარული წიგნები და აუდიოწიგნები',
  description: 'ყველაზე პოპულარული ქართული წიგნები და აუდიოწიგნები — რას უსმენენ ათასობით მკითხველი.',
  path: '/books/popular',
});

export default async function PopularBooksPage() {
  const list = await getPopularBooks(48);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'მთავარი', href: '/' },
          { name: 'პოპულარული', href: '/books/popular' },
        ])}
      />
      <CatalogPage
        title="პოპულარული წიგნები"
        description="ყველაზე ხშირად მოსმენილი და წაკითხული წიგნები პლატფორმაზე."
        books={list}
        breadcrumbs={[
          { name: 'მთავარი', href: '/' },
          { name: 'პოპულარული', href: '/books/popular' },
        ]}
      />
    </>
  );
}
