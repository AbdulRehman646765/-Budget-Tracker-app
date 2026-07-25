"use client";

import React from "react";
import { CurrencySymbol } from "@/types/budget";

interface SavingsGoalProps {
  goal: number;
  remaining: number;
  currency: CurrencySymbol;
}

export const SavingsGoal: React.FC<SavingsGoalProps> = ({ goal, remaining, currency }) => {
  let statusContent = "Set your savings goal to get started.";
  let statusColor = "";

  if (goal <= 0) {
    statusContent = "🎯 Enter your savings goal to get started.";
    statusColor = "";
  } else if (remaining >= goal) {
    statusContent = "🏆 Congratulations! You've achieved your savings goal!";
    statusColor = "#4ade80";
  } else {
    const need = goal - remaining;
    statusContent = `💰 You need <strong>${currency} ${need.toLocaleString()}</strong> more to reach your goal.`;
    statusColor = "#fbbf24";
  }

  return (
    <section className="glass-card goal-section" id="goalSection">
      <div className="goal-header">
        <div className="goal-icon"><i className="fa-solid fa-trophy"></i></div>
        <h2>Savings Goal</h2>
      </div>
      <p
        className="goal-status"
        id="goalStatus"
        style={{ color: statusColor }}
        dangerouslySetInnerHTML={{ __html: statusContent }}
      />
    </section>
  );
};
