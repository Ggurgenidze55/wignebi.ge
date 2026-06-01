import Link from 'next/link';
import { JsonLd, breadcrumbSchema } from '@/lib/seo/json-ld';

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema(items)} />
      <nav aria-label="ბრუნვა" className="mb-6 text-sm text-fg-muted">
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, i) => (
            <li key={item.href} className="flex items-center gap-2">
              {i > 0 ? <span aria-hidden className="text-fg-faint">/</span> : null}
              {i === items.length - 1 ? (
                <span className="text-fg">{item.name}</span>
              ) : (
                <Link href={item.href} className="link-muted">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
