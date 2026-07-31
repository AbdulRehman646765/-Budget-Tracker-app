"use client";

import React, { useState } from "react";
import { CustomFormField, FieldVisibilityMap, AppTheme, DashboardTemplate, DebtEntry, CurrencySymbol } from "@/types/budget";
import { CustomSelect, CustomSelectOption } from "@/components/CustomSelect";
import { useScrollLock } from "@/hooks/useScrollLock";
import { THEMES } from "@/constants/themes";
import { DASHBOARD_TEMPLATES } from "@/constants/templates";

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
  theme?: AppTheme;
  onThemeChange?: (theme: AppTheme) => void;
  dashboardTemplate?: DashboardTemplate;
  onTemplateChange?: (template: DashboardTemplate) => void;
  onConverterClick?: () => void;
  // Khata / Debts Tracker Props
  debts?: DebtEntry[];
  currency?: CurrencySymbol;
  onAddDebt?: (debt: DebtEntry) => void;
  onToggleDebtStatus?: (id: string) => void;
  onDeleteDebt?: (id: string) => void;
  hideAmounts?: boolean;
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

const ICON_LABELS: Record<string, string> = {
  "fa-solid fa-cart-shopping": "Shopping",
  "fa-solid fa-basket-shopping": "Groceries",
  "fa-solid fa-bag-shopping": "Shopping Bag",
  "fa-solid fa-utensils": "Food / Dining",
  "fa-solid fa-burger": "Fast Food",
  "fa-solid fa-pizza-slice": "Pizza",
  "fa-solid fa-mug-hot": "Coffee / Café",
  "fa-solid fa-house": "Rent / House",
  "fa-solid fa-bolt": "Electricity",
  "fa-solid fa-faucet": "Water Bill",
  "fa-solid fa-car": "Car / Transport",
  "fa-solid fa-gas-pump": "Fuel / Petrol",
  "fa-solid fa-wifi": "Internet / Mobile",
  "fa-solid fa-briefcase": "Work / Office",
  "fa-solid fa-graduation-cap": "Education",
  "fa-solid fa-hospital": "Health / Medical",
  "fa-solid fa-shirt": "Clothing",
  "fa-solid fa-gamepad": "Entertainment",
  "fa-solid fa-credit-card": "Cards / Bank",
  "fa-solid fa-star": "Special",
  "fa-solid fa-ellipsis": "Other",
};

const PRESET_ICON_OPTIONS: CustomSelectOption[] = Object.entries(ICON_LABELS).map(([value, label]) => ({
  value,
  label,
  iconName: value,
}));

const TRANSACTION_TYPE_OPTIONS = [
  { value: "receivable", label: "Paisy Leny Hain (I am owed)", iconName: "fa-solid fa-arrow-down-left", color: "#4ade80" },
  { value: "payable", label: "Paisy Deny Hain (I owe)", iconName: "fa-solid fa-arrow-up-right", color: "#f87171" },
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
  onExportJSON,
  onImportJSON,
  theme = "dark",
  onThemeChange,
  dashboardTemplate = "classic",
  onTemplateChange,
  onConverterClick,
  debts = [],
  currency = "Rs.",
  onAddDebt,
  onToggleDebtStatus,
  onDeleteDebt,
  hideAmounts = false,
}) => {
  useScrollLock(show);

  const [activeTab, setActiveTab] = useState<
    "visibility" | "custom_fields" | "debts" | "templates" | "themes" | "backup"
  >("visibility");

  // Form state for custom fields
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldIcon, setFieldIcon] = useState(PRESET_ICON_OPTIONS[0].value);
  const [fieldDefaultVal, setFieldDefaultVal] = useState<number | "">("");

  // Khata / Debt state
  const [debtPersonName, setDebtPersonName] = useState("");
  const [debtType, setDebtType] = useState<"receivable" | "payable">("receivable");
  const [debtAmount, setDebtAmount] = useState<number | "">("");
  const [debtNotes, setDebtNotes] = useState("");
  const [debtActiveTab, setDebtActiveTab] = useState<"all" | "receivable" | "payable">("all");

  if (!show) return null;

  const handleToggleVisibility = (key: string) => {
    const isCurrentlyVisible = visibility[key] !== false;
    onVisibilityChange({
      ...visibility,
      [key]: !isCurrentlyVisible,
    });
  };

  const handleSaveCustomField = () => {
    const trimmedLabel = fieldLabel.trim();
    if (!trimmedLabel) return;

    if (editingId) {
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

  const handleAddDebtRecord = () => {
    const trimmedName = debtPersonName.trim();
    const numAmount = Number(debtAmount);
    if (!trimmedName || !numAmount || numAmount <= 0) return;

    const newEntry: DebtEntry = {
      id: Date.now().toString(),
      type: debtType,
      personName: trimmedName,
      amount: numAmount,
      date: new Date().toLocaleDateString(),
      notes: debtNotes.trim(),
      status: "pending",
    };

    if (onAddDebt) onAddDebt(newEntry);
    setDebtPersonName("");
    setDebtAmount("");
    setDebtNotes("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImportJSON(files[0]);
      e.target.value = "";
    }
  };

  const totalReceivables = debts
    .filter((d) => d.type === "receivable" && d.status === "pending")
    .reduce((sum, d) => sum + d.amount, 0);

  const totalPayables = debts
    .filter((d) => d.type === "payable" && d.status === "pending")
    .reduce((sum, d) => sum + d.amount, 0);

  const filteredDebts = debts.filter((d) => {
    if (debtActiveTab === "receivable") return d.type === "receivable";
    if (debtActiveTab === "payable") return d.type === "payable";
    return true;
  });

  return (
    <div
      className="popup-overlay show"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="popup-content settings-modal-box" style={{ maxWidth: "640px", width: "95%", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <div className="popup-header">
          <h3>
            <i className="fa-solid fa-sliders"></i> App & Form Settings
          </h3>
          <button className="popup-close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Tab Navigation — 3-column grid for clean, balanced 3x2 alignment */}
        <div
          className="settings-tabs"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "8px",
            marginBottom: "16px",
            borderBottom: "1px solid var(--border-card)",
            paddingBottom: "12px",
          }}
        >
          <button
            className={`settings-tab-btn ${activeTab === "visibility" ? "active" : ""}`}
            onClick={() => setActiveTab("visibility")}
            style={{ justifyContent: "center", width: "100%", padding: "10px 12px" }}
          >
            <i className="fa-solid fa-eye"></i> Form Fields
          </button>
          <button
            className={`settings-tab-btn ${activeTab === "custom_fields" ? "active" : ""}`}
            onClick={() => setActiveTab("custom_fields")}
            style={{ justifyContent: "center", width: "100%", padding: "10px 12px" }}
          >
            <i className="fa-solid fa-plus-circle"></i> Custom Inputs
          </button>
          <button
            className={`settings-tab-btn ${activeTab === "debts" ? "active" : ""}`}
            onClick={() => setActiveTab("debts")}
            style={{ justifyContent: "center", width: "100%", padding: "10px 12px" }}
          >
            <i className="fa-solid fa-hand-holding-dollar"></i> Khata Tracker
          </button>
          <button
            className={`settings-tab-btn ${activeTab === "templates" ? "active" : ""}`}
            onClick={() => setActiveTab("templates")}
            style={{ justifyContent: "center", width: "100%", padding: "10px 12px" }}
          >
            <i className="fa-solid fa-table-cells"></i> Dashboard Mode
          </button>
          <button
            className={`settings-tab-btn ${activeTab === "themes" ? "active" : ""}`}
            onClick={() => setActiveTab("themes")}
            style={{ justifyContent: "center", width: "100%", padding: "10px 12px" }}
          >
            <i className="fa-solid fa-palette"></i> Color Themes
          </button>
          <button
            className={`settings-tab-btn ${activeTab === "backup" ? "active" : ""}`}
            onClick={() => setActiveTab("backup")}
            style={{ justifyContent: "center", width: "100%", padding: "10px 12px" }}
          >
            <i className="fa-solid fa-database"></i> Backup & Restore
          </button>
        </div>

        <div style={{ overflowY: "auto", paddingRight: "4px", flex: 1 }}>

          {/* TAB 1: VISIBILITY CHECKS */}
          {activeTab === "visibility" && (
            <div className="settings-tab-body">
              <p className="settings-subtext">
                <i className="fa-solid fa-circle-info"></i> Toggle which fields appear in your main Budget Form.
              </p>

              <div className="visibility-grid">
                <h4 className="visibility-section-title">Standard Inputs</h4>
                {BUILT_IN_FIELDS.map((item) => {
                  const isChecked = visibility[item.key] !== false;
                  return (
                    <label key={item.key} className="visibility-item-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "var(--bg-input)", borderRadius: "var(--radius-sm)", marginBottom: "6px" }}>
                      <div className="visibility-item-left" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <i className={item.iconName} style={{ width: "16px", color: "var(--primary-400)" }}></i>
                        <span style={{ fontSize: "13px", fontWeight: 500 }}>{item.label}</span>
                      </div>
                      <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleVisibility(item.key)}
                        style={{ width: "18px", height: "18px", cursor: "pointer" }}
                      />
                    </label>
                  );
                })}

                {customFields.length > 0 && (
                  <>
                    <h4 className="visibility-section-title" style={{ marginTop: "16px", marginBottom: "8px" }}>
                      Your Custom Inputs
                    </h4>
                    {customFields.map((field) => {
                      const isChecked = visibility[field.key] !== false;
                      return (
                        <label key={field.id} className="visibility-item-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "var(--bg-input)", borderRadius: "var(--radius-sm)", marginBottom: "6px" }}>
                          <div className="visibility-item-left" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <i className={field.iconName} style={{ width: "16px", color: "var(--primary-400)" }}></i>
                            <span style={{ fontSize: "13px", fontWeight: 500 }}>{field.label}</span>
                          </div>
                          <input
                            type="checkbox"
                            className="custom-checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleVisibility(field.key)}
                            style={{ width: "18px", height: "18px", cursor: "pointer" }}
                          />
                        </label>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOM FORM FIELDS */}
          {activeTab === "custom_fields" && (
            <div className="settings-tab-body">
              <div className="glass-card" style={{ padding: "16px", marginBottom: "16px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "12px", color: "var(--text-primary)" }}>
                  <i className={editingId ? "fa-solid fa-pen-to-square" : "fa-solid fa-plus-circle"}></i>{" "}
                  {editingId ? "Edit Custom Input" : "Add New Custom Form Input"}
                </h4>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div className="input-group">
                    <label>Input Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Internet Bill / Gym Membership"
                      value={fieldLabel}
                      onChange={(e) => setFieldLabel(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label>Icon</label>
                    <CustomSelect
                      options={PRESET_ICON_OPTIONS}
                      value={fieldIcon}
                      onChange={(val) => setFieldIcon(val)}
                    />
                  </div>

                  <div className="input-group">
                    <label>Default Value (Amount)</label>
                    <input
                      type="number"
                      placeholder="e.g. 2000 (Optional)"
                      value={fieldDefaultVal}
                      onChange={(e) => setFieldDefaultVal(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                    <button className="btn btn-primary btn-sm" onClick={handleSaveCustomField} style={{ flex: 1 }}>
                      <i className="fa-solid fa-check"></i> {editingId ? "Update Input" : "Save Input"}
                    </button>
                    {editingId && (
                      <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* List of Custom Inputs */}
              <div>
                <h4 className="visibility-section-title" style={{ marginBottom: "8px" }}>Active Custom Inputs</h4>
                {customFields.length === 0 ? (
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic", padding: "10px" }}>
                    No custom inputs added yet.
                  </p>
                ) : (
                  customFields.map((field) => (
                    <div key={field.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "var(--bg-input)", borderRadius: "var(--radius-sm)", marginBottom: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <i className={field.iconName} style={{ color: "var(--primary-400)", width: "16px" }}></i>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 600 }}>{field.label}</div>
                          {field.defaultValue ? (
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Default: {field.defaultValue}</div>
                          ) : null}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "6px" }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleStartEdit(field)} title="Edit">
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button className="cat-delete-btn" onClick={() => onDeleteCustomField(field.id)} title="Delete">
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: KHATA / DEBTS TRACKER INTEGRATED INSIDE SETTINGS */}
          {activeTab === "debts" && (
            <div className="settings-tab-body">
              {/* Summary Cards */}
              <div className="debts-summary-cards" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                <div className="debt-summary-card debt-card-leny" style={{ padding: "12px 14px", borderRadius: "var(--radius-sm)", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", gap: "10px" }}>
                  <div className="debt-summary-icon" style={{ color: "var(--success-500)", fontSize: "18px" }}>
                    <i className="fa-solid fa-arrow-down-left"></i>
                  </div>
                  <div>
                    <span className="debt-summary-label" style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Paisy Leny Hain (Receivable)</span>
                    <h4 className="debt-summary-value" style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--success-500)" }}>
                      {hideAmounts ? "••••" : `${currency} ${totalReceivables.toLocaleString()}`}
                    </h4>
                  </div>
                </div>

                <div className="debt-summary-card debt-card-deny" style={{ padding: "12px 14px", borderRadius: "var(--radius-sm)", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", gap: "10px" }}>
                  <div className="debt-summary-icon" style={{ color: "var(--danger-500)", fontSize: "18px" }}>
                    <i className="fa-solid fa-arrow-up-right"></i>
                  </div>
                  <div>
                    <span className="debt-summary-label" style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Paisy Deny Hain (Payable)</span>
                    <h4 className="debt-summary-value" style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--danger-500)" }}>
                      {hideAmounts ? "••••" : `${currency} ${totalPayables.toLocaleString()}`}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Add Debt Form */}
              <div className="glass-card debts-form-card" style={{ padding: "14px", marginBottom: "14px" }}>
                <h4 style={{ fontSize: "13px", fontWeight: "700", marginBottom: "10px", color: "var(--text-primary)" }}>
                  <i className="fa-solid fa-plus-circle"></i> Add Debt / Due Entry
                </h4>

                <div className="debts-form-grid" style={{ marginBottom: "8px" }}>
                  <div className="input-group">
                    <label>Person Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ali Khan / Ahmed"
                      value={debtPersonName}
                      onChange={(e) => setDebtPersonName(e.target.value)}
                      style={{ height: "38px" }}
                    />
                  </div>

                  <div className="input-group">
                    <label>Type</label>
                    <CustomSelect
                      options={TRANSACTION_TYPE_OPTIONS}
                      value={debtType}
                      onChange={(val) => setDebtType(val as "receivable" | "payable")}
                    />
                  </div>
                </div>

                <div className="debts-form-grid" style={{ marginBottom: "10px" }}>
                  <div className="input-group">
                    <label>Amount ({currency})</label>
                    <input
                      type="number"
                      placeholder="e.g. 5000"
                      value={debtAmount}
                      onChange={(e) => setDebtAmount(e.target.value === "" ? "" : Number(e.target.value))}
                      style={{ height: "38px" }}
                    />
                  </div>

                  <div className="input-group">
                    <label>Notes / Reason (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Dinner split / Loan"
                      value={debtNotes}
                      onChange={(e) => setDebtNotes(e.target.value)}
                      style={{ height: "38px" }}
                    />
                  </div>
                </div>

                <button className="btn btn-primary btn-sm" onClick={handleAddDebtRecord} style={{ width: "100%", justifyContent: "center", height: "38px" }}>
                  <i className="fa-solid fa-plus"></i> Save Debt Record
                </button>
              </div>

              {/* Debt Filter Tabs */}
              <div className="settings-tabs" style={{ marginBottom: "10px" }}>
                <button className={`settings-tab-btn ${debtActiveTab === "all" ? "active" : ""}`} onClick={() => setDebtActiveTab("all")}>
                  All ({debts.length})
                </button>
                <button className={`settings-tab-btn ${debtActiveTab === "receivable" ? "active" : ""}`} onClick={() => setDebtActiveTab("receivable")}>
                  <i className="fa-solid fa-arrow-down-left" style={{ color: "#4ade80" }}></i> Leny Hain
                </button>
                <button className={`settings-tab-btn ${debtActiveTab === "payable" ? "active" : ""}`} onClick={() => setDebtActiveTab("payable")}>
                  <i className="fa-solid fa-arrow-up-right" style={{ color: "#f87171" }}></i> Deny Hain
                </button>
              </div>

              {/* Debt Records List */}
              <div className="debts-list-container" style={{ maxHeight: "260px", overflowY: "auto", paddingRight: "4px" }}>
                {filteredDebts.length === 0 ? (
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", padding: "16px" }}>
                    No records found.
                  </p>
                ) : (
                  filteredDebts.map((item) => {
                    const isReceivable = item.type === "receivable";
                    const isSettled = item.status === "settled";

                    return (
                      <div key={item.id} className={`debt-item-row ${isSettled ? "settled" : ""}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "var(--bg-input)", borderRadius: "var(--radius-sm)", marginBottom: "6px" }}>
                        <div className="debt-item-left" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div className={`debt-type-badge ${isReceivable ? "leny" : "deny"}`} style={{ width: "28px", height: "28px", borderRadius: "50%", background: isReceivable ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: isReceivable ? "#4ade80" : "#f87171", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>
                            <i className={isReceivable ? "fa-solid fa-arrow-down-left" : "fa-solid fa-arrow-up-right"}></i>
                          </div>

                          <div>
                            <div className="debt-person-name" style={{ fontSize: "13px", fontWeight: 600 }}>
                              {item.personName}{" "}
                              <span className={`debt-status-tag ${isSettled ? "status-settled" : "status-pending"}`} style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "10px", background: isSettled ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)", color: isSettled ? "#4ade80" : "#fbbf24" }}>
                                {isSettled ? "Settled" : "Pending"}
                              </span>
                            </div>
                            <div className="debt-meta" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                              {item.date} {item.notes ? `• ${item.notes}` : ""}
                            </div>
                          </div>
                        </div>

                        <div className="debt-item-right" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span className={`debt-amount ${isReceivable ? "text-leny" : "text-deny"}`} style={{ fontSize: "13px", fontWeight: 700, color: isReceivable ? "#4ade80" : "#f87171" }}>
                            {hideAmounts ? "••••" : `${isReceivable ? "+" : "-"}${currency} ${item.amount.toLocaleString()}`}
                          </span>

                          <button
                            className={`btn btn-sm ${isSettled ? "btn-secondary" : "btn-success"}`}
                            onClick={() => onToggleDebtStatus && onToggleDebtStatus(item.id)}
                            title={isSettled ? "Mark as Pending" : "Mark as Settled"}
                            style={{ padding: "4px 8px", fontSize: "11px" }}
                          >
                            <i className={isSettled ? "fa-solid fa-rotate-left" : "fa-solid fa-check"}></i>
                          </button>

                          <button
                            className="cat-delete-btn"
                            onClick={() => onDeleteDebt && onDeleteDebt(item.id)}
                            title="Delete Record"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 4: DASHBOARD LAYOUT TEMPLATES */}
          {activeTab === "templates" && (
            <div className="settings-tab-body">
              <p className="settings-subtext">
                <i className="fa-solid fa-table-cells"></i> Choose how your Dashboard sections are arranged.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {Object.values(DASHBOARD_TEMPLATES).map((tpl) => {
                  const isSelected = dashboardTemplate === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => onTemplateChange && onTemplateChange(tpl.id)}
                      style={{
                        padding: "14px",
                        borderRadius: "var(--radius-md)",
                        background: isSelected ? "rgba(99,102,241,0.12)" : "var(--bg-input)",
                        border: isSelected ? "2px solid var(--primary-500)" : "1px solid var(--border-input)",
                        cursor: "pointer",
                        transition: "var(--transition)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                        <i className={`fa-solid ${tpl.icon}`} style={{ fontSize: "18px", color: isSelected ? "var(--primary-500)" : "var(--text-secondary)" }}></i>
                        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>{tpl.name}</h4>
                      </div>
                      <p style={{ fontSize: "11px", color: "var(--text-secondary)", margin: 0 }}>{tpl.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: COLOR THEMES */}
          {activeTab === "themes" && (
            <div className="settings-tab-body">
              <p className="settings-subtext">
                <i className="fa-solid fa-palette"></i> Customize your app's visual color scheme.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {Object.values(THEMES).map((t) => {
                  const isSelected = theme === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => onThemeChange && onThemeChange(t.id)}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "var(--radius-md)",
                        background: isSelected ? "rgba(99,102,241,0.12)" : "var(--bg-input)",
                        border: isSelected ? "2px solid var(--primary-500)" : "1px solid var(--border-input)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "var(--transition)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <i className={`fa-solid ${t.icon}`} style={{ fontSize: "16px", color: t.primaryColor }}></i>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{t.name}</span>
                      </div>
                      <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: t.primaryColor }}></span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: BACKUP & RESTORE */}
          {activeTab === "backup" && (
            <div className="settings-tab-body">
              <p className="settings-subtext">
                <i className="fa-solid fa-database"></i> Export or import your entire budget dataset safely in JSON format.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ padding: "16px", borderRadius: "var(--radius-md)", background: "var(--bg-input)", border: "1px solid var(--border-input)" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "4px" }}>
                    <i className="fa-solid fa-download"></i> Export Data Backup
                  </h4>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "12px" }}>
                    Download a full JSON file containing all your expenses, subscriptions, settings & history.
                  </p>
                  <button className="btn btn-primary btn-sm" onClick={onExportJSON}>
                    <i className="fa-solid fa-download"></i> Export Backup (.json)
                  </button>
                </div>

                <div style={{ padding: "16px", borderRadius: "var(--radius-md)", background: "var(--bg-input)", border: "1px solid var(--border-input)" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "4px" }}>
                    <i className="fa-solid fa-upload"></i> Restore Data Backup
                  </h4>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "12px" }}>
                    Load a previously saved JSON backup file to restore all your budget data.
                  </p>
                  <label className="btn btn-secondary btn-sm" style={{ cursor: "pointer", display: "inline-flex", width: "auto" }}>
                    <i className="fa-solid fa-upload"></i> Import Backup File
                    <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: "none" }} />
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
