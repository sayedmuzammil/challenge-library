'use client';

import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { createContext } from 'react';

interface CartItem {
  bookId: number;
  bookName: string;
  categoryName: string;
  authorName: string;
  bookImage: string;
}

// Define cart context
interface CartContextType {
  cartCount: number;
  cartItems: CartItem[];
  addToCart: (bookId: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart count from localStorage on initial render
    const savedCartCount = localStorage.getItem('cartCount');
    if (savedCartCount) {
      setCartCount(parseInt(savedCartCount, 10));
    }
  }, []);

  const addToCart = (
    bookId: number,
    bookName: string,
    categoryName: string,
    authorName: string,
    bookImage: string
  ) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.bookId === bookId);
      let updatedItems: CartItem[];

      if (existingItem) {
        // If book already in cart, increase quantity
        updatedItems = prevItems.map((item) =>
          item.bookId === bookId ? { ...item } : item
        );
      } else {
        // If new book, add to cart
        updatedItems = [
          ...prevItems,
          { bookId, bookName, categoryName, authorName, bookImage },
        ];
      }

      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));

      // Update cart count
      const newCount = updatedItems.reduce((sum, item) => sum, 0);
      setCartCount(newCount);

      return updatedItems;
    });
  };

  return (
    <CartContext.Provider value={{ cartCount, cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
interface User {
  name?: string;
}

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    const loggedIn = localStorage.getItem('user');
    if (loggedIn) {
      setIsLoggedIn(true);
      setUser(JSON.parse(loggedIn));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest('.dropdown-container') &&
        !target.closest('.user-dropdown')
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    setIsDropdownOpen(false);
  };

  return (
    <header className={'bg-white shadow-sm px-4 py-3'}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-gray-900">Booky</span>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          {isLoggedIn && user ? (
            <div className="flex justify-center items-center space-x-4">
              {/* Notification Badge */}
              <div className="relative">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h4V8h-4V5a3 3 0 00-3 3v14a3 3 0 003 3z"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <div className="relative dropdown-container">
                <div
                  className="flex items-center space-x-2 cursor-pointer user-dropdown"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {/* User Avatar */}
                  <div className="relative">
                    <img
                      src="/images/default-avatar.png"
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="absolute inset-0 bg-blue-500 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
                  </div>

                  {/* User Name */}
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-800 font-medium">
                      {user?.name || 'John Doe'}
                    </span>
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/borrowed-list"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Borrowed List
                      </Link>
                      <Link
                        href="/reviews"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Reviews
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
