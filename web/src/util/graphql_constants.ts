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

/*
 This was added because we added 
 the query ability in the backend
*/

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