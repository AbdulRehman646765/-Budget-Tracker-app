"use client";

import React from "react";
import { CurrencySymbol, CustomExpense } from "@/types/budget";
import { CATEGORIES } from "@/lib/categories";

interface CustomExpensesProps {
  expenses: CustomExpense[];
  currency: CurrencySymbol;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const CustomExpenses: React.FC<CustomExpensesProps> = ({
  expenses,
  currency,
  onDelete,
  onClearAll,
}) => {
  if (expenses.length === 0) return null;

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <section className="glass-card custom-expenses-section" id="customExpensesSection">
      <div className="section-title-row">
        <h2><i className="fa-solid fa-list-check"></i> Custom Expenses</h2>
        <span className="badge" id="customTotalBadge">
          <span className="curr-symbol">{currency}</span> {total.toLocaleString()}
        </span>
      </div>
      <div id="customExpensesList" className="custom-expenses-list">
        {expenses.map((exp) => {
          const cat = CATEGORIES[exp.category] || CATEGORIES.general;
          return (
            <div className="custom-expense-item" key={exp.id}>
              <div className="custom-expense-info">
                <span className="custom-expense-badge" style={{ background: cat.color }}>
                  <i className={`fa-solid ${cat.iconName || 'fa-tag'}`}></i> {cat.label}
                </span>
                <span className="custom-expense-name">{exp.name}</span>
              </div>
              <div className="custom-expense-right">
                <span className="custom-expense-amount">{currency} {exp.amount.toLocaleString()}</span>
                <button className="custom-expense-delete" onClick={() => onDelete(exp.id)} title="Delete">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <button className="btn btn-danger" onClick={onClearAll} style={{ marginTop: "14px" }}>
        <i className="fa-solid fa-trash-can"></i> Clear All
      </button>
    </section>
  );
};
