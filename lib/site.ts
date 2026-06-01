export const site = {
  name: 'Tsignebi',
  domain: 'tsignebi.ge',
  tagline: 'წაიკითხე. მოუსმინე. ისწავლე.',
  description:
    'Tsignebi.ge არის თანამედროვე პლატფორმა, სადაც შეგიძლია წაიკითხო ელექტრონული წიგნები და მოუსმინო აუდიოწიგნებს — ნებისმიერ მოწყობილობაზე, იქიდან, სადაც გაჩერდი.',
  seoH1: 'წიგნები და აუდიოწიგნები ქართულად',
} as const;

export const subscriptionPlans = [
  {
    id: 'monthly',
    name: 'ყოველთვიური',
    priceGel: 19,
    highlight: false,
    features: ['500+ საბსკრიფშენ წიგნი', 'ოფლაინ PWA', 'პროგრესის შენახვა'],
  },
  {
    id: 'yearly',
    name: 'წლიური',
    priceGel: 149,
    highlight: true,
    features: ['ყველაფერი ყოველთვიურში', '2 თვე უფასოდ', 'პრიორიტეტული ახალი წიგნები'],
  },
] as const;

export function bookCoverUrl(slug: string) {
  return `https://picsum.photos/seed/tsignebi-${slug}/480/720`;
}
