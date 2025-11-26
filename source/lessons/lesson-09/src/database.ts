// Global state! No encapsulation! Direct access everywhere!
export let books: any[] = [];
export let members: any[] = [];
export let checkouts: any[] = [];
export let transactions: any[] = [];

// Initialize with some data
export function initDB() {
  books = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "9780743273565", copies: 3, status: 1 },
    { id: 2, title: "1984", author: "George Orwell", isbn: "9780451524935", copies: 2, status: 1 },
    { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "9780061120084", copies: 5, status: 1 },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen", isbn: "9780141439518", copies: 0, status: 2 },
    { id: 5, title: "The Catcher in the Rye", author: "J.D. Salinger", isbn: "9780316769174", copies: 4, status: 1 }
  ];

  members = [
    { id: 1, name: "John Doe", email: "john@example.com", type: "regular", books: [], fees: 0, joinDate: new Date('2023-01-15') },
    { id: 2, name: "Jane Smith", email: "jane@example.com", type: "premium", books: [], fees: 0, joinDate: new Date('2023-03-20') },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", type: "regular", books: [], fees: 5.50, joinDate: new Date('2022-11-10') }
  ];

  checkouts = [];
  transactions = [];
}

// Reset for tests
export function resetDB() {
  books = [];
  members = [];
  checkouts = [];
  transactions = [];
}

// Some random utility functions mixed in
export function getNextId(arr: any[]) {
  if (arr.length === 0) return 1;
  return Math.max(...arr.map(x => x.id)) + 1;
}

export function findById(arr: any[], id: number) {
  return arr.find(x => x.id === id);
}

