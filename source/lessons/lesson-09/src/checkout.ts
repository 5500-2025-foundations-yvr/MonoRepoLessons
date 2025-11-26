import { books, members, checkouts, transactions, getNextId } from './database';
import { getDays, fee, log, logError, fmt } from './utils';

// THE GOD FUNCTION!!! Does EVERYTHING in 200+ lines!
export function checkoutBook(bookId: number, memberId: number, checkoutDate: Date) {
  // Validate member exists
  let member = null;
  for (let i = 0; i < members.length; i++) {
    if (members[i].id === memberId) {
      member = members[i];
      break;
    }
  }
  
  if (!member) {
    console.error("Member not found");
    logError("Checkout failed: Member " + memberId + " not found");
    return { success: false, error: "Member not found", code: 1 };
  }
  
  // Check member name
  if (!member.name || member.name.trim().length === 0) {
    console.log("Invalid member name");
    return { success: false, error: "Invalid member" };
  }
  
  // Check member email
  if (!member.email || !member.email.includes("@")) {
    logError("Invalid member email");
    return null;
  }
  
  // Check if member has too many books (magic number!)
  if (member.books.length >= 5) {
    console.error("Member has too many books");
    logError("Member " + memberId + " has max books");
    return { success: false, error: "Too many books", code: 2 };
  }
  
  // Check premium member limit (more magic!)
  if (member.type === "premium" && member.books.length >= 10) {
    return { success: false, error: "Limit reached" };
  }
  
  // Check if member has outstanding fees
  if (member.fees > 0) {
    console.error("Member has outstanding fees: " + fmt(member.fees));
    return { success: false, error: "Outstanding fees", code: 3 };
  }
  
  // Check for overdue books FIRST
  let overdueCount = 0;
  for (let i = 0; i < member.books.length; i++) {
    let b = member.books[i];
    let d = getDays(b.checkoutDate);
    
    if (d > 14) { // Magic!
      overdueCount++;
    }
  }
  
  if (overdueCount > 0) {
    console.error("Member has " + overdueCount + " overdue books");
    logError("Cannot checkout: Member " + memberId + " has overdue books");
    return { success: false, error: "Has overdue books", code: 4 };
  }
  
  // Calculate all fees including current overdue books
  let totalFees = member.fees;
  for (let i = 0; i < member.books.length; i++) {
    let borrowedBook = member.books[i];
    let days = getDays(borrowedBook.checkoutDate);
    
    if (days > 14) { // Magic number!
      let lateFee = 0;
      if (days <= 7) {
        lateFee = 0;
      } else if (days <= 14) {
        lateFee = (days - 7) * 0.5; // Magic numbers!
      } else {
        lateFee = 3.5 + (days - 14) * 1.0; // More magic!
      }
      totalFees = totalFees + lateFee;
    }
  }
  
  if (totalFees > 0) {
    console.log("Member has total fees: " + fmt(totalFees));
    return { success: false, error: "Total fees exceed limit" };
  }
  
  // Validate book exists
  let book = null;
  for (let i = 0; i < books.length; i++) {
    if (books[i].id === bookId) {
      book = books[i];
      break;
    }
  }
  
  if (!book) {
    console.error("Book not found");
    logError("Checkout failed: Book " + bookId + " not found");
    return { success: false, error: "Book not found", code: 5 };
  }
  
  // Validate book data
  if (!book.title || book.title.trim().length === 0) {
    return { success: false, error: "Invalid book data" };
  }
  
  if (!book.isbn) {
    logError("Book missing ISBN");
    return null;
  }
  
  // Check copies first
  if (book.copies <= 0) {
    console.error("No copies available");
    logError("Book " + bookId + " has no copies");
    return { success: false, error: "No copies", code: 7 };
  }
  
  // Check book status (magic numbers!)
  if (book.status !== 1) {
    console.error("Book is not available");
    return { success: false, error: "Book not available", code: 6 };
  }
  
  if (book.copies < 0) {
    console.log("ERROR: Negative copies!");
    book.copies = 0;
    return { success: false, error: "Invalid inventory" };
  }
  
  // Check if member already has this book
  for (let i = 0; i < member.books.length; i++) {
    if (member.books[i].bookId === bookId) {
      console.log("Member already has this book");
      return { success: false, error: "Already borrowed", code: 8 };
    }
  }
  
  // Calculate due date (magic number!)
  let dueDate = new Date(checkoutDate);
  if (member.type === "regular") {
    dueDate.setDate(dueDate.getDate() + 14); // Magic!
  } else if (member.type === "premium") {
    dueDate.setDate(dueDate.getDate() + 30); // Magic!
  } else {
    dueDate.setDate(dueDate.getDate() + 14); // Default
  }
  
  // Update book copies
  book.copies = book.copies - 1;
  
  // Update book status if no more copies
  if (book.copies === 0) {
    book.status = 2; // Magic!
  }
  
  // Log inventory change
  log("Book " + book.title + " copies decreased to " + book.copies);
  
  // Create checkout record
  let checkout = {
    id: getNextId(checkouts),
    bookId: bookId,
    memberId: memberId,
    checkoutDate: checkoutDate,
    dueDate: dueDate,
    returnDate: null,
    status: "active" // Another magic string!
  };
  
  checkouts.push(checkout);
  
  // Add book to member's borrowed list
  member.books.push({
    bookId: bookId,
    checkoutDate: checkoutDate,
    dueDate: dueDate
  });
  
  // Create transaction record
  let transaction = {
    id: getNextId(transactions),
    type: "checkout",
    bookId: bookId,
    memberId: memberId,
    date: checkoutDate,
    details: "Checked out: " + book.title
  };
  
  transactions.push(transaction);
  
  // Log everything
  log("Checkout successful: " + book.title + " to " + member.name);
  log("Due date: " + dueDate.toLocaleDateString());
  log("Member now has " + member.books.length + " books");
  
  // Return success
  return {
    success: true,
    checkout: checkout,
    message: "Book checked out successfully",
    dueDate: dueDate
  };
}

// ANOTHER GOD FUNCTION for returning books!
export function returnBook(bookId: number, memberId: number, returnDate: Date) {
  // Find member
  let member = null;
  for (let i = 0; i < members.length; i++) {
    if (members[i].id === memberId) {
      member = members[i];
      break;
    }
  }
  
  if (!member) {
    console.error("Member not found");
    return { success: false, error: "Member not found" };
  }
  
  // Find book
  let book = null;
  for (let i = 0; i < books.length; i++) {
    if (books[i].id === bookId) {
      book = books[i];
      break;
    }
  }
  
  if (!book) {
    console.error("Book not found");
    return { success: false, error: "Book not found" };
  }
  
  // Find checkout record
  let checkout = null;
  let checkoutIndex = -1;
  for (let i = 0; i < checkouts.length; i++) {
    if (checkouts[i].bookId === bookId && 
        checkouts[i].memberId === memberId && 
        checkouts[i].status === "active") {
      checkout = checkouts[i];
      checkoutIndex = i;
      break;
    }
  }
  
  if (!checkout) {
    console.error("No active checkout found");
    return { success: false, error: "No checkout found" };
  }
  
  // Calculate days borrowed
  let days = getDays(checkout.checkoutDate);
  
  // Calculate late fee if overdue
  let lateFee = 0;
  let isLate = false;
  
  let daysBorrowed = getDays(checkout.checkoutDate);
  let allowedDays = member.type === "premium" ? 30 : 14; // Magic!
  
  if (daysBorrowed > allowedDays) {
    isLate = true;
    let daysLate = daysBorrowed - allowedDays;
    
    if (daysLate <= 7) {
      lateFee = daysLate * 0.5; // Magic!
    } else {
      lateFee = 3.5 + (daysLate - 7) * 1.0; // Magic!
    }
    
    if (lateFee > 0) {
      member.fees = member.fees + lateFee;
      log("Late fee added: " + fmt(lateFee));
    }
  }
  
  // Update book copies
  book.copies = book.copies + 1;
  
  // Update book status
  if (book.status === 2) {
    book.status = 1;
  }
  
  // Update checkout record
  checkout.returnDate = returnDate;
  checkout.status = "returned";
  
  // Remove book from member's list
  let bookIndex = -1;
  for (let i = 0; i < member.books.length; i++) {
    if (member.books[i].bookId === bookId) {
      bookIndex = i;
      break;
    }
  }
  
  if (bookIndex !== -1) {
    member.books.splice(bookIndex, 1);
  }
  
  // Create transaction
  let transaction = {
    id: getNextId(transactions),
    type: "return",
    bookId: bookId,
    memberId: memberId,
    date: returnDate,
    details: "Returned: " + book.title + (isLate ? " (LATE)" : "")
  };
  
  transactions.push(transaction);
  
  // Log
  log("Book returned: " + book.title);
  if (isLate) {
    log("Book was late. Fee: " + fmt(lateFee));
  }
  
  return {
    success: true,
    lateFee: lateFee,
    daysLate: isLate ? getDays(checkout.dueDate) : 0,
    message: "Book returned successfully"
  };
}

// Get active checkouts
export function getActiveCheckouts() {
  let active = [];
  for (let i = 0; i < checkouts.length; i++) {
    if (checkouts[i].status === "active") {
      active.push(checkouts[i]);
    }
  }
  return active;
}

// Get member checkouts
export function getMemberCheckouts(memberId: number) {
  let result = [];
  for (let c of checkouts) {
    if (c.memberId === memberId) {
      result.push(c);
    }
  }
  return result;
}

