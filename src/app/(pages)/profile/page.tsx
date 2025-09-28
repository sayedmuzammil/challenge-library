'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/layouts/navbar';
import Footer from '@/components/layouts/footer';
import { Tabs, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { TabsList } from '@radix-ui/react-tabs';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>();
  const [loanBooks, setLoanBooks] = useState<any>();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = localStorage.getItem('token');

        const responseProfile = await fetch('/api/get-profile', {
          headers: {
            Authorization: `${token}`,
          },
        });

        const responsLoanBooks = await fetch('/api/get-my-loans', {
          headers: {
            Authorization: `${token}`,
          },
        });

        const dataProfile = await responseProfile.json();
        const dataLoanBooks = await responsLoanBooks.json();

        console.log('Profile data fetched successfully:', dataProfile);
        console.log('Loan books data fetched successfully:', dataLoanBooks);

        const userProfile = dataProfile.data.profile;
        const userLoanBooks = dataLoanBooks.data.loans;
        // console.log(data);

        setProfile(userProfile);
        setLoanBooks(userLoanBooks);
      } catch (error) {
        `Error fetching profile or loan books: ${error}`;
        console.error('Error fetching profile or loan books:', error);
      }
    };
    getProfile();
  }, []);

  //   console.log(profile);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Navbar />
      <div className="max-w-md mx-auto">
        <Tabs defaultValue="profile" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="borrowed">Borrowed List</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <h1 className="text-2xl font-bold mb-6">Profile</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Image
                  src="/images/default-avatar.png"
                  alt="Profile"
                  width={60}
                  height={60}
                  className="rounded-full mr-4"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Name</span>
                  <span className="text-right">{profile?.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Email</span>
                  <span className="text-right">{profile?.email}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Nomor Handphone</span>
                  <span className="text-right">{profile?.phoneNumber}</span>
                </div>
              </div>

              <button className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Update Profile
              </button>
            </div>
          </TabsContent>
          <TabsContent value="borrowed">
            <h2 className="text-xl font-semibold mb-4">Borrowed List</h2>

            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search book"
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

            <div className="flex space-x-2 mb-4">
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                All
              </button>
              <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                Active
              </button>
              <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                Returned
              </button>
              <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                Overdue
              </button>
            </div>

            <div className="space-y-4">
              {Array.isArray(loanBooks) && loanBooks.length > 0 ? (
                loanBooks.map((loan: any) => (
                  <div key={loan.id} className="bg-white p-4 rounded-lg border">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Image
                          src={loan.book.coverImage || '/placeholder-book.jpg'}
                          alt="Book"
                          width={60}
                          height={80}
                          className="rounded-md"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {loan.book.category || 'Category'}
                          </span>
                          <h3 className="text-lg font-medium ml-2">
                            {loan.book.title || 'Book Name'}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          {loan.book.author}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(loan.borrowedAt).toLocaleDateString(
                            'en-GB',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }
                          )}{' '}
                          · Due Date{' '}
                          {new Date(loan.dueAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="ml-4">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Give Review
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3 text-sm">
                      <div className="flex items-center">
                        <span className="text-gray-500">Status</span>
                        <span className="ml-2 text-green-600 font-medium">
                          {loan.status}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500">Due Date</span>
                        <span className="ml-2 text-red-600 font-medium">
                          {new Date(loan.dueAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No borrowed books found.</p>
              )}
            </div>
            <div className="flex justify-center mt-6">
              <button className="bg-white text-gray-700 px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                Load More
              </button>
            </div>
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
