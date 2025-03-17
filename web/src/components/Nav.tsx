import React from "react";
import "../App.css";
import "../styles/Nav.css";
import { Button } from "./button";

type NavProps = {
  onAddPaymentClick: () => void;
};

export const Nav: React.FC<NavProps> = ({ onAddPaymentClick }) => {
  return (
    <nav className="container">
      <img src="/logo_numida.png" alt="Numida Logo" className="logo" />
      <Button
        isPrimary
        disabled={false}
        onSubmit={onAddPaymentClick}
        content="Add Payment"
      />
    </nav>
  );
};
