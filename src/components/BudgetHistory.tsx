"use client";

import React, { useState } from "react";
import { CurrencySymbol, HistoryEntry } from "@/types/budget";

interface BudgetHistoryProps {
  history: HistoryEntry[];
  currency: CurrencySymbol;
  onEdit: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  hideAmounts?: boolean;
}

export const BudgetHistory: React.FC<BudgetHistoryProps> = ({
  history,
  currency,
  onEdit,
  onDelete,
  hideAmounts = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = history.filter((entry) => {
    const text =
      `${entry.date} ${entry.salary} ${entry.grocery} ${entry.vegetables} ${entry.fruits} ${entry.transport} ${entry.mobile}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  const exportCSV = () => {
    if (history.length === 0) return;
    const headers =
      "Date,Salary,Grocery,Vegetables,Fruits,Transport,Mobile,Expense,Remaining\n";
    const rows = history
      .map(
        (e) =>
          `"${e.date}","${e.salary}","${e.grocery}","${e.vegetables}","${e.fruits}","${e.transport}","${e.mobile}","${e.expense}","${e.remaining}"`,
      )
      .join("\n");

    const blob = new Blob([headers + rows], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `budget_history_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    if (history.length === 0) return;
    const tableRows = history
      .map(
        (e) =>
          `<tr><td>${e.date}</td><td>${e.salary}</td><td>${e.grocery}</td><td>${e.vegetables}</td><td>${e.fruits}</td><td>${e.transport}</td><td>${e.mobile}</td><td>${e.expense}</td><td>${e.remaining}</td></tr>`,
      )
      .join("");

    const printWindow = window.open("", "", "height=700,width=900");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
      <head>
        <title>Budget History Export</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          h2 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; font-size: 13px; }
          th { background-color: #4f46e5; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <h2>💰 Monthly Budget Tracker — History Export</h2>
        <p>Export Date: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr><th>Date</th><th>Salary</th><th>Grocery</th><th>Vegetables</th><th>Fruits</th><th>Transport</th><th>Mobile</th><th>Expense</th><th>Remaining</th></tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
        <script>window.onload = function() { window.print(); window.close(); }<\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <section
      className="glass-card history-section tool-card"
      id="historySection"
    >
      <div className="section-title-row">
        <h2>
          <i className="fa-solid fa-clock-rotate-left"></i> Budget History
        </h2>
        <div className="export-btns">
          <button className="icon-btn" onClick={exportCSV} title="Export CSV">
            <i className="fa-solid fa-file-csv"></i>
          </button>
          <button className="icon-btn" onClick={exportPDF} title="Export PDF">
            <i className="fa-solid fa-file-pdf"></i>
          </button>
        </div>
      </div>
      {hideAmounts ? (
        <div className="chart-locked">
          <i className="fa-solid fa-lock"></i>
          <h3>History Locked</h3>
          <p>Set and unlock your PIN to view your budget history.</p>
        </div>
      ) : (
        <>
          <div className="search-wrapper">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              id="searchInput"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="table-wrapper">
            <table id="historyTable">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Salary</th>
                  <th>Grocery</th>
                  <th>Vegetables</th>
                  <th>Fruits</th>
                  <th>Transport</th>
                  <th>Mobile</th>
                  <th>Expense</th>
                  <th>Remaining</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody id="historyBody">
                {filtered.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.date}</td>
                    <td>
                      {currency} {entry.salary.toLocaleString()}
                    </td>
                    <td>
                      {currency} {entry.grocery.toLocaleString()}
                    </td>
                    <td>
                      {currency} {entry.vegetables.toLocaleString()}
                    </td>
                    <td>
                      {currency} {entry.fruits.toLocaleString()}
                    </td>
                    <td>
                      {currency} {entry.transport.toLocaleString()}
                    </td>
                    <td>
                      {currency} {entry.mobile.toLocaleString()}
                    </td>
                    <td>
                      {currency} {entry.expense.toLocaleString()}
                    </td>
                    <td>
                      {currency} {entry.remaining.toLocaleString()}
                    </td>
                    <td>
                      <button onClick={() => onEdit(entry)}>
                        <i className="fa-solid fa-pen"></i>
                      </button>

                      <button onClick={() => onDelete(entry.id)}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
};
