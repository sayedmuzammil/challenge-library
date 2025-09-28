'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // ⬅️ add
import Navbar, { useCart } from '@/components/layouts/navbar';
import Footer from '@/components/layouts/footer';
import { BookCategory } from '@/interfaces/book-category';

export default function CartPage() {
  const router = useRouter();
  const [selectedBooks, setSelectedBooks] = useState<number[]>([]); // ⬅️ start empty
  const [selectAll, setSelectAll] = useState(false);
  const { cartItems } = useCart();

  // Keep selections valid if cart changes; if select-all is on, reselect all.
  useEffect(() => {
    if (selectAll) {
      setSelectedBooks(cartItems.map((i) => i.bookId));
    } else {
      // remove ids that no longer exist in cart
      const ids = new Set(cartItems.map((i) => i.bookId));
      setSelectedBooks((prev) => prev.filter((id) => ids.has(id)));
    }
  }, [cartItems, selectAll]);

  const handleSelectAll = () => {
    setSelectAll((prev) => {
      const next = !prev;
      setSelectedBooks(next ? cartItems.map((i) => i.bookId) : []);
      return next;
    });
  };

  const handleBookSelection = (bookId: number) => {
    setSelectedBooks((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  const totalSelectedItems = selectedBooks.length;

  async function onBorrowClick() {
    if (totalSelectedItems === 0) return;

    // Keep only selected items for checkout
    const selected = cartItems.filter((i) => selectedBooks.includes(i.bookId));
    // Save to localStorage so the checkout page can load it
    localStorage.setItem('cartItems', JSON.stringify(selected));
    // Go to checkout
    router.push('/checkout');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar />
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
            {Array.isArray(cartItems) && cartItems.length > 0 ? (
              cartItems.map((book) => (
                <div
                  key={book.bookId}
                  className="border-b pb-4 last:border-b-0"
                >
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      id={`book-${book.bookId}`}
                      checked={selectedBooks.includes(book.bookId)}
                      onChange={() => handleBookSelection(book.bookId)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                    />
                    <div className="flex-shrink-0">
                      <Image
                        src={
                          typeof book.bookImage === 'string'
                            ? book.bookImage
                            : '/images/default-book.png'
                        }
                        alt={book.bookName}
                        width={96}
                        height={144}
                        className="w-24 h-32 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                          {typeof book.categoryName === 'string'
                            ? book.categoryName
                            : (book.categoryName as BookCategory)?.name ||
                              'Unknown Category'}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg">{book.bookName}</h3>
                      <p className="text-sm text-gray-600">{book.authorName}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">
                <p className="text-gray-600">No books found.</p>
              </div>
            )}
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
              onClick={onBorrowClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
              disabled={totalSelectedItems === 0}
            >
              Borrow Book
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
