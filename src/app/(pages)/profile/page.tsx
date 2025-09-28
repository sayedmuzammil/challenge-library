'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/layouts/navbar';
import Footer from '@/components/layouts/footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Profile } from '@/interfaces/profile';
import { Loan } from '@/interfaces/loan';
import { Author } from '@/interfaces/author';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loanBooks, setLoanBooks] = useState<Loan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errMsg, setErrMsg] = useState<string>('');

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = localStorage.getItem('token') ?? '';

        const [responseProfile, responseLoanBooks] = await Promise.all([
          fetch('/api/get-profile', { headers: { Authorization: token } }),
          fetch('/api/get-my-loans', { headers: { Authorization: token } }),
        ]);

        // optional: handle non-2xx quickly
        if (!responseProfile.ok) {
          const t = await responseProfile.text();
          throw new Error(
            `Profile load failed (${responseProfile.status}): ${t}`
          );
        }
        if (!responseLoanBooks.ok) {
          const t = await responseLoanBooks.text();
          throw new Error(
            `Loans load failed (${responseLoanBooks.status}): ${t}`
          );
        }

        const dataProfile: { data?: { profile?: Profile } } =
          await responseProfile.json();
        const dataLoanBooks: { data?: { loans?: Loan[] } } =
          await responseLoanBooks.json();

        // Debug logs
        console.log('Profile data fetched successfully:', dataProfile);
        console.log('Loan books data fetched successfully:', dataLoanBooks);

        setProfile(dataProfile?.data?.profile ?? null);
        setLoanBooks(dataLoanBooks?.data?.loans ?? []);
      } catch (error) {
        console.error('Error fetching profile or loan books:', error);
        setErrMsg(
          error instanceof Error ? error.message : 'Failed to load data.'
        );
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Navbar />
      <div className="mx-auto w-full max-w-2xl">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="borrowed">Borrowed List</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* PROFILE TAB */}
          <TabsContent value="profile">
            <h1 className="mb-6 text-2xl font-bold">Profile</h1>

            {loading ? (
              <div className="rounded-lg bg-white p-6 text-sm text-gray-600 shadow">
                Loading…
              </div>
            ) : errMsg ? (
              <div className="rounded-lg bg-white p-6 text-sm text-rose-600 shadow">
                Error: {errMsg}
              </div>
            ) : (
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 flex items-center">
                  <Image
                    src="/images/default-avatar.png"
                    alt="Profile"
                    width={60}
                    height={60}
                    className="mr-4 rounded-full"
                  />
                </div>

                <div className="space-y-4">
                  <Row label="Name" value={profile?.name ?? '—'} />
                  <Row label="Email" value={profile?.email ?? '—'} />
                  <Row
                    label="Nomor Handphone"
                    value={profile?.phoneNumber ?? '—'}
                  />
                </div>

                <button className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                  Update Profile
                </button>
              </div>
            )}
          </TabsContent>

          {/* BORROWED TAB */}
          <TabsContent value="borrowed">
            <h2 className="mb-4 text-xl font-semibold">Borrowed List</h2>

            {loading ? (
              <div className="rounded-lg bg-white p-6 text-sm text-gray-600 shadow">
                Loading…
              </div>
            ) : errMsg ? (
              <div className="rounded-lg bg-white p-6 text-sm text-rose-600 shadow">
                Error: {errMsg}
              </div>
            ) : (
              <>
                {/* Search (placeholder) */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search book"
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <svg
                    className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {/* Filter chips (placeholder) */}
                <div className="mb-4 flex space-x-2">
                  <button className="rounded-full bg-blue-600 px-3 py-1 text-sm text-white">
                    All
                  </button>
                  <button className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700">
                    Active
                  </button>
                  <button className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700">
                    Returned
                  </button>
                  <button className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700">
                    Overdue
                  </button>
                </div>

                <div className="space-y-4">
                  {loanBooks.length > 0 ? (
                    loanBooks.map((loan) => (
                      <div
                        key={loan.id}
                        className="rounded-lg border bg-white p-4"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <Image
                              src={
                                loan.book?.coverImage || '/placeholder-book.jpg'
                              }
                              alt={loan.book?.title || 'Book'}
                              width={60}
                              height={80}
                              className="rounded-md object-cover"
                            />
                          </div>

                          <div className="ml-4 flex-1">
                            <div className="flex items-center">
                              <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
                                {/* API sample didn't include category; keep placeholder */}
                                Book
                              </span>
                              <h3 className="ml-2 text-lg font-medium">
                                {loan.book?.title || 'Book Name'}
                              </h3>
                            </div>

                            {/* Author */}
                            {loan.book?.author && (
                              <p className="text-sm text-gray-600">
                                {/* If your typing includes author as string/obj, tweak accordingly */}
                                {(loan.book.author as Author)?.name ??
                                  (loan.book.author as Author) ??
                                  ''}
                              </p>
                            )}

                            <p className="mt-1 text-xs text-gray-500">
                              {loan.borrowedAt
                                ? new Date(loan.borrowedAt).toLocaleDateString(
                                    'en-GB',
                                    {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                    }
                                  )
                                : 'N/A'}{' '}
                              · Due Date{' '}
                              {new Date(loan.dueAt).toLocaleDateString(
                                'en-GB',
                                {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                }
                              )}
                            </p>
                          </div>

                          <div className="ml-4">
                            <button className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                              Give Review
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <span className="text-gray-500">Status</span>
                            <span className="ml-2 font-medium text-green-600">
                              {loan.status}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-500">Due Date</span>
                            <span className="ml-2 font-medium text-red-600">
                              {new Date(loan.dueAt).toLocaleDateString(
                                'en-GB',
                                {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No borrowed books found.</p>
                  )}
                </div>

                <div className="mt-6 flex justify-center">
                  <button className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50">
                    Load More
                  </button>
                </div>
              </>
            )}
          </TabsContent>
          <TabsContent value="reviews">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>

            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search Reviews"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div className="space-y-4">
              {/* Review Item 1 */}
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Image
                      src="/placeholder-book.jpg"
                      alt="Book"
                      width={60}
                      height={80}
                      className="rounded-md"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Category
                      </span>
                      <h3 className="text-lg font-medium ml-2">Book Name</h3>
                    </div>
                    <p className="text-sm text-gray-600">Author name</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${
                          i < 4 ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.122a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.122a1 1 0 00-1.175 0l-3.976 2.122c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.122c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <p className="mt-3 text-gray-700">
                  Lorem ipsum dolor sit amet consectetur. Pulvinar porttitor
                  aliquam viverra nunc sed facilisis. Integer tristique nullam
                  morbi mauris ante.
                </p>
              </div>

              {/* Review Item 2 */}
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Image
                      src="/placeholder-book.jpg"
                      alt="Book"
                      width={60}
                      height={80}
                      className="rounded-md"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Category
                      </span>
                      <h3 className="text-lg font-medium ml-2">Book Name</h3>
                    </div>
                    <p className="text-sm text-gray-600">Author name</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${
                          i < 4 ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.122a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.122a1 1 0 00-1.175 0l-3.976 2.122c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.122c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <p className="mt-3 text-gray-700">
                  Lorem ipsum dolor sit amet consectetur. Pulvinar porttitor
                  aliquam viverra nunc sed facilisis. Integer tristique nullam
                  morbi mauris ante.
                </p>
              </div>

              {/* Review Item 3 */}
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Image
                      src="/placeholder-book.jpg"
                      alt="Book"
                      width={60}
                      height={80}
                      className="rounded-md"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Category
                      </span>
                      <h3 className="text-lg font-medium ml-2">Book Name</h3>
                    </div>
                    <p className="text-sm text-gray-600">Author name</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${
                          i < 4 ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.122a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.122a1 1 0 00-1.175 0l-3.976 2.122c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.122c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <p className="mt-3 text-gray-700">
                  Lorem ipsum dolor sit amet consectetur. Pulvinar porttitor
                  aliquam viverra nunc sed facilisis. Integer tristique nullam
                  morbi mauris ante.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[160px,1fr] gap-6 py-2 text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="justify-self-end text-right">{value}</span>
    </div>
  );
}
