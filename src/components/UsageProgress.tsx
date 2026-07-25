"use client";

import React from "react";

interface UsageProgressProps {
  salary: number;
  expenses: number;
}

export const UsageProgress: React.FC<UsageProgressProps> = ({ salary, expenses }) => {
  let percent = 0;
  if (salary > 0) {
    percent = (expenses / salary) * 100;
    if (percent > 100) percent = 100;
  }
  const roundedPercent = Math.round(percent);

  let fillBackground = "linear-gradient(90deg, #4ade80, #22c55e)";
  let badgeBackground = "#22c55e";
  let statusClass = "budget-status status-safe";
  let statusIcon = "fa-solid fa-circle-check";
  let statusText = "Budget is under control";

  if (percent <= 60) {
    fillBackground = "linear-gradient(90deg, #4ade80, #22c55e)";
    badgeBackground = "#22c55e";
    statusClass = "budget-status status-safe";
    statusIcon = "fa-solid fa-circle-check";
    statusText = "Budget is under control";
  } else if (percent <= 85) {
    fillBackground = "linear-gradient(90deg, #fbbf24, #f59e0b)";
    badgeBackground = "#f59e0b";
    statusClass = "budget-status status-warning";
    statusIcon = "fa-solid fa-triangle-exclamation";
    statusText = "Approaching budget limit";
  } else if (percent < 100) {
    fillBackground = "linear-gradient(90deg, #f87171, #ef4444)";
    badgeBackground = "#ef4444";
    statusClass = "budget-status status-danger";
    statusIcon = "fa-solid fa-circle-exclamation";
    statusText = "Very little budget left!";
  } else {
    fillBackground = "linear-gradient(90deg, #ef4444, #991b1b)";
    badgeBackground = "#ef4444";
    statusClass = "budget-status status-critical";
    statusIcon = "fa-solid fa-ban";
    statusText = "Budget Exceeded!";
  }

  return (
    <section className="glass-card progress-section" id="progressSection">
      <div className="section-title-row">
        <h2><i className="fa-solid fa-chart-pie"></i> Budget Usage</h2>
        <span className="badge" id="progressPercent" style={{ background: badgeBackground }}>
          {roundedPercent}%
        </span>
      </div>
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          id="progressFill"
          style={{ width: `${percent}%`, background: fillBackground }}
        />
      </div>
      <div id="budgetWarning" className={statusClass}>
        <i className={statusIcon}></i> {statusText}
      </div>
    </section>
  );
};
