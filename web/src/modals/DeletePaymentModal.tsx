import { memo, useCallback } from "react";

import "../App.css";
import "../styles/Modal.css";
import useFetch from "../hooks/useFetch";
import { Button } from "../components/Button";
import { VITE_API_URL } from "../util/constants";
import LoadingIndicator from "../components/LoadingIndicator";

const METHOD = "DELETE";
const BASE_URL = import.meta.env.VITE_API_URL || VITE_API_URL;

type DeletePaymentModalProps = {
  paymentId: number;
  onClose: () => void;
};

const DeletePaymentModal: React.FC<DeletePaymentModalProps> = memo(
  ({ paymentId, onClose }) => {
    const { loading, error: apiError, fetchData } = useFetch();

    const deletePayment = useCallback(async () => {
      try {
        const options = {
          method: METHOD,
          body: JSON.stringify({
            payment_id: paymentId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        };

        const resp = await fetchData(`${BASE_URL}/api/v1/payments`, options);

        console.log(resp);

        onClose();
      } catch (err) {
        console.error(err);
      }
    }, []);

    return (
      <div className="form-container">
        <h2 className="header-title-2">Delete Payment</h2>

        <p className="subtitle-message">
          You're about to delete a payment transaction log. Are you sure you
          would like to continue with this action?
        </p>

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
            onSubmit={deletePayment}
          />
        </div>
      </div>
    );
  }
);

export default DeletePaymentModal;
