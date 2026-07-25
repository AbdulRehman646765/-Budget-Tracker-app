"use client";

import React, { useState } from "react";
import { CategoryKey } from "@/types/budget";

interface AddExpenseModalProps {
  show: boolean;
  currency: string;
  onClose: () => void;
  onAdd: (name: string, amount: number, category: CategoryKey) => void;
}

const categoryOptions: { key: CategoryKey; label: string; icon: string }[] = [
  { key: "general", label: "General", icon: "fa-solid fa-tag" },
  { key: "food", label: "Food", icon: "fa-solid fa-utensils" },
  { key: "bills", label: "Bills", icon: "fa-solid fa-file-invoice-dollar" },
  { key: "health", label: "Health", icon: "fa-solid fa-heart-pulse" },
  { key: "shopping", label: "Shopping", icon: "fa-solid fa-bag-shopping" },
  { key: "education", label: "Education", icon: "fa-solid fa-graduation-cap" },
  { key: "entertainment", label: "Entertainment", icon: "fa-solid fa-film" },
  { key: "other", label: "Other", icon: "fa-solid fa-ellipsis" },
];

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  show,
  currency,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<CategoryKey>("general");

  if (!show) return null;

  const handleSubmit = () => {
    const n = name.trim();
    const a = Number(amount);
    if (!n || !a || a <= 0) return;

    onAdd(n, a, category);
    setName("");
    setAmount("");
    setCategory("general");
  };

  return (
    <div
      className={`popup-overlay ${show ? "show" : ""}`}
      id="popup"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="popup-content">
        <div className="popup-header">
          <h3><i className="fa-solid fa-receipt"></i> Add Expense</h3>
          <button className="popup-close" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
        </div>
        <div className="input-group">
          <label htmlFor="expenseName">Expense Name</label>
          <input
            type="text"
            id="expenseName"
            placeholder="e.g. Electricity Bill"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="expenseAmount">Amount (<span className="curr-symbol">{currency}</span>)</label>
          <input
            type="number"
            id="expenseAmount"
            placeholder="e.g. 1500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Category</label>
          <div className="category-picker" id="categoryPicker">
            {categoryOptions.map((opt) => (
              <button
                key={opt.key}
                className={`cat-tag ${category === opt.key ? "active" : ""}`}
                data-cat={opt.key}
                onClick={() => setCategory(opt.key)}
              >
                <i className={opt.icon}></i> {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="btn-row">
          <button className="btn btn-success" onClick={handleSubmit}>
            <i className="fa-solid fa-check"></i> Save
          </button>
          <button className="btn btn-danger" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i> Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export const FAB: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="fab" onClick={onClick} id="fabBtn" title="Add Quick Expense">
    <i className="fa-solid fa-plus"></i>
  </div>
);
