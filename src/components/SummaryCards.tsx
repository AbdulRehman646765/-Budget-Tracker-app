"use client";

import React from "react";
import { CurrencySymbol } from "@/types/budget";

interface SummaryCardsProps {
  salary: number;
  expenses: number;
  remaining: number;
  currency: CurrencySymbol;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  salary,
  expenses,
  remaining,
  currency,
}) => {
  return (
    <section className="summary-cards" id="summaryCards">
      <div className="summary-card card-income">
        <div className="card-icon"><i className="fa-solid fa-arrow-trend-up"></i></div>
        <div className="card-info">
          <span className="card-label">Income</span>
          <span className="card-value" id="salaryCard"><span className="curr-symbol">{currency}</span> {salary.toLocaleString()}</span>
        </div>
      </div>
      <div className="summary-card card-expense">
        <div className="card-icon"><i className="fa-solid fa-arrow-trend-down"></i></div>
        <div className="card-info">
          <span className="card-label">Expenses</span>
          <span className="card-value" id="expenseCard"><span className="curr-symbol">{currency}</span> {expenses.toLocaleString()}</span>
        </div>
      </div>
      <div className="summary-card card-remaining">
        <div className="card-icon"><i className="fa-solid fa-piggy-bank"></i></div>
        <div className="card-info">
          <span className="card-label">Remaining</span>
          <span className="card-value" id="remainingCard"><span className="curr-symbol">{currency}</span> {remaining.toLocaleString()}</span>
        </div>
      </div>
    </section>
  );
};
