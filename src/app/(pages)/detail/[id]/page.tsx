'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layouts/navbar';
import Footer from '@/components/layouts/footer';
import { useParams } from 'next/navigation';
import { Book } from '../../../../interfaces/book';
import { BookReview } from '@/interfaces/book-review';
import { BookRelated } from '../../../../interfaces/book-related';
import BookLayout from '@/components/layouts/book-layout';
import { useCart } from '@/components/layouts/navbar';
import Link from 'next/link';
import Image from 'next/image';

const DetailPage = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<BookReview[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<BookRelated[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMoreReviews, setShowMoreReviews] = useState(false);

  const { addToCart } = useCart();

  // Get route parameters
  const params = useParams();
  const bookId = params.id;

  // Fetch book data
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        setError(null);

        // let id: string;
        // if (Array.isArray(bookId)) {
        //   id = bookId[0];
        // } else if (typeof bookId === 'string') {
        //   id = bookId;
        // } else {
        //   id = String(bookId);
        // }

        // Fetch book details
        const bookResponse = await fetch(`/api/get-book-detail?id=${bookId}`);

        const bookData = await bookResponse.json();
        console.log('Book data fetched successfully:', bookData);

        // Fetch reviews
        const reviewsResponse = await fetch(
          `/api/get-reviews-book?bookId=${bookId}`
        );
        if (!reviewsResponse.ok) throw new Error('Failed to fetch reviews');
        const reviewsData = await reviewsResponse.json();
        console.log('Reviews data fetched successfully:', reviewsData);

        // Fetch recommended books
        const recommendResponse = await fetch(`/api/get-recommend-book`);
        if (!recommendResponse.ok)
          throw new Error('Failed to fetch recommendations');
        const recommendData = await recommendResponse.json();
        console.log('Recommended data fetched successfully:', recommendData);

        setBook(bookData.data);
        setReviews(reviewsData.data.reviews);
        setRecommendedBooks(recommendData.data.books);
        console.log('bookData', bookData);
        console.log('reviewData', reviewsData);
        console.log('recommendData', recommendData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookData();
    }
  }, [bookId]);
  // Handle borrow book action
  const handleBorrowBook = () => {
    // In a real app, this would make an API call to borrow the book
    alert('Book borrowed successfully!');
  };

  // Handle add to cart action
  const handleAddToCart = () => {
    if (book && bookId) {
      // Convert bookId to number if it's a string
      let id: number;
      if (Array.isArray(bookId)) {
        // If it's an array, take the first element and convert to number
        id = parseInt(bookId[0], 10);
      } else {
        // If it's a string, convert directly to number
        id = parseInt(bookId as string, 10);
      }

      // Add to cart using the context with all book details
      addToCart(
        id,
        book.title,
        book.category || '',
        book.author.name,
        book.coverImage || book.image || ''
      );

      // Show success message
      alert('Book added to cart!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>›</span>
          <a href="/category" className="hover:text-blue-600">
            Category
          </a>
          <span>›</span>
          <span className="text-gray-900">{book?.title}</span>
        </nav>

        {/* Book Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="md:col-span-1">
            <Image
              width={337}
              height={498}
              src={book?.coverImage || '/images/default-book.svg'}
              alt={book?.title || 'Book Cover'}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>

          {/* Book Information */}
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {book?.title}
            </h1>
            <p className="text-gray-600 mb-4">{book?.author.name}</p>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.floor(book?.rating || 0)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <span className="ml-2 text-gray-700">
                {book?.rating?.toFixed(1)} ({book?.ratingCount} ratings)
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {book?.pages}
                </div>
                <div className="text-sm text-gray-500">Pages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {book?.ratingCount}
                </div>
                <div className="text-sm text-gray-500">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {book?.reviewCount}
                </div>
                <div className="text-sm text-gray-500">Reviews</div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h2>
              <p className="text-gray-700">{book?.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBorrowBook}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
              >
                Borrow Book
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Review</h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <>
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < Math.floor(book?.rating || 0)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-gray-700">
                  {book?.rating?.toFixed(1)} ({reviews.length}{' '}
                  {reviews.length === 1 ? 'Review' : 'Reviews'})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews
                  .slice(0, showMoreReviews ? reviews.length : 4)
                  .map((review) => (
                    <div
                      key={review.id}
                      className="bg-white p-4 rounded-lg shadow-sm border"
                    >
                      <div className="flex items-center mb-3">
                        <Image
                          width={64}
                          height={64}
                          src={review.avatar || '/images/default-avatar.png'}
                          alt={review.user?.name || 'John Doe'}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {review.user?.name || 'John Doe'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {review.createdAt}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < Math.floor(book?.rating || 0)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>

                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
              </div>

              {reviews.length > 4 && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setShowMoreReviews(!showMoreReviews)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    {showMoreReviews ? 'Show Less' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Related Books Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Related Books
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.isArray(recommendedBooks) &&
              recommendedBooks
                .slice(0, 5)
                .map((book, index) => (
                  <BookLayout
                    key={book?.id || index}
                    id={book?.id || 0}
                    bookCover={book?.coverImage || ''}
                    bookTitle={book?.title}
                    bookAuthor={book?.author?.name || ''}
                    bookRating={book?.rating || 0}
                  />
                ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DetailPage;
