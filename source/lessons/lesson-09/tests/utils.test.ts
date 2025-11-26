import {
  getDays,
  fee,
  calculateFee,
  getFee,
  validEmail,
  validName,
  s1,
  filterByType,
  sortByName
} from '../src';

// Even utils have brittle tests!

describe('Utils Tests', () => {
  test('getDays should calculate days difference', () => {
    let date = new Date();
    date.setDate(date.getDate() - 10);
    
    let days = getDays(date);
    expect(days).toBe(10);
  });

  test('fee should calculate correct fee for 7 days or less', () => {
    expect(fee(5)).toBe(0);
    expect(fee(7)).toBe(0);
  });

  test('fee should calculate correct fee for 8-14 days', () => {
    expect(fee(10)).toBe(1.5); // (10-7) * 0.5
    expect(fee(14)).toBe(3.5); // (14-7) * 0.5
  });

  test('fee should calculate correct fee for more than 14 days', () => {
    expect(fee(20)).toBe(9.5); // 3.5 + (20-14) * 1.0
  });

  // Testing duplicate functions!
  test('calculateFee should give same result as fee', () => {
    expect(calculateFee(10)).toBe(fee(10));
    expect(calculateFee(20)).toBe(fee(20));
  });

  test('getFee should also give same result', () => {
    expect(getFee(10)).toBe(fee(10));
    expect(getFee(20)).toBe(fee(20));
  });

  test('validEmail should validate emails', () => {
    expect(validEmail("test@test.com")).toBe(true);
    expect(validEmail("invalid")).toBe(false);
    expect(validEmail("")).toBe(false);
  });

  test('validName should validate names', () => {
    expect(validName("John")).toBe(true);
    expect(validName("")).toBe(false);
  });

  test('s1 should trim and lowercase', () => {
    expect(s1("  TEST  ")).toBe("test");
    expect(s1("MixedCase")).toBe("mixedcase");
  });

  test('filterByType should filter array', () => {
    let arr = [
      { type: "regular", name: "A" },
      { type: "premium", name: "B" },
      { type: "regular", name: "C" }
    ];
    
    let filtered = filterByType(arr, "regular");
    expect(filtered.length).toBe(2);
  });

  test('sortByName should sort array', () => {
    let arr = [
      { name: "Charlie" },
      { name: "Alice" },
      { name: "Bob" }
    ];
    
    let sorted = sortByName(arr);
    expect(sorted[0].name).toBe("Alice");
    expect(sorted[1].name).toBe("Bob");
    expect(sorted[2].name).toBe("Charlie");
  });
});

