"use client";

import React, { useEffect, useState } from "react";
import { CurrencySymbol } from "@/types/budget";

interface HeaderProps {
  currency: CurrencySymbol;
  onCurrencyChange: (curr: CurrencySymbol) => void;
  onPinClick: () => void;
  theme: "dark" | "light";
  onThemeToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currency,
  onCurrencyChange,
  onPinClick,
  theme,
  onThemeToggle,
}) => {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(today.toLocaleDateString("en-US", options));
  }, []);

  return (
    <header className="app-header" id="appHeader">
      <div className="header-left">
        <div className="logo-icon">
          <i className="fa-solid fa-wallet"></i>
        </div>
        <div>
          <h1>Budget Tracker</h1>
          <p className="header-date" id="todayDate">{currentDate}</p>
        </div>
      </div>
      <div className="header-right">
        {/* Currency Selector */}
        <div className="currency-select-wrapper">
          <i className="fa-solid fa-coins currency-icon"></i>
          <select
            id="currencySelect"
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value as CurrencySymbol)}
          >
            <option value="Rs.">PKR (Rs.)</option>
            <option value="$">USD ($)</option>
            <option value="€">EUR (€)</option>
            <option value="AED">AED (AED)</option>
            <option value="SR">SAR (SR)</option>
            <option value="₹">INR (₹)</option>
          </select>
        </div>
        {/* Lock PIN Button */}
        <button
          className="icon-btn"
          id="pinToggle"
          onClick={onPinClick}
          title="PIN Lock Settings"
        >
          <i className="fa-solid fa-lock"></i>
        </button>
        {/* Theme Toggle */}
        <button
          className="icon-btn"
          id="themeToggle"
          onClick={onThemeToggle}
          title="Toggle Theme"
        >
          <i className={theme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
        </button>
      </div>
    </header>
  );
};
