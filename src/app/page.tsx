"use client";

import React, { useState, useEffect } from "react";

// Layout Components
import { Header } from "@/components/layout/Header";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Existing Components
import { SummaryCards } from "@/components/SummaryCards";
import { BudgetForm } from "@/components/BudgetForm";
import { UsageProgress } from "@/components/UsageProgress";
import { ResultSummary } from "@/components/ResultSummary";
import { SavingsGoal } from "@/components/SavingsGoal";
import { CustomExpenses } from "@/components/CustomExpenses";
import { ToolsBar } from "@/components/ToolsBar";
import { DonutChart } from "@/components/DonutChart";
import { SmartInsights } from "@/components/SmartInsights";
import { Subscriptions } from "@/components/Subscriptions";
import { SpendingCalendar } from "@/components/SpendingCalendar";
import { MonthlyComparison } from "@/components/MonthlyComparison";
import { BudgetHistory } from "@/components/BudgetHistory";
import { AlertSettings } from "@/components/AlertSettings";
import { FAB, AddExpenseModal } from "@/components/AddExpenseModal";
import { AddSubscriptionModal } from "@/components/AddSubscriptionModal";
import { PinLockOverlay } from "@/components/PinLockOverlay";
import { AlertBanner } from "@/components/AlertBanner";
import { ToastProvider, useToast } from "@/components/Toast";
import { CategoryManagerModal } from "@/components/CategoryManagerModal";
import { QuickCalculatorModal } from "@/components/QuickCalculatorModal";
import { SettingsModal } from "@/components/SettingsModal";


// New UI Components
import { BackToTop } from "@/components/ui/BackToTop";

// New Feature Components
import { CurrencyConverterModal } from "@/features/converter/CurrencyConverterModal";
import { DuplicateDetectorBanner } from "@/features/duplicates/DuplicateDetectorBanner";
import { UndoNotificationToast } from "@/features/undo/UndoNotificationToast";

// Hooks
import { useTheme } from "@/hooks/useTheme";
import { useOffline } from "@/hooks/useOffline";
import { useUndo } from "@/hooks/useUndo";

// Lib & Types
import { DEFAULT_CATEGORIES, buildCategoriesMap } from "@/lib/categories";
import { checkForDuplicates } from "@/utils/duplicateDetector";
import { syncService } from "@/services/syncService";

import {
  CurrencySymbol,
  CustomExpense,
  Subscription,
  HistoryEntry,
  MonthlySummary,
  CategoryKey,
  CategoryConfig,
  CustomFormField,
  FieldVisibilityMap,
  CustomFieldValuesMap,
  DebtEntry,
  AppDataBackup,
  DashboardTemplate,
} from "@/types/budget";

type ToolKey =
  | "chart"
  | "insights"
  | "subscriptions"
  | "calendar"
  | "comparison"
  | "history"
  | "alert";

function MainApp() {
  const { showToast } = useToast();

  // Theme & Currency
  const { theme, changeTheme, toggleTheme } = useTheme();
  const [currency, setCurrency] = useState<CurrencySymbol>("Rs.");
  const [dashboardTemplate, setDashboardTemplate] = useState<DashboardTemplate>("classic");

  // Offline Status
  const { isOffline } = useOffline();

  // Undo System
  const { pushUndo, popUndo, latestUndo, dismissLatestUndo } = useUndo();

  // Duplicate Warning
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Sync Status
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing">("synced");

  // PIN Lock State
  const [appPin, setAppPin] = useState<string>("");
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [pinOverlayMode, setPinOverlayMode] = useState<
    "unlock" | "setup" | "disable" | null
  >(null);

  // Form Inputs
  const [salary, setSalary] = useState<number>(0);
  const [grocery, setGrocery] = useState<number>(0);
  const [vegetables, setVegetables] = useState<number>(0);
  const [fruits, setFruits] = useState<number>(0);
  const [transport, setTransport] = useState<number>(0);
  const [mobile, setMobile] = useState<number>(0);
  const [goal, setGoal] = useState<number>(0);

  // Lists & Settings
  const [customExpenses, setCustomExpenses] = useState<CustomExpense[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    { id: "1", name: "Netflix", amount: 1500, dueDate: 5, status: "unpaid" },
    { id: "2", name: "Wifi / Internet", amount: 2000, dueDate: 10, status: "paid" },
    { id: "3", name: "Electricity Bill", amount: 4500, dueDate: 15, status: "unpaid" },
  ]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [monthlyHistory, setMonthlyHistory] = useState<MonthlySummary[]>([]);
  const [alertSettings, setAlertSettings] = useState<{
    enabled: boolean;
    threshold: number;
  }>({ enabled: true, threshold: 80 });

  // Modals
  const [showAddExpenseModal, setShowAddExpenseModal] = useState<boolean>(false);
  const [showAddSubModal, setShowAddSubModal] = useState<boolean>(false);
  const [showCategoryManagerModal, setShowCategoryManagerModal] = useState<boolean>(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  const [showConverterModal, setShowConverterModal] = useState<boolean>(false);

  const [userCustomCategories, setUserCustomCategories] = useState<CategoryConfig[]>([]);
  const [customFormFields, setCustomFormFields] = useState<CustomFormField[]>([]);
  const [customFieldValues, setCustomFieldValues] = useState<CustomFieldValuesMap>({});
  const [fieldVisibility, setFieldVisibility] = useState<FieldVisibilityMap>({});
  const [debts, setDebts] = useState<DebtEntry[]>([]);
  const [showAlertBanner, setShowAlertBanner] = useState<boolean>(false);
  const [alertBannerText, setAlertBannerText] = useState<string>("");

  // Visible Tool Sections
  const [visibleTools, setVisibleTools] = useState<Record<ToolKey, boolean>>({
    chart: false,
    insights: false,
    subscriptions: false,
    calendar: false,
    comparison: false,
    history: false,
    alert: false,
  });

  // Init from localStorage
  useEffect(() => {
    const savedCurr = localStorage.getItem("selectedCurrency") as CurrencySymbol | null;
    if (savedCurr) setCurrency(savedCurr);

    const savedTpl = localStorage.getItem("dashboardTemplate") as DashboardTemplate | null;
    if (savedTpl) setDashboardTemplate(savedTpl);

    const pin = localStorage.getItem("appPin") || "";
    setAppPin(pin);
    if (pin) {
      setIsLocked(true);
      setPinOverlayMode(null);
    }

    const savedCustom = localStorage.getItem("customExpenses");
    if (savedCustom) setCustomExpenses(JSON.parse(savedCustom));

    const savedSubs = localStorage.getItem("subscriptions");
    if (savedSubs) setSubscriptions(JSON.parse(savedSubs));

    const savedHistory = localStorage.getItem("budgetHistory");
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedMonthly = localStorage.getItem("monthlyHistory");
    if (savedMonthly) setMonthlyHistory(JSON.parse(savedMonthly));

    const savedAlerts = localStorage.getItem("budgetAlertSettings");
    if (savedAlerts) setAlertSettings(JSON.parse(savedAlerts));

    const savedUserCat = localStorage.getItem("userCustomCategories");
    if (savedUserCat) setUserCustomCategories(JSON.parse(savedUserCat));

    setSalary(Number(localStorage.getItem("salary")) || 0);
    setGrocery(Number(localStorage.getItem("grocery")) || 0);
    setVegetables(Number(localStorage.getItem("vegetables")) || 0);
    setFruits(Number(localStorage.getItem("fruits")) || 0);
    setTransport(Number(localStorage.getItem("transport")) || 0);
    setMobile(Number(localStorage.getItem("mobile")) || 0);
    setGoal(Number(localStorage.getItem("goal")) || 0);

    const savedFormFields = localStorage.getItem("customFormFields");
    if (savedFormFields) setCustomFormFields(JSON.parse(savedFormFields));

    const savedFieldValues = localStorage.getItem("customFieldValues");
    if (savedFieldValues) setCustomFieldValues(JSON.parse(savedFieldValues));

    const savedVisibility = localStorage.getItem("budgetFieldVisibility");
    if (savedVisibility) setFieldVisibility(JSON.parse(savedVisibility));

    const savedDebts = localStorage.getItem("debtsAndDues");
    if (savedDebts) setDebts(JSON.parse(savedDebts));
  }, []);

  // BroadcastChannel real-time sync listener
  useEffect(() => {
    const unsubscribe = syncService.subscribe((remoteData) => {
      setSyncStatus("syncing");
      if (remoteData.customExpenses) setCustomExpenses(remoteData.customExpenses);
      if (remoteData.subscriptions) setSubscriptions(remoteData.subscriptions);
      if (remoteData.salary !== undefined) setSalary(remoteData.salary);
      if (remoteData.debts) setDebts(remoteData.debts);
      if (remoteData.userCustomCategories) setUserCustomCategories(remoteData.userCustomCategories);
      setTimeout(() => setSyncStatus("synced"), 500);
    });
    return () => unsubscribe();
  }, []);

  // Lock on page unload
  useEffect(() => {
    const lockApp = () => {
      if (appPin) {
        setIsLocked(true);
        setPinOverlayMode(null);
      }
    };
    window.addEventListener("beforeunload", lockApp);
    return () => window.removeEventListener("beforeunload", lockApp);
  }, [appPin]);

  // ──────────────────────────── HELPERS ────────────────────────────

  const checkPinAccess = () => {
    if (!appPin) {
      showToast("🔒 Please set a 4-digit PIN first to use this feature.", "error");
      return false;
    }
    return true;
  };

  const broadcastUpdate = (patch: object) => {
    setSyncStatus("syncing");
    syncService.notifyUpdate(patch);
    setTimeout(() => setSyncStatus("synced"), 300);
  };

  // ──────────────────────────── THEME & CURRENCY ────────────────────────────

  const changeCurrency = (symbol: CurrencySymbol) => {
    if (!checkPinAccess()) return;
    setCurrency(symbol);
    localStorage.setItem("selectedCurrency", symbol);
    showToast(`Currency changed to ${symbol}`);
  };

  const handleTemplateChange = (tpl: DashboardTemplate) => {
    setDashboardTemplate(tpl);
    localStorage.setItem("dashboardTemplate", tpl);
    showToast(`Dashboard: ${tpl} view activated`);
  };

  // ──────────────────────────── FORM INPUTS ────────────────────────────

  const handleSalaryChange = (val: number) => { setSalary(val); localStorage.setItem("salary", String(val)); };
  const handleGroceryChange = (val: number) => { setGrocery(val); localStorage.setItem("grocery", String(val)); };
  const handleVegetablesChange = (val: number) => { setVegetables(val); localStorage.setItem("vegetables", String(val)); };
  const handleFruitsChange = (val: number) => { setFruits(val); localStorage.setItem("fruits", String(val)); };
  const handleTransportChange = (val: number) => { setTransport(val); localStorage.setItem("transport", String(val)); };
  const handleMobileChange = (val: number) => { setMobile(val); localStorage.setItem("mobile", String(val)); };
  const handleGoalChange = (val: number) => { setGoal(val); localStorage.setItem("goal", String(val)); };

  const handleCustomFieldValueChange = (key: string, val: number) => {
    const updated = { ...customFieldValues, [key]: val };
    setCustomFieldValues(updated);
    localStorage.setItem("customFieldValues", JSON.stringify(updated));
  };

  const handleVisibilityChange = (updated: FieldVisibilityMap) => {
    setFieldVisibility(updated);
    localStorage.setItem("budgetFieldVisibility", JSON.stringify(updated));
    showToast("Field visibility updated!");
  };

  const handleAddCustomField = (newField: CustomFormField) => {
    const updated = [...customFormFields, newField];
    setCustomFormFields(updated);
    localStorage.setItem("customFormFields", JSON.stringify(updated));
    showToast(`Custom input "${newField.label}" added to form!`);
  };

  const handleUpdateCustomField = (updatedField: CustomFormField) => {
    const updated = customFormFields.map((f) => f.id === updatedField.id ? updatedField : f);
    setCustomFormFields(updated);
    localStorage.setItem("customFormFields", JSON.stringify(updated));
    showToast("Custom input updated!");
  };

  const handleDeleteCustomField = (id: string) => {
    const updated = customFormFields.filter((f) => f.id !== id);
    setCustomFormFields(updated);
    localStorage.setItem("customFormFields", JSON.stringify(updated));
    showToast("Custom input removed");
  };

  // ──────────────────────────── DEBTS ────────────────────────────

  const handleAddDebt = (newDebt: DebtEntry) => {
    if (!checkPinAccess()) return;
    const updated = [newDebt, ...debts];
    setDebts(updated);
    localStorage.setItem("debtsAndDues", JSON.stringify(updated));
    broadcastUpdate({ debts: updated });
    showToast(`Record added for ${newDebt.personName}!`);
  };

  const handleToggleDebtStatus = (id: string) => {
    if (!checkPinAccess()) return;
    const updated = debts.map((d) =>
      d.id === id
        ? { ...d, status: (d.status === "settled" ? "pending" : "settled") as "pending" | "settled" }
        : d
    );
    setDebts(updated);
    localStorage.setItem("debtsAndDues", JSON.stringify(updated));
    broadcastUpdate({ debts: updated });
    showToast("Status updated!");
  };

  const handleDeleteDebt = (id: string) => {
    if (!checkPinAccess()) return;
    const target = debts.find((d) => d.id === id);
    if (target) {
      pushUndo({ type: "debt", description: `Deleted debt for "${target.personName}"`, item: target });
    }
    const updated = debts.filter((d) => d.id !== id);
    setDebts(updated);
    localStorage.setItem("debtsAndDues", JSON.stringify(updated));
    broadcastUpdate({ debts: updated });
    showToast("Record removed — tap Undo to restore");
  };

  // ──────────────────────────── JSON BACKUP ────────────────────────────

  const handleExportJSON = () => {
    if (!checkPinAccess()) return;
    const backupData: AppDataBackup = {
      version: "2.0",
      exportDate: new Date().toISOString(),
      theme,
      dashboardTemplate,
      currency,
      salary, grocery, vegetables, fruits, transport, mobile, goal,
      customExpenses, subscriptions, history, monthlyHistory,
      alertSettings, userCustomCategories, customFormFields,
      customFieldValues, fieldVisibility, debts,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `budget_tracker_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("JSON Backup downloaded successfully!");
  };

  const handleImportJSON = (file: File) => {
    if (!checkPinAccess()) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text) as AppDataBackup;

        if (data.currency) { setCurrency(data.currency); localStorage.setItem("selectedCurrency", data.currency); }
        if (data.salary !== undefined) { setSalary(data.salary); localStorage.setItem("salary", String(data.salary)); }
        if (data.grocery !== undefined) { setGrocery(data.grocery); localStorage.setItem("grocery", String(data.grocery)); }
        if (data.vegetables !== undefined) { setVegetables(data.vegetables); localStorage.setItem("vegetables", String(data.vegetables)); }
        if (data.fruits !== undefined) { setFruits(data.fruits); localStorage.setItem("fruits", String(data.fruits)); }
        if (data.transport !== undefined) { setTransport(data.transport); localStorage.setItem("transport", String(data.transport)); }
        if (data.mobile !== undefined) { setMobile(data.mobile); localStorage.setItem("mobile", String(data.mobile)); }
        if (data.goal !== undefined) { setGoal(data.goal); localStorage.setItem("goal", String(data.goal)); }
        if (data.customExpenses) { setCustomExpenses(data.customExpenses); localStorage.setItem("customExpenses", JSON.stringify(data.customExpenses)); }
        if (data.subscriptions) { setSubscriptions(data.subscriptions); localStorage.setItem("subscriptions", JSON.stringify(data.subscriptions)); }
        if (data.history) { setHistory(data.history); localStorage.setItem("budgetHistory", JSON.stringify(data.history)); }
        if (data.monthlyHistory) { setMonthlyHistory(data.monthlyHistory); localStorage.setItem("monthlyHistory", JSON.stringify(data.monthlyHistory)); }
        if (data.alertSettings) { setAlertSettings(data.alertSettings); localStorage.setItem("budgetAlertSettings", JSON.stringify(data.alertSettings)); }
        if (data.userCustomCategories) { setUserCustomCategories(data.userCustomCategories); localStorage.setItem("userCustomCategories", JSON.stringify(data.userCustomCategories)); }
        if (data.customFormFields) { setCustomFormFields(data.customFormFields); localStorage.setItem("customFormFields", JSON.stringify(data.customFormFields)); }
        if (data.customFieldValues) { setCustomFieldValues(data.customFieldValues); localStorage.setItem("customFieldValues", JSON.stringify(data.customFieldValues)); }
        if (data.fieldVisibility) { setFieldVisibility(data.fieldVisibility); localStorage.setItem("budgetFieldVisibility", JSON.stringify(data.fieldVisibility)); }
        if (data.debts) { setDebts(data.debts); localStorage.setItem("debtsAndDues", JSON.stringify(data.debts)); }
        if (data.dashboardTemplate) { setDashboardTemplate(data.dashboardTemplate); localStorage.setItem("dashboardTemplate", data.dashboardTemplate); }

        showToast("Backup restored & data reloaded successfully!");
      } catch (err) {
        showToast("Invalid JSON Backup File!", "error");
      }
    };
    reader.readAsText(file);
  };

  // ──────────────────────────── CALCULATIONS ────────────────────────────

  const customTotal = customExpenses.reduce((sum, e) => sum + e.amount, 0);

  const customFormFieldsTotal = customFormFields.reduce((sum, field) => {
    if (fieldVisibility[field.key] === false) return sum;
    const val = customFieldValues[field.key] ?? field.defaultValue ?? 0;
    return sum + (Number(val) || 0);
  }, 0);

  const activeGrocery = fieldVisibility.grocery !== false ? grocery : 0;
  const activeVegetables = fieldVisibility.vegetables !== false ? vegetables : 0;
  const activeFruits = fieldVisibility.fruits !== false ? fruits : 0;
  const activeTransport = fieldVisibility.transport !== false ? transport : 0;
  const activeMobile = fieldVisibility.mobile !== false ? mobile : 0;
  const activeSalary = fieldVisibility.salary !== false ? salary : 0;

  const totalExpenses = activeGrocery + activeVegetables + activeFruits + activeTransport + activeMobile + customFormFieldsTotal + customTotal;
  const remaining = activeSalary - totalExpenses;
  const percent = activeSalary > 0 ? Math.min((totalExpenses / activeSalary) * 100, 100) : 0;
  const hideAmounts = appPin === "";

  // Alert Banner
  useEffect(() => {
    if (alertSettings.enabled && salary > 0 && percent >= alertSettings.threshold) {
      setAlertBannerText(
        `Warning! You have used <strong>${Math.round(percent)}%</strong> of your budget (Threshold: ${alertSettings.threshold}%)`
      );
      setShowAlertBanner(true);
    } else {
      setShowAlertBanner(false);
    }
  }, [percent, alertSettings, salary]);

  // ──────────────────────────── FORM ACTIONS ────────────────────────────

  const handleRefresh = () => {
    if (!checkPinAccess()) return;
    showToast("Values recalculated!");
  };

  const handleSave = () => {
    if (!checkPinAccess()) return;
    const date = new Date().toLocaleDateString();
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      date, salary, grocery, vegetables, fruits, transport, mobile,
      expense: totalExpenses, remaining,
    };
    const newHistory = [newEntry, ...history];
    setHistory(newHistory);
    localStorage.setItem("budgetHistory", JSON.stringify(newHistory));

    const monthYear = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });
    const existingIdx = monthlyHistory.findIndex((m) => m.month === monthYear);
    let updatedMonthly = [...monthlyHistory];
    if (existingIdx >= 0) {
      updatedMonthly[existingIdx] = { month: monthYear, salary, expense: totalExpenses };
    } else {
      updatedMonthly.push({ month: monthYear, salary, expense: totalExpenses });
    }
    setMonthlyHistory(updatedMonthly);
    localStorage.setItem("monthlyHistory", JSON.stringify(updatedMonthly));
    showToast("Budget saved successfully!");
  };

  const handleReset = () => {
    if (!checkPinAccess()) return;
    if (!confirm("Reset current budget? This will clear all input fields.")) return;
    setSalary(0); setGrocery(0); setVegetables(0); setFruits(0); setTransport(0); setMobile(0);
    ["salary", "grocery", "vegetables", "fruits", "transport", "mobile"].forEach((k) => localStorage.removeItem(k));
    showToast("Budget reset successfully");
  };

  // ──────────────────────────── CUSTOM EXPENSES ────────────────────────────

  const handleAddCustomExpense = (name: string, amount: number, category: CategoryKey) => {
    if (!checkPinAccess()) return;

    // Duplicate Detection
    const dup = checkForDuplicates(name, amount, customExpenses, subscriptions);
    if (dup) {
      setDuplicateWarning(`⚠️ Duplicate detected! "${name}" (${currency} ${amount.toLocaleString()}) already exists as a ${dup.type}.`);
    } else {
      setDuplicateWarning(null);
    }

    const newExp: CustomExpense = { id: Date.now().toString(), name, amount, category };
    const updated = [...customExpenses, newExp];
    setCustomExpenses(updated);
    localStorage.setItem("customExpenses", JSON.stringify(updated));
    broadcastUpdate({ customExpenses: updated });
    setShowAddExpenseModal(false);
    showToast(`${name} — ${currency} ${amount.toLocaleString()} added!`);
  };

  const handleDeleteCustomExpense = (id: string) => {
    if (!checkPinAccess()) return;
    const target = customExpenses.find((e) => e.id === id);
    if (target) {
      pushUndo({ type: "customExpense", description: `Deleted expense "${target.name}"`, item: target });
    }
    const updated = customExpenses.filter((e) => e.id !== id);
    setCustomExpenses(updated);
    localStorage.setItem("customExpenses", JSON.stringify(updated));
    broadcastUpdate({ customExpenses: updated });
    showToast("Expense removed — tap Undo to restore");
  };

  const handleClearAllCustomExpenses = () => {
    if (!checkPinAccess()) return;
    if (!confirm("Clear all custom expenses?")) return;
    setCustomExpenses([]);
    localStorage.setItem("customExpenses", JSON.stringify([]));
    showToast("All custom expenses cleared");
  };

  // ──────────────────────────── CATEGORIES ────────────────────────────

  const allCategories: CategoryConfig[] = [...DEFAULT_CATEGORIES, ...userCustomCategories];
  const categoriesMap = buildCategoriesMap(userCustomCategories);

  const handleAddCategory = (newCategory: CategoryConfig) => {
    if (!checkPinAccess()) return;
    const updated = [...userCustomCategories, newCategory];
    setUserCustomCategories(updated);
    localStorage.setItem("userCustomCategories", JSON.stringify(updated));
    broadcastUpdate({ userCustomCategories: updated });
    showToast(`Category "${newCategory.label}" created!`);
  };

  const handleDeleteCategory = (key: string) => {
    if (!checkPinAccess()) return;
    const updated = userCustomCategories.filter((c) => c.key !== key);
    setUserCustomCategories(updated);
    localStorage.setItem("userCustomCategories", JSON.stringify(updated));
    broadcastUpdate({ userCustomCategories: updated });
    showToast("Category removed");
  };

  // ──────────────────────────── SUBSCRIPTIONS ────────────────────────────

  const handleAddSubscription = (name: string, amount: number, dueDate: number) => {
    if (!checkPinAccess()) return;

    // Duplicate Detection for subscriptions
    const dup = checkForDuplicates(name, amount, customExpenses, subscriptions);
    if (dup) {
      setDuplicateWarning(`⚠️ Duplicate detected! "${name}" already exists as a ${dup.type}.`);
    }

    const newSub: Subscription = { id: Date.now().toString(), name, amount, dueDate, status: "unpaid" };
    const updated = [...subscriptions, newSub];
    setSubscriptions(updated);
    localStorage.setItem("subscriptions", JSON.stringify(updated));
    broadcastUpdate({ subscriptions: updated });
    setShowAddSubModal(false);
    showToast(`${name} added to recurring bills!`);
  };

  const handleToggleSubStatus = (id: string) => {
    if (!checkPinAccess()) return;
    const updated = subscriptions.map((s) =>
      s.id === id
        ? { ...s, status: (s.status === "paid" ? "unpaid" : "paid") as "paid" | "unpaid" }
        : s
    );
    setSubscriptions(updated);
    localStorage.setItem("subscriptions", JSON.stringify(updated));
    broadcastUpdate({ subscriptions: updated });
    showToast("Bill status updated!");
  };

  const handleDeleteSubscription = (id: string) => {
    if (!checkPinAccess()) return;
    const target = subscriptions.find((s) => s.id === id);
    if (target) {
      pushUndo({ type: "subscription", description: `Deleted subscription "${target.name}"`, item: target });
    }
    const updated = subscriptions.filter((s) => s.id !== id);
    setSubscriptions(updated);
    localStorage.setItem("subscriptions", JSON.stringify(updated));
    broadcastUpdate({ subscriptions: updated });
    showToast("Subscription deleted — tap Undo to restore");
  };

  // ──────────────────────────── HISTORY ────────────────────────────

  const handleEditHistoryRow = (entry: HistoryEntry) => {
    if (!checkPinAccess()) return;
    setSalary(entry.salary); setGrocery(entry.grocery); setVegetables(entry.vegetables);
    setFruits(entry.fruits); setTransport(entry.transport); setMobile(entry.mobile);
    showToast("Row loaded for editing");
  };

  const handleDeleteHistoryRow = (id: string) => {
    if (!checkPinAccess()) return;
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem("budgetHistory", JSON.stringify(updated));
    showToast("Record deleted");
  };

  const handleClearMonthlyData = () => {
    if (!checkPinAccess()) return;
    if (!confirm("Clear monthly comparison history?")) return;
    setMonthlyHistory([]);
    localStorage.removeItem("monthlyHistory");
    showToast("Monthly comparison cleared");
  };

  // ──────────────────────────── UNDO ────────────────────────────

  const handleUndo = () => {
    const action = popUndo();
    if (!action) return;

    if (action.type === "customExpense") {
      const restored = [...customExpenses, action.item];
      setCustomExpenses(restored);
      localStorage.setItem("customExpenses", JSON.stringify(restored));
      showToast(`Restored expense "${action.item.name}"`);
    } else if (action.type === "subscription") {
      const restored = [...subscriptions, action.item];
      setSubscriptions(restored);
      localStorage.setItem("subscriptions", JSON.stringify(restored));
      showToast(`Restored subscription "${action.item.name}"`);
    } else if (action.type === "debt") {
      const restored = [...debts, action.item];
      setDebts(restored);
      localStorage.setItem("debtsAndDues", JSON.stringify(restored));
      showToast(`Restored debt for "${action.item.personName}"`);
    }

    dismissLatestUndo();
  };

  // ──────────────────────────── PIN ────────────────────────────

  const handleUnlockPin = (inputPin: string) => {
    if (inputPin === appPin) {
      setIsLocked(false); setPinOverlayMode(null);
      showToast("App Unlocked!"); return true;
    }
    showToast("Incorrect PIN!", "error"); return false;
  };

  const handleSetPin = (newPin: string) => {
    setAppPin(newPin); localStorage.setItem("appPin", newPin);
    setIsLocked(false); setPinOverlayMode(null); showToast("PIN Lock Enabled!");
  };

  const handleDisablePin = (inputPin: string) => {
    if (inputPin === appPin) {
      setAppPin(""); setIsLocked(false); setPinOverlayMode(null);
      localStorage.removeItem("appPin"); showToast("PIN Lock Disabled"); return true;
    }
    showToast("Incorrect PIN!", "error"); return false;
  };

  const handlePinToggleClick = () => {
    if (appPin === "") { setPinOverlayMode("setup"); } else { setPinOverlayMode("disable"); }
  };

  // ──────────────────────────── TOOLS ────────────────────────────

  const handleSelectToolSection = (value: string) => {
    const allTools: ToolKey[] = ["chart", "insights", "subscriptions", "calendar", "comparison", "history", "alert"];
    if (value === "all") {
      setVisibleTools({ chart: true, insights: true, subscriptions: true, calendar: true, comparison: true, history: true, alert: true });
    } else if (value === "none") {
      setVisibleTools({ chart: false, insights: false, subscriptions: false, calendar: false, comparison: false, history: false, alert: false });
    } else {
      const newVisibility = {} as Record<ToolKey, boolean>;
      allTools.forEach((t) => { newVisibility[t] = t === value; });
      setVisibleTools(newVisibility);
    }
  };

  const toggleTool = (tool: ToolKey) => {
    setVisibleTools((prev) => ({ ...prev, [tool]: !prev[tool] }));
  };

  // ──────────────────────────── RENDER ────────────────────────────

  return (
    <>
      {/* Background Floating Orbs */}
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <div className="bg-orb bg-orb-3"></div>

      {/* Offline Banner */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-600 text-amber-50 text-center py-2 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg">
          <i className="fa-solid fa-wifi-slash" />
          You are offline — all data is saved locally
        </div>
      )}

      {/* Alert Banner */}
      <AlertBanner
        show={showAlertBanner}
        text={alertBannerText}
        onDismiss={() => setShowAlertBanner(false)}
      />

      {/* PIN Lock Overlays */}
      <PinLockOverlay show={isLocked && pinOverlayMode === null} mode="unlock" onUnlock={handleUnlockPin} />
      <PinLockOverlay show={pinOverlayMode === "setup"} mode="setup" onUnlock={() => false} onSetPin={handleSetPin} onCancel={() => setPinOverlayMode(null)} />
      <PinLockOverlay show={pinOverlayMode === "disable"} mode="disable" onUnlock={() => false} onDisablePin={handleDisablePin} onCancel={() => setPinOverlayMode(null)} />

      <div className="app-wrapper">
        {/* Header */}
        <Header
          currency={currency}
          onCurrencyChange={changeCurrency}
          onPinClick={handlePinToggleClick}
          theme={theme}
          onThemeChange={changeTheme}
          onThemeToggle={toggleTheme}
          onCalculatorClick={() => setShowCalculatorModal(true)}
          onSettingsClick={() => setShowSettingsModal(true)}
          onConverterClick={() => setShowConverterModal(true)}
          syncStatus={syncStatus}
          dashboardTemplate={dashboardTemplate}
          onTemplateChange={handleTemplateChange}
        />

        {/* Dashboard Layout — template-driven section ordering */}
        <DashboardLayout
          template={dashboardTemplate}
          children={{
            summaryCards: (
              <SummaryCards
                salary={salary}
                expenses={totalExpenses}
                remaining={remaining}
                currency={currency}
                hideAmounts={!appPin || isLocked}
              />
            ),
            usageProgress: <UsageProgress salary={salary} expenses={totalExpenses} />,
            budgetForm: (
              <BudgetForm
                salary={salary} grocery={grocery} vegetables={vegetables}
                fruits={fruits} transport={transport} mobile={mobile} goal={goal}
                currency={currency} fieldVisibility={fieldVisibility}
                customFormFields={customFormFields} customFieldValues={customFieldValues}
                onSalaryChange={handleSalaryChange} onGroceryChange={handleGroceryChange}
                onVegetablesChange={handleVegetablesChange} onFruitsChange={handleFruitsChange}
                onTransportChange={handleTransportChange} onMobileChange={handleMobileChange}
                onGoalChange={handleGoalChange} onCustomFieldValueChange={handleCustomFieldValueChange}
                onRefresh={handleRefresh} onSave={handleSave} onReset={handleReset}
              />
            ),
            resultSummary: (
              <ResultSummary
                totalExpenses={totalExpenses}
                remaining={remaining}
                currency={currency}
                hideAmounts={!appPin || isLocked}
              />
            ),
            savingsGoal: <SavingsGoal goal={goal} remaining={remaining} currency={currency} />,
            customExpenses: (
              <CustomExpenses
                expenses={customExpenses}
                currency={currency}
                categoriesMap={categoriesMap}
                onDelete={handleDeleteCustomExpense}
                onClearAll={handleClearAllCustomExpenses}
                hideAmounts={!appPin || isLocked}
              />
            ),
            toolsBar: (
              <ToolsBar
                visibleTools={visibleTools}
                onToggleTool={toggleTool}
                onSelectOption={handleSelectToolSection}
              />
            ),
            chart: visibleTools.chart ? (
              <DonutChart
                grocery={grocery} vegetables={vegetables} fruits={fruits}
                transport={transport} mobile={mobile} customExpenses={customExpenses}
                currency={currency} categoriesMap={categoriesMap}
                hideAmounts={!appPin || isLocked}
              />
            ) : null,
            insights: visibleTools.insights ? (
              <SmartInsights
                salary={salary} grocery={grocery} vegetables={vegetables}
                fruits={fruits} transport={transport} mobile={mobile}
                total={totalExpenses} remaining={remaining} goal={goal}
                customExpenses={customExpenses} currency={currency}
                categoriesMap={categoriesMap} hideAmounts={!appPin || isLocked}
              />
            ) : null,
            subscriptions: visibleTools.subscriptions ? (
              <Subscriptions
                subscriptions={subscriptions} currency={currency}
                onToggleStatus={handleToggleSubStatus} onDelete={handleDeleteSubscription}
                onAddClick={() => setShowAddSubModal(true)} hideAmounts={!appPin || isLocked}
              />
            ) : null,
            calendar: visibleTools.calendar ? (
              <SpendingCalendar customExpenses={customExpenses} hideAmounts={!appPin || isLocked} />
            ) : null,
            comparison: visibleTools.comparison ? (
              <MonthlyComparison
                monthlyHistory={monthlyHistory} currency={currency}
                onClear={handleClearMonthlyData} hideAmounts={!appPin || isLocked}
              />
            ) : null,
            history: visibleTools.history ? (
              <BudgetHistory
                history={history} currency={currency} customExpenses={customExpenses}
                onEdit={handleEditHistoryRow} onDelete={handleDeleteHistoryRow}
                hideAmounts={!appPin || isLocked}
              />
            ) : null,
            alert: visibleTools.alert ? (
              <AlertSettings
                enabled={alertSettings.enabled}
                threshold={alertSettings.threshold}
                onToggle={() => {
                  const updated = { ...alertSettings, enabled: !alertSettings.enabled };
                  setAlertSettings(updated);
                  localStorage.setItem("budgetAlertSettings", JSON.stringify(updated));
                }}
                onThresholdChange={(val) => {
                  const updated = { ...alertSettings, threshold: val };
                  setAlertSettings(updated);
                  localStorage.setItem("budgetAlertSettings", JSON.stringify(updated));
                }}
              />
            ) : null,
          }}
        />
      </div>

      {/* FAB */}
      <FAB onClick={() => setShowAddExpenseModal(true)} />

      {/* Back To Top Button */}
      <BackToTop />

      {/* Undo Notification Toast */}
      <UndoNotificationToast
        latestUndo={latestUndo}
        onUndo={handleUndo}
        onDismiss={dismissLatestUndo}
      />

      {/* Duplicate Detector Banner */}
      <DuplicateDetectorBanner
        message={duplicateWarning}
        onDismiss={() => setDuplicateWarning(null)}
      />

      {/* Add Expense Modal */}
      <AddExpenseModal
        show={showAddExpenseModal}
        currency={currency}
        categories={allCategories}
        onClose={() => setShowAddExpenseModal(false)}
        onAdd={handleAddCustomExpense}
        onOpenCategoryManager={() => {
          setShowAddExpenseModal(false);
          setShowCategoryManagerModal(true);
        }}
      />

      {/* Add Subscription Modal */}
      <AddSubscriptionModal
        show={showAddSubModal}
        currency={currency}
        onClose={() => setShowAddSubModal(false)}
        onAdd={handleAddSubscription}
      />

      {/* Category Manager Modal */}
      <CategoryManagerModal
        show={showCategoryManagerModal}
        categories={allCategories}
        onClose={() => setShowCategoryManagerModal(false)}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Quick Calculator Modal */}
      <QuickCalculatorModal show={showCalculatorModal} onClose={() => setShowCalculatorModal(false)} />

      {/* Settings Modal */}
      <SettingsModal
        show={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        visibility={fieldVisibility}
        onVisibilityChange={handleVisibilityChange}
        customFields={customFormFields}
        onAddCustomField={handleAddCustomField}
        onUpdateCustomField={handleUpdateCustomField}
        onDeleteCustomField={handleDeleteCustomField}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        theme={theme}
        onThemeChange={changeTheme}
        dashboardTemplate={dashboardTemplate}
        onTemplateChange={handleTemplateChange}
        onConverterClick={() => {
          setShowSettingsModal(false);
          setShowConverterModal(true);
        }}
        debts={debts}
        currency={currency}
        onAddDebt={handleAddDebt}
        onToggleDebtStatus={handleToggleDebtStatus}
        onDeleteDebt={handleDeleteDebt}
        hideAmounts={!appPin || isLocked}
      />



      {/* Live Currency Converter Modal */}
      <CurrencyConverterModal
        isOpen={showConverterModal}
        onClose={() => setShowConverterModal(false)}
      />
    </>
  );
}

export default function Home() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
