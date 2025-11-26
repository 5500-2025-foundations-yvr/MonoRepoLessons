# Command-Line Interface Usage Guide

## Starting the CLI

```bash
# Quick start (builds first)
npm start

# Or for faster development (no build step)
npm run dev
```

## Main Menu

When you start the CLI, you'll see:

```
==================================================
📚 STINKY LIBRARY MANAGEMENT SYSTEM 📚
==================================================

📖 BOOK OPERATIONS:
  1. List all books
  2. Search books
  3. Add a book
  4. Remove a book

👥 MEMBER OPERATIONS:
  5. List all members
  6. Add a member
  7. View member details

📋 CHECKOUT OPERATIONS:
  8. Checkout a book
  9. Return a book

📊 REPORTS:
  10. Most popular books
  11. Overdue books report
  12. Library statistics

  0. Exit
==================================================
```

## Example Walkthrough

### 1. View Initial Books
```
Choose option: 1

📚 ALL BOOKS:
1. The Great Gatsby by F. Scott Fitzgerald (ISBN: 9780743273565) - 3 copies available
2. 1984 by George Orwell (ISBN: 9780451524935) - 2 copies available
...
```

### 2. View Members
```
Choose option: 5

👥 ALL MEMBERS:
1. John Doe (john@example.com) - regular member - Books borrowed: 0
2. Jane Smith (jane@example.com) - premium member - Books borrowed: 0
...
```

### 3. Checkout a Book
```
Choose option: 8

📋 CHECKOUT BOOK:
[Shows book list]
Enter book ID: 1

[Shows member list]
Enter member ID: 1

✅ Book checked out successfully!
Due date: 12/10/2024
```

### 4. Return a Book
```
Choose option: 9

📋 RETURN BOOK:
Enter book ID: 1
Enter member ID: 1

✅ Book returned successfully!
```

### 5. View Reports
```
Choose option: 12

📊 LIBRARY STATISTICS:
Total Books: 5
Available Books: 5
Total Copies: 14
Total Members: 3
  - Regular: 2
  - Premium: 1
Active Checkouts: 0
Overdue Checkouts: 0
Total Fees Owed: $5.50
```

## Tips for Students

### See the Code in Action
As you use the CLI, notice:
- **Slow responses** (inefficient code!)
- **Console error messages** (inconsistent error handling!)
- **Confusing behavior** (poor code organization!)

### Test Your Refactoring
After refactoring:
```bash
# 1. Run tests to ensure nothing broke
npm test

# 2. Run the CLI to verify it still works
npm start

# 3. Try all the operations to ensure functionality is preserved
```

### Common Scenarios to Test

**Happy Path:**
1. Add a book → ✅ Success
2. Add a member → ✅ Success
3. Checkout the book → ✅ Success
4. Return the book → ✅ Success

**Error Cases:**
1. Try to checkout with no copies available → ❌ Should fail gracefully
2. Try to checkout when member has overdue books → ❌ Should fail with clear message
3. Try to checkout when member has fees → ❌ Should fail with fee amount

**Edge Cases:**
1. Search for non-existent book → Empty results
2. Remove book that doesn't exist → Error message
3. Add duplicate ISBN → Should prevent

## Observing Code Smells in the CLI

While using the CLI, you'll notice manifestations of the code smells:

### 🤢 Magic Numbers in Action
When you see fees calculated, notice the mysterious numbers:
- Why is it charging $0.50 per day?
- What does "14 days" mean?
- Why do premium members get 30 days?

### 🤢 Poor Error Handling
Try invalid operations and see:
- Inconsistent error messages
- Some errors logged, some returned, some thrown
- Unclear what went wrong

### 🤢 Mixed Concerns
Notice how:
- Data access is mixed with business logic
- UI formatting is in model code
- Everything is tightly coupled

### 🤢 God Functions
When you checkout/return books:
- The operation takes a while (processing 200+ lines!)
- It's doing way too many things at once
- It's hard to debug when something goes wrong

## Debugging with the CLI

### Add Console Logs
Want to see how bad the code is?

```typescript
// Add this to checkout.ts to see the horror
console.log('Starting checkout...');
console.log('Validating member...');
console.log('Checking fees...');
// ... watch it print 50 lines for one operation!
```

### Monitor Performance
```bash
# Run the CLI and time operations
time npm start
# Try a checkout - notice how long it takes!
```

## After Refactoring

Once you've refactored, run the CLI again:
- Operations should feel snappier
- Error messages should be clearer
- Code should be easier to extend

Try adding a new feature:
- Add "renew book" option
- Add "search by genre"
- Add "reserve book"

Good refactoring makes new features MUCH easier to add!

## Exiting the CLI

```
Choose option: 0

👋 Thank you for using the Stinky Library System!
Remember: Refactor this terrible code! 💪
```

---

**Pro Tip:** Run the CLI before AND after refactoring to appreciate how much better the code becomes! 🎉

