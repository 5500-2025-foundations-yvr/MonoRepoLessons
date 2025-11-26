import {
  books,
  members,
  checkouts,
  resetDB,
  checkoutBook,
  returnBook,
  getActiveCheckouts
} from '../src';

// Very brittle checkout tests!

describe('Checkout Tests', () => {
  // Yet another duplicated setup!
  beforeEach(() => {
    resetDB();
    
    // Setup books
    books.push({ id: 1, title: "Book 1", author: "Author 1", isbn: "1111111111111", copies: 3, status: 1 });
    books.push({ id: 2, title: "Book 2", author: "Author 2", isbn: "2222222222222", copies: 1, status: 1 });
    books.push({ id: 3, title: "Book 3", author: "Author 3", isbn: "3333333333333", copies: 0, status: 2 });
    
    // Setup members
    members.push({
      id: 1,
      name: "Member 1",
      email: "member1@test.com",
      type: "regular",
      books: [],
      fees: 0,
      joinDate: new Date()
    });
    members.push({
      id: 2,
      name: "Member 2",
      email: "member2@test.com",
      type: "premium",
      books: [],
      fees: 5.00,
      joinDate: new Date()
    });
  });

  test('checkoutBook should checkout a book successfully', () => {
    let result = checkoutBook(1, 1, new Date());
    
    // Checking internal implementation!
    expect(result.success).toBe(true);
    expect(result.checkout).toBeDefined();
    expect(books[0].copies).toBe(2); // Direct state access!
    expect(members[0].books.length).toBe(1);
    expect(checkouts.length).toBe(1);
  });

  test('checkoutBook should fail for non-existent member', () => {
    let result = checkoutBook(1, 9999, new Date());
    
    expect(result.success).toBe(false);
    expect(result.error).toBe("Member not found");
    expect(result.code).toBe(1); // Magic number!
  });

  test('checkoutBook should fail for non-existent book', () => {
    let result = checkoutBook(9999, 1, new Date());
    
    expect(result.success).toBe(false);
    expect(result.error).toBe("Book not found");
    expect(result.code).toBe(5);
  });

  test('checkoutBook should fail when member has fees', () => {
    let result = checkoutBook(1, 2, new Date());
    
    expect(result.success).toBe(false);
    expect(result.error).toBe("Outstanding fees");
    expect(result.code).toBe(3);
  });

  test('checkoutBook should fail when no copies available', () => {
    let result = checkoutBook(3, 1, new Date());
    
    expect(result.success).toBe(false);
    expect(result.error).toBe("No copies");
    expect(result.code).toBe(7);
  });

  test('checkoutBook should fail when member has too many books', () => {
    // Direct manipulation!
    members[0].books = [
      { bookId: 1, checkoutDate: new Date(), dueDate: new Date() },
      { bookId: 2, checkoutDate: new Date(), dueDate: new Date() },
      { bookId: 3, checkoutDate: new Date(), dueDate: new Date() },
      { bookId: 4, checkoutDate: new Date(), dueDate: new Date() },
      { bookId: 5, checkoutDate: new Date(), dueDate: new Date() }
    ];
    
    let result = checkoutBook(1, 1, new Date());
    
    expect(result.success).toBe(false);
    expect(result.error).toBe("Too many books");
    expect(result.code).toBe(2);
  });

  test('checkoutBook should fail when member has overdue books', () => {
    // Creating an old date
    let oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 20);
    
    members[0].books = [
      { bookId: 2, checkoutDate: oldDate, dueDate: new Date() }
    ];
    
    let result = checkoutBook(1, 1, new Date());
    
    expect(result.success).toBe(false);
    expect(result.error).toBe("Has overdue books");
    expect(result.code).toBe(4);
  });

  test('checkoutBook should update book status when last copy checked out', () => {
    // Book 2 has only 1 copy
    let result = checkoutBook(2, 1, new Date());
    
    expect(result.success).toBe(true);
    expect(books[1].copies).toBe(0);
    expect(books[1].status).toBe(2); // Magic!
  });

  test('checkoutBook should calculate due date correctly for regular members', () => {
    let checkoutDate = new Date('2024-01-01');
    let result = checkoutBook(1, 1, checkoutDate);
    
    expect(result.success).toBe(true);
    
    let expectedDueDate = new Date('2024-01-01');
    expectedDueDate.setDate(expectedDueDate.getDate() + 14); // Magic!
    
    expect(result.dueDate).toEqual(expectedDueDate);
  });

  test('returnBook should return a book successfully', () => {
    // First checkout
    checkoutBook(1, 1, new Date());
    
    // Then return
    let result = returnBook(1, 1, new Date());
    
    expect(result.success).toBe(true);
    expect(result.lateFee).toBe(0);
    expect(books[0].copies).toBe(3); // Back to original
    expect(members[0].books.length).toBe(0);
  });

  test('returnBook should calculate late fee for overdue return', () => {
    // Checkout in the past
    let checkoutDate = new Date();
    checkoutDate.setDate(checkoutDate.getDate() - 20);
    
    checkoutBook(1, 1, checkoutDate);
    
    // Return today
    let result = returnBook(1, 1, new Date());
    
    expect(result.success).toBe(true);
    expect(result.lateFee).toBeGreaterThan(0);
    expect(members[0].fees).toBeGreaterThan(0);
  });

  test('returnBook should update book status when returned', () => {
    // Checkout last copy of book 2
    checkoutBook(2, 1, new Date());
    
    expect(books[1].status).toBe(2);
    
    // Return it
    returnBook(2, 1, new Date());
    
    expect(books[1].status).toBe(1);
  });

  test('returnBook should fail for non-existent checkout', () => {
    let result = returnBook(1, 1, new Date());
    
    expect(result.success).toBe(false);
    expect(result.error).toBe("No checkout found");
  });

  test('getActiveCheckouts should return only active checkouts', () => {
    checkoutBook(1, 1, new Date());
    checkoutBook(2, 1, new Date());
    
    let active = getActiveCheckouts();
    
    expect(active.length).toBe(2);
    
    // Return one
    returnBook(1, 1, new Date());
    
    active = getActiveCheckouts();
    expect(active.length).toBe(1);
  });
});

