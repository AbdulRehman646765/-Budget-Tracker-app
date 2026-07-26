"use client";

import React, { useEffect, useRef } from "react";
import { CategoryInfo, CurrencySymbol, CustomExpense } from "@/types/budget";
import { CATEGORIES } from "@/lib/categories";

interface DonutChartProps {
  grocery: number;
  vegetables: number;
  fruits: number;
  transport: number;
  mobile: number;
  customExpenses: CustomExpense[];
  currency: CurrencySymbol;
  categoriesMap?: Record<string, CategoryInfo>;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  grocery,
  vegetables,
  fruits,
  transport,
  mobile,
  customExpenses,
  currency,
  categoriesMap = CATEGORIES,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const categoriesMapList = [
    { label: "Grocery", amount: grocery, color: "#38bdf8" },
    { label: "Vegetables", amount: vegetables, color: "#22c55e" },
    { label: "Fruits", amount: fruits, color: "#f59e0b" },
    { label: "Transport", amount: transport, color: "#a855f7" },
    { label: "Mobile", amount: mobile, color: "#ec4899" },
  ];

  customExpenses.forEach((exp) => {
    const catObj = categoriesMap[exp.category] || CATEGORIES.general || { label: exp.category, color: '#64748b', iconName: '' };
    const existing = categoriesMapList.find((c) => c.label === catObj.label);
    if (existing) {
      existing.amount += exp.amount;
    } else {
      categoriesMapList.push({
        label: catObj.label,
        amount: exp.amount,
        color: catObj.color,
      });
    }
  });

  const activeItems = categoriesMapList.filter((c) => c.amount > 0);
  const totalAmount = activeItems.reduce((sum, c) => sum + c.amount, 0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = 105;
    const innerRadius = 72;

    ctx.clearRect(0, 0, width, height);

    if (totalAmount === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
      ctx.arc(centerX, centerY, innerRadius, 2 * Math.PI, 0, true);
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.fill();
      return;
    }

    let startAngle = -Math.PI / 2;
    activeItems.forEach((item) => {
      const sliceAngle = (item.amount / totalAmount) * (2 * Math.PI);
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();

      ctx.fillStyle = item.color;
      ctx.fill();

      startAngle = endAngle;
    });
  }, [activeItems, totalAmount]);

  return (
    <section className="glass-card chart-section tool-card" id="chartSection">
      <h2><i className="fa-solid fa-chart-pie"></i> Expense Breakdown</h2>
      <div className="chart-container">
        <canvas ref={canvasRef} id="donutChart" width="260" height="260"></canvas>
        <div className="chart-center-label" id="chartCenterLabel">
          <span className="chart-center-amount" id="chartCenterAmount">
            <span className="curr-symbol">{currency}</span> {totalAmount.toLocaleString()}
          </span>
          <span className="chart-center-text">Total</span>
        </div>
      </div>
      <div className="chart-legend" id="chartLegend">
        {totalAmount === 0 ? (
          <p className="comparison-empty" style={{ gridColumn: "span 2" }}>No expenses added yet.</p>
        ) : (
          activeItems.map((item, idx) => {
            const percentage = Math.round((item.amount / totalAmount) * 100);
            return (
              <div className="legend-item" key={idx}>
                <span className="legend-color" style={{ background: item.color }}></span>
                <span className="legend-label">{item.label}</span>
                <span className="legend-val">{percentage}%</span>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
