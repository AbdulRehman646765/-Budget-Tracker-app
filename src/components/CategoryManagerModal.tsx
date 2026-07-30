"use client";

import React, { useState } from "react";
import { CategoryConfig } from "@/types/budget";
import { DEFAULT_CATEGORIES } from "@/lib/categories";

interface CategoryManagerModalProps {
  show: boolean;
  categories: CategoryConfig[];
  onClose: () => void;
  onAddCategory: (newCategory: CategoryConfig) => void;
  onDeleteCategory: (key: string) => void;
}

const PRESET_COLORS = [
  "#a855f7", // Purple
  "#ec4899", // Pink
  "#fb7185", // Rose
  "#0ea5e9", // Sky Blue
  "#22d3ee", // Cyan
  "#14b8a6", // Teal
  "#f97316", // Orange
  "#84cc16", // Lime
  "#eab308", // Yellow
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#ef4444", // Red
];

const PRESET_ICONS = [
  "fa-solid fa-gamepad",
  "fa-solid fa-gift",
  "fa-solid fa-dumbbell",
  "fa-solid fa-paw",
  "fa-solid fa-car",
  "fa-solid fa-plane",
  "fa-solid fa-tv",
  "fa-solid fa-music",
  "fa-solid fa-briefcase",
  "fa-solid fa-shirt",
  "fa-solid fa-bolt",
  "fa-solid fa-coins",
  "fa-solid fa-house-user",
  "fa-solid fa-ticket",
  "fa-solid fa-mug-hot",
  "fa-solid fa-camera",
  "fa-solid fa-tree",
  "fa-solid fa-heart",
  "fa-solid fa-star",
  // "fa-solid fa-basketball",
  "fa-solid fa-glass-water-droplet"
];

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  show,
  categories,
  onClose,
  onAddCategory,
  onDeleteCategory,
}) => {
  const [label, setLabel] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [iconName, setIconName] = useState(PRESET_ICONS[0]);

  if (!show) return null;

  const handleAdd = () => {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) return;

    // Generate unique key
    const key = trimmedLabel.toLowerCase().replace(/[^a-z0-9]/g, "_") + "_" + Date.now();

    onAddCategory({
      key,
      label: trimmedLabel,
      color,
      iconName,
      isCustom: true,
    });

    setLabel("");
    setColor(PRESET_COLORS[0]);
    setIconName(PRESET_ICONS[0]);
  };

  const defaultKeys = DEFAULT_CATEGORIES.map((c) => c.key);

  return (
    <div
      className={`popup-overlay ${show ? "show" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="popup-content" style={{ maxWidth: "550px" }}>
        <div className="popup-header">
          <h3>
            <i className="fa-solid fa-tags"></i> Manage Categories
          </h3>
          <button className="popup-close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Create New Category Form */}
        <div className="glass-card" style={{ padding: "18px", marginBottom: "20px" }}>
          <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "12px", color: "var(--text-primary)" }}>
            <i className="fa-solid fa-plus-circle"></i> Add New Category
          </h4>

          {/* Name Input */}
          <div className="input-group" style={{ marginBottom: "14px" }}>
            <label htmlFor="catName">Category Name</label>
            <input
              type="text"
              id="catName"
              placeholder="e.g. Gaming / Pet Care / Gifts"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          {/* Color Selection */}
          <div className="input-group" style={{ marginBottom: "14px" }}>
            <label>Choose Color</label>
            <div className="color-swatches">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-swatch ${color === c ? "active" : ""}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
              <input
                type="color"
                className="custom-color-input"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                title="Custom Color Picker"
              />
            </div>
          </div>

          {/* Icon Selection */}
          <div className="input-group" style={{ marginBottom: "16px" }}>
            <label>Choose Icon</label>
            <div className="icon-swatches">
              {PRESET_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  className={`icon-swatch ${iconName === ic ? "active" : ""}`}
                  onClick={() => setIconName(ic)}
                >
                  <i className={ic}></i>
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-primary btn-sm" onClick={handleAdd} style={{ width: "100%", justifyContent: "center" }}>
            <i className="fa-solid fa-plus"></i> Save Category
          </button>
        </div>

        {/* Existing Categories List */}
        <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "10px", color: "var(--text-primary)" }}>
          <i className="fa-solid fa-list"></i> Available Categories ({categories.length})
        </h4>

        <div className="cat-list-container">
          {categories.map((cat) => {
            const isBuiltIn = defaultKeys.includes(cat.key);
            return (
              <div key={cat.key} className="cat-manage-item">
                <div className="cat-manage-left">
                  <span className="cat-badge-preview" style={{ background: cat.color }}>
                    <i className={cat.iconName}></i> {cat.label}
                  </span>
                  {isBuiltIn && <span className="cat-built-in-tag">(Built-in)</span>}
                </div>
                {!isBuiltIn && (
                  <button
                    className="cat-delete-btn"
                    onClick={() => onDeleteCategory(cat.key)}
                    title="Delete Category"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
