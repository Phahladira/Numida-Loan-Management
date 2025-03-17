import React, { useState, useRef, useEffect } from "react";

import "../styles/Accordion.css";
import { Payment } from "../util/types";
import { LoanCalculator } from "./LoanCalculator";
import { ExistingLoans } from "../__generated__/graphql";
import {
  categorizeLoanPayment,
  formatDate,
  getLoanColor,
} from "../util/helpers";

type AccordionProps = {
  loans: ExistingLoans[];
};

type AccordionSectionProps = {
  loan: ExistingLoans;
  children: React.ReactNode;
};

type PaymentProps = {
  payment: Payment;
};

const AccordionSection: React.FC<AccordionSectionProps> = ({
  loan,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState("0px");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `100%` : "0px");
    }
  }, [isOpen, children]);

  return (
    <div style={{ marginBottom: "12px", minWidth: "100%" }}>
      <div
        className={`accordion-card ${isOpen ? "open" : "closed"}`}
        onClick={() => setIsOpen(!isOpen)}>
        <div className="accordion-card-content">
          <div className="name-item">
            <img
              src="arrow.svg"
              alt="arrow"
              className={`arrow-icon ${isOpen ? "rotate" : ""}`}
            />
            <h3 className="title">{loan.name}</h3>
          </div>
          <div className="accordion-card-item">
            <p className="title">{loan.interestRate}%</p>
          </div>
          <div className="accordion-card-item">
            <p className="title">{formatDate(loan.dueDate)}</p>
          </div>
          <div className="accordion-card-item">
            <p className="title">R{loan.principal}</p>
          </div>
          <div className="accordion-card-item">
            <LoanCalculator
              rate={loan.interestRate!}
              principal={loan.principal!}
            />
          </div>
        </div>
      </div>

      <div
        ref={contentRef}
        style={{ height: height }}
        className="accordion-children">
        {children}
      </div>
    </div>
  );
};

const AccordionHeader: React.FC = () => {
  return (
    <div className="accordion-header">
      <div className="name-item">Name</div>
      <div className="header-item">Interest Rate</div>
      <div className="header-item">Due Date</div>
      <div className="header-item">Principal</div>
      <div className="header-item">Loan Interest</div>
    </div>
  );
};

const AccordionPaymentItem: React.FC<PaymentProps> = ({ payment }) => {
  const { id, paymentDate, status } = payment;

  return (
    <div className="payment-container">
      <div className="name-container">
        <img src="currency.svg" alt="currency" className="currency-icon" />
        <p className="title">Payment ID: #{id}</p>
      </div>
      {!isNaN(paymentDate.getTime()) && (
        <p className="date-subtitle">
          Date Paid: {formatDate(paymentDate.toDateString())}
        </p>
      )}

      <div
        className="loan-category"
        style={{ backgroundColor: getLoanColor(status) }}>
        {status}
      </div>
    </div>
  );
};

const Accordion: React.FC<AccordionProps> = ({ loans }) => {
  return (
    <div className="accordion-container">
      <AccordionHeader />
      {loans.map((item) => {
        const categorizedPayments: Payment[] =
          categorizeLoanPayment(item) || [];

        return (
          <AccordionSection key={`${item.id}-${item.name}`} loan={item}>
            {categorizedPayments && categorizedPayments.length > 0 ? (
              categorizedPayments.map((payment, index) => (
                <AccordionPaymentItem key={index} payment={payment} />
              ))
            ) : (
              <div style={{ marginTop: "1rem" }}>
                <p className="title">No payments available.</p>
              </div>
            )}
          </AccordionSection>
        );
      })}
    </div>
  );
};

export default Accordion;
