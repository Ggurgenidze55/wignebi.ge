import type { Author } from '@/types/catalog';

const avatar = (seed: string) => `https://picsum.photos/seed/tsignebi-author-${seed}/400/400`;

const featured: Author[] = [
  {
    id: 'a1',
    slug: 'vazha-pshavela',
    name: 'ვაჟა-ფშაველა',
    bio: 'ვაჟა-ფშაველა — ქართული ლიტერატურის კლასიკოსი, ეპოსისა და ლირიკის მაიგალი ოსტატი. მისი ნაწარმოებები ქართული კულტურის ფუნდამენტია.',
    imageUrl: avatar('vazha'),
    relatedSlugs: ['shota-rustaveli', 'galaktion-tabidze'],
  },
  {
    id: 'a2',
    slug: 'shota-rustaveli',
    name: 'შოთა რუსთაველი',
    bio: 'შოთა რუსთაველი — XII საუკუნის უმთავრესი ქართული პოეტი, „ვეფხისტყაოსნის“ ავტორი. მსოფლიო ლიტერატურის უნიკალური ძეგლი.',
    imageUrl: avatar('shota'),
    relatedSlugs: ['vazha-pshavela', 'ilia-chavchavadze'],
  },
  {
    id: 'a3',
    slug: 'ilia-chavchavadze',
    name: 'ილია ჭავჭავაძე',
    bio: 'ილია ჭავჭავაძე — ქართული პუბლიცისტიკის, პოეზიისა და საზოგადოებრივი აზრის ფიგურა. ახალი ქართული პროზის მამოძრავებელი.',
    imageUrl: avatar('ilia'),
    relatedSlugs: ['akaki-tsereteli', 'galaktion-tabidze'],
  },
  {
    id: 'a4',
    slug: 'akaki-tsereteli',
    name: 'აკაკი წერეთელი',
    bio: 'აკაკი წერეთელი — ჰუმორისა და ლირიკის ოსტატი, ქართული რომანტიზმის წარმომადგენელი.',
    imageUrl: avatar('akaki'),
    relatedSlugs: ['ilia-chavchavadze', 'vazha-pshavela'],
  },
  {
    id: 'a5',
    slug: 'galaktion-tabidze',
    name: 'გალაქტიონ ტაბიძე',
    bio: 'გალაქტიონ ტაბიძე — XX საუკუნის ქართული სიმბოლისტური პოეზიის უდიდესი პოეტი.',
    imageUrl: avatar('galaktion'),
    relatedSlugs: ['titsian-tabidze', 'vazha-pshavela'],
  },
];

const extraNames = [
  'ნიკა მელაძე',
  'სალომე ბერიძე',
  'დავით კვირიკაშვილი',
  'ანა გვაზავა',
  'გიორგი მჭედლიძე',
  'მარიამ ლომიძე',
  'ლევან თავაძე',
  'თამარ ჯანელიძე',
  'კოტე აბაშიძე',
  'ნინო ხარაძე',
  'ზურა ბოლქვაძე',
  'ელენე სტურუა',
  'ირაკლი გოგოლაძე',
  'მაკა ჯაფარიძე',
  'თეა ჩიხლაძე',
  'ბესო ხვიჩია',
  'ლუკა ჭანტურია',
  'ნათია ბლიაძე',
  'გვანცა კალანდაძე',
  'სოფო გოგიტიძე',
  'არჩილ ხარაბაძე',
  'მიხეილ ჯავახიშვილი',
  'ალექსანდრე ყაზბეგი',
  'კონსტანტინე გამსახურდია',
  'ოტია იოსელიანი',
  'გიორგი ლეონიძე',
  'იოსებ გრიშაშვილი',
  'ანა კალანდაძე',
  'თამარ ბერიძე',
  'ნოდარ დუმბაძე',
  'შალვა ნადარაია',
  'გურამ დოჩანაშვილი',
  'ჩაბუა ამირეჯიბი',
  'ლევან ბრეგაძე',
  'მერაბ კოსტავა',
  'თეონა ბრეგაძე',
  'ზაზა ბურთულაძე',
  'ნიკოლოზ ბარათაშვილი',
  'რევაზ ინანიშვილი',
  'ალექსანდრე ყაზბეგი-შვილი',
  'თენგიზ ბილური',
  'მანანა ანძაფიძე',
  'გოგი გაჩეჩილაძე',
  'ნინო ჰარაბაძე',
  'თემურ ბაბლუაშვილი',
  'ზურაბ კართოზია',
  'ლაშა ბუღაძი',
  'მარიამ მაჩავიანი',
  'გიგა ლორთქიფანიძე',
];

function slugify(name: string, i: number) {
  const base = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return base.length > 2 ? `${base}-${i}` : `author-${i}`;
}

const generated: Author[] = extraNames.map((name, i) => {
  const slug = slugify(name, i + 10);
  const rel = featured[i % featured.length];
  return {
    id: `a${i + 10}`,
    slug,
    name,
    bio: `${name} — თანამედროვე ქართული ავტორი. წიგნები ხელმისაწვდომია აუდიო და ელექტრონულ ფორმატში Tsignebi.ge-ზე.`,
    imageUrl: avatar(slug),
    relatedSlugs: [rel.slug, featured[(i + 1) % featured.length].slug],
  };
});

export const authors: Author[] = [...featured, ...generated];

export function getAuthor(slug: string) {
  return authors.find((a) => a.slug === slug);
}

export function getAuthorByName(name: string) {
  return authors.find((a) => a.name === name);
}
