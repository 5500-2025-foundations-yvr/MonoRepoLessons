// A dumping ground for random functions with terrible names!

// What does this do? Who knows!
export function f1(x: any, y: any) {
  if (x && y) {
    return x + y;
  }
  return null;
}

// Calculate something
export function calc(d1: Date, d2: Date) {
  let diff = d2.getTime() - d1.getTime();
  return diff / (1000 * 60 * 60 * 24);
}

// Process data
export function process(data: any) {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i]) {
      result.push(data[i]);
    }
  }
  return result;
}

// More date stuff
export function getDays(d: Date) {
  let now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / 86400000);
}

// Validate something
export function check(x: any) {
  if (!x) return false;
  if (x.length === 0) return false;
  return true;
}

// Format money - mixing concerns!
export function fmt(n: number) {
  return "$" + n.toFixed(2);
}

// Is it late?
export function late(d: Date) {
  return getDays(d) > 14;
}

// Calculate fee - magic numbers!
export function fee(days: number) {
  if (days <= 0) return 0;
  if (days <= 7) return 0;
  if (days <= 14) return (days - 7) * 0.5;
  return 3.5 + (days - 14) * 1.0;
}

// Duplicate of fee but slightly different
export function calculateFee(daysLate: number) {
  if (daysLate < 1) return 0;
  if (daysLate < 8) return 0;
  let f = 0;
  if (daysLate > 7 && daysLate <= 14) {
    f = (daysLate - 7) * 0.5;
  } else {
    f = 3.5;
    f = f + (daysLate - 14) * 1.0;
  }
  return f;
}

// Yet another fee calculation!
export function getFee(d: number) {
  if (d <= 7) {
    return 0;
  } else if (d > 7 && d <= 14) {
    return (d - 7) * 0.50;
  } else {
    return ((d - 14) * 1.0) + 3.5;
  }
}

// String utilities with bad names
export function s1(str: string) {
  return str.trim().toLowerCase();
}

export function s2(str: string) {
  return str.replace(/\s+/g, ' ').trim();
}

// Array utility
export function a1(arr: any[]) {
  return arr.filter(x => x);
}

// Object utility
export function o1(obj: any) {
  return Object.keys(obj).length > 0;
}

// Random number
export function r1() {
  return Math.floor(Math.random() * 10000);
}

// Validate email - but not really
export function validEmail(email: string) {
  return email.includes("@");
}

// Validate name - not really
export function validName(name: string) {
  return name.length > 0;
}

// Another validation function that does the same thing
export function checkName(n: string) {
  if (n) {
    if (n.length > 0) {
      return true;
    }
  }
  return false;
}

// And another!
export function isNameValid(name: string) {
  return name && name.trim().length > 0;
}

// Date formatting - mixing concerns again!
export function formatDate(d: Date) {
  return d.toLocaleDateString();
}

// Sort stuff
export function sortByName(arr: any[]) {
  return arr.sort((a, b) => a.name > b.name ? 1 : -1);
}

// Filter stuff
export function filterByType(arr: any[], type: string) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].type === type) {
      result.push(arr[i]);
    }
  }
  return result;
}

// Map stuff
export function mapToNames(arr: any[]) {
  let names = [];
  for (let item of arr) {
    names.push(item.name);
  }
  return names;
}

// Reduce stuff - but doing it manually
export function sumFees(members: any[]) {
  let total = 0;
  for (let i = 0; i < members.length; i++) {
    total = total + members[i].fees;
  }
  return total;
}

// Count stuff
export function countBooks(members: any[]) {
  let count = 0;
  for (let m of members) {
    count = count + m.books.length;
  }
  return count;
}

// Find stuff
export function findByTitle(books: any[], title: string) {
  for (let i = 0; i < books.length; i++) {
    if (books[i].title.toLowerCase() === title.toLowerCase()) {
      return books[i];
    }
  }
  return null;
}

// Another find function
export function searchByTitle(books: any[], searchTerm: string) {
  let results = [];
  for (let book of books) {
    if (book.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      results.push(book);
    }
  }
  return results;
}

// Log stuff - side effects!
export function log(message: string) {
  console.log("[LOG] " + new Date().toISOString() + " - " + message);
}

// Error logging
export function logError(error: string) {
  console.error("[ERROR] " + error);
}

// Deep copy - implemented badly
export function copy(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

// Random helper
export function randomString() {
  return Math.random().toString(36).substring(7);
}

