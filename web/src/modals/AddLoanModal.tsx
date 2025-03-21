import { useState, useCallback } from "react";

import "../App.css";
import "../styles/Modal.css";
import FormField from "../components/FormField";
import useFetch from "../hooks/useFetch";
import { VITE_API_URL } from "../util/constants";
import LoadingIndicator from "../components/LoadingIndicator";
import {
  validateDate,
  validateName,
  validatePaymentAmount,
} from "../util/helpers";
import { Button } from "../components/Button";

const METHOD = "POST";
const BASE_URL = import.meta.env.VITE_API_URL || VITE_API_URL;

type AddLoanModalProps = {
  onClose: () => void;
};

type NewLoanProps = {
  name: string;
  dueDate: string;
  principal: string;
  interestRate: string;
};

export const AddLoanModal: React.FC<AddLoanModalProps> = ({ onClose }) => {
  const { loading, error: apiError, fetchData } = useFetch();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<NewLoanProps>({
    name: "",
    dueDate: "",
    principal: "",
    interestRate: "",
  });

  const handleChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameError = validateName(formData["name"]);
    const dueDateError = validateDate(formData["dueDate"]);
    const principalError = validatePaymentAmount(formData["principal"]);
    const interestRateError = validatePaymentAmount(formData["interestRate"]);

    if (nameError || dueDateError || principalError || interestRateError) {
      setErrors({
        name: nameError || "",
        dueDate: dueDateError || "",
        principal: principalError || "",
        interestRate: interestRateError || "",
      });
      return;
    }

    await addLoanData(formData);
  };

  const addLoanData = useCallback(async (newLoanObj: NewLoanProps) => {
    try {
      const options = {
        method: METHOD,
        body: JSON.stringify({
          name: newLoanObj.name,
          due_date: newLoanObj.dueDate,
          principal: parseFloat(newLoanObj.principal),
          interest_rate: parseFloat(newLoanObj.interestRate),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      await fetchData(`${BASE_URL}/api/v1/loans`, options);

      setFormData({
        name: "",
        dueDate: "",
        principal: "",
        interestRate: "",
      });

      onClose();
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="header-title ">Add Loan</h2>

      <p className="subtitle-message">
        Add loan is meant to create a record of a newly issue loan
      </p>

      <FormField
        type="text"
        name="name"
        value={formData["name"]}
        onChange={handleChange}
        validate={validateName}
        error={errors["name"]}
        placeholder="Enter loan name"
        required
        disabled={loading}
      />
      <FormField
        type="text"
        name="principal"
        value={formData["principal"]}
        onChange={handleChange}
        validate={validatePaymentAmount}
        error={errors["principal"]}
        placeholder="Enter your principal amount"
        required
        disabled={loading}
      />
      <FormField
        type="text"
        name="interestRate"
        value={formData["interestRate"]}
        onChange={handleChange}
        validate={validatePaymentAmount}
        error={errors["interestRate"]}
        placeholder="Enter interest rate"
        required
        disabled={loading}
      />
      <FormField
        type="date"
        name="dueDate"
        value={formData["dueDate"]}
        onChange={handleChange}
        validate={validateDate}
        error={errors["dueDate"]}
        placeholder=""
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
