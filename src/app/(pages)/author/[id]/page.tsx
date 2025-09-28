'use client';

import BookLayout from '@/components/layouts/book-layout';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Book } from '@/interfaces/book';

const AuthorPage = () => {
  const [authorBooks, setAuthorBooks] = useState<Book[]>([]);

  const params = useParams(); // Changed from useSearchParams
  const authorId = params.id; // Changed from searchParams.get('id')

  useEffect(() => {
    const authorBooks = async () => {
      try {
        const response = await fetch(
          `/api/get-book-by-author?authorId=${authorId}`
        );
        const data = await response.json();

        // const booklist = data.books;
        console.log('Book data fetched successfully:', data);
        setAuthorBooks(data.data.books);
      } catch (error) {
        console.error('Error fetching author books:', error);
      }
    };

    authorBooks();
  }, [authorId]);

  console.log('Book data:', authorBooks);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Authors</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.isArray(authorBooks) &&
          authorBooks
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
  );
};

export default AuthorPage;
