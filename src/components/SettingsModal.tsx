"use client";

import React, { useState } from "react";
import { CustomFormField, FieldVisibilityMap } from "@/types/budget";
import { CustomSelect, CustomSelectOption } from "@/components/CustomSelect";

interface SettingsModalProps {
  show: boolean;
  onClose: () => void;
  visibility: FieldVisibilityMap;
  onVisibilityChange: (updated: FieldVisibilityMap) => void;
  customFields: CustomFormField[];
  onAddCustomField: (field: CustomFormField) => void;
  onUpdateCustomField: (field: CustomFormField) => void;
  onDeleteCustomField: (id: string) => void;
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
}

const BUILT_IN_FIELDS = [
  {
    key: "salary",
    label: "Salary / Income",
    iconName: "fa-solid fa-money-bill-wave",
  },
  { key: "grocery", label: "Grocery", iconName: "fa-solid fa-cart-shopping" },
  { key: "vegetables", label: "Vegetables", iconName: "fa-solid fa-carrot" },
  { key: "fruits", label: "Fruits", iconName: "fa-solid fa-apple-whole" },
  { key: "transport", label: "Transport", iconName: "fa-solid fa-bus" },
  { key: "mobile", label: "Mobile / Internet", iconName: "fa-solid fa-wifi" },
  { key: "goal", label: "Savings Goal", iconName: "fa-solid fa-bullseye" },
];

const ICON_LABELS: Record<string, string> = {
  "fa-solid fa-cart-shopping": "Shopping",
  "fa-solid fa-basket-shopping": "Groceries",
  "fa-solid fa-bag-shopping": "Shopping Bag",

  "fa-solid fa-utensils": "Food / Dining",
  "fa-solid fa-burger": "Fast Food",
  "fa-solid fa-pizza-slice": "Pizza",
  "fa-solid fa-mug-hot": "Coffee / Café",
  "fa-solid fa-glass-water-droplet": "Drinks",

  "fa-solid fa-house": "Rent",
  "fa-solid fa-house-user": "House",
  "fa-solid fa-house-chimney": "House / Rent",

  "fa-solid fa-bolt": "Electricity",
  "fa-solid fa-faucet": "Water Bill",
  "fa-solid fa-droplet": "Water",
  "fa-solid fa-fire": "Gas Bill",

  "fa-solid fa-car": "Car",
  "fa-solid fa-gas-pump": "Fuel / Petrol",
  "fa-solid fa-bus": "Bus",
  "fa-solid fa-train": "Train",
  "fa-solid fa-motorcycle": "Motorcycle",
  "fa-solid fa-plane": "Travel",

  "fa-solid fa-wifi": "Internet",
  "fa-solid fa-mobile-screen": "Mobile",
  "fa-solid fa-mobile-screen-button": "Mobile",
  "fa-solid fa-tv": "TV / OTT",
  "fa-solid fa-laptop": "Laptop",
  "fa-solid fa-computer": "Computer",

  "fa-solid fa-briefcase": "Work / Office",
  "fa-solid fa-graduation-cap": "Education",
  "fa-solid fa-book": "Books",

  "fa-solid fa-user-doctor": "Doctor",
  "fa-solid fa-stethoscope": "Doctor",
  "fa-solid fa-hospital": "Hospital",
  "fa-solid fa-heart-pulse": "Health",
  "fa-solid fa-pills": "Medicine",
  "fa-solid fa-dumbbell": "Gym / Fitness",

  "fa-solid fa-shirt": "Clothing",
  "fa-solid fa-shoe-prints": "Shoes",
  "fa-solid fa-gem": "Jewellery",

  "fa-solid fa-gamepad": "Gaming",
  "fa-solid fa-music": "Music",
  "fa-solid fa-film": "Movies",
  "fa-solid fa-clapperboard": "Entertainment",
  "fa-solid fa-ticket": "Events",
  "fa-solid fa-camera": "Photography",

  "fa-solid fa-gift": "Gifts",
  "fa-solid fa-cake-candles": "Birthday",
  "fa-solid fa-champagne-glasses": "Celebration",

  "fa-solid fa-child": "Kids",
  "fa-solid fa-baby": "Baby",
  "fa-solid fa-paw": "Pets",

  "fa-solid fa-credit-card": "Credit Card",
  "fa-solid fa-money-bill-wave": "Cash",
  "fa-solid fa-building-columns": "Bank",
  "fa-solid fa-piggy-bank": "Savings",
  "fa-solid fa-hand-holding-dollar": "Loan / Money",
  "fa-solid fa-coins": "Coins",

  "fa-solid fa-receipt": "Receipt / Bills",
  "fa-solid fa-newspaper": "Subscriptions",
  "fa-solid fa-vault": "Vault",
  "fa-solid fa-key": "Keys",
  "fa-solid fa-wrench": "Maintenance",
  "fa-solid fa-screwdriver-wrench": "Repairs",
  "fa-solid fa-shield-halved": "Insurance",

  "fa-solid fa-tree": "Nature",
  "fa-solid fa-leaf": "Garden",

  "fa-solid fa-heart": "Favourite",
  "fa-solid fa-star": "Special",
  "fa-solid fa-ellipsis": "Other",
};

const PRESET_ICON_OPTIONS: CustomSelectOption[] = Object.entries(
  ICON_LABELS,
).map(([value, label]) => ({ value, label, iconName: value }));

export const SettingsModal: React.FC<SettingsModalProps> = ({
  show,
  onClose,
  visibility,
  onVisibilityChange,
  customFields,
  onAddCustomField,
  onUpdateCustomField,
  onDeleteCustomField,
  onExportJSON,
  onImportJSON,
}) => {
  const [activeTab, setActiveTab] = useState<
    "visibility" | "custom_fields" | "backup"
  >("visibility");

  // Form state for creating/editing a custom field
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldIcon, setFieldIcon] = useState(PRESET_ICON_OPTIONS[0].value);
  const [fieldDefaultVal, setFieldDefaultVal] = useState<number | "">("");

  if (!show) return null;

  const handleToggleVisibility = (key: string) => {
    const isCurrentlyVisible = visibility[key] !== false; // default to true
    onVisibilityChange({
      ...visibility,
      [key]: !isCurrentlyVisible,
    });
  };

  const handleSaveCustomField = () => {
    const trimmedLabel = fieldLabel.trim();
    if (!trimmedLabel) return;

    if (editingId) {
      // Edit mode
      const existing = customFields.find((f) => f.id === editingId);
      if (existing) {
        onUpdateCustomField({
          ...existing,
          label: trimmedLabel,
          iconName: fieldIcon,
          defaultValue: Number(fieldDefaultVal) || 0,
        });
      }
    } else {
      // Create mode
      const newKey = "custom_field_" + Date.now();
      const newField: CustomFormField = {
        id: Date.now().toString(),
        key: newKey,
        label: trimmedLabel,
        iconName: fieldIcon,
        defaultValue: Number(fieldDefaultVal) || 0,
      };
      onAddCustomField(newField);
    }

    // Reset form
    setEditingId(null);
    setFieldLabel("");
    setFieldIcon(PRESET_ICON_OPTIONS[0].value);
    setFieldDefaultVal("");
  };

  const handleStartEdit = (field: CustomFormField) => {
    setEditingId(field.id);
    setFieldLabel(field.label);
    setFieldIcon(field.iconName);
    setFieldDefaultVal(field.defaultValue || "");
    setActiveTab("custom_fields");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFieldLabel("");
    setFieldIcon(PRESET_ICON_OPTIONS[0].value);
    setFieldDefaultVal("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImportJSON(files[0]);
      e.target.value = "";
    }
  };

  return (
    <div
      className="popup-overlay show"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="popup-content settings-modal-box">
        <div className="popup-header">
          <h3>
            <i className="fa-solid fa-sliders"></i> App & Form Settings
          </h3>
          <button className="popup-close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="settings-tabs">
          <button
            className={`settings-tab-btn ${activeTab === "visibility" ? "active" : ""}`}
            onClick={() => setActiveTab("visibility")}
          >
            <i className="fa-solid fa-eye"></i> Form Fields
          </button>
          <button
            className={`settings-tab-btn ${activeTab === "custom_fields" ? "active" : ""}`}
            onClick={() => setActiveTab("custom_fields")}
          >
            <i className="fa-solid fa-plus-circle"></i> Custom Inputs
          </button>
          <button
            className={`settings-tab-btn ${activeTab === "backup" ? "active" : ""}`}
            onClick={() => setActiveTab("backup")}
          >
            <i className="fa-solid fa-database"></i> Backup & Restore
          </button>
        </div>

        {/* TAB 1: VISIBILITY CHECKS */}
        {activeTab === "visibility" && (
          <div className="settings-tab-body">
            <p className="settings-subtext">
              <i className="fa-solid fa-circle-info"></i> Select which fields to
              display in the main Budget Form. Unchecked fields will be hidden.
            </p>

            <div className="visibility-grid">
              <h4 className="visibility-section-title">Standard Inputs</h4>
              {BUILT_IN_FIELDS.map((item) => {
                const isChecked = visibility[item.key] !== false;
                return (
                  <label key={item.key} className="visibility-item-row">
                    <div className="visibility-item-left">
                      <i className={item.iconName}></i>
                      <span>{item.label}</span>
                    </div>
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleVisibility(item.key)}
                    />
                  </label>
                );
              })}

              {customFields.length > 0 && (
                <>
                  <h4
                    className="visibility-section-title"
                    style={{ marginTop: "16px" }}
                  >
                    Your Custom Inputs
                  </h4>
                  {customFields.map((field) => {
                    const isChecked = visibility[field.key] !== false;
                    return (
                      <label key={field.id} className="visibility-item-row">
                        <div className="visibility-item-left">
                          <i className={field.iconName}></i>
                          <span>{field.label}</span>
                        </div>
                        <input
                          type="checkbox"
                          className="custom-checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleVisibility(field.key)}
                        />
                      </label>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOM FORM FIELDS MANAGER */}
        {activeTab === "custom_fields" && (
          <div className="settings-tab-body">
            <div
              className="glass-card"
              style={{ padding: "16px", marginBottom: "18px" }}
            >
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  marginBottom: "12px",
                  color: "var(--text-primary)",
                }}
              >
                <i
                  className={
                    editingId
                      ? "fa-solid fa-pen-to-square"
                      : "fa-solid fa-plus-circle"
                  }
                ></i>{" "}
                {editingId
                  ? "Edit Custom Input Field"
                  : "Create New Custom Input Field"}
              </h4>

              {/* Label */}
              <div className="input-group" style={{ marginBottom: "12px" }}>
                <label>Field Name / Label</label>
                <input
                  type="text"
                  placeholder="e.g. House Rent / Electricity / Gym"
                  value={fieldLabel}
                  onChange={(e) => setFieldLabel(e.target.value)}
                />
              </div>

              {/* Default Value */}
              <div className="input-group" style={{ marginBottom: "12px" }}>
                <label>Default Amount (Optional)</label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  value={fieldDefaultVal}
                  onChange={(e) =>
                    setFieldDefaultVal(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                />
              </div>

              {/* Icon Picker */}
              <div className="input-group" style={{ marginBottom: "14px" }}>
                <label>Choose Icon</label>
                <CustomSelect
                  options={PRESET_ICON_OPTIONS}
                  value={fieldIcon}
                  onChange={setFieldIcon}
                  placeholder="Select an icon..."
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSaveCustomField}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  <i className="fa-solid fa-floppy-disk"></i>{" "}
                  {editingId ? "Update Input Field" : "Add Input Field"}
                </button>
                {editingId && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* List of Custom Inputs */}
            <h4
              style={{
                fontSize: "14px",
                fontWeight: "700",
                marginBottom: "10px",
                color: "var(--text-primary)",
              }}
            >
              <i className="fa-solid fa-list"></i> Your Custom Form Fields (
              {customFields.length})
            </h4>

            {customFields.length === 0 ? (
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  fontStyle: "italic",
                }}
              >
                No custom form fields created yet. Fill out the form above to
                add your first custom input field to BudgetForm!
              </p>
            ) : (
              <div className="cat-list-container">
                {customFields.map((field) => (
                  <div key={field.id} className="cat-manage-item">
                    <div className="cat-manage-left">
                      <span
                        className="cat-badge-preview"
                        style={{
                          background: "rgba(99, 102, 241, 0.25)",
                          color: "var(--primary-400)",
                        }}
                      >
                        <i className={field.iconName}></i> {field.label}
                      </span>
                      {field.defaultValue ? (
                        <span className="cat-built-in-tag">
                          Def: {field.defaultValue}
                        </span>
                      ) : null}
                    </div>

                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        className="cat-delete-btn"
                        style={{ color: "var(--primary-400)" }}
                        onClick={() => handleStartEdit(field)}
                        title="Edit Field"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button
                        className="cat-delete-btn"
                        onClick={() => onDeleteCustomField(field.id)}
                        title="Delete Field"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: JSON BACKUP IMPORT / EXPORT */}
        {activeTab === "backup" && (
          <div className="settings-tab-body">
            <p className="settings-subtext">
              <i className="fa-solid fa-circle-info"></i> Save all your data
              (Budget entries, Custom Expenses, Subscriptions, Debts & Dues,
              Settings) as a JSON file, or restore data from a previous backup
              file.
            </p>

            <div className="backup-actions-grid">
              {/* EXPORT JSON */}
              <div className="glass-card backup-box">
                <div className="backup-box-icon text-success">
                  <i className="fa-solid fa-file-export"></i>
                </div>
                <h4>Export Backup (JSON)</h4>
                <p>
                  Download your complete app data, history, debts, and custom
                  fields into a JSON backup file.
                </p>
                <button
                  className="btn btn-success btn-sm"
                  onClick={onExportJSON}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <i className="fa-solid fa-download"></i> Save & Export JSON
                </button>
              </div>

              {/* IMPORT JSON */}
              <div className="glass-card backup-box">
                <div className="backup-box-icon text-primary">
                  <i className="fa-solid fa-file-import"></i>
                </div>
                <h4>Import Backup (JSON)</h4>
                <p>
                  Upload a previously exported JSON backup file to instantly
                  restore and reload all your data.
                </p>

                <label
                  className="btn btn-primary btn-sm file-upload-btn"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <i className="fa-solid fa-upload"></i> Upload JSON Backup
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
