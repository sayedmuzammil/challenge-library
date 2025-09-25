import Link from 'next/link';
import React from 'react';

export interface BookLayoutProps {
  id: number;
  bookCover: string;
  bookTitle: string;
  bookAuthor: string;
  bookRating: number;
}

const BookLayout: React.FC<BookLayoutProps> = ({
  id,
  bookCover,
  bookTitle,
  bookAuthor,
  bookRating,
}) => {
  return (
    <Link href={`/detail/${id}`} passHref>
      <div
        key={id}
        className="bg-white rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3 overflow-hidden">
          {bookCover ? (
            <img
              src={bookCover}
              alt={bookTitle}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div
            className={`w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold ${
              bookCover ? 'hidden' : ''
            }`}
          >
            📖
          </div>
        </div>
        <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
          {bookTitle}
        </h3>
        <p className="text-xs text-gray-600 mb-2">{bookAuthor}</p>
        <div className="flex items-center">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={
                  i < (bookRating || 4) ? 'text-yellow-400' : 'text-gray-300'
                }
              >
                ⭐
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-600 ml-1">
            {bookRating || '4.5'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BookLayout;
