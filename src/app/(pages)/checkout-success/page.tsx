import Link from 'next/link';
import Navbar from '@/components/layouts/navbar';
import Footer from '@/components/layouts/footer';

function formatLongDate(d: Date) {
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default async function BorrowSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ due?: string }>;
}) {
  // In PPR, searchParams is a Promise — await it:
  const sp = await searchParams;
  const dueRaw = sp?.due ?? '';

  const due = dueRaw
    ? new Date(isNaN(Number(dueRaw)) ? `${dueRaw}T00:00:00` : Number(dueRaw))
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // fallback +7 days

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center text-slate-800">
        {/* Circle check icon */}
        <div className="relative mb-6 h-24 w-24">
          <div className="absolute inset-0 rounded-full bg-blue-600" />
          <div className="absolute inset-0 rounded-full ring-8 ring-blue-100" />
          <svg
            viewBox="0 0 24 24"
            className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold">Borrowing Successful!</h1>

        <p className="mt-3 text-sm text-slate-600">
          Your book has been successfully borrowed. Please return it by{' '}
          <span className="font-semibold text-rose-600">
            {formatLongDate(due)}
          </span>
          .
        </p>

        <Link
          href="/profile"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_0_3px_#E5EDFF_inset] hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-blue-200"
        >
          See Borrowed List
        </Link>
      </div>
      <Footer />
    </main>
  );
}
