import { getBooksByAccess } from '@/lib/cms/catalog';
import { CatalogPage } from '@/components/catalog/CatalogPage';
import { JsonLd, breadcrumbSchema } from '@/lib/seo/json-ld';
import { pageMetadata } from '@/lib/seo/metadata';
import Link from 'next/link';

export const metadata = pageMetadata({
  title: 'პრემიუმ აუდიოწიგნები',
  description: 'ექსკლუზიური პრემიუმ აუდიოწიგნები ქართულად — ცალკეული შეძენა ან გამოწერა.',
  path: '/audiobooks/premium',
});

export default async function PremiumAudiobooksPage() {
  const list = await getBooksByAccess('premium');

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'მთავარი', href: '/' },
          { name: 'აუდიოწიგნები', href: '/audiobooks' },
          { name: 'პრემიუმ', href: '/audiobooks/premium' },
        ])}
      />
      <CatalogPage
        title="პრემიუმ აუდიოწიგნები"
        description={`${list.length} პრემიუმ რელიზი — ექსკლუზიური კონტენტი და მაღალი ხარისხის ხმოვანი ვერსია.`}
        books={list}
        breadcrumbs={[
          { name: 'მთავარი', href: '/' },
          { name: 'აუდიოწიგნები', href: '/audiobooks' },
          { name: 'პრემიუმ', href: '/audiobooks/premium' },
        ]}
      >
        <p className="mt-6 text-sm">
          <Link href="/pricing" className="text-brand-cyan">
            გამოწერის გეგმები →
          </Link>
        </p>
      </CatalogPage>
    </>
  );
}
