import {
  books,
  resetDB,
  initDB,
  addBook,
  removeBook,
  findBook,
  searchBooks,
  updateCopies,
  isAvailable,
  getAvailableBooks,
  getLowStockBooks
} from '../src';

// Brittle tests with lots of code duplication!

describe('Book Tests', () => {
  // Setup code duplicated in every test file!
  beforeEach(() => {
    resetDB();
    // Manually setting up test data - brittle!
    books.push({ id: 1, title: "Test Book 1", author: "Author 1", isbn: "1234567890123", copies: 3, status: 1 });
    books.push({ id: 2, title: "Test Book 2", author: "Author 2", isbn: "1234567890124", copies: 0, status: 2 });
    books.push({ id: 3, title: "Another Book", author: "Author 3", isbn: "1234567890125", copies: 5, status: 1 });
  });

  test('addBook should add a book', () => {
    // Direct access to global state!
    let initialLength = books.length;
    
    let book = addBook("New Book", "New Author", "9999999999999", 5);
    
    // Checking implementation details!
    expect(books.length).toBe(initialLength + 1);
    expect(book).not.toBeNull();
    expect(book?.title).toBe("New Book");
    expect(book?.status).toBe(1); // Magic number!
  });

  test('addBook should not add book without title', () => {
    let book = addBook("", "Author", "1231231231231", 5);
    expect(book).toBeNull();
  });

  test('addBook should not add duplicate ISBN', () => {
    let book = addBook("Duplicate", "Author", "1234567890123", 5);
    expect(book).toBeNull();
  });

  test('removeBook should remove a book', () => {
    // Direct manipulation of global state in test!
    let initialLength = books.length;
    
    let result = removeBook(1);
    
    expect(result).toBe(true);
    expect(books.length).toBe(initialLength - 1);
    
    // Checking that it's really gone
    let found = false;
    for (let i = 0; i < books.length; i++) {
      if (books[i].id === 1) {
        found = true;
      }
    }
    expect(found).toBe(false);
  });

  test('findBook should find a book', () => {
    let book = findBook(1);
    
    expect(book).not.toBeNull();
    expect(book?.id).toBe(1);
    expect(book?.title).toBe("Test Book 1");
  });

  test('findBook should return null for non-existent book', () => {
    let book = findBook(9999);
    expect(book).toBeNull();
  });

  test('searchBooks should find books by title', () => {
    let results = searchBooks("Test");
    
    // Brittle expectation on exact count!
    expect(results.length).toBe(2);
    expect(results[0].title).toContain("Test");
  });

  test('searchBooks should find books by author', () => {
    let results = searchBooks("Author 1");
    expect(results.length).toBe(1);
    expect(results[0].author).toBe("Author 1");
  });

  test('updateCopies should update book copies', () => {
    updateCopies(1, 10);
    
    // Direct access to check!
    let book = books[0];
    expect(book.copies).toBe(10);
    expect(book.status).toBe(1);
  });

  test('updateCopies should set status to 2 when copies is 0', () => {
    updateCopies(1, 0);
    
    let book = books[0];
    expect(book.copies).toBe(0);
    expect(book.status).toBe(2); // Magic number!
  });

  test('isAvailable should return true for available books', () => {
    let result = isAvailable(1);
    expect(result).toBe(true);
  });

  test('isAvailable should return false for unavailable books', () => {
    let result = isAvailable(2);
    expect(result).toBe(false);
  });

  test('getAvailableBooks should return only available books', () => {
    let available = getAvailableBooks();
    
    // Brittle check of exact count!
    expect(available.length).toBe(2);
    
    // Checking each one
    for (let i = 0; i < available.length; i++) {
      expect(available[i].copies).toBeGreaterThan(0);
      expect(available[i].status).toBe(1);
    }
  });

  test('getLowStockBooks should return books with less than 2 copies', () => {
    let lowStock = getLowStockBooks();
    
    expect(lowStock.length).toBe(1);
    expect(lowStock[0].copies).toBeLessThan(2); // Magic number!
  });
});

