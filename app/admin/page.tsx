import Link from 'next/link';

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">კონტენტის მართვა</h1>
      <p className="mt-2 text-fg-muted">
        NestJS + PostgreSQL + Prisma CMS — წიგნები, ავტორები, ჟანრები.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { href: '/admin/books', label: 'წიგნები', desc: 'CRUD + თავები' },
          { href: '/admin/authors', label: 'ავტორები', desc: 'ბიოგრაფია, სლაგი' },
          { href: '/admin/genres', label: 'ჟანრები', desc: 'კატეგორიები SEO-სთვის' },
        ].map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="panel block p-6 no-underline transition hover:-translate-y-0.5"
            >
              <h2 className="font-semibold">{item.label}</h2>
              <p className="mt-2 text-sm text-fg-muted">{item.desc}</p>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-fg-muted">
        <Link href="/admin/login" className="text-brand-indigo">
          შესვლა
        </Link>{' '}
        — საჭიროა JWT (API: POST /api/admin/auth/login).
      </p>
    </div>
  );
}
