"use client";

import React from "react";
import { CurrencySymbol, Subscription } from "@/types/budget";

interface SubscriptionsProps {
  subscriptions: Subscription[];
  currency: CurrencySymbol;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
  hideAmounts?: boolean;
}

export const Subscriptions: React.FC<SubscriptionsProps> = ({
  subscriptions,
  currency,
  onToggleStatus,
  onDelete,
  onAddClick,
  hideAmounts = false,
}) => {
  return (
    <section
      className="glass-card subscriptions-section tool-card"
      id="subscriptionsSection"
    >
      <div className="section-title-row">
        <h2>
          <i className="fa-solid fa-calendar-check"></i> Subscriptions &
          Recurring Bills
        </h2>
        <button className="btn btn-sm btn-primary" onClick={onAddClick}>
          <i className="fa-solid fa-plus"></i> Add Bill
        </button>
      </div>
      <div className="subscriptions-list" id="subscriptionsList">
        {subscriptions.length === 0 ? (
          <p className="comparison-empty">No recurring bills added yet.</p>
        ) : (
          subscriptions.map((sub) => (
            <div className="sub-card" key={sub.id}>
              <div className="sub-info">
                <div className="sub-icon">
                  <i className="fa-solid fa-receipt"></i>
                </div>
                <div className="sub-details">
                  <h4>{sub.name}</h4>
                  <p>Due {sub.dueDate}th of every month</p>
                </div>
              </div>
              <div className="sub-right">
                <span className="sub-amount">
                  {hideAmounts
                    ? "*****"
                    : currency + " " + sub.amount.toLocaleString()}
                </span>
                <button
                  className={`sub-status-btn ${sub.status}`}
                  onClick={() => onToggleStatus(sub.id)}
                >
                  {sub.status.toUpperCase()}
                </button>
                <button
                  className="sub-delete-btn"
                  onClick={() => onDelete(sub.id)}
                  title="Delete"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
