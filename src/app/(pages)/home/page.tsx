'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { homeService } from '../../../services/service';
import BookLayout from '@/components/layouts/book-layout';
import Navbar from '@/components/layouts/navbar';

// TypeScript interfaces for data structures (now using service interfaces)
interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Book {
  id: number;
  title: string;
  author: Author;
  rating?: number;
  image?: string;
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Author {
  id: number;
  name: string;
  bio?: string;
  avatar?: string;
  booksCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from APIs using services
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const homeData = await homeService.getAllHomeData();

        console.log('Home data fetched successfully:', homeData);

        setCategories(homeData.categories);
        setBooks(homeData.books || []);
        setAuthors(homeData.authors);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load data. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl p-8 mb-8 text-white overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to
              <br />
              Booky
            </h1>
            <div className="flex space-x-2 mb-4">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            </div>
          </div>
          {/* Hero Illustrations */}
          <div className="absolute top-4 left-8 opacity-80">
            <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center">
              📚
            </div>
          </div>
          <div className="absolute top-4 right-8 opacity-80">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
              👨‍🎓
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-8">
          <div className="grid grid-cols-6 gap-4">
            {Array.isArray(categories) && categories.length > 0
              ? categories.slice(0, 6).map((category, index) => (
                  <div
                    key={category?.id || index}
                    className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">
                        {index === 0
                          ? '📖'
                          : index === 1
                          ? '📚'
                          : index === 2
                          ? '🎯'
                          : index === 3
                          ? '💰'
                          : index === 4
                          ? '🔬'
                          : '🎓'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {category?.name || 'Category'}
                    </p>
                  </div>
                ))
              : [
                  'Fiction',
                  'Non-Fiction',
                  'Self-Improvement',
                  'Finance',
                  'Science',
                  'Education',
                ].map((name, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">
                        {index === 0
                          ? '📖'
                          : index === 1
                          ? '📚'
                          : index === 2
                          ? '🎯'
                          : index === 3
                          ? '💰'
                          : index === 4
                          ? '🔬'
                          : '🎓'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{name}</p>
                  </div>
                ))}
          </div>
        </div>

        {/* Recommendation Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recommendation
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {Array.isArray(books) && books.length > 0
              ? books
                  .slice(0, 10)
                  .map((book, index) => (
                    <BookLayout
                      key={book?.id || index}
                      id={book?.id || 0}
                      bookCover={book?.image || book?.coverImage || ''}
                      bookTitle={book?.title}
                      bookAuthor={
                        typeof book?.author === 'object'
                          ? book?.author?.name || ''
                          : book?.author || ''
                      }
                      bookRating={book?.rating || 0}
                    />
                  ))
              : Array.from({ length: 10 }, (_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-3 hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-[3/4] bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-3 flex items-center justify-center text-white font-bold">
                      📖
                    </div>
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">
                      Book Name
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">Author name</p>
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < 4 ? 'text-yellow-400' : 'text-gray-300'
                            }
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-600 ml-1">4.5</span>
                    </div>
                  </div>
                ))}
          </div>
          <div className="text-center">
            <button className="text-blue-500 hover:text-blue-600 font-medium">
              Load More
            </button>
          </div>
        </div>

        {/* Popular Authors Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Popular Authors
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.isArray(authors) && authors.length > 0
              ? authors.slice(0, 4).map((author, index) => (
                  <Link href={`/author/${author.id}`} key={author?.id || index}>
                    <div
                      key={author?.id || index}
                      className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow"
                    >
                      <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3 overflow-hidden">
                        {author?.avatar ? (
                          <img
                            src={author.avatar}
                            alt={author?.name || 'Author'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove(
                                'hidden'
                              );
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold ${
                            author?.avatar ? 'hidden' : ''
                          }`}
                        >
                          👤
                        </div>
                      </div>
                      <h3 className="font-semibold text-sm text-gray-900 mb-1">
                        {author?.name || 'Author name'}
                      </h3>
                      <div className="flex items-center justify-center text-blue-500">
                        <span className="text-xs">
                          📚 {author?.booksCount || '5'} books
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              : // Fallback authors if API data is not available
                Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold">
                      👤
                    </div>
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">
                      Author name
                    </h3>
                    <div className="flex items-center justify-center text-blue-500">
                      <span className="text-xs">📚 5 books</span>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <span className="text-xl font-semibold">Booky</span>
          </div>
          <p className="text-gray-400 mb-4">
            Discover inspiring stories & timeless knowledge. Booky is borrowing
            anytime. Explore online or visit our newest library branch.
          </p>
          <div>
            <p className="text-gray-400 mb-4">Follow us Social Media</p>
            <div className="flex justify-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.098.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-2.84v5.79a2.1 2.1 0 0 1-2.8 1.94 2.1 2.1 0 0 1 .7-4.07V2a4.83 4.83 0 0 0-1.92 9.19 2.1 2.1 0 0 1 0 3.61 4.83 4.83 0 0 0 1.92 9.19v-3.52a2.1 2.1 0 0 1-.7-4.07 2.1 2.1 0 0 1 2.8 1.94V22h2.84v-.31a4.83 4.83 0 0 1 3.77-4.25 4.83 4.83 0 0 1-.77-2.63c0-.38.04-.74.11-1.1a4.83 4.83 0 0 1 .77-2.63 4.83 4.83 0 0 1-.11-1.1c0-.38-.04-.74-.11-1.1z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
