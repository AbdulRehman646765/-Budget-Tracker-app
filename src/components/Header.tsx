"use client";

import React, { useEffect, useState } from "react";
import { CurrencySymbol } from "@/types/budget";
import { CustomSelect, CustomSelectOption } from "@/components/CustomSelect";

const CURRENCY_OPTIONS: CustomSelectOption[] = [
{ value: "Rs.", label: "PKR", iconName: "fa-solid fa-rupee-sign" },
  { value: "$",   label: "USD", iconName: "fa-solid fa-dollar-sign" },
  { value: "€",   label: "EUR", iconName: "fa-solid fa-euro-sign" },
  { value: "AED", label: "AED", iconName: "fa-solid fa-money-bill-wave" },
  { value: "SR",  label: "SAR", iconName: "fa-solid fa-sack-dollar" },
  { value: "₹",   label: "INR", iconName: "fa-solid fa-indian-rupee-sign" },
];

interface HeaderProps {
  currency: CurrencySymbol;
  onCurrencyChange: (curr: CurrencySymbol) => void;
  onPinClick: () => void;
  theme: "dark" | "light";
  onThemeToggle: () => void;
  onCalculatorClick: () => void;
  onSettingsClick: () => void;
  onDebtsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currency,
  onCurrencyChange,
  onPinClick,
  theme,
  onThemeToggle,
  onCalculatorClick,
  onSettingsClick,
  onDebtsClick,
}) => {
  const [currentDate, setCurrentDate] = useState("");
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);

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
        {/* DESKTOP HEADER ACTIONS */}
        <div className="header-desktop-actions">
          {/* Currency Selector */}
          <div className="currency-select-wrapper">
            <CustomSelect
              options={CURRENCY_OPTIONS}
              value={currency}
              onChange={(val) => onCurrencyChange(val as CurrencySymbol)}
              placeholder="Currency"
            />
          </div>

          {/* Quick Calculator Button */}
          <button
            className="icon-btn"
            id="calcBtn"
            onClick={onCalculatorClick}
            title="Quick Calculator"
          >
            <i className="fa-solid fa-calculator"></i>
          </button>

          {/* Debts & Dues (Paisy Leny/Deny) Button */}
          <button
            className="icon-btn"
            id="debtsBtn"
            onClick={onDebtsClick}
            title="Paisy Leny / Deny (Debts)"
          >
            <i className="fa-solid fa-hand-holding-dollar"></i>
          </button>

          {/* App & Form Settings Button */}
          <button
            className="icon-btn"
            id="settingsBtn"
            onClick={onSettingsClick}
            title="App & Form Settings"
          >
            <i className="fa-solid fa-sliders"></i>
          </button>

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

        {/* MOBILE / RESPONSIVE EXTRA TOOLS DROPDOWN */}
        <div className="header-mobile-tools">
          <button
            className="btn btn-primary extra-tools-btn"
            onClick={() => setShowToolsDropdown(!showToolsDropdown)}
            title="Extra Tools Menu"
          >
            <i className="fa-solid fa-toolbox"></i> Tools{" "}
            <i className={`fa-solid fa-chevron-${showToolsDropdown ? "up" : "down"}`}></i>
          </button>

          {showToolsDropdown && (
            <div className="extra-tools-dropdown-menu">
              <div className="dropdown-item-header">
                <i className="fa-solid fa-wrench"></i> Extra Tools & Settings
              </div>

              {/* Currency Selector inside Mobile Menu */}
              <div className="dropdown-tool-row">
                <label><i className="fa-solid fa-coins"></i> Currency</label>
                <CustomSelect
                  options={CURRENCY_OPTIONS}
                  value={currency}
                  onChange={(val) => {
                    onCurrencyChange(val as CurrencySymbol);
                    setShowToolsDropdown(false);
                  }}
                  placeholder="Currency"
                />
              </div>

              {/* Quick Calculator inside Mobile Menu */}
              <button
                className="dropdown-tool-btn"
                onClick={() => {
                  onCalculatorClick();
                  setShowToolsDropdown(false);
                }}
              >
                <i className="fa-solid fa-calculator"></i> Quick Calculator
              </button>

              {/* Paisy Leny / Deny inside Mobile Menu */}
              <button
                className="dropdown-tool-btn"
                onClick={() => {
                  onDebtsClick();
                  setShowToolsDropdown(false);
                }}
              >
                <i className="fa-solid fa-hand-holding-dollar"></i> Paisy Leny / Deny (Debts)
              </button>

              {/* App Settings inside Mobile Menu */}
              <button
                className="dropdown-tool-btn"
                onClick={() => {
                  onSettingsClick();
                  setShowToolsDropdown(false);
                }}
              >
                <i className="fa-solid fa-sliders"></i> Form & App Settings
              </button>

              {/* PIN Lock inside Mobile Menu */}
              <button
                className="dropdown-tool-btn"
                onClick={() => {
                  onPinClick();
                  setShowToolsDropdown(false);
                }}
              >
                <i className="fa-solid fa-lock"></i> PIN Lock Settings
              </button>

              {/* Theme Toggle inside Mobile Menu */}
              <button
                className="dropdown-tool-btn"
                onClick={() => {
                  onThemeToggle();
                  setShowToolsDropdown(false);
                }}
              >
                <i className={theme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>{" "}
                Theme: {theme === "light" ? "Light" : "Dark"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
