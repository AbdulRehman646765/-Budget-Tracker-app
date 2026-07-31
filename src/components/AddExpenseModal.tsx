"use client";

import React, { useState } from "react";
import { CategoryConfig, CategoryKey } from "@/types/budget";
import { DEFAULT_CATEGORIES } from "@/lib/categories";
import { useScrollLock } from "@/hooks/useScrollLock";

interface AddExpenseModalProps {
  show: boolean;
  currency: string;
  categories?: CategoryConfig[];
  onClose: () => void;
  onAdd: (name: string, amount: number, category: CategoryKey) => void;
  onOpenCategoryManager?: () => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  show,
  currency,
  categories = DEFAULT_CATEGORIES,
  onClose,
  onAdd,
  onOpenCategoryManager,
}) => {
  useScrollLock(show);

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
          <div className="cat-picker-header">
            <label>Category</label>
            {onOpenCategoryManager && (
              <button type="button" className="btn-link" onClick={onOpenCategoryManager}>
                <i className="fa-solid fa-gear"></i> Manage Categories
              </button>
            )}
          </div>
          <div className="category-picker" id="categoryPicker">
            {categories.map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={`cat-tag ${category === opt.key ? "active" : ""}`}
                style={category === opt.key ? { background: opt.color, borderColor: opt.color } : {}}
                onClick={() => setCategory(opt.key)}
              >
                <i className={opt.iconName}></i> {opt.label}
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
