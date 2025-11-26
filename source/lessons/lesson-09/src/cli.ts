import * as readline from 'readline';
import {
  initDB,
  books,
  members,
  addBook,
  removeBook,
  searchBooks,
  addMember,
  checkoutBook,
  returnBook,
  getMostPopularBooks,
  getOverdueReport,
  getLibraryStats,
  formatBook,
  formatMember
} from './index';

// Initialize database with sample data
initDB();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

function displayMenu() {
  console.log('\n' + '='.repeat(50));
  console.log('📚 STINKY LIBRARY MANAGEMENT SYSTEM 📚');
  console.log('='.repeat(50));
  console.log('\n📖 BOOK OPERATIONS:');
  console.log('  1. List all books');
  console.log('  2. Search books');
  console.log('  3. Add a book');
  console.log('  4. Remove a book');
  console.log('\n👥 MEMBER OPERATIONS:');
  console.log('  5. List all members');
  console.log('  6. Add a member');
  console.log('  7. View member details');
  console.log('\n📋 CHECKOUT OPERATIONS:');
  console.log('  8. Checkout a book');
  console.log('  9. Return a book');
  console.log('\n📊 REPORTS:');
  console.log('  10. Most popular books');
  console.log('  11. Overdue books report');
  console.log('  12. Library statistics');
  console.log('\n  0. Exit');
  console.log('='.repeat(50));
}

async function listBooks() {
  console.log('\n📚 ALL BOOKS:');
  console.log('-'.repeat(80));
  
  if (books.length === 0) {
    console.log('No books in the library.');
    return;
  }
  
  books.forEach((book, index) => {
    console.log(`${index + 1}. ${formatBook(book)}`);
  });
}

async function searchBooksMenu() {
  const query = await prompt('\nEnter search term (title, author, or ISBN): ');
  const results = searchBooks(query);
  
  console.log(`\n🔍 Found ${results.length} result(s):`);
  console.log('-'.repeat(80));
  
  if (results.length === 0) {
    console.log('No books found.');
    return;
  }
  
  results.forEach((book, index) => {
    console.log(`${index + 1}. ${formatBook(book)}`);
  });
}

async function addBookMenu() {
  console.log('\n📖 ADD NEW BOOK:');
  const title = await prompt('Title: ');
  const author = await prompt('Author: ');
  const isbn = await prompt('ISBN (13 digits): ');
  const copiesStr = await prompt('Number of copies: ');
  
  const copies = parseInt(copiesStr);
  
  if (isNaN(copies)) {
    console.log('❌ Invalid number of copies!');
    return;
  }
  
  const book = addBook(title, author, isbn, copies);
  
  if (book) {
    console.log('✅ Book added successfully!');
    console.log(formatBook(book));
  } else {
    console.log('❌ Failed to add book. Check the console for errors.');
  }
}

async function removeBookMenu() {
  await listBooks();
  const idStr = await prompt('\nEnter book ID to remove: ');
  const id = parseInt(idStr);
  
  if (isNaN(id)) {
    console.log('❌ Invalid ID!');
    return;
  }
  
  const result = removeBook(id);
  
  if (result) {
    console.log('✅ Book removed successfully!');
  } else {
    console.log('❌ Failed to remove book. Book not found.');
  }
}

async function listMembers() {
  console.log('\n👥 ALL MEMBERS:');
  console.log('-'.repeat(80));
  
  if (members.length === 0) {
    console.log('No members registered.');
    return;
  }
  
  members.forEach((member, index) => {
    console.log(`${index + 1}. ${formatMember(member)} - Books borrowed: ${member.books.length}`);
  });
}

async function addMemberMenu() {
  console.log('\n👤 ADD NEW MEMBER:');
  const name = await prompt('Name: ');
  const email = await prompt('Email: ');
  const type = await prompt('Type (regular/premium): ');
  
  const member = addMember(name, email, type);
  
  if (member) {
    console.log('✅ Member added successfully!');
    console.log(formatMember(member));
  } else {
    console.log('❌ Failed to add member. Check the console for errors.');
  }
}

async function viewMemberDetails() {
  await listMembers();
  const idStr = await prompt('\nEnter member ID to view: ');
  const id = parseInt(idStr);
  
  if (isNaN(id)) {
    console.log('❌ Invalid ID!');
    return;
  }
  
  const member = members.find(m => m.id === id);
  
  if (!member) {
    console.log('❌ Member not found!');
    return;
  }
  
  console.log('\n👤 MEMBER DETAILS:');
  console.log('-'.repeat(80));
  console.log(`Name: ${member.name}`);
  console.log(`Email: ${member.email}`);
  console.log(`Type: ${member.type}`);
  console.log(`Outstanding Fees: $${member.fees.toFixed(2)}`);
  console.log(`Books Borrowed: ${member.books.length}`);
  
  if (member.books.length > 0) {
    console.log('\nCurrent Checkouts:');
    member.books.forEach((book, index) => {
      const bookDetails = books.find(b => b.id === book.bookId);
      console.log(`  ${index + 1}. ${bookDetails?.title} (Checked out: ${book.checkoutDate.toLocaleDateString()})`);
    });
  }
}

async function checkoutBookMenu() {
  console.log('\n📋 CHECKOUT BOOK:');
  await listBooks();
  const bookIdStr = await prompt('\nEnter book ID: ');
  
  await listMembers();
  const memberIdStr = await prompt('\nEnter member ID: ');
  
  const bookId = parseInt(bookIdStr);
  const memberId = parseInt(memberIdStr);
  
  if (isNaN(bookId) || isNaN(memberId)) {
    console.log('❌ Invalid ID!');
    return;
  }
  
  const result = checkoutBook(bookId, memberId, new Date());
  
  if (result.success) {
    console.log('✅ Book checked out successfully!');
    console.log(`Due date: ${result.dueDate?.toLocaleDateString()}`);
  } else {
    console.log(`❌ Checkout failed: ${result.error}`);
  }
}

async function returnBookMenu() {
  console.log('\n📋 RETURN BOOK:');
  await listBooks();
  const bookIdStr = await prompt('\nEnter book ID: ');
  
  await listMembers();
  const memberIdStr = await prompt('\nEnter member ID: ');
  
  const bookId = parseInt(bookIdStr);
  const memberId = parseInt(memberIdStr);
  
  if (isNaN(bookId) || isNaN(memberId)) {
    console.log('❌ Invalid ID!');
    return;
  }
  
  const result = returnBook(bookId, memberId, new Date());
  
  if (result.success) {
    console.log('✅ Book returned successfully!');
    if (result.lateFee > 0) {
      console.log(`⚠️  Late fee charged: $${result.lateFee.toFixed(2)}`);
      console.log(`   Days late: ${result.daysLate}`);
    }
  } else {
    console.log(`❌ Return failed: ${result.error}`);
  }
}

async function showPopularBooks() {
  const popular = getMostPopularBooks();
  
  console.log('\n⭐ MOST POPULAR BOOKS:');
  console.log('-'.repeat(80));
  
  if (popular.length === 0) {
    console.log('No checkout history yet.');
    return;
  }
  
  popular.forEach((item, index) => {
    console.log(`${index + 1}. ${item.book.title} - Checked out ${item.checkoutCount} time(s)`);
  });
}

async function showOverdueReport() {
  const overdue = getOverdueReport();
  
  console.log('\n⚠️  OVERDUE BOOKS REPORT:');
  console.log('-'.repeat(80));
  
  if (overdue.length === 0) {
    console.log('No overdue books! 🎉');
    return;
  }
  
  overdue.forEach((item, index) => {
    console.log(`${index + 1}. ${item.book}`);
    console.log(`   Member: ${item.member}`);
    console.log(`   Days Overdue: ${item.daysOverdue}`);
    console.log(`   Late Fee: $${item.fee.toFixed(2)}`);
    console.log();
  });
}

async function showLibraryStats() {
  const stats = getLibraryStats();
  
  console.log('\n📊 LIBRARY STATISTICS:');
  console.log('-'.repeat(80));
  console.log(`Total Books: ${stats.totalBooks}`);
  console.log(`Available Books: ${stats.availableBooks}`);
  console.log(`Total Copies: ${stats.totalCopies}`);
  console.log(`Total Members: ${stats.totalMembers}`);
  console.log(`  - Regular: ${stats.regularMembers}`);
  console.log(`  - Premium: ${stats.premiumMembers}`);
  console.log(`Active Checkouts: ${stats.activeCheckouts}`);
  console.log(`Overdue Checkouts: ${stats.overdueCheckouts}`);
  console.log(`Total Fees Owed: $${stats.totalFeesOwed.toFixed(2)}`);
}

async function main() {
  console.log('\n🎉 Welcome to the Stinky Library Management System! 🎉');
  console.log('\n⚠️  Note: This code is DELIBERATELY TERRIBLE for educational purposes!');
  console.log('Your mission is to refactor it while keeping all functionality working.\n');
  
  await prompt('Press Enter to continue...');
  
  let running = true;
  
  while (running) {
    displayMenu();
    const choice = await prompt('\nEnter your choice: ');
    
    try {
      switch (choice) {
        case '1':
          await listBooks();
          break;
        case '2':
          await searchBooksMenu();
          break;
        case '3':
          await addBookMenu();
          break;
        case '4':
          await removeBookMenu();
          break;
        case '5':
          await listMembers();
          break;
        case '6':
          await addMemberMenu();
          break;
        case '7':
          await viewMemberDetails();
          break;
        case '8':
          await checkoutBookMenu();
          break;
        case '9':
          await returnBookMenu();
          break;
        case '10':
          await showPopularBooks();
          break;
        case '11':
          await showOverdueReport();
          break;
        case '12':
          await showLibraryStats();
          break;
        case '0':
          console.log('\n👋 Thank you for using the Stinky Library System!');
          console.log('Remember: Refactor this terrible code! 💪\n');
          running = false;
          break;
        default:
          console.log('❌ Invalid choice. Please try again.');
      }
      
      if (running && choice !== '0') {
        await prompt('\nPress Enter to continue...');
      }
    } catch (error) {
      console.error('❌ An error occurred:', error);
      await prompt('\nPress Enter to continue...');
    }
  }
  
  rl.close();
}

// Run the CLI
main().catch(console.error);

