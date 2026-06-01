import { BookForm } from '@/components/admin/BookForm';

export default function EditBookPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">წიგნის რედაქტირება</h1>
      <BookForm bookId={params.id} />
    </div>
  );
}
