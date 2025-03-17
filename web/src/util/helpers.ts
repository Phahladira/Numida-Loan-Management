import { Payment } from "./types"
import { LOAN_CATEGORY_COLORS, LOAN_CATEGORY_ENUM, DATE_REGEX } from "./constants"
import { ExistingLoans, LoanRepayments, Maybe } from "../__generated__/graphql"

// This function is meant to return the relevant colour
// based on the payment status
export const getLoanColor = (status: LOAN_CATEGORY_ENUM): LOAN_CATEGORY_COLORS => {

    if (status === LOAN_CATEGORY_ENUM.UNPAID) return LOAN_CATEGORY_COLORS.GREY

    if (status === LOAN_CATEGORY_ENUM.ON_TIME)  return LOAN_CATEGORY_COLORS.GREEN

    if (status === LOAN_CATEGORY_ENUM.LATE) return LOAN_CATEGORY_COLORS.ORANGE

    if (status === LOAN_CATEGORY_ENUM.DEFAULTED)return LOAN_CATEGORY_COLORS.RED

    return LOAN_CATEGORY_COLORS.GREY
}


export const validateLoan = (loan: ExistingLoans): ExistingLoans | null => {

    if (!loan || !isExistingLoanValid(loan)) {
        console.error("Loan item is null or invalid");
        return null;
    }

    return loan
};

/*
    This function is meant to ensure the repayments of loans
    are valid and to create the new object with the Payment
    status:

    {
       id: 1,
       name: "Tom's Loan",
       interest_rate: 5.0,
       principal: 10000,
       dueDate: "2025-03-01",
       paymentDate: "2025-03-04",
       status: "On Time",
     }
*/
export const categorizeLoanPayment = (loan: ExistingLoans): Payment[] | null => {

    if (loan.repayments?.some(payment => !isPaymentValid(payment))) {
        console.error("One or more payments are invalid");
        return null;
    }

    const payments: Payment[] = (loan.repayments || []).map(payment => ({
        name: loan?.name || "",
        id: payment?.id || 0,
        principal: loan?.principal || 0,
        interestRate: loan?.interestRate || 0,
        dueDate: new Date(loan?.dueDate || ""),
        paymentDate: new Date(payment?.paymentDate || ""),
        status: getLoanCategory(loan.dueDate || "", payment?.paymentDate || ""),
    }));

    return payments
}

// This function is meant to calculate simple interest
export function calculateSimpleInterest(
    principal: number,
    rate: number,
    time: number
): number {
    const decimalRate = rate / 100;

    const simpleInterest = principal * decimalRate * time;

    return Math.round(simpleInterest * 100) / 100;
}

// This function is meant to calculate compound interest
export function calculateCompoundInterest(
    principal: number,
    rate: number,
    time: number,
    compoundingFrequency: number = 1
): number {
    const decimalRate = rate / 100;

    const compoundInterest =
        principal * Math.pow(1 + decimalRate / compoundingFrequency, compoundingFrequency * time) - principal;

    return Math.round(compoundInterest * 100) / 100;
}

/*
    This function is meant to take a string date
    and format it into this format: 01 March 2025
*/
export function formatDate(dateStr: string): string {

    if (!dateStr) {
        console.error("Date string is null");

        return ""
    }

    const dateObj = new Date(dateStr);

    if (isNaN(dateObj.getTime())) {
        console.error("Invalid date string");

        return ""
    }

    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = dateObj.toLocaleString("default", { month: "long" });
    const year = dateObj.getFullYear();

    return `${day} ${month} ${year}`;
}

/*
    This function is used to validate the ID
    value being used to ensure it meets our criteria
    and to avoid bad values. It ensures that the ID
    is a number and equal/larger than 0
*/
export const validatePaymentId = (value: string) => {
    if (!value) return "Loan ID is required";
    
    if (!/^\d+$/.test(value)) return "Loan ID must be a number";

    if (parseInt(value, 10) < 0) return "Loan ID cannot be negative";

    return undefined;
}

/*
    This function is used to validate the amount
    value being used to ensure it meets our criteria
    and to avoid bad values. It ensures that the amount
    is a number and larger than 0
*/
export const validatePaymentAmount =  (value: string): string | undefined => {
    if (!value) return "Payment amount is required";

    if (!/^\d*\.?\d+$/.test(value)) return "Payment amount must be a number";
        
    if (parseInt(value, 10) < 0) return "Payment amount cannot be negative";

    return undefined;
}

/*
    This function is used to get which category 
    a loan's payment falls into. 
*/
const getLoanCategory = (dueDateString: string, paymentDateString: string): LOAN_CATEGORY_ENUM => {

    // This checks to enusure that both dates are well formatted and valid
    // This is before we can use them and transform them
    if (!DATE_REGEX.test(dueDateString) || !DATE_REGEX.test(paymentDateString)) {
        return LOAN_CATEGORY_ENUM.UNPAID
    }

    const dueDate: Date = new Date(dueDateString)
    const paymentDate: Date = new Date(paymentDateString)

    /*
        This is created to add 5 days to the initial
        due date because we need to know if the payment
        false into this category or not
    */
    const newDueDate = new Date(dueDate)
    newDueDate.setDate(newDueDate.getDate() + 5)

    let dueDateTimeStamp: number = newDueDate.getTime();
    let paymentDateTimeStamp: number = paymentDate.getTime();

    if (dueDateTimeStamp >= paymentDateTimeStamp){
        return LOAN_CATEGORY_ENUM.ON_TIME
    }

    /*
        This get's the difference between two dates and
        calculates the time difference between the two dates
        in days that is
     */
    let differenceBetweenDatesInTime = paymentDate.getTime() - dueDate.getTime();
    let differenceBetweenDatesInDays = Math.round(differenceBetweenDatesInTime / (1000 * 3600 * 24));

    if (differenceBetweenDatesInDays >=6 &&  differenceBetweenDatesInDays <= 30) {
        return LOAN_CATEGORY_ENUM.LATE
    }

    if (differenceBetweenDatesInDays > 30) {
        return LOAN_CATEGORY_ENUM.DEFAULTED
    }

    return LOAN_CATEGORY_ENUM.UNPAID
}

/*
    This function is used to validate whether a loan 
    is valid/has relevant information or not. If it doesn't
    it logs an error and returns false
*/
const isExistingLoanValid = (loan: ExistingLoans): boolean  => {
    if (loan.id === undefined) {
       console.error("The loan id is undefined");
       return false
    }

    if (loan.name === undefined) {
        console.error("The loan name is undefined");
        return false
    }

    if (loan.interestRate === undefined) {
        console.error("The loan interestRate is undefined");
        return false
    }

    if (loan.dueDate === undefined) {
        console.error("The loan dueDate is undefined");
        return false
    }

    if (loan.principal === undefined) {
        console.error("The loan principal is undefined");
        return false
    }

    if (loan.repayments === undefined) {
        console.error("The loan repayments is undefined");
        return false
    }

    return true
}

/*
    This function is used to validate whether a payment 
    is valid/has relevant information or not. If it doesn't
    it logs an error and returns false
*/
const isPaymentValid = (payment: Maybe<LoanRepayments>): boolean => {
    if (payment === undefined || payment === null) {
        console.error("payment is undefined or null");
        return false;
    }
    
    if (payment.id === undefined) {
        console.error("The payment id is undefined");
        return false;
    }

    if (payment.loanId === undefined) {
        console.error("The payment load id is undefined");
        return false;
    }

    if (payment.paymentDate === undefined) {
        console.error("The payment date is undefined");
        return false;
    }

    return true;
};
