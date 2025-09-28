'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { homeService } from '../../../services/service';
import BookLayout from '@/components/layouts/book-layout';
import Navbar from '@/components/layouts/navbar';
import Footer from '@/components/layouts/footer';
import Image from 'next/image';

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
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMoreBooks, setHasMoreBooks] = useState<boolean>(true);

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

        // Check if there are more books to load
        // We'll assume there are more books if we got exactly 10 books (a full page)
        if (homeData.books && homeData.books.length < 10) {
          setHasMoreBooks(false);
        }
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

  const loadMoreBooks = async () => {
    if (loadingMore || !hasMoreBooks) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;

      // Use the service pattern consistently
      const response = await homeService.getBooks(nextPage, 10);

      if (response && response.data && response.data.books) {
        const newBooks = response.data.books;
        setBooks((prevBooks) => [...prevBooks, ...newBooks]);
        setCurrentPage(nextPage);

        // Check if we've reached the last page or if no more books were returned
        if (newBooks.length < 10) {
          setHasMoreBooks(false);
        }
      } else {
        setHasMoreBooks(false);
      }
    } catch (err) {
      console.error('Failed to load more books:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load more books. Please try again.'
      );
    } finally {
      setLoadingMore(false);
    }
  };

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
              ? books.map((book, index) => (
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
            {hasMoreBooks ? (
              <button
                onClick={loadMoreBooks}
                disabled={loadingMore}
                className="text-blue-500 hover:text-blue-600 font-medium disabled:opacity-50"
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            ) : (
              <p className="text-gray-500">No more books to load</p>
            )}
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
                          <Image
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
      <Footer />
    </div>
  );
};

export default HomePage;
