import { getFeaturedBooks } from '@/lib/cms/catalog';
import { BookCoverCard } from '@/components/ui/BookCover';
import { FadeUp } from '@/components/ui/fade-up';
import { AmbientSparks } from '@/components/home/ambient-sparks';
import { FeatureCard } from '@/components/home/feature-card';
import { FloatingOrbs } from '@/components/home/floating-orbs';
import { HeroHeadline } from '@/components/home/hero-headline';
import { HeroPlayer } from '@/components/home/hero-player';
import { SpringLink } from '@/components/ui/spring-link';
import { subscriptionPlans, site } from '@/lib/site';
import Link from 'next/link';

const features = [
  {
    title: 'აუდიოწიგნები',
    desc: 'მოუსმინე შენს საყვარელ წიგნებს — ფონზე რბილი მუსიკა, თითქოს პიპილები გიყვებიან ისტორიას.',
  },
  {
    title: 'ელექტრონული წიგნები',
    desc: 'წაიკითხე ონლაინ, შეინახე ბიბლიოთეკაში და გააგრძელე ზუსტად იქიდან, სადაც გაჩერდი.',
  },
  {
    title: 'პერსონალური ბიბლიოთეკა',
    desc: 'შენი წიგნები, შენი პროგრესი — ყველაფერი ერთ ადგილას, ნებისმიერ მოწყობილობაზე.',
  },
];

export default async function HomePage() {
  const featured = await getFeaturedBooks();
  const heroBook = featured[0];

  return (
    <main>
      <section className="relative overflow-hidden">
        <FloatingOrbs />
        <AmbientSparks count={32} className="opacity-80" />

        <div className="relative mx-auto max-w-page px-6 pb-20 pt-16 lg:pt-24">
          <div className="hero-grid">
            <div>
              <HeroHeadline />
              <div className="btn-row mt-10 flex flex-wrap gap-3">
                <SpringLink href="/library">დაიწყე უფასოდ</SpringLink>
                <SpringLink href="/library" variant="secondary">
                  დაათვალიერე ბიბლიოთეკა
                </SpringLink>
              </div>
            </div>
            {heroBook ? <HeroPlayer book={heroBook} carousel={featured} /> : null}
          </div>

          <FadeUp delay={0.2}>
            <p className="mx-auto mt-20 max-w-3xl text-center text-sm leading-relaxed text-fg-muted lg:text-base">
              {site.description}
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="relative border-t border-line/80 bg-base-raised/70">
        <AmbientSparks count={12} className="opacity-40" />
        <div className="relative mx-auto max-w-page px-6 py-20">
          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((f, i) => (
              <FeatureCard key={f.title} title={f.title} desc={f.desc} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-page px-6 py-20">
        <FadeUp>
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-semibold">
              ახლა პოპულარული <span className="text-brand-cyan">✦</span>
            </h2>
            <Link href="/books/popular" className="link-muted text-sm">
              ყველა →
            </Link>
          </div>
        </FadeUp>
        <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((b, i) => (
            <FadeUp key={b.id} delay={i * 0.05}>
              <BookCoverCard book={b} />
            </FadeUp>
          ))}
        </div>
      </section>

      <section className="relative border-t border-line/80 bg-base-surface/50">
        <FloatingOrbs className="opacity-60" />
        <div className="relative mx-auto max-w-page px-6 py-20">
          <FadeUp>
            <h2 className="text-xl font-semibold">გამოწერა</h2>
            <p className="mt-2 text-fg-muted">7 დღე საცდელი — გაუქმება ნებისმიერ დროს</p>
          </FadeUp>
          <div className="mt-10 grid gap-4 md:max-w-2xl md:grid-cols-2">
            {subscriptionPlans.map((plan, i) => (
              <FadeUp key={plan.id} delay={i * 0.08}>
                <div
                  className={`panel panel-glow p-8 transition-transform hover:-translate-y-1 ${plan.highlight ? 'border-brand-indigo/30 ring-1 ring-brand-indigo/10' : ''}`}
                >
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="mt-4 text-3xl font-semibold tracking-tight">
                    {plan.priceGel} ₾
                    <span className="text-base font-normal text-fg-muted">
                      /{plan.id === 'yearly' ? 'წელი' : 'თვე'}
                    </span>
                  </p>
                  <ul className="mt-6 space-y-2 text-sm text-fg-muted">
                    {plan.features.map((f) => (
                      <li key={f}>✦ {f}</li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.15}>
            <SpringLink href="/pricing" variant="secondary" className="mt-8 inline-flex">
              დეტალები
            </SpringLink>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
