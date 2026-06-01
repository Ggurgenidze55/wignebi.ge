'use client';

import { subscriptionPlans } from '@/lib/site';
import { usePlayerStore } from '@/lib/player-store';
import { FadeUp } from '@/components/ui/fade-up';
import Link from 'next/link';

export default function PricingPage() {
  const setPlan = usePlayerStore((s) => s.setPlan);

  return (
    <main className="mx-auto max-w-page px-6 py-14">
      <FadeUp>
        <h1 className="text-3xl font-semibold tracking-tight">გამოწერა</h1>
        <p className="mt-3 max-w-lg text-fg-muted">
          უფასო წიგნები ყოველთვის ხელმისაწვდომია. გამოწერა გახსნის სრულ კატალოგს.
        </p>
      </FadeUp>

      <div className="mt-14 grid gap-4 md:grid-cols-2 md:max-w-3xl">
        {subscriptionPlans.map((plan, i) => (
          <FadeUp key={plan.id} delay={i * 0.08}>
            <div className={`panel p-8 ${plan.highlight ? 'border-brand-indigo/40 ring-1 ring-brand-indigo/20' : ''}`}>
              {plan.highlight ? (
                <p className="text-xs font-medium uppercase tracking-wide text-brand-cyan">რეკომენდებული</p>
              ) : null}
              <h2 className="mt-2 text-xl font-semibold">{plan.name}</h2>
              <p className="mt-6 text-4xl font-semibold tracking-tight">
                {plan.priceGel} ₾
                <span className="text-lg font-normal text-fg-muted">
                  /{plan.id === 'yearly' ? 'წელი' : 'თვე'}
                </span>
              </p>
              <ul className="mt-8 space-y-2 text-sm text-fg-muted">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <button
                type="button"
                className={`mt-8 w-full ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPlan('subscriber')}
              >
                გამოწერა (demo)
              </button>
            </div>
          </FadeUp>
        ))}
      </div>

      <p className="mt-16 text-sm text-fg-faint">
        პრემიუმ წიგნები —{' '}
        <Link href="/library?filter=premium" className="text-brand-cyan no-underline hover:underline">
          ცალ-ცალკე შეძენა
        </Link>
      </p>
    </main>
  );
}
