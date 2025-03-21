import { useState, useCallback } from "react";

import "./App.css";
import Loans from "./components/Loans";
import { Nav } from "./components/Nav";
import { LoginModal } from "./modals/LoginModal";
import { SignUpModal } from "./modals/SignUpModal";
import { AddPaymentModal } from "./modals/AddPaymentModal";
import { useAuth } from "./context/AuthContext";
import HowTo from "./components/HowTo";
import { AddLoanModal } from "./modals/AddLoanModal";

function App() {
  const { isAuthenticated } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false);
  const [isAddLoanDialogOpen, setIsAddLoanDialogOpen] = useState(false);

  const handleAddPaymentClick = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const handleLoginClick = useCallback(() => {
    setIsLoginDialogOpen(true);
  }, []);

  const handleLoginCloseDialog = useCallback(() => {
    setIsLoginDialogOpen(false);
  }, []);

  const handleSignUpClick = useCallback(() => {
    setIsSignUpDialogOpen(true);
  }, []);

  const handleSignUpCloseDialog = useCallback(() => {
    setIsSignUpDialogOpen(false);
  }, []);

  const handleAddLoanClick = useCallback(() => {
    setIsAddLoanDialogOpen(true);
  }, []);

  const handleAddLoanCloseDialog = useCallback(() => {
    setIsAddLoanDialogOpen(false);
  }, []);

  return (
    <div className="app">
      <Nav
        onLoginClick={handleLoginClick}
        onSignUpClick={handleSignUpClick}
        onAddLoanClick={handleAddLoanClick}
        onAddPaymentClick={handleAddPaymentClick}
      />

      <section className="section">
        <div className="animate-container">
          <h1 className="header-text">
            Numida Loans
            <br className="breaker-text" />
            <span className="blue-gradient">Unsecured Business Loans</span>
          </h1>
        </div>
        <div className="line" />
        <div className="animate-container">
          <p className="desc">
            Numida Loans is a proprietary application used to track loan
            repayments, for unsecured business loans delivered in 24 hours
          </p>
        </div>

        {isAuthenticated ? <Loans /> : <HowTo />}
      </section>

      {isDialogOpen && (
        <div className="dialog-backdrop" onClick={handleCloseDialog}>
          <div onClick={(e) => e.stopPropagation()}>
            <AddPaymentModal onClose={handleCloseDialog} />
          </div>
        </div>
      )}

      {isAddLoanDialogOpen && (
        <div className="dialog-backdrop" onClick={handleAddLoanCloseDialog}>
          <div onClick={(e) => e.stopPropagation()}>
            <AddLoanModal onClose={handleAddLoanCloseDialog} />
          </div>
        </div>
      )}

      {isLoginDialogOpen && (
        <div className="dialog-backdrop" onClick={handleLoginCloseDialog}>
          <div onClick={(e) => e.stopPropagation()}>
            <LoginModal onClose={handleLoginCloseDialog} />
          </div>
        </div>
      )}

      {isSignUpDialogOpen && (
        <div className="dialog-backdrop" onClick={handleSignUpCloseDialog}>
          <div onClick={(e) => e.stopPropagation()}>
            <SignUpModal onClose={handleSignUpCloseDialog} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
