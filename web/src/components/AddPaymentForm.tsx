import { useState, useCallback } from "react";

import "../App.css";
import FormField from "./FormField";
import "../styles/AddPaymentForm.css";
import useFetch from "../hooks/useFetch";
import { VITE_API_URL } from "../util/constants";
import LoadingIndicator from "./LoadingIndicator";
import { validatePaymentId, validatePaymentAmount } from "../util/helpers";
import { Button } from "./button";

const METHOD = "POST";
const BASE_URL = import.meta.env.VITE_API_URL || VITE_API_URL;

type AddPaymentModalProps = {
  onClose: () => void;
};

type NewPaymentProps = {
  loanId: string;
  paymentAmount: string;
};

export const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  onClose,
}) => {
  const { loading, error: apiError, fetchData } = useFetch();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<NewPaymentProps>({
    loanId: "",
    paymentAmount: "",
  });

  const handleChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const paymentIdError = validatePaymentId(formData["loanId"]);
    const paymentAmountError = validatePaymentAmount(formData["paymentAmount"]);

    if (paymentIdError || paymentAmountError) {
      setErrors({
        loanId: paymentIdError || "",
        paymentAmount: paymentAmountError || "",
      });
      return;
    }

    await addPaymentData(formData);
  };

  const addPaymentData = useCallback(async (newPaymentObj: NewPaymentProps) => {
    try {
      const options = {
        method: METHOD,
        body: JSON.stringify({
          loan_id: parseInt(newPaymentObj.loanId),
          amount: parseFloat(newPaymentObj.paymentAmount),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      await fetchData(`${BASE_URL}/v1/payments`, options);

      setFormData({
        loanId: "",
        paymentAmount: "",
      });

      onClose();
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="header-title ">Add Payment</h2>

      <p className="subtitle-message">
        Add payment is meant to be used to create a link between a loan and its
        payment using the loan's id.
      </p>

      <FormField
        type="text"
        name="loanId"
        value={formData["loanId"]}
        onChange={handleChange}
        validate={validatePaymentId}
        error={errors["loanId"]}
        placeholder="Enter your loan id"
        required
        disabled={loading}
      />
      <FormField
        type="text"
        name="paymentAmount"
        value={formData["paymentAmount"]}
        onChange={handleChange}
        validate={validatePaymentAmount}
        error={errors["paymentAmount"]}
        placeholder="Enter your payment amount"
        required
        disabled={loading}
      />

      {loading && <LoadingIndicator />}

      {apiError && <p className="error-message">{apiError}</p>}

      <div className="button-container">
        <Button
          isFlex
          isPrimary={false}
          disabled={loading}
          onSubmit={onClose}
          content="Close"
        />

        <Button
          isFlex
          isPrimary
          type="submit"
          disabled={loading}
          content="Confirm"
        />
      </div>
    </form>
  );
};
