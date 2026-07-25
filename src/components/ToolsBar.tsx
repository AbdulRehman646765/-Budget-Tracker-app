"use client";

import React from "react";

type ToolKey = "chart" | "insights" | "subscriptions" | "calendar" | "comparison" | "history" | "alert";

interface ToolsBarProps {
  visibleTools: Record<ToolKey, boolean>;
  onToggleTool: (tool: ToolKey) => void;
  onSelectOption: (val: string) => void;
}

const toolPills: { key: ToolKey; label: string; icon: string }[] = [
  { key: "chart", label: "Chart", icon: "fa-solid fa-chart-pie" },
  { key: "insights", label: "Insights", icon: "fa-solid fa-lightbulb" },
  { key: "subscriptions", label: "Bills", icon: "fa-solid fa-calendar-check" },
  { key: "calendar", label: "Calendar", icon: "fa-solid fa-calendar-days" },
  { key: "comparison", label: "Comparison", icon: "fa-solid fa-chart-bar" },
  { key: "history", label: "History", icon: "fa-solid fa-clock-rotate-left" },
  { key: "alert", label: "Alerts", icon: "fa-solid fa-bell" },
];

export const ToolsBar: React.FC<ToolsBarProps> = ({
  visibleTools,
  onToggleTool,
  onSelectOption,
}) => {
  return (
    <section className="glass-card tools-bar-section">
      <div className="section-title-row">
        <h2><i className="fa-solid fa-sliders"></i> Extra Tools & Analytics</h2>
        <div className="tool-dropdown-wrap">
          <select id="toolSelect" onChange={(e) => onSelectOption(e.target.value)}>
            <option value="all">👁️ Show All Tools</option>
            <option value="chart">📊 Expense Breakdown</option>
            <option value="insights">💡 Smart Insights</option>
            <option value="subscriptions">💳 Recurring Bills</option>
            <option value="calendar">📅 Spending Calendar</option>
            <option value="comparison">📈 Monthly Comparison</option>
            <option value="history">📜 History & Export</option>
            <option value="alert">🔔 Alert Settings</option>
            <option value="none">🙈 Hide Extra Tools</option>
          </select>
        </div>
      </div>

      <div className="tool-pills-row">
        {toolPills.map((pill) => (
          <button
            key={pill.key}
            className={`tool-pill ${visibleTools[pill.key] ? "active" : ""}`}
            onClick={() => onToggleTool(pill.key)}
          >
            <i className={pill.icon}></i> {pill.label}
          </button>
        ))}
      </div>
    </section>
  );
};
