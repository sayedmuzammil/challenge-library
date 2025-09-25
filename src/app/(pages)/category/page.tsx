'use client';

import React, { useEffect, useState } from 'react';
import { Book } from '@/interfaces/book';
import { BookCategory } from '@/interfaces/book-category';
import BookLayout from '@/components/layouts/book-layout';
import Navbar from '@/components/layouts/navbar';
import Footer from '@/components/layouts/footer';
// import { getCategories } from '@/lib/utils';

const CategoryPage = () => {
  const [categoriesList, setCategoriesList] = useState<BookCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesList = await fetch(`/api/get-categories`);
        const books = await fetch(`/api/get-book`);

        if (!categoriesList.ok) throw new Error('Failed to fetch categories');
        if (!books.ok) throw new Error('Failed to fetch Books');

        const categoryList = await categoriesList.json();
        const booksList = await books.json();

        setBooks(booksList.data.books);
        setCategoriesList(categoryList.data.categories);
        console.log(categoryList.data);
        console.log(booksList.data.books);
      } catch (error) {
        console.error(error, 'Failed to fetch categories');
      }
    };
    fetchData();
  }, []);

  const filteredBooks = books.filter((book) => {
    const matchesCategory =
      selectedCategory.length === 0 ||
      selectedCategory.includes(book.category || '');

    const matchesRating =
      selectedRating === null ||
      Math.floor(book.rating || 0) === selectedRating;

    return matchesCategory && matchesRating;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Book List</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="w-full lg:w-64 bg-white rounded-lg shadow-sm p-6 sticky top-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">FILTER</h2>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Category</h3>
                <div className="space-y-2">
                  {Array.isArray(categoriesList) &&
                    categoriesList.map((category: any) => (
                      // <div> a </div>
                      <label
                        key={category.id}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategory.includes(category.name)}
                          onChange={() => {
                            const newCategories = selectedCategory.includes(
                              category.name
                            )
                              ? selectedCategory.filter(
                                  (c) => c !== category.name
                                )
                              : [...selectedCategory, category.name];
                            setSelectedCategory(newCategories);
                          }}
                          className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm">{category.name}</span>
                      </label>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Rating</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="rating"
                        checked={selectedRating === rating}
                        onChange={() =>
                          setSelectedRating(
                            selectedRating === rating ? null : rating
                          )
                        }
                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm">{rating} ★</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Books Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <BookLayout
                  key={book.id}
                  id={book.id}
                  bookCover={book?.coverImage || ''}
                  bookTitle={book.title}
                  bookAuthor={book.author.name}
                  bookRating={book?.rating || 0}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
