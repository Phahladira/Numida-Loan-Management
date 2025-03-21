import { memo } from "react";
import { useQuery } from "@apollo/client";

import {
  GET_LOANS,
  GET_LOANS_WITHOUT_REPAYMENTS,
} from "../util/graphql_constants";
import "../styles/Loans.css";
import Accordion from "./Accordion";
import LoadingIndicator from "./LoadingIndicator";
import { ExistingLoans } from "../__generated__/graphql";
import { validateLoan } from "../util/helpers";
import { PULL_LESS_INFO } from "../util/constants";

/*
  NB: Made this a react.memo to avoid
  uneccessary rerenders when the modal state
  changes as a result of usage.
  This is in consideration with the fact that
  The loans component could grow to be large, 
  given it's data.
*/
const Loans: React.FC = memo(() => {
  const { loading, error, data } = useQuery<{ loans: ExistingLoans[] }>(
    PULL_LESS_INFO ? GET_LOANS_WITHOUT_REPAYMENTS : GET_LOANS
  );

  if (loading) {
    return (
      <div className="loans_container">
        <div style={{ marginTop: "2rem" }}>
          <LoadingIndicator />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loans_container">
        <img
          src="/error.svg"
          alt="Error"
          style={{ marginTop: "2rem", width: "250px" }}
        />
        <div>
          <h2>Error: An unexpected error occurred</h2>
          <p className="error-message">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data || !data.loans || data.loans.length === 0) {
    return (
      <div className="loans_container">
        <img
          src="/empty_list.svg"
          alt="Empty List"
          style={{ marginTop: "2rem", width: "250px" }}
        />
        <div>
          <h2>No loans available</h2>
        </div>
      </div>
    );
  }

  const transformedLoans: ExistingLoans[] = data.loans
    .map((loan) => validateLoan(loan))
    .filter((loan): loan is ExistingLoans => loan !== null);

  return <Accordion loans={transformedLoans} />;
});

export default Loans;
