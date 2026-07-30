"use client";

import React, { useState } from "react";
import { CustomFormField, FieldVisibilityMap } from "@/types/budget";

interface SettingsModalProps {
  show: boolean;
  onClose: () => void;
  visibility: FieldVisibilityMap;
  onVisibilityChange: (updated: FieldVisibilityMap) => void;
  customFields: CustomFormField[];
  onAddCustomField: (field: CustomFormField) => void;
  onUpdateCustomField: (field: CustomFormField) => void;
  onDeleteCustomField: (id: string) => void;
}

const BUILT_IN_FIELDS = [
  { key: "salary", label: "Salary / Income", iconName: "fa-solid fa-money-bill-wave" },
  { key: "grocery", label: "Grocery", iconName: "fa-solid fa-cart-shopping" },
  { key: "vegetables", label: "Vegetables", iconName: "fa-solid fa-carrot" },
  { key: "fruits", label: "Fruits", iconName: "fa-solid fa-apple-whole" },
  { key: "transport", label: "Transport", iconName: "fa-solid fa-bus" },
  { key: "mobile", label: "Mobile / Internet", iconName: "fa-solid fa-wifi" },
  { key: "goal", label: "Savings Goal", iconName: "fa-solid fa-bullseye" },
];

const PRESET_ICONS = [
  "fa-solid fa-house-chimney",
  "fa-solid fa-bolt",
  "fa-solid fa-droplet",
  "fa-solid fa-shield-halved",
  "fa-solid fa-briefcase",
  "fa-solid fa-graduation-cap",
  "fa-solid fa-dumbbell",
  "fa-solid fa-gamepad",
  "fa-solid fa-shirt",
  "fa-solid fa-car",
  "fa-solid fa-gas-pump",
  "fa-solid fa-plane",
  "fa-solid fa-baby",
  "fa-solid fa-paw",
  "fa-solid fa-heart-pulse",
  "fa-solid fa-stethoscope",
  "fa-solid fa-pills",
  "fa-solid fa-credit-card",
  "fa-solid fa-piggy-bank",
  "fa-solid fa-hand-holding-dollar",
  "fa-solid fa-tv",
  "fa-solid fa-clapperboard",
  "fa-solid fa-music",
  "fa-solid fa-utensils",
  "fa-solid fa-mug-hot",
  "fa-solid fa-bag-shopping",
  "fa-solid fa-wrench",
  "fa-solid fa-screwdriver-wrench",
  "fa-solid fa-laptop",
  "fa-solid fa-mobile-screen-button",
  "fa-solid fa-gift",
  "fa-solid fa-receipt",
  "fa-solid fa-newspaper",
  "fa-solid fa-vault",
  "fa-solid fa-key",
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  show,
  onClose,
  visibility,
  onVisibilityChange,
  customFields,
  onAddCustomField,
  onUpdateCustomField,
  onDeleteCustomField,
}) => {
  const [activeTab, setActiveTab] = useState<"visibility" | "custom_fields">("visibility");

  // Form state for creating/editing a custom field
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldIcon, setFieldIcon] = useState(PRESET_ICONS[0]);
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
    setFieldIcon(PRESET_ICONS[0]);
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
    setFieldIcon(PRESET_ICONS[0]);
    setFieldDefaultVal("");
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
            <i className="fa-solid fa-eye"></i> Form Fields (Hide/Show)
          </button>
          <button
            className={`settings-tab-btn ${activeTab === "custom_fields" ? "active" : ""}`}
            onClick={() => setActiveTab("custom_fields")}
          >
            <i className="fa-solid fa-plus-circle"></i> Custom Inputs Manager
          </button>
        </div>

        {/* TAB 1: VISIBILITY CHECKS */}
        {activeTab === "visibility" && (
          <div className="settings-tab-body">
            <p className="settings-subtext">
              <i className="fa-solid fa-circle-info"></i> Select which fields to display in the main Budget Form. Unchecked fields will be hidden.
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
                  <h4 className="visibility-section-title" style={{ marginTop: "16px" }}>
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
            <div className="glass-card" style={{ padding: "16px", marginBottom: "18px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "12px", color: "var(--text-primary)" }}>
                <i className={editingId ? "fa-solid fa-pen-to-square" : "fa-solid fa-plus-circle"}></i>{" "}
                {editingId ? "Edit Custom Input Field" : "Create New Custom Input Field"}
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
                    setFieldDefaultVal(e.target.value === "" ? "" : Number(e.target.value))
                  }
                />
              </div>

              {/* Icon Picker */}
              <div className="input-group" style={{ marginBottom: "14px" }}>
                <label>Choose Icon</label>
                <div className="icon-swatches">
                  {PRESET_ICONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      className={`icon-swatch ${fieldIcon === ic ? "active" : ""}`}
                      onClick={() => setFieldIcon(ic)}
                    >
                      <i className={ic}></i>
                    </button>
                  ))}
                </div>
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
            <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "10px", color: "var(--text-primary)" }}>
              <i className="fa-solid fa-list"></i> Your Custom Form Fields ({customFields.length})
            </h4>

            {customFields.length === 0 ? (
              <p style={{ fontSize: "13px", color: "var(--text-muted)", fontStyle: "italic" }}>
                No custom form fields created yet. Fill out the form above to add your first custom input field to BudgetForm!
              </p>
            ) : (
              <div className="cat-list-container">
                {customFields.map((field) => (
                  <div key={field.id} className="cat-manage-item">
                    <div className="cat-manage-left">
                      <span className="cat-badge-preview" style={{ background: "rgba(99, 102, 241, 0.25)", color: "var(--primary-400)" }}>
                        <i className={field.iconName}></i> {field.label}
                      </span>
                      {field.defaultValue ? (
                        <span className="cat-built-in-tag">Def: {field.defaultValue}</span>
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
      </div>
    </div>
  );
};
