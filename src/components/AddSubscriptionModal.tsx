"use client";

import React, { useState } from "react";

interface AddSubscriptionModalProps {
  show: boolean;
  currency: string;
  onClose: () => void;
  onAdd: (name: string, amount: number, dueDate: number) => void;
}

export const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({
  show,
  currency,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  if (!show) return null;

  const handleSubmit = () => {
    const n = name.trim();
    const a = Number(amount);
    const d = Number(dueDate) || 1;
    if (!n || !a || a <= 0) return;

    onAdd(n, a, d);
    setName("");
    setAmount("");
    setDueDate("");
  };

  return (
    <div
      className={`popup-overlay ${show ? "show" : ""}`}
      id="subModal"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="popup-content">
        <div className="popup-header">
          <h3><i className="fa-solid fa-calendar-plus"></i> Add Recurring Bill</h3>
          <button className="popup-close" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
        </div>
        <div className="input-group">
          <label htmlFor="subName">Bill / Subscription Name</label>
          <input
            type="text"
            id="subName"
            placeholder="e.g. Netflix / Wifi / Rent"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="subAmount">Amount (<span className="curr-symbol">{currency}</span>)</label>
          <input
            type="number"
            id="subAmount"
            placeholder="e.g. 2500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="subDueDate">Due Date (Day of Month)</label>
          <input
            type="number"
            id="subDueDate"
            min={1}
            max={31}
            placeholder="e.g. 5 (5th of every month)"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="btn-row">
          <button className="btn btn-success" onClick={handleSubmit}>
            <i className="fa-solid fa-check"></i> Save Bill
          </button>
          <button className="btn btn-danger" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i> Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
