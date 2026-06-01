import { getBooksByAccess } from '@/lib/cms/catalog';
import { CatalogPage } from '@/components/catalog/CatalogPage';
import { JsonLd, breadcrumbSchema } from '@/lib/seo/json-ld';
import { pageMetadata } from '@/lib/seo/metadata';
import Link from 'next/link';

export const metadata = pageMetadata({
  title: 'უფასო აუდიოწიგნები ქართულად',
  description: 'უფასო ქართული აუდიოწიგნები — დაიწყე მოსმენა დაუყოვნებლივ, რეგისტრაციის გარეშე (demo).',
  path: '/audiobooks/free',
});

export default async function FreeAudiobooksPage() {
  const list = await getBooksByAccess('free');

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'მთავარი', href: '/' },
          { name: 'აუდიოწიგნები', href: '/audiobooks' },
          { name: 'უფასო', href: '/audiobooks/free' },
        ])}
      />
      <CatalogPage
        title="უფასო აუდიოწიგნები"
        description={`${list.length} უფასო აუდიოწიგნი — სცადე პლატფორმა და იპოვე შენი შემდეგი საყვარელი ისტორია.`}
        books={list}
        breadcrumbs={[
          { name: 'მთავარი', href: '/' },
          { name: 'აუდიოწიგნები', href: '/audiobooks' },
          { name: 'უფასო', href: '/audiobooks/free' },
        ]}
      >
        <p className="mt-6 text-sm">
          <Link href="/audiobooks" className="link-muted">
            ← ყველა აუდიოწიგნი
          </Link>
        </p>
      </CatalogPage>
    </>
  );
}
