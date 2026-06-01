import { getNewBooks } from '@/lib/cms/catalog';
import { CatalogPage } from '@/components/catalog/CatalogPage';
import { JsonLd, breadcrumbSchema } from '@/lib/seo/json-ld';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata = pageMetadata({
  title: 'ახალი წიგნები და აუდიოწიგნები',
  description: 'უახლესი რელიზები Tsignebi.ge-ზე — ახალი ქართული აუდიოწიგნები და ელწიგნები.',
  path: '/books/new',
});

export default async function NewBooksPage() {
  const list = await getNewBooks(48);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'მთავარი', href: '/' },
          { name: 'ახალი წიგნები', href: '/books/new' },
        ])}
      />
      <CatalogPage
        title="ახალი წიგნები"
        description="უახლესი დამატებები ბიბლიოთეკაში — განახლება ყოველ კვირას (demo)."
        books={list}
        breadcrumbs={[
          { name: 'მთავარი', href: '/' },
          { name: 'ახალი წიგნები', href: '/books/new' },
        ]}
      />
    </>
  );
}
