import { memo } from "react";
import { useQuery } from "@apollo/client";

import "../styles/Loans.css";
import Accordion from "./Accordion";
import LoadingIndicator from "./LoadingIndicator";
import { GET_LOANS } from "../util/graphql_constants";
import { ExistingLoans } from "../__generated__/graphql";
import { validateLoan } from "../util/helpers";

const Loans: React.FC = memo(() => {
  const { loading, error, data } = useQuery<{ loans: ExistingLoans[] }>(
    GET_LOANS
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
          <p>{error.message}</p>
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
