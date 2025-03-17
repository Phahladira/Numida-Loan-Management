import React, { useEffect, useState } from "react";

import {
  calculateSimpleInterest,
  calculateCompoundInterest,
} from "../util/helpers";
import "../styles/Accordion.css";

type LoanCalculatorProps = {
  principal: number;
  rate: number;
  months?: number;
  interestType?: "SIMPLE" | "COMPOUND";
};

export const LoanCalculator: React.FC<LoanCalculatorProps> = ({
  principal,
  rate,
  months = 12,
  interestType = "SIMPLE",
}) => {
  const [interest, setInterest] = useState(0);

  useEffect(() => {
    if (interestType === "COMPOUND")
      setInterest(calculateCompoundInterest(principal, rate, months / 12));
    else setInterest(calculateSimpleInterest(principal, rate, months / 12));
  }, []);

  return (
    <>
      <p className="title">R{interest}</p>
    </>
  );
};
