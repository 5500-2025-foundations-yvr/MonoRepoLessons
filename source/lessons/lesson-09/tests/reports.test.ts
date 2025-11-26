import {
  books,
  members,
  checkouts,
  resetDB,
  checkoutBook,
  getMostPopularBooks,
  getOverdueReport,
  getLibraryStats,
  getMembersWithOverdueBooks
} from '../src';

// Yet more brittle tests with duplicated setup!

describe('Reports Tests', () => {
  // Same setup code AGAIN!
  beforeEach(() => {
    resetDB();
    
    // Setup books
    books.push({ id: 1, title: "Popular Book", author: "Author 1", isbn: "1111111111111", copies: 5, status: 1 });
    books.push({ id: 2, title: "Less Popular", author: "Author 2", isbn: "2222222222222", copies: 3, status: 1 });
    books.push({ id: 3, title: "Unpopular Book", author: "Author 3", isbn: "3333333333333", copies: 2, status: 1 });
    
    // Setup members
    members.push({
      id: 1,
      name: "Member 1",
      email: "m1@test.com",
      type: "regular",
      books: [],
      fees: 0,
      joinDate: new Date()
    });
    members.push({
      id: 2,
      name: "Member 2",
      email: "m2@test.com",
      type: "regular",
      books: [],
      fees: 0,
      joinDate: new Date()
    });
  });

  test('getMostPopularBooks should return books sorted by checkout count', () => {
    // Create some checkouts
    checkoutBook(1, 1, new Date());
    checkoutBook(1, 2, new Date());
    checkoutBook(2, 1, new Date());
    
    let popular = getMostPopularBooks();
    
    // Brittle expectations!
    expect(popular.length).toBe(2);
    expect(popular[0].book.id).toBe(1);
    expect(popular[0].checkoutCount).toBe(2);
    expect(popular[1].book.id).toBe(2);
    expect(popular[1].checkoutCount).toBe(1);
  });

  test('getMostPopularBooks should return empty for no checkouts', () => {
    let popular = getMostPopularBooks();
    expect(popular.length).toBe(0);
  });

  test('getOverdueReport should return overdue books', () => {
    // Create overdue checkout
    let oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 20); // Magic number!
    
    checkoutBook(1, 1, oldDate);
    
    let report = getOverdueReport();
    
    expect(report.length).toBe(1);
    expect(report[0].book).toBe("Popular Book");
    expect(report[0].member).toBe("Member 1");
    expect(report[0].daysOverdue).toBeGreaterThan(0);
    expect(report[0].fee).toBeGreaterThan(0);
  });

  test('getOverdueReport should return empty for no overdue books', () => {
    checkoutBook(1, 1, new Date());
    
    let report = getOverdueReport();
    expect(report.length).toBe(0);
  });

  test('getLibraryStats should return correct statistics', () => {
    checkoutBook(1, 1, new Date());
    checkoutBook(2, 2, new Date());
    
    let stats = getLibraryStats();
    
    // Very brittle exact checks!
    expect(stats.totalBooks).toBe(3);
    expect(stats.availableBooks).toBe(3);
    expect(stats.totalCopies).toBe(8); // 3 + 2 + 2 = 7 after checkouts
    expect(stats.totalMembers).toBe(2);
    expect(stats.regularMembers).toBe(2);
    expect(stats.premiumMembers).toBe(0);
    expect(stats.activeCheckouts).toBe(2);
    expect(stats.overdueCheckouts).toBe(0);
  });

  test('getLibraryStats should calculate overdue checkouts', () => {
    // Create overdue
    let oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 20);
    
    checkoutBook(1, 1, oldDate);
    checkoutBook(2, 2, new Date());
    
    let stats = getLibraryStats();
    
    expect(stats.activeCheckouts).toBe(2);
    expect(stats.overdueCheckouts).toBe(1);
  });

  test('getLibraryStats should calculate total fees owed', () => {
    // Add some fees
    members[0].fees = 5.00;
    members[1].fees = 3.50;
    
    let stats = getLibraryStats();
    
    expect(stats.totalFeesOwed).toBe(8.50);
  });

  test('getLibraryStats should include overdue fees in total', () => {
    let oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 20);
    
    checkoutBook(1, 1, oldDate);
    
    let stats = getLibraryStats();
    
    expect(stats.totalFeesOwed).toBeGreaterThan(0);
  });

  test('getMembersWithOverdueBooks should return members with overdue', () => {
    let oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 20);
    
    checkoutBook(1, 1, oldDate);
    checkoutBook(2, 2, new Date()); // Not overdue
    
    let membersWithOverdue = getMembersWithOverdueBooks();
    
    expect(membersWithOverdue.length).toBe(1);
    expect(membersWithOverdue[0].id).toBe(1);
  });

  test('getMembersWithOverdueBooks should return empty when no overdue', () => {
    checkoutBook(1, 1, new Date());
    
    let membersWithOverdue = getMembersWithOverdueBooks();
    expect(membersWithOverdue.length).toBe(0);
  });
});

