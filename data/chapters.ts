/** Ebook reading paragraphs per book chapter (demo content). */

const paragraphs = [
  'დილა ნელა იწყებოდა. ქალაქი ჯერ კიდევ ძილავდა, მაგრამ მკითხველის გონებაში ისტორია უკვე ცოცხალი იყო — სიტყვა სიტყვას ებრძვოდა და ახალ სივრცეს ქმნიდა.',
  'თითოეული თავი ახალ კითხვას ტოვებს: ვინ ვართ, სად მივდივართ, რა გვაძლევს ძალას გავაგრძელოთ. წიგნი ამ კითხვებზე პასუხს ცდილობს — ზოგჯერ ხმამაღლად, ზოგჯერ ძალიან ნდობით.',
  'გმირები აქ არ არიან დაუნჯრელად რჩეულები. ისინი ეჭვებს, შეცდომებს უშვებენ, ხელახლა იწყებენ. სწორედ ამიტომ გვეხმარება მათი გზა ჩვენს საკუთარ გზაზე ფიქრში.',
  'ავტორი იყენებს მარტივ, მკაფიო ფრაზებს. რთული იდეები ხდება გასაგები, რადგან თითოეული აზრი ბუნებრივად მიედგმება წინას — როგორც კარგ ლექციაში.',
  'თუ გინდა, გააჩერე აქ — დათვალიერე პირობები, შეცვალე ფონტის ზომა, დააბრუნე ხაზების სივრცე. კითხვა შენი რიტმი უნდა იყოს: სწრაფი ტრამვა ან ნელი საღამო.',
  'ქვემოთ გაგრძელდება ისტორია. ყოველი აბზაცი ახლოვდება კულმინაციას, მაგრამ არ ჩჩქნის — იზრდება, როგორც მუსიკა, რომელიც იცის, როდის უნდა იმაღლოს ტემპი.',
  'Tsignebi.ge-ზე შეგიძლია წაიკითხო და მოუსმინო იქიდან, სადაც გაჩერდი. პროგრესი ინახება — შენი ადგილი წიგნში არ გაქრება.',
];

export function getReadingParagraphs(bookSlug: string, chapterId: string, chapterTitle: string): string[] {
  const seed = `${bookSlug}-${chapterId}`.length;
  const extra = [
    `«${chapterTitle}» — ამ თავის დასაწყისი. წაიკითხე ნელი, გამოყავი ფიქრისთვის დრო.`,
    paragraphs[(seed + 1) % paragraphs.length],
    paragraphs[(seed + 3) % paragraphs.length],
    paragraphs[(seed + 5) % paragraphs.length],
    paragraphs[(seed + 2) % paragraphs.length],
    paragraphs[(seed + 4) % paragraphs.length],
    paragraphs[(seed + 6) % paragraphs.length],
  ];
  return extra;
}

export const AUDIO_DEMO = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
export const AUDIO_DEMO_2 = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';
