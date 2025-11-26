import {
  members,
  resetDB,
  addMember,
  removeMember,
  findMember,
  canCheckout,
  getMemberStats,
  updateMemberType,
  addFee,
  payFee
} from '../src';

// More brittle tests with duplicated setup!

describe('Member Tests', () => {
  // Duplicated setup from book.test.ts!
  beforeEach(() => {
    resetDB();
    // Manual setup - brittle!
    members.push({
      id: 1,
      name: "John Doe",
      email: "john@test.com",
      type: "regular",
      books: [],
      fees: 0,
      joinDate: new Date('2023-01-01')
    });
    members.push({
      id: 2,
      name: "Jane Smith",
      email: "jane@test.com",
      type: "premium",
      books: [],
      fees: 5.50,
      joinDate: new Date('2023-02-01')
    });
  });

  test('addMember should add a member', () => {
    let initialCount = members.length;
    
    let member = addMember("Bob Johnson", "bob@test.com", "regular");
    
    // Direct state checking!
    expect(members.length).toBe(initialCount + 1);
    expect(member).not.toBeNull();
    expect(member?.name).toBe("Bob Johnson");
    expect(member?.type).toBe("regular");
    expect(member?.books).toEqual([]);
    expect(member?.fees).toBe(0);
  });

  test('addMember should not add without name', () => {
    let member = addMember("", "test@test.com", "regular");
    expect(member).toBeNull();
  });

  test('addMember should not add without email', () => {
    let member = addMember("Test", "", "regular");
    expect(member).toBeNull();
  });

  test('addMember should not add with invalid email', () => {
    let member = addMember("Test", "notanemail", "regular");
    expect(member).toBeNull();
  });

  test('addMember should not add duplicate email', () => {
    let member = addMember("Duplicate", "john@test.com", "regular");
    expect(member).toBeNull();
  });

  test('addMember should not add invalid type', () => {
    let member = addMember("Test", "test@test.com", "invalid");
    expect(member).toBeNull();
  });

  test('removeMember should remove a member', () => {
    let initialCount = members.length;
    
    let result = removeMember(1);
    
    expect(result).toBe(true);
    expect(members.length).toBe(initialCount - 1);
  });

  test('removeMember should return false for non-existent member', () => {
    let result = removeMember(9999);
    expect(result).toBe(false);
  });

  test('findMember should find a member', () => {
    let member = findMember(1);
    
    expect(member).not.toBeNull();
    expect(member?.id).toBe(1);
    expect(member?.name).toBe("John Doe");
  });

  test('canCheckout should return true for member in good standing', () => {
    let result = canCheckout(1);
    expect(result).toBe(true);
  });

  test('canCheckout should return false for member with fees', () => {
    let result = canCheckout(2);
    expect(result).toBe(false);
  });

  test('canCheckout should return false for member with too many books', () => {
    // Direct manipulation!
    members[0].books = [
      { bookId: 1, checkoutDate: new Date(), dueDate: new Date() },
      { bookId: 2, checkoutDate: new Date(), dueDate: new Date() },
      { bookId: 3, checkoutDate: new Date(), dueDate: new Date() },
      { bookId: 4, checkoutDate: new Date(), dueDate: new Date() },
      { bookId: 5, checkoutDate: new Date(), dueDate: new Date() }
    ];
    
    let result = canCheckout(1);
    expect(result).toBe(false);
  });

  test('canCheckout should return false for member with overdue books', () => {
    // Direct manipulation with magic dates!
    let oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 20); // Magic number!
    
    members[0].books = [
      { bookId: 1, checkoutDate: oldDate, dueDate: new Date() }
    ];
    
    let result = canCheckout(1);
    expect(result).toBe(false);
  });

  test('getMemberStats should return correct stats', () => {
    let stats = getMemberStats(1);
    
    expect(stats).not.toBeNull();
    expect(stats?.name).toBe("John Doe");
    expect(stats?.type).toBe("regular");
    expect(stats?.bookCount).toBe(0);
    expect(stats?.overdueCount).toBe(0);
    expect(stats?.totalFees).toBe(0);
    expect(stats?.canBorrow).toBe(true);
  });

  test('updateMemberType should update type', () => {
    updateMemberType(1, "premium");
    
    // Direct check
    expect(members[0].type).toBe("premium");
  });

  test('updateMemberType should not accept invalid type', () => {
    let result = updateMemberType(1, "invalid");
    expect(result).toBe(false);
  });

  test('addFee should add fee to member', () => {
    addFee(1, 5.00);
    
    // Direct state check!
    expect(members[0].fees).toBe(5.00);
  });

  test('payFee should reduce fee', () => {
    addFee(1, 10.00);
    payFee(1, 6.00);
    
    expect(members[0].fees).toBe(4.00);
  });

  test('payFee should not go below zero', () => {
    addFee(1, 5.00);
    payFee(1, 10.00);
    
    expect(members[0].fees).toBe(0);
  });
});

