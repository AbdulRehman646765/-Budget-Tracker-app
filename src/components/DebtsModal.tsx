"use client";

import React, { useState } from "react";
import { CurrencySymbol, DebtEntry } from "@/types/budget";
import { CustomSelect } from "@/components/CustomSelect";
import { useScrollLock } from "@/hooks/useScrollLock";

interface DebtsModalProps {
  show: boolean;
  onClose: () => void;
  debts: DebtEntry[];
  currency: CurrencySymbol;
  onAddDebt: (debt: DebtEntry) => void;
  onToggleStatus: (id: string) => void;
  onDeleteDebt: (id: string) => void;
  hideAmounts?: boolean;
}

const TRANSACTION_TYPE_OPTIONS = [
  { value: "receivable", label: "Paisy Leny Hain (I am owed)", iconName: "fa-solid fa-arrow-down-left", color: "#4ade80" },
  { value: "payable", label: "Paisy Deny Hain (I owe)", iconName: "fa-solid fa-arrow-up-right", color: "#f87171" },
];

export const DebtsModal: React.FC<DebtsModalProps> = ({
  show,
  onClose,
  debts,
  currency,
  onAddDebt,
  onToggleStatus,
  onDeleteDebt,
  hideAmounts = false,
}) => {
  useScrollLock(show);

  const [activeTab, setActiveTab] = useState<"all" | "receivable" | "payable">("all");
  const [personName, setPersonName] = useState("");
  const [type, setType] = useState<"receivable" | "payable">("receivable");
  const [amount, setAmount] = useState<number | "">("");
  const [notes, setNotes] = useState("");

  if (!show) return null;

  const handleAdd = () => {
    const trimmedName = personName.trim();
    const numAmount = Number(amount);
    if (!trimmedName || !numAmount || numAmount <= 0) return;

    const newEntry: DebtEntry = {
      id: Date.now().toString(),
      type,
      personName: trimmedName,
      amount: numAmount,
      date: new Date().toLocaleDateString(),
      notes: notes.trim(),
      status: "pending",
    };

    onAddDebt(newEntry);
    setPersonName("");
    setAmount("");
    setNotes("");
  };

  const totalReceivables = debts
    .filter((d) => d.type === "receivable" && d.status === "pending")
    .reduce((sum, d) => sum + d.amount, 0);

  const totalPayables = debts
    .filter((d) => d.type === "payable" && d.status === "pending")
    .reduce((sum, d) => sum + d.amount, 0);

  const filteredDebts = debts.filter((d) => {
    if (activeTab === "receivable") return d.type === "receivable";
    if (activeTab === "payable") return d.type === "payable";
    return true;
  });

  return (
    <div
      className="popup-overlay show"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="popup-content debts-modal-box" style={{ maxWidth: "560px", width: "95%", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <div className="popup-header">
          <h3>
            <i className="fa-solid fa-hand-holding-dollar"></i> Khata Tracker
          </h3>
          <button className="popup-close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div style={{ overflowY: "auto", paddingRight: "2px" }}>
          {/* Summary Badges */}
          <div className="debts-summary-cards">
            <div className="debt-summary-card debt-card-leny">
              <div className="debt-summary-icon">
                <i className="fa-solid fa-arrow-down-left"></i>
              </div>
              <div>
                <span className="debt-summary-label">Paisy Leny Hain (Receivable)</span>
                <h4 className="debt-summary-value">
                  {hideAmounts ? "••••" : `${currency} ${totalReceivables.toLocaleString()}`}
                </h4>
              </div>
            </div>

            <div className="debt-summary-card debt-card-deny">
              <div className="debt-summary-icon">
                <i className="fa-solid fa-arrow-up-right"></i>
              </div>
              <div>
                <span className="debt-summary-label">Paisy Deny Hain (Payable)</span>
                <h4 className="debt-summary-value">
                  {hideAmounts ? "••••" : `${currency} ${totalPayables.toLocaleString()}`}
                </h4>
              </div>
            </div>
          </div>

          {/* Add Entry Form */}
          <div className="glass-card debts-form-card" style={{ padding: "16px", marginBottom: "18px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "12px", color: "var(--text-primary)" }}>
              <i className="fa-solid fa-plus-circle"></i> Add Debt / Due Entry
            </h4>

            <div className="debts-form-grid" style={{ marginBottom: "10px" }}>
              <div className="input-group">
                <label>Person Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ali Khan / Ahmed"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  style={{ height: "40px" }}
                />
              </div>

              <div className="input-group">
                <label>Transaction Type</label>
                <CustomSelect
                  options={TRANSACTION_TYPE_OPTIONS}
                  value={type}
                  onChange={(val) => setType(val as "receivable" | "payable")}
                />
              </div>
            </div>

            <div className="debts-form-grid" style={{ marginBottom: "12px" }}>
              <div className="input-group">
                <label>Amount ({currency})</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  style={{ height: "40px" }}
                />
              </div>

              <div className="input-group">
                <label>Notes / Reason (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Dinner split / Loan"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ height: "40px" }}
                />
              </div>
            </div>

            <button className="btn btn-primary btn-sm" onClick={handleAdd} style={{ width: "100%", justifyContent: "center", height: "40px" }}>
              <i className="fa-solid fa-plus"></i> Save Record
            </button>
          </div>

          {/* Tab Filters */}
          <div className="settings-tabs" style={{ marginBottom: "12px" }}>
            <button
              className={`settings-tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Records ({debts.length})
            </button>
            <button
              className={`settings-tab-btn ${activeTab === "receivable" ? "active" : ""}`}
              onClick={() => setActiveTab("receivable")}
            >
              <i className="fa-solid fa-arrow-down-left" style={{ color: "#4ade80" }}></i> Leny Hain
            </button>
            <button
              className={`settings-tab-btn ${activeTab === "payable" ? "active" : ""}`}
              onClick={() => setActiveTab("payable")}
            >
              <i className="fa-solid fa-arrow-up-right" style={{ color: "#f87171" }}></i> Deny Hain
            </button>
          </div>

          {/* List of Entries */}
          <div className="debts-list-container" style={{ maxHeight: "320px", overflowY: "auto", paddingRight: "4px" }}>
            {filteredDebts.length === 0 ? (
              <p style={{ fontSize: "13px", color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", padding: "20px" }}>
                No records found.
              </p>
            ) : (
              filteredDebts.map((item) => {
                const isReceivable = item.type === "receivable";
                const isSettled = item.status === "settled";

                return (
                  <div key={item.id} className={`debt-item-row ${isSettled ? "settled" : ""}`}>
                    <div className="debt-item-left">
                      <div className={`debt-type-badge ${isReceivable ? "leny" : "deny"}`}>
                        <i className={isReceivable ? "fa-solid fa-arrow-down-left" : "fa-solid fa-arrow-up-right"}></i>
                      </div>

                      <div>
                        <div className="debt-person-name">
                          {item.personName}{" "}
                          <span className={`debt-status-tag ${isSettled ? "status-settled" : "status-pending"}`}>
                            {isSettled ? "Settled" : "Pending"}
                          </span>
                        </div>
                        <div className="debt-meta">
                          {item.date} {item.notes ? `• ${item.notes}` : ""}
                        </div>
                      </div>
                    </div>

                    <div className="debt-item-right">
                      <span className={`debt-amount ${isReceivable ? "text-leny" : "text-deny"}`}>
                        {hideAmounts ? "••••" : `${isReceivable ? "+" : "-"}${currency} ${item.amount.toLocaleString()}`}
                      </span>

                      <button
                        className={`btn btn-sm ${isSettled ? "btn-secondary" : "btn-success"}`}
                        onClick={() => onToggleStatus(item.id)}
                        title={isSettled ? "Mark as Pending" : "Mark as Settled"}
                        style={{ padding: "4px 8px", fontSize: "11px" }}
                      >
                        <i className={isSettled ? "fa-solid fa-rotate-left" : "fa-solid fa-check"}></i>
                      </button>

                      <button
                        className="cat-delete-btn"
                        onClick={() => onDeleteDebt(item.id)}
                        title="Delete Record"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
