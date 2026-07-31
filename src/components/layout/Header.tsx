"use client";

import React, { useEffect, useState } from "react";
import { CurrencySymbol, AppTheme, DashboardTemplate } from "@/types/budget";
import { CustomSelect, CustomSelectOption } from "@/components/CustomSelect";

const CURRENCY_OPTIONS: CustomSelectOption[] = [
  { value: "Rs.", label: "PKR", iconName: "fa-solid fa-rupee-sign" },
  { value: "$",   label: "USD", iconName: "fa-solid fa-dollar-sign" },
  { value: "€",   label: "EUR", iconName: "fa-solid fa-euro-sign" },
  { value: "AED", label: "AED", iconName: "fa-solid fa-money-bill-wave" },
  { value: "SR",  label: "SAR", iconName: "fa-solid fa-sack-dollar" },
  { value: "₹",   label: "INR", iconName: "fa-solid fa-indian-rupee-sign" },
];

export interface HeaderProps {
  currency: CurrencySymbol;
  onCurrencyChange: (curr: CurrencySymbol) => void;
  onPinClick: () => void;
  theme: AppTheme;
  onThemeChange?: (theme: AppTheme) => void;
  onThemeToggle?: () => void;
  onCalculatorClick: () => void;
  onSettingsClick: () => void;
  onConverterClick?: () => void;
  syncStatus?: "synced" | "syncing";
  dashboardTemplate?: DashboardTemplate;
  onTemplateChange?: (template: DashboardTemplate) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currency,
  onCurrencyChange,
  onPinClick,
  theme,
  onThemeChange,
  onThemeToggle,
  onCalculatorClick,
  onSettingsClick,
  onConverterClick,
}) => {
  const [currentDate, setCurrentDate] = useState("");
  const [showMobileToolsMenu, setShowMobileToolsMenu] = useState(false);

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

  const handleThemeSwitch = () => {
    if (onThemeToggle) {
      onThemeToggle();
    } else if (onThemeChange) {
      onThemeChange(theme === "light" ? "dark" : "light");
    }
  };

  const isLightMode = theme === "light";

  return (
    <header className="app-header" id="appHeader">
      {/* Logo & Title */}
      <div className="header-left" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div className="logo-icon">
          <i className="fa-solid fa-wallet"></i>
        </div>
        <div>
          <h1 style={{ margin: 0 }}>Budget Tracker</h1>
          <p className="header-date" id="todayDate">{currentDate}</p>
        </div>
      </div>

      <div className="header-right">
        {/* ── DESKTOP HEADER — 5 clean buttons ── */}
        <div className="header-desktop-actions">

          {/* 1. Currency Selector */}
          <div className="currency-select-wrapper">
            <CustomSelect
              options={CURRENCY_OPTIONS}
              value={currency}
              onChange={(val) => onCurrencyChange(val as CurrencySymbol)}
              placeholder="Currency"
            />
          </div>

          {/* 2. Quick Calculator */}
          <button className="icon-btn" id="calcBtn" onClick={onCalculatorClick} title="Quick Calculator">
            <i className="fa-solid fa-calculator"></i>
          </button>

          {/* 3. Settings (Form Fields + Khata + Themes + Templates + Backup) */}
          <button className="icon-btn" id="settingsBtn" onClick={onSettingsClick} title="App Settings">
            <i className="fa-solid fa-sliders"></i>
          </button>

          {/* 4. PIN Lock */}
          <button className="icon-btn" id="pinToggle" onClick={onPinClick} title="PIN Lock Settings">
            <i className="fa-solid fa-lock"></i>
          </button>

          {/* 5. Dark / Light Mode Toggle */}
          <button
            className="icon-btn"
            onClick={handleThemeSwitch}
            title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            <i className={`fa-solid ${isLightMode ? "fa-sun" : "fa-moon"}`}></i>
          </button>
        </div>

        {/* ── MOBILE TOOLS DROPDOWN ── */}
        <div className="header-mobile-tools">
          <button
            className="btn btn-primary extra-tools-btn"
            onClick={() => setShowMobileToolsMenu(!showMobileToolsMenu)}
            title="Extra Tools Menu"
          >
            <i className="fa-solid fa-toolbox"></i> Tools{" "}
            <i className={`fa-solid fa-chevron-${showMobileToolsMenu ? "up" : "down"}`}></i>
          </button>

          {showMobileToolsMenu && (
            <div className="extra-tools-dropdown-menu">
              <div className="dropdown-item-header">
                <i className="fa-solid fa-wrench"></i> Tools & Settings
              </div>

              {/* Currency inside Mobile */}
              <div className="dropdown-tool-row" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                  <i className="fa-solid fa-coins"></i> Currency
                </label>
                <CustomSelect
                  options={CURRENCY_OPTIONS}
                  value={currency}
                  onChange={(val) => {
                    onCurrencyChange(val as CurrencySymbol);
                    setShowMobileToolsMenu(false);
                  }}
                  placeholder="Currency"
                />
              </div>

              {/* Quick Calculator */}
              <button
                className="dropdown-tool-btn"
                onClick={() => { onCalculatorClick(); setShowMobileToolsMenu(false); }}
              >
                <i className="fa-solid fa-calculator"></i> Quick Calculator
              </button>

              {/* Settings (incl. Khata, Themes, Templates, Fields) */}
              <button
                className="dropdown-tool-btn"
                onClick={() => { onSettingsClick(); setShowMobileToolsMenu(false); }}
              >
                <i className="fa-solid fa-sliders"></i> App Settings & Khata
              </button>

              {/* PIN Lock */}
              <button
                className="dropdown-tool-btn"
                onClick={() => { onPinClick(); setShowMobileToolsMenu(false); }}
              >
                <i className="fa-solid fa-lock"></i> PIN Lock Settings
              </button>

              {/* Dark / Light Mode */}
              <button
                className="dropdown-tool-btn"
                onClick={() => { handleThemeSwitch(); setShowMobileToolsMenu(false); }}
              >
                <i className={`fa-solid ${isLightMode ? "fa-sun" : "fa-moon"}`} />{" "}
                {isLightMode ? "Light Mode" : "Dark Mode"}
              </button>

              {/* Live Currency Converter */}
              {onConverterClick && (
                <button
                  className="dropdown-tool-btn"
                  onClick={() => { onConverterClick(); setShowMobileToolsMenu(false); }}
                >
                  <i className="fa-solid fa-arrows-rotate"></i> Live Currency Converter
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
