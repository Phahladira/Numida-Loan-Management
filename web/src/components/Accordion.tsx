import { useQuery } from "@apollo/client";
import React, { useState, useRef, useEffect, useCallback, memo } from "react";

import {
  formatDate,
  getLoanColor,
  categorizeLoanPayment,
} from "../util/helpers";
import "../App.css";

import "../styles/Accordion.css";
import { Payment } from "../util/types";
import { LoanCalculator } from "./LoanCalculator";
import { PULL_LESS_INFO } from "../util/constants";
import { ExistingLoans, LoanRepayments } from "../__generated__/graphql";
import { GET_LOAN_REPAYMENTS_BY_LOAN_ID } from "../util/graphql_constants";
import LoadingIndicator from "./LoadingIndicator";
import DeletePaymentModal from "../modals/DeletePaymentModal";

type AccordionProps = {
  loans: ExistingLoans[];
};

type AccordionSectionProps = {
  loan: ExistingLoans;
  children: React.ReactNode;
};

type PaymentProps = {
  payment: Payment;
  onDeleteButtonClick: (paymentId: number) => void;
};

type AccordionSectionChildProps = {
  loan: ExistingLoans;
  payments: Payment[];
  onDeleteButtonClick: (paymentId: number) => void;
};

const AccordionSection: React.FC<AccordionSectionProps> = memo(
  ({ loan, children }) => {
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
          {isOpen && children}
        </div>
      </div>
    );
  }
);

const AccordionHeader: React.FC = memo(() => {
  return (
    <div className="accordion-header">
      <div className="name-item">Name</div>
      <div className="header-item">Interest Rate</div>
      <div className="header-item">Due Date</div>
      <div className="header-item">Principal</div>
      <div className="header-item">Loan Interest</div>
    </div>
  );
});

const AccordionPaymentItem: React.FC<PaymentProps> = memo(
  ({ payment, onDeleteButtonClick }) => {
    const { id, paymentDate, status } = payment;

    const onDelete = () => {
      onDeleteButtonClick(id);
    };

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
        <div className="loan-category-container">
          <div
            className="loan-category"
            style={{ backgroundColor: getLoanColor(status) }}>
            {status}
          </div>
          <button className="delete-button" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    );
  }
);

export const AccordionSectionChild: React.FC<AccordionSectionChildProps> = memo(
  ({ loan, payments, onDeleteButtonClick }) => {
    const [repayments, setRepayments] = useState<Payment[]>(payments);

    const { loading, error, data } = useQuery<{
      loanPayments: LoanRepayments[];
    }>(GET_LOAN_REPAYMENTS_BY_LOAN_ID, {
      variables: { loanId: loan.id }, // Pass the loanId as a variable
      skip: !PULL_LESS_INFO, // Skip the query if PULL_LESS_INFO is false
    });

    // Transform data when it is returned
    useEffect(() => {
      if (!data || !data.loanPayments || data.loanPayments.length === 0) return;

      const new_existing_loans = { ...loan };
      new_existing_loans.repayments = data.loanPayments;

      const categorizedPayments =
        categorizeLoanPayment(new_existing_loans) || [];

      setRepayments(categorizedPayments);
    }, [data]);

    if (loading) {
      return (
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            flex: 1,
            justifyContent: "center",
          }}>
          <LoadingIndicator />
        </div>
      );
    }

    if (error) {
      return (
        <div>
          <img
            src="/error.svg"
            alt="Error"
            style={{ marginTop: "1rem", width: "100px" }}
          />
          <div>
            <h3>Error: An unexpected error occurred while fetching payments</h3>
            <p className="error-message">{error?.message}</p>
          </div>
        </div>
      );
    }

    if (repayments.length === 0) {
      return (
        <div style={{ marginTop: "1rem" }}>
          <p className="title">No payments available.</p>
        </div>
      );
    }

    return repayments.map((payment) => (
      <AccordionPaymentItem
        key={`${payment.id}-${loan.id}`}
        payment={payment}
        onDeleteButtonClick={onDeleteButtonClick}
      />
    ));
  }
);

const Accordion: React.FC<AccordionProps> = ({ loans }) => {
  const [deletePaymentId, setDeletePaymentId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const onDeleteButtonClick = useCallback((paymentId: number) => {
    setDeletePaymentId(paymentId);
    setIsDeleteModalOpen(true);
  }, []);

  const onCloseDialog = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  return (
    <>
      <div className="accordion-container">
        <AccordionHeader />
        {loans.map((item) => {
          const categorizedPayments: Payment[] = PULL_LESS_INFO
            ? []
            : categorizeLoanPayment(item) || [];

          return (
            <AccordionSection key={`${item.id}-${item.name}`} loan={item}>
              <AccordionSectionChild
                loan={item}
                payments={categorizedPayments}
                onDeleteButtonClick={onDeleteButtonClick}
              />
            </AccordionSection>
          );
        })}
      </div>

      {isDeleteModalOpen && (
        <div className="dialog-backdrop" onClick={onCloseDialog}>
          <div onClick={(e) => e.stopPropagation()}>
            <DeletePaymentModal
              paymentId={deletePaymentId || 0}
              onClose={onCloseDialog}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Accordion;
