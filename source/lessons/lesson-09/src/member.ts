import { members, getNextId } from './database';
import { validEmail, validName, log, getDays, fee, fmt } from './utils';

// More terrible code with duplicated validation logic!

// Add member - duplicate validation from book.ts
export function addMember(name: string, email: string, type: string) {
  // Inline validation - should be extracted
  if (!name) {
    console.error("Name required");
    return null;
  }
  if (!email) {
    console.error("Email required");
    return null;
  }
  if (!validEmail(email)) {
    console.error("Invalid email");
    return null;
  }
  if (type !== "regular" && type !== "premium") {
    console.error("Type must be 'regular' or 'premium'");
    return null;
  }
  
  // Check duplicate
  for (let m of members) {
    if (m.email === email) {
      console.error("Member with this email already exists");
      return null;
    }
  }
  
  let member = {
    id: getNextId(members),
    name: name,
    email: email,
    type: type,
    books: [],
    fees: 0,
    joinDate: new Date()
  };
  
  members.push(member);
  log("Member added: " + name);
  return member;
}

// Remove member
export function removeMember(id: number) {
  let idx = -1;
  for (let i = 0; i < members.length; i++) {
    if (members[i].id === id) {
      idx = i;
      break;
    }
  }
  
  if (idx !== -1) {
    members.splice(idx, 1);
    return true;
  }
  return false;
}

// Find member - more duplication
export function findMember(id: number) {
  for (let i = 0; i < members.length; i++) {
    if (members[i].id === id) {
      return members[i];
    }
  }
  return null;
}

// Find by email - duplicate logic
export function findMemberByEmail(email: string) {
  for (let m of members) {
    if (m.email === email) {
      return m;
    }
  }
  return null;
}

// Validate member - duplicate validation logic!
export function validateMember(name: string, email: string) {
  let errs = [];
  
  if (!name) {
    errs.push("Name required");
  }
  if (name && name.trim().length === 0) {
    errs.push("Name cannot be empty");
  }
  if (!email) {
    errs.push("Email required");
  }
  if (email && !email.includes("@")) {
    errs.push("Invalid email format");
  }
  
  return errs;
}

// Yet another validation function!
export function checkMember(member: any) {
  if (!member) return false;
  if (!member.name) return false;
  if (!member.email) return false;
  if (!member.type) return false;
  return true;
}

// And another!
export function isMemberValid(m: any) {
  return m && m.name && m.email && m.type;
}

// Check if member can checkout
export function canCheckout(memberId: number) {
  let m = findMember(memberId);
  if (!m) return false;
  
  // Magic number!
  if (m.books.length >= 5) {
    return false;
  }
  
  // Check fees
  if (m.fees > 0) {
    return false;
  }
  
  // Check for overdue books
  for (let i = 0; i < m.books.length; i++) {
    let book = m.books[i];
    let days = getDays(book.checkoutDate);
    if (days > 14) { // Magic number!
      return false;
    }
  }
  
  return true;
}

// Another version of can checkout - duplication!
export function memberCanBorrow(memberId: number) {
  let member = findMember(memberId);
  if (!member) {
    return false;
  }
  
  if (member.books.length >= 5) {
    return false;
  }
  
  if (member.fees !== 0) {
    return false;
  }
  
  let hasOverdue = false;
  for (let b of member.books) {
    if (getDays(b.checkoutDate) > 14) {
      hasOverdue = true;
    }
  }
  
  return !hasOverdue;
}

// Calculate member fees - duplicate fee calculation!
export function calculateMemberFees(memberId: number) {
  let m = findMember(memberId);
  if (!m) return 0;
  
  let total = m.fees;
  
  for (let book of m.books) {
    let days = getDays(book.checkoutDate);
    if (days > 14) {
      total = total + fee(days);
    }
  }
  
  return total;
}

// Get overdue books for member
export function getOverdueBooks(memberId: number) {
  let m = findMember(memberId);
  if (!m) return [];
  
  let overdue = [];
  for (let i = 0; i < m.books.length; i++) {
    let b = m.books[i];
    let d = getDays(b.checkoutDate);
    if (d > 14) { // Magic number again!
      overdue.push(b);
    }
  }
  
  return overdue;
}

// Get member statistics
export function getMemberStats(memberId: number) {
  let m = findMember(memberId);
  if (!m) return null;
  
  let bookCount = m.books.length;
  let overdueCount = 0;
  let totalFees = m.fees;
  
  for (let book of m.books) {
    let days = getDays(book.checkoutDate);
    if (days > 14) {
      overdueCount++;
      totalFees += fee(days);
    }
  }
  
  return {
    name: m.name,
    type: m.type,
    bookCount: bookCount,
    overdueCount: overdueCount,
    totalFees: totalFees,
    canBorrow: overdueCount === 0 && bookCount < 5 && totalFees === 0
  };
}

// Format member - UI concern!
export function formatMember(member: any) {
  return member.name + " (" + member.email + ") - " + member.type + " member";
}

// Another format function!
export function displayMember(m: any) {
  let status = canCheckout(m.id) ? "Good standing" : "Cannot borrow";
  return "Name: " + m.name + "\nEmail: " + m.email + "\nType: " + m.type + "\nBooks: " + m.books.length + "\nStatus: " + status;
}

// Update member type
export function updateMemberType(memberId: number, newType: string) {
  let m = findMember(memberId);
  if (!m) return false;
  
  if (newType !== "regular" && newType !== "premium") {
    return false;
  }
  
  m.type = newType;
  return true;
}

// Add fee to member
export function addFee(memberId: number, amount: number) {
  let m = findMember(memberId);
  if (!m) return false;
  
  m.fees = m.fees + amount;
  return true;
}

// Pay fee
export function payFee(memberId: number, amount: number) {
  let m = findMember(memberId);
  if (!m) return false;
  
  if (amount > m.fees) {
    m.fees = 0;
  } else {
    m.fees = m.fees - amount;
  }
  
  return true;
}

// Get all members with fees
export function getMembersWithFees() {
  let result = [];
  for (let m of members) {
    if (m.fees > 0) {
      result.push(m);
    }
  }
  return result;
}

// Get premium members
export function getPremiumMembers() {
  let premium = [];
  for (let i = 0; i < members.length; i++) {
    if (members[i].type === "premium") {
      premium.push(members[i]);
    }
  }
  return premium;
}

