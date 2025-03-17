import { LOAN_CATEGORY_ENUM } from "./constants";

export type AddPaymentProps = {
  loan_id: number;
  amount: number;
};

export type Payment = {
  id: number;
  name: string;
  dueDate: Date;
  interestRate: number;
  principal: number;
  paymentDate: Date;
  status: LOAN_CATEGORY_ENUM;
}

export type FormFieldProps = {
  type?: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  placeholder?: string;
  required?: boolean;
  validate?: (value: string) => string | undefined;
  error?: string;
  disabled?: boolean;
};
