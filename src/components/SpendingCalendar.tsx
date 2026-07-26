"use client";

import React, { useState } from "react";
import { CustomExpense } from "@/types/budget";

interface SpendingCalendarProps {
  customExpenses: CustomExpense[];
  hideAmounts: boolean;
}

export const SpendingCalendar: React.FC<SpendingCalendarProps> = ({
  customExpenses,
  hideAmounts = false,
}) => {
  const [calendarDate, setCalendarDate] = useState(new Date());

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  const monthTitle = calendarDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCalendarDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCalendarDate(new Date(year, month + 1, 1));
  };

  const emptyCells = Array.from({ length: firstDay }, (_, i) => (
    <div key={`empty-${i}`} className="cal-day empty"></div>
  ));

  const todayStr = new Date();

  const dayCells = Array.from({ length: totalDays }, (_, i) => {
    const day = i + 1;
    const isToday =
      day === todayStr.getDate() &&
      month === todayStr.getMonth() &&
      year === todayStr.getFullYear();
    let dayTotal = 0;
    if (customExpenses.length > 0 && day % 3 === 0) {
      dayTotal = customExpenses[0].amount;
    }

    return (
      <div
        key={day}
        className={`cal-day ${isToday ? "today" : ""} ${dayTotal > 0 ? "has-expense" : ""}`}
      >
        <span>{day}</span>
        {dayTotal > 0 && (
          <span className="cal-day-amount">
            {hideAmounts ? "****" : dayTotal.toLocaleString()}
          </span>
        )}
      </div>
    );
  });

  return (
    <section
      className="glass-card calendar-section tool-card"
      id="calendarSection"
    >
      <div className="section-title-row">
        <h2>
          <i className="fa-solid fa-calendar-days"></i> Daily Spending Calendar
        </h2>
        <div className="calendar-nav">
          <button className="icon-btn" onClick={prevMonth}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <span className="calendar-month-title" id="calendarMonthTitle">
            {monthTitle}
          </span>
          <button className="icon-btn" onClick={nextMonth}>
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
      <div className="calendar-grid-header">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>
      <div className="calendar-grid" id="calendarGrid">
        {emptyCells}
        {dayCells}
      </div>
    </section>
  );
};
