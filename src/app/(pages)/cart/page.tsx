'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function CartPage() {
  const [selectedBooks, setSelectedBooks] = useState<number[]>([0, 1]); // Example: first two books selected
  const [selectAll, setSelectAll] = useState(false);

  // Mock data for books in cart
  const booksInCart = [
    {
      id: 0,
      cover: '/placeholder-cover.jpg', // Replace with actual cover image path
      category: 'Fiction',
      title: 'Book Name',
      author: 'Author name',
    },
    {
      id: 1,
      cover: '/placeholder-cover.jpg', // Replace with actual cover image path
      category: 'Fiction',
      title: 'Book Name',
      author: 'Author name',
    },
    {
      id: 2,
      cover: '/placeholder-cover.jpg', // Replace with actual cover image path
      category: 'Fiction',
      title: 'Book Name',
      author: 'Author name',
    },
    {
      id: 3,
      cover: '/placeholder-cover.jpg', // Replace with actual cover image path
      category: 'Fiction',
      title: 'Book Name',
      author: 'Author name',
    },
  ];

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedBooks(booksInCart.map((book) => book.id));
    } else {
      setSelectedBooks([]);
    }
  };

  const handleBookSelection = (bookId: number) => {
    setSelectedBooks((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  const totalSelectedItems = selectedBooks.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Books List */}
        <div className="flex-1">
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="select-all"
              checked={selectAll}
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="select-all" className="ml-2 text-sm font-medium">
              Select All
            </label>
          </div>

          <div className="space-y-4">
            {booksInCart.map((book) => (
              <div key={book.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    id={`book-${book.id}`}
                    checked={selectedBooks.includes(book.id)}
                    onChange={() => handleBookSelection(book.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                  />

                  <div className="flex-shrink-0">
                    <Image
                      src={book.cover}
                      alt={book.title}
                      width={96}
                      height={144}
                      className="w-24 h-32 object-cover rounded"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {book.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loan Summary */}
        <div className="w-full lg:w-80">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Loan Summary</h2>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">Total Book</span>
              <span className="font-medium">{totalSelectedItems} Items</span>
            </div>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              disabled={totalSelectedItems === 0}
            >
              Borrow Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
