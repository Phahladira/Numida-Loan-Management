import {
  getLoanColor,
  validateLoan,
  categorizeLoanPayment,
  calculateSimpleInterest,
  calculateCompoundInterest,
  formatDate,
  validatePaymentId,
  validatePaymentAmount,
} from '../util/helpers'; // adjust path as needed

import { ExistingLoans, LoanRepayments } from '../__generated__/graphql';
import { LOAN_CATEGORY_COLORS, LOAN_CATEGORY_ENUM } from '../util/constants';

// Mock global console.error to prevent test output pollution
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('getLoanColor', () => {
  test('should return GREY for UNPAID loans', () => {
    expect(getLoanColor(LOAN_CATEGORY_ENUM.UNPAID)).toBe(LOAN_CATEGORY_COLORS.GREY);
  });

  test('should return GREEN for ON_TIME loans', () => {
    expect(getLoanColor(LOAN_CATEGORY_ENUM.ON_TIME)).toBe(LOAN_CATEGORY_COLORS.GREEN);
  });

  test('should return ORANGE for LATE loans', () => {
    expect(getLoanColor(LOAN_CATEGORY_ENUM.LATE)).toBe(LOAN_CATEGORY_COLORS.ORANGE);
  });

  test('should return RED for DEFAULTED loans', () => {
    expect(getLoanColor(LOAN_CATEGORY_ENUM.DEFAULTED)).toBe(LOAN_CATEGORY_COLORS.RED);
  });

  test('should return GREY as default', () => {
    expect(getLoanColor('INVALID_STATUS' as LOAN_CATEGORY_ENUM)).toBe(LOAN_CATEGORY_COLORS.GREY);
  });
});

describe('validateLoan', () => {
  const validLoan = {
    id: 1,
    name: 'Test Loan',
    interestRate: 5,
    dueDate: '2023-12-31',
    principal: 1000,
    repayments: []
  } as unknown as ExistingLoans;

  test('should return loan when valid', () => {
    expect(validateLoan(validLoan)).toBe(validLoan);
  });

  test('should return null when loan is null', () => {
    expect(validateLoan(null as unknown as ExistingLoans)).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Loan item is null or invalid');
  });

  test('should return null when loan is missing required fields', () => {
    const invalidLoan = { ...validLoan, id: undefined };
    expect(validateLoan(invalidLoan as ExistingLoans)).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Loan item is null or invalid');
  });
});

describe('categorizeLoanPayment', () => {
  const validPayment = {
    id: 1,
    paymentDate: '2023-12-25'
  } as LoanRepayments;

  const validLoan = {
    id: 1,
    name: 'Test Loan',
    interestRate: 5,
    dueDate: '2023-12-31',
    principal: 1000,
    repayments: [validPayment]
  } as unknown as ExistingLoans;

  test('should categorize payments correctly', () => {
    const result = categorizeLoanPayment(validLoan);
    expect(result).toEqual([
      {
        name: 'Test Loan',
        id: 1,
        principal: 1000,
        interestRate: 5,
        dueDate: new Date('2023-12-31'),
        paymentDate: new Date('2023-12-25'),
        status: LOAN_CATEGORY_ENUM.ON_TIME
      }
    ]);
  });

  test('should return null for invalid payments', () => {
    const loanWithInvalidPayment = {
      ...validLoan,
      repayments: [{ id: undefined, paymentDate: '2023-12-25' } as LoanRepayments]
    };
    expect(categorizeLoanPayment(loanWithInvalidPayment as ExistingLoans)).toBeNull();
    expect(console.error).toHaveBeenCalledWith('One or more payments are invalid');
  });

  test('should handle empty repayments array', () => {
    const loanWithNoPayments = { ...validLoan, repayments: [] };
    expect(categorizeLoanPayment(loanWithNoPayments as ExistingLoans)).toEqual([]);
  });
});

describe('calculateSimpleInterest', () => {
  test('should calculate simple interest correctly', () => {
    expect(calculateSimpleInterest(1000, 5, 1)).toBe(50);
    expect(calculateSimpleInterest(1000, 5, 2)).toBe(100);
    expect(calculateSimpleInterest(5000, 3.5, 2)).toBe(350);
  });

  test('should round to 2 decimal places', () => {
    expect(calculateSimpleInterest(1000, 5.123, 1)).toBe(51.23);
  });
});

describe('calculateCompoundInterest', () => {
  test('should calculate compound interest correctly with default compounding frequency', () => {
    expect(calculateCompoundInterest(1000, 5, 1)).toBe(50);
    expect(calculateCompoundInterest(1000, 5, 2)).toBe(102.5);
  });

  test('should calculate compound interest with specified compounding frequency', () => {
    expect(calculateCompoundInterest(1000, 5, 1, 12)).toBe(51.16);
    expect(calculateCompoundInterest(1000, 5, 2, 4)).toBe(104.06);
  });

  test('should round to 2 decimal places', () => {
    expect(calculateCompoundInterest(1000, 5.123, 1)).toBe(51.23);
  });
});

describe('formatDate', () => {
  test('should format valid date strings correctly', () => {
    expect(formatDate('2023-12-31')).toBe('31 December 2023');
    expect(formatDate('2023-01-01')).toBe('01 January 2023');
  });

  test('should return empty string for null or undefined input', () => {
    expect(formatDate('')).toBe('');
    expect(console.error).toHaveBeenCalledWith('Date string is null');
  });

  test('should return empty string for invalid date strings', () => {
    expect(formatDate('not-a-date')).toBe('');
    expect(console.error).toHaveBeenCalledWith('Invalid date string');
  });
});

describe('validatePaymentId', () => {
  test('should return undefined for valid payment IDs', () => {
    expect(validatePaymentId('123')).toBeUndefined();
    expect(validatePaymentId('0')).toBeUndefined();
  });

  test('should validate required field', () => {
    expect(validatePaymentId('')).toBe('Loan ID is required');
  });

  test('should validate numeric values', () => {
    expect(validatePaymentId('abc')).toBe('Loan ID must be a number');
    expect(validatePaymentId('123abc')).toBe('Loan ID must be a number');
  });

  test('should validate non-negative values', () => {
    expect(validatePaymentId('-5')).toBe('Loan ID cannot be negative');
  });
});

describe('validatePaymentAmount', () => {
  test('should return undefined for valid payment amounts', () => {
    expect(validatePaymentAmount('123')).toBeUndefined();
    expect(validatePaymentAmount('123.45')).toBeUndefined();
    expect(validatePaymentAmount('0')).toBeUndefined();
    expect(validatePaymentAmount('0.00')).toBeUndefined();
  });

  test('should validate numeric values', () => {
    expect(validatePaymentAmount('abc')).toBe('Payment amount must be a number');
    expect(validatePaymentAmount('123abc')).toBe('Payment amount must be a number');
  });

  test('should validate non-negative values', () => {
    expect(validatePaymentAmount('-5')).toBe('Payment amount cannot be negative');
  });
});

// Test the private helper function through its uses in the main functions
describe('getLoanCategory (tested indirectly through categorizeLoanPayment)', () => {
  test('ON_TIME categorization for payment before due date', () => {
    const loan = {
      id: 1,
      name: 'Test',
      principal: 1000,
      interestRate: 5,
      dueDate: '2023-12-31',
      repayments: [{ id: 1, paymentDate: '2023-12-25' }]
    } as unknown as ExistingLoans;
    
    const result = categorizeLoanPayment(loan);
    expect(result![0].status).toBe(LOAN_CATEGORY_ENUM.ON_TIME);
  });
  
  test('ON_TIME categorization for payment within 5 days after due date', () => {
    const loan = {
      id: 1,
      name: 'Test',
      principal: 1000,
      interestRate: 5,
      dueDate: '2023-12-31',
      repayments: [{ id: 1, paymentDate: '2024-01-05' }]
    } as unknown as ExistingLoans;
    
    const result = categorizeLoanPayment(loan);
    expect(result![0].status).toBe(LOAN_CATEGORY_ENUM.ON_TIME);
  });
  
  test('LATE categorization for payment between 6-30 days after due date', () => {
    const loan = {
      id: 1,
      name: 'Test',
      principal: 1000,
      interestRate: 5,
      dueDate: '2023-12-31',
      repayments: [{ id: 1, paymentDate: '2024-01-15' }]
    } as unknown as ExistingLoans;
    
    const result = categorizeLoanPayment(loan);
    expect(result![0].status).toBe(LOAN_CATEGORY_ENUM.LATE);
  });
  
  test('DEFAULTED categorization for payment more than 30 days after due date', () => {
    const loan = {
      id: 1,
      name: 'Test',
      principal: 1000,
      interestRate: 5,
      dueDate: '2023-12-31',
      repayments: [{ id: 1, paymentDate: '2024-02-15' }]
    } as unknown as ExistingLoans;
    
    const result = categorizeLoanPayment(loan);
    expect(result![0].status).toBe(LOAN_CATEGORY_ENUM.DEFAULTED);
  });
});