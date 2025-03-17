import { Payment } from "./types"
import { LOAN_CATEGORY_COLORS, LOAN_CATEGORY_ENUM, DATE_REGEX } from "./constants"
import { ExistingLoans, LoanRepayments, Maybe } from "../__generated__/graphql"

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

export function calculateSimpleInterest(
    principal: number,
    rate: number,
    time: number
): number {
    const decimalRate = rate / 100;

    const simpleInterest = principal * decimalRate * time;

    return Math.round(simpleInterest * 100) / 100;
}

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

export const validatePaymentId = (value: string) => {
    if (!value) return "Loan ID is required";
    
    if (!/^\d+$/.test(value)) return "Loan ID must be a number";

    if (parseInt(value, 10) < 0) return "Loan ID cannot be negative";

    return undefined;
}

export const validatePaymentAmount =  (value: string): string | undefined => {
    if (!/^\d*\.?\d+$/.test(value)) return "Payment amount must be a number";
        
    if (parseInt(value, 10) < 0) return "Payment amount cannot be negative";

    return undefined;
}

const getLoanCategory = (dueDateString: string, paymentDateString: string): LOAN_CATEGORY_ENUM => {

    if (!DATE_REGEX.test(dueDateString) || !DATE_REGEX.test(paymentDateString)) {
        return LOAN_CATEGORY_ENUM.UNPAID
    }

    const dueDate: Date = new Date(dueDateString)
    const paymentDate: Date = new Date(paymentDateString)

    const newDueDate = new Date(dueDate)
    newDueDate.setDate(newDueDate.getDate() + 5)

    let dueDateTimeStamp: number = newDueDate.getTime();
    let paymentDateTimeStamp: number = paymentDate.getTime();

    if (dueDateTimeStamp >= paymentDateTimeStamp){
        return LOAN_CATEGORY_ENUM.ON_TIME
    }

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

const isExistingLoanValid = (loan: ExistingLoans): boolean  => {
    if (loan.id === undefined) {
       console.error("loan.id is undefined");
       return false
    }

    if (loan.name === undefined) {
        console.error("loan.name is undefined");
        return false
    }

    if (loan.interestRate === undefined) {
        console.error("loan.interestRate is undefined");
        return false
    }

    if (loan.dueDate === undefined) {
        console.error("loan.dueDate is undefined");
        return false
    }

    if (loan.principal === undefined) {
        console.error("loan.principal is undefined");
        return false
    }

    if (loan.repayments === undefined) {
        console.error("loan.repayments is undefined");
        return false
    }

    return true
}

const isPaymentValid = (payment: Maybe<LoanRepayments>): boolean => {
    if (payment === undefined || payment === null) {
        console.error("payment is undefined or null");
        return false;
    }
    
    if (payment.id === undefined) {
        console.error("payment.id is undefined");
        return false;
    }

    if (payment.paymentDate === undefined) {
        console.error("payment.paymentDate is undefined");
        return false;
    }

    return true;
};
