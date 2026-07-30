"use client";

import React, { useState } from "react";
import { CategoryConfig } from "@/types/budget";
import { DEFAULT_CATEGORIES } from "@/lib/categories";
import { CustomSelect, CustomSelectOption } from "@/components/CustomSelect";

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

const PRESET_ICON_OPTIONS: CustomSelectOption[] = [
  {
    value: "fa-solid fa-cart-shopping",
    label: "Shopping",
    iconName: "fa-solid fa-cart-shopping",
  },
  {
    value: "fa-solid fa-basket-shopping",
    label: "Groceries",
    iconName: "fa-solid fa-basket-shopping",
  },
  {
    value: "fa-solid fa-utensils",
    label: "Food",
    iconName: "fa-solid fa-utensils",
  },
  {
    value: "fa-solid fa-burger",
    label: "Fast Food",
    iconName: "fa-solid fa-burger",
  },
  {
    value: "fa-solid fa-pizza-slice",
    label: "Pizza",
    iconName: "fa-solid fa-pizza-slice",
  },
  {
    value: "fa-solid fa-mug-hot",
    label: "Coffee / Café",
    iconName: "fa-solid fa-mug-hot",
  },
  {
    value: "fa-solid fa-glass-water-droplet",
    label: "Drinks",
    iconName: "fa-solid fa-glass-water-droplet",
  },

  { value: "fa-solid fa-car", label: "Car", iconName: "fa-solid fa-car" },
  {
    value: "fa-solid fa-gas-pump",
    label: "Fuel",
    iconName: "fa-solid fa-gas-pump",
  },
  { value: "fa-solid fa-bus", label: "Bus", iconName: "fa-solid fa-bus" },
  { value: "fa-solid fa-train", label: "Train", iconName: "fa-solid fa-train" },
  {
    value: "fa-solid fa-motorcycle",
    label: "Bike",
    iconName: "fa-solid fa-motorcycle",
  },
  {
    value: "fa-solid fa-plane",
    label: "Travel",
    iconName: "fa-solid fa-plane",
  },

  {
    value: "fa-solid fa-house-user",
    label: "House",
    iconName: "fa-solid fa-house-user",
  },
  { value: "fa-solid fa-house", label: "Rent", iconName: "fa-solid fa-house" },
  {
    value: "fa-solid fa-bolt",
    label: "Electricity",
    iconName: "fa-solid fa-bolt",
  },
  {
    value: "fa-solid fa-faucet",
    label: "Water Bill",
    iconName: "fa-solid fa-faucet",
  },
  {
    value: "fa-solid fa-fire",
    label: "Gas Bill",
    iconName: "fa-solid fa-fire",
  },

  {
    value: "fa-solid fa-wifi",
    label: "Internet",
    iconName: "fa-solid fa-wifi",
  },
  {
    value: "fa-solid fa-mobile-screen",
    label: "Mobile",
    iconName: "fa-solid fa-mobile-screen",
  },
  { value: "fa-solid fa-tv", label: "TV / OTT", iconName: "fa-solid fa-tv" },
  {
    value: "fa-solid fa-laptop",
    label: "Laptop",
    iconName: "fa-solid fa-laptop",
  },
  {
    value: "fa-solid fa-computer",
    label: "Computer",
    iconName: "fa-solid fa-computer",
  },

  {
    value: "fa-solid fa-briefcase",
    label: "Work / Office",
    iconName: "fa-solid fa-briefcase",
  },
  {
    value: "fa-solid fa-graduation-cap",
    label: "Education",
    iconName: "fa-solid fa-graduation-cap",
  },
  { value: "fa-solid fa-book", label: "Books", iconName: "fa-solid fa-book" },

  {
    value: "fa-solid fa-user-doctor",
    label: "Doctor",
    iconName: "fa-solid fa-user-doctor",
  },
  {
    value: "fa-solid fa-hospital",
    label: "Hospital",
    iconName: "fa-solid fa-hospital",
  },
  {
    value: "fa-solid fa-pills",
    label: "Medicine",
    iconName: "fa-solid fa-pills",
  },
  {
    value: "fa-solid fa-heart-pulse",
    label: "Health",
    iconName: "fa-solid fa-heart-pulse",
  },
  {
    value: "fa-solid fa-dumbbell",
    label: "Gym / Fitness",
    iconName: "fa-solid fa-dumbbell",
  },

  {
    value: "fa-solid fa-shirt",
    label: "Clothing",
    iconName: "fa-solid fa-shirt",
  },
  {
    value: "fa-solid fa-shoe-prints",
    label: "Shoes",
    iconName: "fa-solid fa-shoe-prints",
  },
  { value: "fa-solid fa-gem", label: "Jewellery", iconName: "fa-solid fa-gem" },

  {
    value: "fa-solid fa-gamepad",
    label: "Gaming",
    iconName: "fa-solid fa-gamepad",
  },
  { value: "fa-solid fa-music", label: "Music", iconName: "fa-solid fa-music" },
  { value: "fa-solid fa-film", label: "Movies", iconName: "fa-solid fa-film" },
  {
    value: "fa-solid fa-ticket",
    label: "Events",
    iconName: "fa-solid fa-ticket",
  },
  {
    value: "fa-solid fa-camera",
    label: "Photography",
    iconName: "fa-solid fa-camera",
  },

  { value: "fa-solid fa-gift", label: "Gifts", iconName: "fa-solid fa-gift" },
  {
    value: "fa-solid fa-cake-candles",
    label: "Birthday",
    iconName: "fa-solid fa-cake-candles",
  },
  {
    value: "fa-solid fa-champagne-glasses",
    label: "Celebration",
    iconName: "fa-solid fa-champagne-glasses",
  },

  { value: "fa-solid fa-child", label: "Kids", iconName: "fa-solid fa-child" },
  { value: "fa-solid fa-paw", label: "Pets", iconName: "fa-solid fa-paw" },

  {
    value: "fa-solid fa-piggy-bank",
    label: "Savings",
    iconName: "fa-solid fa-piggy-bank",
  },
  {
    value: "fa-solid fa-money-bill-wave",
    label: "Cash",
    iconName: "fa-solid fa-money-bill-wave",
  },
  {
    value: "fa-solid fa-credit-card",
    label: "Card",
    iconName: "fa-solid fa-credit-card",
  },
  {
    value: "fa-solid fa-building-columns",
    label: "Bank",
    iconName: "fa-solid fa-building-columns",
  },
  { value: "fa-solid fa-coins", label: "Coins", iconName: "fa-solid fa-coins" },

  { value: "fa-solid fa-tree", label: "Nature", iconName: "fa-solid fa-tree" },
  { value: "fa-solid fa-leaf", label: "Garden", iconName: "fa-solid fa-leaf" },

  {
    value: "fa-solid fa-heart",
    label: "Favourite",
    iconName: "fa-solid fa-heart",
  },
  { value: "fa-solid fa-star", label: "Special", iconName: "fa-solid fa-star" },
  {
    value: "fa-solid fa-ellipsis",
    label: "Other",
    iconName: "fa-solid fa-ellipsis",
  },
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
  const [iconName, setIconName] = useState(PRESET_ICON_OPTIONS[0].value);

  if (!show) return null;

  const handleAdd = () => {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) return;

    // Generate unique key
    const key =
      trimmedLabel.toLowerCase().replace(/[^a-z0-9]/g, "_") + "_" + Date.now();

    onAddCategory({
      key,
      label: trimmedLabel,
      color,
      iconName,
      isCustom: true,
    });

    setLabel("");
    setColor(PRESET_COLORS[0]);
    setIconName(PRESET_ICON_OPTIONS[0].value);
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
        <div
          className="glass-card"
          style={{ padding: "18px", marginBottom: "20px" }}
        >
          <h4
            style={{
              fontSize: "14px",
              fontWeight: "700",
              marginBottom: "12px",
              color: "var(--text-primary)",
            }}
          >
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
            <CustomSelect
              options={PRESET_ICON_OPTIONS}
              value={iconName}
              onChange={setIconName}
              placeholder="Select an icon..."
            />
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={handleAdd}
            style={{ width: "100%", justifyContent: "center" }}
          >
            <i className="fa-solid fa-plus"></i> Save Category
          </button>
        </div>

        {/* Existing Categories List */}
        <h4
          style={{
            fontSize: "14px",
            fontWeight: "700",
            marginBottom: "10px",
            color: "var(--text-primary)",
          }}
        >
          <i className="fa-solid fa-list"></i> Available Categories (
          {categories.length})
        </h4>

        <div className="cat-list-container">
          {categories.map((cat) => {
            const isBuiltIn = defaultKeys.includes(cat.key);
            return (
              <div key={cat.key} className="cat-manage-item">
                <div className="cat-manage-left">
                  <span
                    className="cat-badge-preview"
                    style={{ background: cat.color }}
                  >
                    <i className={cat.iconName}></i> {cat.label}
                  </span>
                  {isBuiltIn && (
                    <span className="cat-built-in-tag">(Built-in)</span>
                  )}
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
