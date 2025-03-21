import React, { useCallback, memo } from "react";

import "../App.css";
import "../styles/Nav.css";
import { Button } from "./Button";
import useFetch from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";
import { VITE_API_URL } from "../util/constants";

const METHOD = "GET";
const BASE_URL = import.meta.env.VITE_API_URL || VITE_API_URL;

type NavProps = {
  onLoginClick: () => void;
  onSignUpClick: () => void;
  onAddLoanClick: () => void;
  onAddPaymentClick: () => void;
};

export const Nav: React.FC<NavProps> = memo(
  ({ onAddPaymentClick, onLoginClick, onSignUpClick, onAddLoanClick }) => {
    const { isAuthenticated, logout } = useAuth();
    const { fetchData } = useFetch();

    const logoutFunc = useCallback(async () => {
      try {
        const options = {
          method: METHOD,
          headers: {
            "Content-Type": "application/json",
          },
        };

        console.log(await fetchData(`${BASE_URL}/api/v1/auth/logout`, options));

        logout(); // Update authentication state
      } catch (err) {
        console.error(err);
      }
    }, []);

    return (
      <nav className="container">
        <img src="/logo_numida.png" alt="Numida Logo" className="logo" />

        {isAuthenticated ? (
          <div
            style={{
              gap: "0.5rem",
              display: "flex",
            }}>
            <Button
              isPrimary
              disabled={false}
              onSubmit={onAddPaymentClick}
              content="Add Payment"
            />
            <Button
              isPrimary={false}
              isSecondary
              disabled={false}
              onSubmit={onAddLoanClick}
              content="Add Loan"
            />
            <Button
              isPrimary={false}
              disabled={false}
              onSubmit={logoutFunc}
              content="Logout"
            />
          </div>
        ) : (
          <div
            style={{
              gap: "0.5rem",
              display: "flex",
            }}>
            <Button
              isPrimary
              disabled={false}
              onSubmit={onLoginClick}
              content="Login"
            />
            <Button
              isPrimary={false}
              disabled={false}
              onSubmit={onSignUpClick}
              content="Sign Up"
            />
          </div>
        )}
      </nav>
    );
  }
);
