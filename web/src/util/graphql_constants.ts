import { gql } from "@apollo/client";

export const GET_LOANS = gql`
  query GetLoans {
    loans {
        id
        name
        interestRate
        principal
        dueDate
        repayments {
          id
          loanId
          amount
          paymentDate
        }
    }
  }
`;

export const GET_LOAN_REPAYMENTS = gql`
  query GetLoanRepayments {
    loanPayments {
        id
        loanId
        amount
        paymentDate
    }
  }
`;