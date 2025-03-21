import { useState, useCallback } from "react";

import "../App.css";
import "../styles/Modal.css";
import useFetch from "../hooks/useFetch";
import { Button } from "../components/Button";
import FormField from "../components/FormField";
import { VITE_API_URL } from "../util/constants";
import LoadingIndicator from "../components/LoadingIndicator";
import { validatePassword, validateUsername } from "../util/helpers";

const METHOD = "POST";
const BASE_URL = import.meta.env.VITE_API_URL || VITE_API_URL;

type SignUpModalProps = {
  onClose: () => void;
};

type SignUpProps = {
  username: string;
  password: string;
};

export const SignUpModal: React.FC<SignUpModalProps> = ({ onClose }) => {
  const { loading, error: apiError, fetchData } = useFetch();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<SignUpProps>({
    username: "",
    password: "",
  });

  const handleChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const usernameError = validateUsername(formData["username"]);
    const passwordError = validatePassword(formData["password"]);

    if (usernameError || passwordError) {
      setErrors({
        username: usernameError || "",
        password: passwordError || "",
      });
      return;
    }

    await SignUpData(formData);
  };

  const SignUpData = useCallback(async (credentials: SignUpProps) => {
    try {
      const options = {
        method: METHOD,
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      await fetchData(`${BASE_URL}/api/v1/auth/sign-up`, options);

      setFormData({
        username: "",
        password: "",
      });

      onClose();
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="title-container">
        <img src="/logo_numida.png" alt="Numida Logo" className="logo" />

        <h3 className="header-title-2">Welcome</h3>

        <p className="subtitle-message">
          Sign up to Lumida loans to start managing unsecured business loans
        </p>
      </div>

      <FormField
        type="text"
        name="username"
        value={formData["username"]}
        onChange={handleChange}
        validate={validateUsername}
        error={errors["username"]}
        placeholder="Enter username"
        required
        disabled={loading}
      />
      <FormField
        type="password"
        name="password"
        value={formData["password"]}
        onChange={handleChange}
        validate={validatePassword}
        error={errors["password"]}
        placeholder="Enter password"
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
          content="Sign Up"
        />
      </div>
    </form>
  );
};
