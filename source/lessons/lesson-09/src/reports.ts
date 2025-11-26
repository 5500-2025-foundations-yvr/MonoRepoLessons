import { books, members, checkouts, transactions } from './database';
import { getDays, fmt, log } from './utils';

// Reports with duplicated logic and mixed formatting!

// Most popular books
export function getMostPopularBooks() {
  // Count checkouts per book
  let bookCounts: any = {};
  
  for (let i = 0; i < checkouts.length; i++) {
    let bookId = checkouts[i].bookId;
    if (!bookCounts[bookId]) {
      bookCounts[bookId] = 0;
    }
    bookCounts[bookId]++;
  }
  
  // Convert to array
  let results = [];
  for (let bookId in bookCounts) {
    let book = null;
    for (let i = 0; i < books.length; i++) {
      if (books[i].id === parseInt(bookId)) {
        book = books[i];
        break;
      }
    }
    
    if (book) {
      results.push({
        book: book,
        checkoutCount: bookCounts[bookId]
      });
    }
  }
  
  // Sort by count
  results.sort((a, b) => b.checkoutCount - a.checkoutCount);
  
  return results;
}

// Overdue books report - duplicate logic from other files!
export function getOverdueReport() {
  let overdue = [];
  
  for (let i = 0; i < checkouts.length; i++) {
    let c = checkouts[i];
    
    if (c.status === "active") {
      let days = getDays(c.checkoutDate);
      
      if (days > 14) { // Magic number!
        // Find book
        let book = null;
        for (let j = 0; j < books.length; j++) {
          if (books[j].id === c.bookId) {
            book = books[j];
            break;
          }
        }
        
        // Find member
        let member = null;
        for (let k = 0; k < members.length; k++) {
          if (members[k].id === c.memberId) {
            member = members[k];
            break;
          }
        }
        
        // Calculate fee - duplicate calculation!
        let daysLate = days - 14;
        let fee = 0;
        if (daysLate <= 7) {
          fee = daysLate * 0.5;
        } else {
          fee = 3.5 + (daysLate - 7) * 1.0;
        }
        
        if (book && member) {
          overdue.push({
            book: book.title,
            member: member.name,
            daysOverdue: daysLate,
            fee: fee,
            checkoutDate: c.checkoutDate
          });
        }
      }
    }
  }
  
  return overdue;
}

// Member borrowing history
export function getMemberHistory(memberId: number) {
  let history = [];
  
  for (let i = 0; i < checkouts.length; i++) {
    if (checkouts[i].memberId === memberId) {
      let c = checkouts[i];
      
      // Find book
      let book = null;
      for (let j = 0; j < books.length; j++) {
        if (books[j].id === c.bookId) {
          book = books[j];
          break;
        }
      }
      
      if (book) {
        history.push({
          title: book.title,
          checkoutDate: c.checkoutDate,
          dueDate: c.dueDate,
          returnDate: c.returnDate,
          status: c.status
        });
      }
    }
  }
  
  return history;
}

// Library statistics - way too long!
export function getLibraryStats() {
  // Count total books
  let totalBooks = books.length;
  
  // Count available books
  let availableBooks = 0;
  for (let i = 0; i < books.length; i++) {
    if (books[i].status === 1) {
      availableBooks++;
    }
  }
  
  // Count total copies
  let totalCopies = 0;
  for (let i = 0; i < books.length; i++) {
    totalCopies = totalCopies + books[i].copies;
  }
  
  // Count members
  let totalMembers = members.length;
  
  // Count regular vs premium
  let regularMembers = 0;
  let premiumMembers = 0;
  for (let i = 0; i < members.length; i++) {
    if (members[i].type === "regular") {
      regularMembers++;
    } else {
      premiumMembers++;
    }
  }
  
  // Count active checkouts
  let activeCheckouts = 0;
  for (let i = 0; i < checkouts.length; i++) {
    if (checkouts[i].status === "active") {
      activeCheckouts++;
    }
  }
  
  // Count overdue
  let overdueCheckouts = 0;
  for (let i = 0; i < checkouts.length; i++) {
    if (checkouts[i].status === "active") {
      let days = getDays(checkouts[i].checkoutDate);
      if (days > 14) {
        overdueCheckouts++;
      }
    }
  }
  
  // Calculate total fees owed
  let totalFeesOwed = 0;
  for (let i = 0; i < members.length; i++) {
    totalFeesOwed = totalFeesOwed + members[i].fees;
  }
  
  // Add overdue fees
  for (let i = 0; i < checkouts.length; i++) {
    if (checkouts[i].status === "active") {
      let days = getDays(checkouts[i].checkoutDate);
      if (days > 14) {
        let daysLate = days - 14;
        let fee = 0;
        if (daysLate <= 7) {
          fee = daysLate * 0.5;
        } else {
          fee = 3.5 + (daysLate - 7) * 1.0;
        }
        totalFeesOwed = totalFeesOwed + fee;
      }
    }
  }
  
  return {
    totalBooks: totalBooks,
    availableBooks: availableBooks,
    totalCopies: totalCopies,
    totalMembers: totalMembers,
    regularMembers: regularMembers,
    premiumMembers: premiumMembers,
    activeCheckouts: activeCheckouts,
    overdueCheckouts: overdueCheckouts,
    totalFeesOwed: totalFeesOwed
  };
}

// Format report - mixing UI with business logic!
export function formatOverdueReport() {
  let report = getOverdueReport();
  let output = "=== OVERDUE BOOKS REPORT ===\n\n";
  
  if (report.length === 0) {
    output += "No overdue books!\n";
  } else {
    for (let i = 0; i < report.length; i++) {
      let item = report[i];
      output += "Book: " + item.book + "\n";
      output += "Member: " + item.member + "\n";
      output += "Days Overdue: " + item.daysOverdue + "\n";
      output += "Late Fee: " + fmt(item.fee) + "\n";
      output += "---\n";
    }
  }
  
  return output;
}

// Another format function!
export function printLibraryStats() {
  let stats = getLibraryStats();
  
  console.log("=== LIBRARY STATISTICS ===");
  console.log("Total Books: " + stats.totalBooks);
  console.log("Available Books: " + stats.availableBooks);
  console.log("Total Copies: " + stats.totalCopies);
  console.log("Total Members: " + stats.totalMembers);
  console.log("  Regular: " + stats.regularMembers);
  console.log("  Premium: " + stats.premiumMembers);
  console.log("Active Checkouts: " + stats.activeCheckouts);
  console.log("Overdue Checkouts: " + stats.overdueCheckouts);
  console.log("Total Fees Owed: " + fmt(stats.totalFeesOwed));
}

// Members with overdue books - more duplication!
export function getMembersWithOverdueBooks() {
  let result = [];
  
  for (let i = 0; i < members.length; i++) {
    let member = members[i];
    let hasOverdue = false;
    
    // Check member's books
    for (let j = 0; j < checkouts.length; j++) {
      if (checkouts[j].memberId === member.id && checkouts[j].status === "active") {
        let days = getDays(checkouts[j].checkoutDate);
        if (days > 14) {
          hasOverdue = true;
          break;
        }
      }
    }
    
    if (hasOverdue) {
      result.push(member);
    }
  }
  
  return result;
}

// Transaction report
export function getTransactionReport(startDate: Date, endDate: Date) {
  let filtered = [];
  
  for (let i = 0; i < transactions.length; i++) {
    let t = transactions[i];
    if (t.date >= startDate && t.date <= endDate) {
      filtered.push(t);
    }
  }
  
  return filtered;
}

