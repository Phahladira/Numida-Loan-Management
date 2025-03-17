import { useState, useCallback } from "react";

import "./App.css";
import Loans from "./components/Loans";
import { Nav } from "./components/Nav";
import { AddNewPaymentForm } from "./components/AddPaymentForm";

function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddPaymentClick = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  return (
    <div className="app">
      <Nav onAddPaymentClick={handleAddPaymentClick} />

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
            repayments, for unsecured business loans
          </p>
        </div>

        <Loans />
      </section>

      {isDialogOpen && (
        <div className="dialog-backdrop" onClick={handleCloseDialog}>
          <div onClick={(e) => e.stopPropagation()}>
            <AddNewPaymentForm onClose={handleCloseDialog} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
