import React from "react";
import "../App.css";
import "../styles/Nav.css";

type NavProps = {
  onAddPaymentClick: () => void;
};

export const Nav: React.FC<NavProps> = ({ onAddPaymentClick }) => {
  return (
    <nav className="container">
      <img src="/logo_numida.png" alt="Numida Logo" className="logo" />
      <button type="button" className="primary-btn" onClick={onAddPaymentClick}>
        Add Payment
      </button>
    </nav>
  );
};
