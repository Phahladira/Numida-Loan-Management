import { gql } from "@apollo/client";

/*
 This is the GraphQL query to get loans
*/

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

export const GET_LOANS_WITHOUT_REPAYMENTS = gql`
  query GetLoans {
    loans {
        id
        name
        interestRate
        principal
        dueDate
    }
  }
`;

/*
 This was added because we added 
 the query ability in the backend
*/

export const GET_LOAN_REPAYMENTS_BY_LOAN_ID = gql`
  query GetLoanRepayments($loanId: Int) {
    loanPayments(loanId: $loanId) {
      id
      loanId
      amount
      paymentDate
    }
  }
`;