"use client";

import React from "react";
import { CategoryInfo, CurrencySymbol, CustomExpense } from "@/types/budget";
import { CATEGORIES } from "@/lib/categories";

interface SmartInsightsProps {
  salary: number;
  grocery: number;
  vegetables: number;
  fruits: number;
  transport: number;
  mobile: number;
  total: number;
  remaining: number;
  goal: number;
  customExpenses: CustomExpense[];
  currency: CurrencySymbol;
  categoriesMap?: Record<string, CategoryInfo>;
}

interface Insight {
  type: "positive" | "warning" | "danger" | "neutral";
  icon: string;
  text: string;
}

export const SmartInsights: React.FC<SmartInsightsProps> = ({
  salary, grocery, vegetables, fruits, transport, mobile,
  total, remaining, goal, customExpenses, currency,
  categoriesMap = CATEGORIES,
}) => {
  const insights: Insight[] = [];

  if (salary <= 0 && total <= 0) {
    return (
      <section className="glass-card insights-section tool-card" id="insightsSection">
        <div className="section-title-row">
          <h2><i className="fa-solid fa-lightbulb"></i> Smart Financial Insights</h2>
        </div>
        <div className="insights-container" id="insightsContainer">
          <div className="insight-item insight-neutral">
            <i className="fa-solid fa-chart-line"></i>
            <span>Enter income and expenses to generate personal spending insights.</span>
          </div>
        </div>
      </section>
    );
  }

  if (salary > 0) {
    const savingsRate = Math.round((remaining / salary) * 100);
    if (savingsRate >= 20) {
      insights.push({
        type: "positive",
        icon: "fa-circle-check",
        text: `Awesome job! You are saving <strong>${savingsRate}%</strong> of your monthly income.`
      });
    } else if (savingsRate < 0) {
      insights.push({
        type: "danger",
        icon: "fa-circle-exclamation",
        text: `Critical Alert: Expenses exceed your income by <strong>${currency} ${Math.abs(remaining).toLocaleString()}</strong>.`
      });
    } else {
      insights.push({
        type: "warning",
        icon: "fa-triangle-exclamation",
        text: `Your savings rate is only <strong>${savingsRate}%</strong>. Financial experts recommend saving at least 20%.`
      });
    }
  }

  if (total > 0) {
    const categoriesMapList = [
      { label: "Grocery", amount: grocery },
      { label: "Vegetables", amount: vegetables },
      { label: "Fruits", amount: fruits },
      { label: "Transport", amount: transport },
      { label: "Mobile", amount: mobile }
    ];

    customExpenses.forEach(exp => {
      const catLabel = categoriesMap[exp.category]?.label || exp.category || "Other";
      const existing = categoriesMapList.find(c => c.label === catLabel);
      if (existing) existing.amount += exp.amount;
      else categoriesMapList.push({ label: catLabel, amount: exp.amount });
    });

    const highest = categoriesMapList.reduce((prev, curr) => (curr.amount > prev.amount) ? curr : prev, { label: "None", amount: 0 });
    if (highest.amount > 0) {
      const highPercent = Math.round((highest.amount / total) * 100);
      insights.push({
        type: highPercent > 40 ? "warning" : "neutral",
        icon: "fa-pie-chart",
        text: `<strong>${highest.label}</strong> is your top expense category, making up <strong>${highPercent}%</strong> of total spending (${currency} ${highest.amount.toLocaleString()}).`
      });
    }
  }

  if (goal > 0 && remaining > 0) {
    if (remaining >= goal) {
      insights.push({
        type: "positive",
        icon: "fa-trophy",
        text: `Savings goal achieved! You have <strong>${currency} ${(remaining - goal).toLocaleString()}</strong> surplus.`
      });
    } else {
      const diff = goal - remaining;
      insights.push({
        type: "neutral",
        icon: "fa-bullseye",
        text: `Reduce expenses by <strong>${currency} ${diff.toLocaleString()}</strong> to hit your Savings Goal.`
      });
    }
  }

  return (
    <section className="glass-card insights-section tool-card" id="insightsSection">
      <div className="section-title-row">
        <h2><i className="fa-solid fa-lightbulb"></i> Smart Financial Insights</h2>
      </div>
      <div className="insights-container" id="insightsContainer">
        {insights.map((item, idx) => (
          <div className={`insight-item insight-${item.type}`} key={idx}>
            <i className={`fa-solid ${item.icon}`}></i>
            <span dangerouslySetInnerHTML={{ __html: item.text }}></span>
          </div>
        ))}
      </div>
    </section>
  );
};
