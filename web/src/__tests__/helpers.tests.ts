import {
  getLoanColor,
  validateLoan,
  categorizeLoanPayment,
  calculateSimpleInterest,
  calculateCompoundInterest,
  formatDate,
  validateName,
  validateUsername,
  validatePassword,
  validatePaymentId,
  validatePaymentAmount,
  validateDate,
  getTokens,
} from "../util/helpers";
import { LOAN_CATEGORY_COLORS, LOAN_CATEGORY_ENUM } from "../util/constants";
import { ExistingLoans } from "../__generated__/graphql";

describe("getLoanColor", () => {
  it("should return GREY for UNPAID status", () => {
    expect(getLoanColor(LOAN_CATEGORY_ENUM.UNPAID)).toBe(LOAN_CATEGORY_COLORS.GREY);
  });

  it("should return GREEN for ON_TIME status", () => {
    expect(getLoanColor(LOAN_CATEGORY_ENUM.ON_TIME)).toBe(LOAN_CATEGORY_COLORS.GREEN);
  });

  it("should return ORANGE for LATE status", () => {
    expect(getLoanColor(LOAN_CATEGORY_ENUM.LATE)).toBe(LOAN_CATEGORY_COLORS.ORANGE);
  });

  it("should return RED for DEFAULTED status", () => {
    expect(getLoanColor(LOAN_CATEGORY_ENUM.DEFAULTED)).toBe(LOAN_CATEGORY_COLORS.RED);
  });

  it("should return GREY for unknown status", () => {
    expect(getLoanColor("UNKNOWN_STATUS" as LOAN_CATEGORY_ENUM)).toBe(LOAN_CATEGORY_COLORS.GREY);
  });
});

describe("validateLoan", () => {
  const validLoan: ExistingLoans = {
    id: 1,
    name: "Test Loan",
    interestRate: 5.0,
    dueDate: "2025-03-01",
    principal: 10000,
  };

  it("should return the loan if it is valid", () => {
    expect(validateLoan(validLoan)).toEqual(validLoan);
  });

  it("should return null if the loan is missing required fields", () => {
    const invalidLoan = { ...validLoan, id: undefined };
    expect(validateLoan(invalidLoan)).toBeNull();
  });
});

describe("categorizeLoanPayment", () => {
  const validLoan: ExistingLoans = {
    id: 1,
    name: "Test Loan",
    interestRate: 5.0,
    dueDate: "2025-03-01",
    principal: 10000,
    repayments: [
      {
        id: 1,
        loanId: 1,
        paymentDate: "2025-03-04",
      },
    ],
  };

  it("should return categorized payments for a valid loan", () => {
    const result = categorizeLoanPayment(validLoan);
    expect(result).toEqual([
      {
        id: 1,
        name: "Test Loan",
        principal: 10000,
        interestRate: 5.0,
        dueDate: new Date("2025-03-01"),
        paymentDate: new Date("2025-03-04"),
        status: LOAN_CATEGORY_ENUM.ON_TIME,
      },
    ]);
  });

  it("should return null if any payment is invalid", () => {
    const invalidLoan = { ...validLoan, repayments: [{ id: 1 }] };
    expect(categorizeLoanPayment(invalidLoan)).toBeNull();
  });

  it("should return null if repayments are missing", () => {
    const invalidLoan = { ...validLoan, repayments: undefined };
    expect(categorizeLoanPayment(invalidLoan)).toStrictEqual([]);
  });
});

describe("calculateSimpleInterest", () => {
  it("should calculate simple interest correctly", () => {
    expect(calculateSimpleInterest(1000, 5, 2)).toBe(100);
  });

  it("should return 0 if principal is 0", () => {
    expect(calculateSimpleInterest(0, 5, 2)).toBe(0);
  });

  it("should return 0 if rate is 0", () => {
    expect(calculateSimpleInterest(1000, 0, 2)).toBe(0);
  });

  it("should return 0 if time is 0", () => {
    expect(calculateSimpleInterest(1000, 5, 0)).toBe(0);
  });
});

describe("calculateCompoundInterest", () => {
  it("should calculate compound interest correctly", () => {
    expect(calculateCompoundInterest(1000, 5, 2)).toBe(102.5);
  });

  it("should return 0 if principal is 0", () => {
    expect(calculateCompoundInterest(0, 5, 2)).toBe(0);
  });

  it("should return 0 if rate is 0", () => {
    expect(calculateCompoundInterest(1000, 0, 2)).toBe(0);
  });

  it("should return 0 if time is 0", () => {
    expect(calculateCompoundInterest(1000, 5, 0)).toBe(0);
  });
});

describe("formatDate", () => {
  it("should format a valid date string", () => {
    expect(formatDate("2025-03-01")).toBe("01 March 2025");
  });

  it("should return an empty string for an invalid date string", () => {
    expect(formatDate("invalid-date")).toBe("");
  });

  it("should return an empty string for an empty date string", () => {
    expect(formatDate("")).toBe("");
  });
});

describe("validateName", () => {
  it("should return undefined for a valid name", () => {
    expect(validateName("John")).toBeUndefined();
  });

  it("should return an error message for a name shorter than 3 characters", () => {
    expect(validateName("Jo")).toBe("Username needs to be at least 3 chars long");
  });

  it("should return an error message for a name longer than 20 characters", () => {
    expect(validateName("JohnDoeJohnDoeJohnDoeJohnDoe")).toBe("Username needs to be at most 20 chars long");
  });
});

describe("validateUsername", () => {
  it("should return undefined for a valid username", () => {
    expect(validateUsername("john_doe")).toBeUndefined();
  });

  it("should return an error message for an invalid username", () => {
    expect(validateUsername("john@doe")).toBe("Username is invalid");
  });

  it("should return an error message for a username shorter than 3 characters", () => {
    expect(validateUsername("jo")).toBe("Username needs to be at least 3 chars long");
  });

  it("should return an error message for a username longer than 20 characters", () => {
    expect(validateUsername("john_doe_john_doe_john_doe")).toBe("Username needs to be at most 20 chars long");
  });
});

describe("validatePassword", () => {
  it("should return undefined for a valid password", () => {
    expect(validatePassword("123456")).toBeUndefined();
  });

  it("should return an error message for a password shorter than 6 characters", () => {
    expect(validatePassword("12345")).toBe("Passwird must be at least 6 chars long");
  });
});

describe("validatePaymentId", () => {
  it("should return undefined for a valid payment ID", () => {
    expect(validatePaymentId("123")).toBeUndefined();
  });

  it("should return an error message for a non-numeric payment ID", () => {
    expect(validatePaymentId("abc")).toBe("Loan ID must be a number");
  });

  it("should return an error message for a negative payment ID", () => {
    expect(validatePaymentId("-1")).toBe("Loan ID must be a number");
  });

  it("should return an error message for an empty payment ID", () => {
    expect(validatePaymentId("")).toBe("Loan ID is required");
  });
});

describe("validatePaymentAmount", () => {
  it("should return undefined for a valid payment amount", () => {
    expect(validatePaymentAmount("100.50")).toBeUndefined();
  });

  it("should return an error message for a non-numeric payment amount", () => {
    expect(validatePaymentAmount("abc")).toBe("Payment amount must be a number");
  });

  it("should return an error message for a negative payment amount", () => {
    expect(validatePaymentAmount("-1")).toBe("Payment amount must be a number");
  });

  it("should return an error message for an empty payment amount", () => {
    expect(validatePaymentAmount("")).toBe("Payment amount is required");
  });
});

describe("validateDate", () => {
  it("should return undefined for a valid future date", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    expect(validateDate(futureDate.toISOString().split("T")[0])).toBeUndefined();
  });

  it("should return an error message for a past date", () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    expect(validateDate(pastDate.toISOString().split("T")[0])).toBe("Date is invalid");
  });

  it("should return an error message for an invalid date string", () => {
    expect(validateDate("invalid-date")).toBe("Date is invalid");
  });
});
