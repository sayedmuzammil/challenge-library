'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layouts/navbar';
import api from '@/app/api/api';
import Image from 'next/image';
import axios, { AxiosError } from 'axios';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type Category = {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

type CartItem = {
  bookId: number;
  bookName: string;
  authorName: string;
  bookImage: string; // url or base64 data uri
  categoryName: Category | string; // allow raw string fallback
};

const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }); // e.g., 28 Aug 2024

const addDays = (d: Date, days: number) => {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
};

export default function CheckoutPage() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [borrowDate, setBorrowDate] = useState<string>(() => {
    const today = new Date();
    // yyyy-mm-dd for <input type="date" />
    return new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  });
  const [duration, setDuration] = useState<3 | 5 | 10>(3);
  const [agreeReturn, setAgreeReturn] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const router = useRouter();

  // Load localStorage (client only)
  useEffect(() => {
    try {
      const u = localStorage.getItem('user');
      if (u) setUser(JSON.parse(u));
    } catch {}
    try {
      const c = localStorage.getItem('cartItems');
      if (c) setItems(JSON.parse(c));
    } catch {}
  }, []);

  const returnDate = useMemo(
    () => addDays(new Date(borrowDate), duration),
    [borrowDate, duration]
  );
  const canSubmit = items.length > 0 && agreeReturn && agreePolicy;

  async function onBorrow() {
    if (!items.length) return;
    try {
      setSubmitting(true);

      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMsg('You are not authenticated. Please log in first.');
        setErrorOpen(true);
        return;
      }

      // Process sequentially so we can stop and show the first error nicely
      for (const it of items) {
        try {
          const res = await api.post('/loans', {
            bookId: it.bookId,
            days: duration,
          });

          // Optional: if API returns 200 but body has success=false
          if (res?.data && res.data.success === false) {
            throw new Error(res.data.message || 'Borrowing failed.');
          }
        } catch (e: unknown) {
          let msg = 'Borrowing failed.';
          if (axios.isAxiosError(e)) {
            const ax = e as AxiosError<{ message?: string; error?: string }>;
            msg =
              ax.response?.data?.message ??
              ax.response?.data?.error ??
              ax.message ??
              msg;
          } else if (e instanceof Error) {
            msg = e.message ?? msg;
          } else if (typeof e === 'string') {
            msg = e;
          }
          setErrorMsg(msg);
          setErrorOpen(true);
          return;
        }
      }

      // If we got here, all items succeeded
      localStorage.removeItem('cartItems');
      const dueISO = returnDate.toISOString().slice(0, 10);
      router.push(`/checkout-success?due=${dueISO}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 text-slate-800">
      <Navbar />
      <h1 className="text-2xl font-semibold">Checkout</h1>

      <div className="mt-6 grid gap-8 md:grid-cols-[1fr,1.2fr]">
        {/* LEFT: User + Book List */}
        <section>
          {/* User Information */}
          <div>
            <h2 className="text-lg font-medium">User Information</h2>
            <div className="mt-4 divide-y rounded-xl border bg-white">
              <Row label="Name" value={user?.name ?? '—'} />
              <Row label="Email" value={user?.email ?? '—'} />
              <Row label="Nomor Handphone" value="—" />
            </div>
          </div>

          {/* Book List */}
          <div className="mt-8">
            <h2 className="text-lg font-medium">Book List</h2>

            <ul className="mt-4 space-y-4">
              {items.map((it) => (
                <li
                  key={it.bookId}
                  className="flex items-start gap-4 rounded-xl border bg-white p-4"
                >
                  <Image
                    width={92}
                    height={138}
                    src={it.bookImage}
                    alt={it.bookName}
                    className="h-20 w-14 flex-none rounded object-cover ring-1 ring-slate-200"
                  />
                  <div className="min-w-0">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
                      {typeof it.categoryName === 'string'
                        ? it.categoryName
                        : it.categoryName?.name}
                    </span>
                    <div className="mt-1 truncate text-sm font-semibold">
                      {it.bookName}
                    </div>
                    <div className="text-xs text-slate-500">
                      {it.authorName}
                    </div>
                  </div>
                </li>
              ))}

              {items.length === 0 && (
                <li className="rounded-xl border bg-white p-6 text-sm text-slate-500">
                  Your cart is empty.
                </li>
              )}
            </ul>
          </div>
        </section>

        {/* RIGHT: Borrow Card */}
        <section>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">
              Complete Your Borrow Request
            </h2>

            {/* Borrow Date */}
            <div className="mt-5">
              <label className="block text-xs font-medium text-slate-600">
                Borrow Date
              </label>
              <div className="mt-2 relative">
                <input
                  type="date"
                  value={borrowDate}
                  onChange={(e) => setBorrowDate(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  📅
                </span>
              </div>
            </div>

            {/* Borrow Duration */}
            <div className="mt-6">
              <div className="text-xs font-medium text-slate-600">
                Borrow Duration
              </div>
              <div className="mt-2 space-y-2">
                {[3, 5, 10].map((d) => (
                  <label
                    key={d}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
                  >
                    <input
                      type="radio"
                      name="duration"
                      checked={duration === d}
                      onChange={() => setDuration(d as 3 | 5 | 10)}
                      className="h-4 w-4 accent-blue-600"
                    />
                    <span>{d} Days</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Return Date Note */}
            <div className="mt-6 rounded-lg bg-slate-50 p-3 text-xs">
              <div className="font-semibold">Return Date</div>
              <div className="mt-1">
                Please return the book no later than{' '}
                <span className="font-semibold text-rose-600">
                  {returnDate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                .
              </div>
            </div>

            {/* Agreements */}
            <div className="mt-6 space-y-3 text-sm">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreeReturn}
                  onChange={(e) => setAgreeReturn(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-blue-600"
                />
                <span>I agree to return the book(s) before the due date.</span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreePolicy}
                  onChange={(e) => setAgreePolicy(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-blue-600"
                />
                <span>I accept the library borrowing policy.</span>
              </label>
            </div>

            {/* Submit */}
            <button
              disabled={!canSubmit || submitting}
              className="mt-6 w-full rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              onClick={onBorrow} // ⬅️ call the handler
            >
              {submitting ? 'Processing…' : 'Confirm & Borrow'}
            </button>

            {/* Error Modal */}
            {errorOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* backdrop */}
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setErrorOpen(false)}
                />
                {/* dialog */}
                <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                      !
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-slate-800">
                        Borrowing Failed
                      </h3>
                      <p className="mt-2 text-sm text-slate-600 break-words">
                        {errorMsg || 'Something went wrong.'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setErrorOpen(false)}
                      className="rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-white"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Small helper under the card */}
          <p className="mt-3 text-center text-xs text-slate-500">
            Borrow date: {formatDate(new Date(borrowDate))} • Return date:{' '}
            {formatDate(returnDate)}
          </p>
        </section>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[160px,1fr] gap-6 px-5 py-3 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="justify-self-end text-right">{value}</span>
    </div>
  );
}
