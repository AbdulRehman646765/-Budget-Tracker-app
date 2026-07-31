"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

export interface CustomSelectOption {
  value: string;
  label: string;
  iconName?: string;
  color?: string;
}

interface CustomSelectProps {
  options: CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  fullWidth?: boolean;
}

interface PositionState {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
  isUpward: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  className = "",
  style,
  fullWidth = true,
}) => {
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState<PositionState>({
    left: 0,
    width: 0,
    maxHeight: 280,
    isUpward: false,
  });
  const btnRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || null;

  const updatePosition = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - rect.bottom - 12;
    const spaceAbove = rect.top - 12;
    const shouldFlipUpward = spaceBelow < 200 && spaceAbove > spaceBelow;

    // Calculate clamped width & left position to prevent screen overflow on mobile
    const targetWidth = Math.min(Math.max(rect.width, 160), viewportWidth - 24);
    let calculatedLeft = rect.left;
    if (calculatedLeft + targetWidth > viewportWidth - 12) {
      calculatedLeft = viewportWidth - targetWidth - 12;
    }
    calculatedLeft = Math.max(12, calculatedLeft);

    if (shouldFlipUpward) {
      setDropPos({
        bottom: viewportHeight - rect.top + 6,
        left: calculatedLeft,
        width: targetWidth,
        maxHeight: Math.max(140, Math.min(spaceAbove, 280)),
        isUpward: true,
      });
    } else {
      setDropPos({
        top: rect.bottom + 6,
        left: calculatedLeft,
        width: targetWidth,
        maxHeight: Math.max(140, Math.min(spaceBelow, 280)),
        isUpward: false,
      });
    }
  }, []);

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

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        btnRef.current &&
        !btnRef.current.contains(e.target as Node) &&
        !(e.target as Element).closest(".custom-select-portal")
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSelect = (opt: CustomSelectOption) => {
    onChange(opt.value);
    setOpen(false);
  };

  const portalContent =
    open && typeof document !== "undefined"
      ? createPortal(
          <ul
            className={`custom-select-portal-list custom-select-portal ${
              dropPos.isUpward ? "upward" : ""
            }`}
            role="listbox"
            style={{
              position: "fixed",
              top: dropPos.top !== undefined ? dropPos.top : "auto",
              bottom: dropPos.bottom !== undefined ? dropPos.bottom : "auto",
              left: dropPos.left,
              width: dropPos.width,
              maxHeight: dropPos.maxHeight,
              zIndex: 99999,
              marginTop: "7px",
            }}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  className={`custom-select-option ${isSelected ? "selected" : ""}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(opt);
                  }}
                >
                  {opt.color ? (
                    <span
                      className="custom-option-color-dot"
                      style={{ background: opt.color }}
                    />
                  ) : opt.iconName ? (
                    <i className={`${opt.iconName} custom-option-icon`}></i>
                  ) : null}
                  <span className="custom-option-label">{opt.label}</span>
                  {isSelected && (
                    <i className="fa-solid fa-check custom-option-check"></i>
                  )}
                </li>
              );
            })}
          </ul>,
          document.body
        )
      : null;

  return (
    <div
      className={`custom-select-wrapper ${fullWidth ? "full-width" : ""} ${className}`}
      style={style}
    >
      <button
        ref={btnRef}
        type="button"
        className="custom-select-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selectedOption ? (
          <div className="custom-select-trigger-content">
            {selectedOption.color ? (
              <span
                className="custom-option-color-dot"
                style={{ background: selectedOption.color }}
              />
            ) : selectedOption.iconName ? (
              <i className={`${selectedOption.iconName} custom-option-icon`}></i>
            ) : null}
            <span className="custom-trigger-label">{selectedOption.label}</span>
          </div>
        ) : (
          <span className="custom-trigger-placeholder">{placeholder}</span>
        )}

        <i
          className={`fa-solid fa-chevron-down custom-trigger-chevron ${
            open ? "open" : ""
          }`}
        ></i>
      </button>

      {portalContent}
    </div>
  );
};
