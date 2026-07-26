"use client";

import React from "react";
import { CurrencySymbol } from "@/types/budget";

interface BudgetFormProps {
  salary: number;
  grocery: number;
  vegetables: number;
  fruits: number;
  transport: number;
  mobile: number;
  goal: number;
  currency: CurrencySymbol;
  onSalaryChange: (val: number) => void;
  onGroceryChange: (val: number) => void;
  onVegetablesChange: (val: number) => void;
  onFruitsChange: (val: number) => void;
  onTransportChange: (val: number) => void;
  onMobileChange: (val: number) => void;
  onGoalChange: (val: number) => void;
  onRefresh: () => void;
  onSave: () => void;
  onReset: () => void;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({
  salary,
  grocery,
  vegetables,
  fruits,
  transport,
  mobile,
  goal,
  currency,
  onSalaryChange,
  onGroceryChange,
  onVegetablesChange,
  onFruitsChange,
  onTransportChange,
  onMobileChange,
  onGoalChange,
  onRefresh,
  onSave,
  onReset,
}) => {
  return (
    <section className="glass-card form-section" id="formSection">
      <h2><i className="fa-solid fa-pen-to-square"></i> Enter Details</h2>

      <div className="form-grid">
        <div className="input-group">
          <label htmlFor="salary">
            <i className="fa-solid fa-money-bill-wave"></i> Salary 
          </label>
          <input
            type="number"
            id="salary"
            placeholder="e.g. 50000"
            value={salary || ""}
            onChange={(e) => onSalaryChange(Number(e.target.value))}
          />
        </div>
        <div className="input-group">
          <label htmlFor="grocery">
            <i className="fa-solid fa-cart-shopping"></i> Grocery
          </label>
          <input
            type="number"
            id="grocery"
            value={grocery || ""}
            placeholder="e.g. 7000"
            onChange={(e) => onGroceryChange(Number(e.target.value))}
          />
        </div>
        <div className="input-group">
          <label htmlFor="vegetables">
            <i className="fa-solid fa-carrot"></i> Vegetables
          </label>
          <input
            type="number"
            id="vegetables"
            value={vegetables || ""}
            placeholder="e.g. 2000"
            onChange={(e) => onVegetablesChange(Number(e.target.value))}
          />
        </div>
        <div className="input-group">
          <label htmlFor="fruits">
            <i className="fa-solid fa-apple-whole"></i> Fruits
          </label>
          <input
            type="number"
            id="fruits"
            value={fruits || ""}
            placeholder="e.g. 3500"
            onChange={(e) => onFruitsChange(Number(e.target.value))}
          />
        </div>
        <div className="input-group">
          <label htmlFor="transport">
            <i className="fa-solid fa-bus"></i> Transport
          </label>
          <input
            type="number"
            id="transport"
            value={transport || ""}
            placeholder="e.g. 4000"
            onChange={(e) => onTransportChange(Number(e.target.value))}
          />
        </div>
        <div className="input-group">
          <label htmlFor="mobile">
            <i className="fa-solid fa-wifi"></i> Mobile / Internet
          </label>
          <input
            type="number"
            id="mobile"
            value={mobile || ""}
            placeholder="e.g. 1200"
            onChange={(e) => onMobileChange(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="input-group savings-goal-group">
        <label htmlFor="goal">
          <i className="fa-solid fa-bullseye"></i> Savings Goal
        </label>
        <input
          type="number"
          id="goal"
          placeholder="e.g. 5000"
          value={goal || ""}
          onChange={(e) => onGoalChange(Number(e.target.value))}
        />
      </div>

      <div className="btn-row">
        <button className="btn btn-primary" onClick={onRefresh} id="refreshBtn">
          <i className="fa-solid fa-rotate"></i> Refresh
        </button>
        <button className="btn btn-success" onClick={onSave} id="saveBtn">
          <i className="fa-solid fa-floppy-disk"></i> Save
        </button>
        <button className="btn btn-danger" onClick={onReset} id="resetBtn">
          <i className="fa-solid fa-trash-can"></i> Reset
        </button>
      </div>
    </section>
  );
};
