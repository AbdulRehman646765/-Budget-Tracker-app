"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Eye,
  EyeOff,
  PieChart,
  Lightbulb,
  CreditCard,
  CalendarDays,
  BarChart2,
  History,
  Bell,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";

type ToolKey =
  | "chart"
  | "insights"
  | "subscriptions"
  | "calendar"
  | "comparison"
  | "history"
  | "alert";

interface ToolsBarProps {
  visibleTools: Record<ToolKey, boolean>;
  onToggleTool: (tool: ToolKey) => void;
  onSelectOption: (val: string) => void;
}

const toolPills: { key: ToolKey; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { key: "chart",         label: "Chart",      Icon: PieChart },
  { key: "insights",      label: "Insights",   Icon: Lightbulb },
  { key: "subscriptions", label: "Bills",      Icon: CreditCard },
  { key: "calendar",      label: "Calendar",   Icon: CalendarDays },
  { key: "comparison",    label: "Comparison", Icon: BarChart2 },
  { key: "history",       label: "History",    Icon: History },
  { key: "alert",         label: "Alerts",     Icon: Bell },
];

const dropdownOptions: { value: string; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { value: "all",           label: "Show All Tools",     Icon: Eye },
  { value: "chart",         label: "Expense Breakdown",  Icon: PieChart },
  { value: "insights",      label: "Smart Insights",     Icon: Lightbulb },
  { value: "subscriptions", label: "Recurring Bills",    Icon: CreditCard },
  { value: "calendar",      label: "Spending Calendar",  Icon: CalendarDays },
  { value: "comparison",    label: "Monthly Comparison", Icon: BarChart2 },
  { value: "history",       label: "History & Export",   Icon: History },
  { value: "alert",         label: "Alert Settings",     Icon: Bell },
  { value: "none",          label: "Hide Extra Tools",   Icon: EyeOff },
];

export const ToolsBar: React.FC<ToolsBarProps> = ({
  visibleTools,
  onToggleTool,
  onSelectOption,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(dropdownOptions[dropdownOptions.length - 1]);
  const [dropPos, setDropPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  // Recalculate dropdown position relative to viewport
  const updatePosition = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setDropPos({
      top: rect.bottom + window.scrollY + 6,
      right: window.innerWidth - rect.right,
    });
  }, []);

  // Update position on scroll / resize while open
  useEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        btnRef.current &&
        !btnRef.current.contains(e.target as Node) &&
        !(e.target as Element).closest(".tools-dropdown-portal")
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSelect = (opt: (typeof dropdownOptions)[0]) => {
    setSelected(opt);
    setOpen(false);
    onSelectOption(opt.value);
  };

  // Portal: render dropdown at document.body to escape any stacking context
  const dropdownPortal =
    open && typeof document !== "undefined"
      ? createPortal(
          <ul
            className="tools-dropdown-list tools-dropdown-portal"
            role="listbox"
            style={{
              position: "absolute",
              top: dropPos.top,
              right: dropPos.right,
            }}
          >
            {dropdownOptions.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={selected.value === opt.value}
                className={`tools-dropdown-item ${selected.value === opt.value ? "selected" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent button blur before click
                  handleSelect(opt);
                }}
              >
                <opt.Icon size={14} />
                <span>{opt.label}</span>
              </li>
            ))}
          </ul>,
          document.body
        )
      : null;

  return (
    <section className="glass-card tools-bar-section">
      <div className="section-title-row">
        <h2>
          <SlidersHorizontal
            size={18}
            style={{
              display: "inline",
              marginRight: 8,
              color: "var(--primary-400)",
              verticalAlign: "middle",
            }}
          />
          Extra Tools &amp; Analytics
        </h2>

        {/* Trigger button – dropdown portal renders at body */}
        <div className="tool-dropdown-wrap">
          <button
            ref={btnRef}
            type="button"
            className="tools-custom-select"
            onClick={() => setOpen((p) => !p)}
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <selected.Icon size={14} />
            <span>{selected.label}</span>
            <ChevronDown
              size={13}
              style={{
                marginLeft: "auto",
                opacity: 0.6,
                transition: "transform 0.2s",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>

          {dropdownPortal}
        </div>
      </div>

      {/* Tool Pills */}
      <div className="tool-pills-row">
        {toolPills.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`tool-pill ${visibleTools[key] ? "active" : ""}`}
            onClick={() => onToggleTool(key)}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>
    </section>
  );
};
