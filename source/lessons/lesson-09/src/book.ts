import { books, getNextId } from './database';
import { s1, s2, validName, log, fmt } from './utils';

// Mixed concerns: data access, business logic, validation, formatting all in one!

// Add a book - way too long!
export function addBook(title: string, author: string, isbn: string, copies: number) {
  // Validation mixed with everything else
  if (!title) {
    console.log("Error: Title required");
    return null;
  }
  if (!author) {
    console.log("Error: Author required");
    return null;
  }
  if (!isbn) {
    console.log("Error: ISBN required");
    return null;
  }
  if (copies < 0) {
    console.log("Error: Copies must be positive");
    return null;
  }
  
  // Check for duplicates
  let exists = false;
  for (let i = 0; i < books.length; i++) {
    if (books[i].isbn === isbn) {
      exists = true;
      break;
    }
  }
  
  if (exists) {
    console.log("Error: Book with this ISBN already exists");
    return null;
  }
  
  // Create book
  let book = {
    id: getNextId(books),
    title: title,
    author: author,
    isbn: isbn,
    copies: copies,
    status: 1 // Magic number! What does 1 mean?
  };
  
  books.push(book);
  log("Book added: " + title);
  
  return book;
}

// Remove book
export function removeBook(id: number) {
  let index = -1;
  for (let i = 0; i < books.length; i++) {
    if (books[i].id === id) {
      index = i;
      break;
    }
  }
  
  if (index === -1) {
    return false;
  }
  
  books.splice(index, 1);
  return true;
}

// Find book by ID - duplicated logic
export function findBook(id: number) {
  for (let i = 0; i < books.length; i++) {
    if (books[i].id === id) {
      return books[i];
    }
  }
  return null;
}

// Find book by ISBN - more duplication
export function findBookByISBN(isbn: string) {
  for (let b of books) {
    if (b.isbn === isbn) {
      return b;
    }
  }
  return null;
}

// Search books - messy logic
export function searchBooks(query: string) {
  let results = [];
  let q = s1(query);
  
  for (let i = 0; i < books.length; i++) {
    let book = books[i];
    let title = s1(book.title);
    let author = s1(book.author);
    
    if (title.includes(q) || author.includes(q) || book.isbn.includes(q)) {
      results.push(book);
    }
  }
  
  return results;
}

// Update book copies
export function updateCopies(bookId: number, newCopies: number) {
  let book = findBook(bookId);
  if (!book) return false;
  
  book.copies = newCopies;
  
  // Update status based on copies
  if (newCopies === 0) {
    book.status = 2; // What is 2?
  } else {
    book.status = 1; // What is 1?
  }
  
  return true;
}

// Check if book is available
export function isAvailable(bookId: number) {
  let book = findBook(bookId);
  if (!book) return false;
  return book.copies > 0 && book.status === 1;
}

// Get all available books
export function getAvailableBooks() {
  let available = [];
  for (let i = 0; i < books.length; i++) {
    if (books[i].copies > 0 && books[i].status === 1) {
      available.push(books[i]);
    }
  }
  return available;
}

// Get books by author
export function getBooksByAuthor(author: string) {
  let result = [];
  let a = s1(author);
  
  for (let book of books) {
    if (s1(book.author) === a) {
      result.push(book);
    }
  }
  
  return result;
}

// Format book for display - UI concern in model!
export function formatBook(book: any) {
  return book.title + " by " + book.author + " (ISBN: " + book.isbn + ") - " + book.copies + " copies available";
}

// Another format function - duplicate!
export function displayBook(book: any) {
  let status = book.status === 1 ? "Available" : "Unavailable";
  return "Title: " + book.title + "\nAuthor: " + book.author + "\nCopies: " + book.copies + "\nStatus: " + status;
}

// Validate book data - should be separate
export function validateBook(title: string, author: string, isbn: string) {
  let errors = [];
  
  if (!title || title.trim().length === 0) {
    errors.push("Title is required");
  }
  
  if (!author || author.trim().length === 0) {
    errors.push("Author is required");
  }
  
  if (!isbn || isbn.trim().length === 0) {
    errors.push("ISBN is required");
  }
  
  if (isbn && isbn.length !== 13) {
    errors.push("ISBN must be 13 digits");
  }
  
  return errors;
}

// Get book statistics - mixed concerns
export function getBookStats() {
  let total = books.length;
  let available = 0;
  let unavailable = 0;
  let totalCopies = 0;
  
  for (let i = 0; i < books.length; i++) {
    totalCopies = totalCopies + books[i].copies;
    if (books[i].status === 1) {
      available++;
    } else {
      unavailable++;
    }
  }
  
  return {
    total: total,
    available: available,
    unavailable: unavailable,
    totalCopies: totalCopies,
    avgCopies: total > 0 ? totalCopies / total : 0
  };
}

// Sort books - duplicated logic from utils
export function sortBooks(sortBy: string) {
  let sorted = [...books];
  
  if (sortBy === "title") {
    sorted.sort((a, b) => a.title > b.title ? 1 : -1);
  } else if (sortBy === "author") {
    sorted.sort((a, b) => a.author > b.author ? 1 : -1);
  } else if (sortBy === "copies") {
    sorted.sort((a, b) => a.copies - b.copies);
  }
  
  return sorted;
}

// Get low stock books - magic number!
export function getLowStockBooks() {
  let lowStock = [];
  for (let book of books) {
    if (book.copies < 2) { // Magic number!
      lowStock.push(book);
    }
  }
  return lowStock;
}

