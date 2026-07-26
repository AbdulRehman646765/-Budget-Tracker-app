"use client";

import React from "react";
import { CurrencySymbol, MonthlySummary } from "@/types/budget";

interface MonthlyComparisonProps {
  monthlyHistory: MonthlySummary[];
  currency: CurrencySymbol;
  onClear: () => void;
  hideAmounts?: boolean;
}

export const MonthlyComparison: React.FC<MonthlyComparisonProps> = ({
  monthlyHistory,
  currency,
  onClear,
  hideAmounts = false,
}) => {
  const maxExpense = Math.max(...monthlyHistory.map((m) => m.expense), 1);

  return (
    <section
      className="glass-card comparison-section tool-card"
      id="comparisonSection"
    >
      <div className="section-title-row">
        <h2>
          <i className="fa-solid fa-chart-bar"></i> Monthly Comparison
        </h2>
        <button
          className="icon-btn"
          onClick={onClear}
          title="Clear Monthly Data"
        >
          <i className="fa-solid fa-trash-can"></i>
        </button>
      </div>
      <div className="comparison-chart" id="comparisonChart">
        {monthlyHistory.length === 0 ? (
          <p className="comparison-empty" id="comparisonEmpty">
            Save budgets to see monthly comparison.
          </p>
        ) : (
          monthlyHistory.map((m, idx) => {
            const percent = Math.min(
              Math.round((m.expense / maxExpense) * 100),
              100,
            );
            return (
              <div className="comp-bar-wrapper" key={idx}>
                <div className="comp-bar-header">
                  <span>{m.month}</span>
                  <span>
                    {hideAmounts ? (
                      "*****"
                    ) : (
                      <>
                        {currency} {m.expense.toLocaleString()}
                      </>
                    )}
                  </span>
                </div>
                <div className="comp-bar-track">
                  <div
                    className="comp-bar-fill"
                    style={{
                      width: `${percent}%`,
                      background: "linear-gradient(90deg, #6366f1, #38bdf8)",
                    }}
                  >
                    {percent > 20 ? percent + "%" : ""}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
