"use client";

import React from "react";
import { CurrencySymbol } from "@/types/budget";

interface ResultSummaryProps {
  totalExpenses: number;
  remaining: number;
  currency: CurrencySymbol;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({
  totalExpenses,
  remaining,
  currency,
}) => {
  return (
    <section className="glass-card result-section" id="resultSection">
      <h2><i className="fa-solid fa-calculator"></i> Summary</h2>
      <div className="result-row">
        <span>Total Expenses</span>
        <span className="result-value expense-color" id="total">
          <span className="curr-symbol">{currency}</span> {totalExpenses.toLocaleString()}
        </span>
      </div>
      <div className="result-divider"></div>
      <div className="result-row">
        <span>Remaining Balance</span>
        <span className="result-value remaining-color" id="remaining">
          <span className="curr-symbol">{currency}</span> {remaining.toLocaleString()}
        </span>
      </div>
    </section>
  );
};
