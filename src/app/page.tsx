"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
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
import { DEFAULT_CATEGORIES, buildCategoriesMap } from "@/lib/categories";

import {
  CurrencySymbol,
  CustomExpense,
  Subscription,
  HistoryEntry,
  MonthlySummary,
  CategoryKey,
  CategoryConfig,
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

  // App Theme & Currency
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [currency, setCurrency] = useState<CurrencySymbol>("Rs.");

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
    {
      id: "2",
      name: "Wifi / Internet",
      amount: 2000,
      dueDate: 10,
      status: "paid",
    },
    {
      id: "3",
      name: "Electricity Bill",
      amount: 4500,
      dueDate: 15,
      status: "unpaid",
    },
  ]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [monthlyHistory, setMonthlyHistory] = useState<MonthlySummary[]>([]);
  const [alertSettings, setAlertSettings] = useState<{
    enabled: boolean;
    threshold: number;
  }>({
    enabled: true,
    threshold: 80,
  });

  // Modals
  const [showAddExpenseModal, setShowAddExpenseModal] =
    useState<boolean>(false);
  const [showAddSubModal, setShowAddSubModal] = useState<boolean>(false);
  const [showCategoryManagerModal, setShowCategoryManagerModal] =
    useState<boolean>(false);
  const [userCustomCategories, setUserCustomCategories] = useState<
    CategoryConfig[]
  >([]);
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
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "light") document.body.classList.add("light-theme");
    }

    const savedCurr = localStorage.getItem(
      "selectedCurrency",
    ) as CurrencySymbol | null;
    if (savedCurr) setCurrency(savedCurr);

    const pin = localStorage.getItem("appPin") || "";
    const locked = localStorage.getItem("isAppLocked") === "true";
    setAppPin(pin);
    if (pin && locked) setIsLocked(true);

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

    // Form inputs restore
    setSalary(Number(localStorage.getItem("salary")) || 0);
    setGrocery(Number(localStorage.getItem("grocery")) || 0);
    setVegetables(Number(localStorage.getItem("vegetables")) || 0);
    setFruits(Number(localStorage.getItem("fruits")) || 0);
    setTransport(Number(localStorage.getItem("transport")) || 0);
    setMobile(Number(localStorage.getItem("mobile")) || 0);
    setGoal(Number(localStorage.getItem("goal")) || 0);
  }, []);

  // Theme Toggle
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  };

  // Currency Change
  const changeCurrency = (symbol: CurrencySymbol) => {
    setCurrency(symbol);
    localStorage.setItem("selectedCurrency", symbol);
    showToast(`Currency changed to ${symbol}`);
  };

  // Save Input Handlers
  const handleSalaryChange = (val: number) => {
    setSalary(val);
    localStorage.setItem("salary", String(val));
  };
  const handleGroceryChange = (val: number) => {
    setGrocery(val);
    localStorage.setItem("grocery", String(val));
  };
  const handleVegetablesChange = (val: number) => {
    setVegetables(val);
    localStorage.setItem("vegetables", String(val));
  };
  const handleFruitsChange = (val: number) => {
    setFruits(val);
    localStorage.setItem("fruits", String(val));
  };
  const handleTransportChange = (val: number) => {
    setTransport(val);
    localStorage.setItem("transport", String(val));
  };
  const handleMobileChange = (val: number) => {
    setMobile(val);
    localStorage.setItem("mobile", String(val));
  };
  const handleGoalChange = (val: number) => {
    setGoal(val);
    localStorage.setItem("goal", String(val));
  };

  // Calculations
  const customTotal = customExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses =
    grocery + vegetables + fruits + transport + mobile + customTotal;
  const remaining = salary - totalExpenses;

  const percent =
    salary > 0 ? Math.min((totalExpenses / salary) * 100, 100) : 0;

  // Check alert threshold
  useEffect(() => {
    if (
      alertSettings.enabled &&
      salary > 0 &&
      percent >= alertSettings.threshold
    ) {
      setAlertBannerText(
        `Warning! You have used <strong>${Math.round(percent)}%</strong> of your budget (Threshold: ${alertSettings.threshold}%)`,
      );
      setShowAlertBanner(true);
    } else {
      setShowAlertBanner(false);
    }
  }, [percent, alertSettings, salary]);

  // Handlers for Form Actions
  const handleRefresh = () => {
    showToast("Values recalculated!");
  };

  const handleSave = () => {
    const date = new Date().toLocaleDateString();
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      date,
      salary,
      grocery,
      vegetables,
      fruits,
      transport,
      mobile,
      expense: totalExpenses,
      remaining,
    };

    const newHistory = [newEntry, ...history];
    setHistory(newHistory);
    localStorage.setItem("budgetHistory", JSON.stringify(newHistory));

    // Save Monthly Summary
    const monthYear = new Date().toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    const existingIdx = monthlyHistory.findIndex((m) => m.month === monthYear);
    let updatedMonthly = [...monthlyHistory];
    if (existingIdx >= 0) {
      updatedMonthly[existingIdx] = {
        month: monthYear,
        salary,
        expense: totalExpenses,
      };
    } else {
      updatedMonthly.push({ month: monthYear, salary, expense: totalExpenses });
    }
    setMonthlyHistory(updatedMonthly);
    localStorage.setItem("monthlyHistory", JSON.stringify(updatedMonthly));

    showToast("Budget saved successfully!");
  };

  const handleReset = () => {
    if (!confirm("Reset current budget? This will clear all input fields."))
      return;
    setSalary(0);
    setGrocery(0);
    setVegetables(0);
    setFruits(0);
    setTransport(0);
    setMobile(0);

    [
      "salary",
      "grocery",
      "vegetables",
      "fruits",
      "transport",
      "mobile",
    ].forEach((k) => localStorage.removeItem(k));
    showToast("Budget reset successfully");
  };

  // Custom Expense Actions
  const handleAddCustomExpense = (
    name: string,
    amount: number,
    category: CategoryKey,
  ) => {
    const newExp: CustomExpense = {
      id: Date.now().toString(),
      name,
      amount,
      category,
    };
    const updated = [...customExpenses, newExp];
    setCustomExpenses(updated);
    localStorage.setItem("customExpenses", JSON.stringify(updated));
    setShowAddExpenseModal(false);
    showToast(`${name} — ${currency} ${amount.toLocaleString()} added!`);
  };

  const handleDeleteCustomExpense = (id: string) => {
    const updated = customExpenses.filter((e) => e.id !== id);
    setCustomExpenses(updated);
    localStorage.setItem("customExpenses", JSON.stringify(updated));
    showToast("Expense removed");
  };

  const handleClearAllCustomExpenses = () => {
    if (!confirm("Clear all custom expenses?")) return;
    setCustomExpenses([]);
    localStorage.setItem("customExpenses", JSON.stringify([]));
    showToast("All custom expenses cleared");
  };

  // Category Manager Actions
  const allCategories: CategoryConfig[] = [
    ...DEFAULT_CATEGORIES,
    ...userCustomCategories,
  ];
  const categoriesMap = buildCategoriesMap(userCustomCategories);

  const handleAddCategory = (newCategory: CategoryConfig) => {
    const updated = [...userCustomCategories, newCategory];
    setUserCustomCategories(updated);
    localStorage.setItem("userCustomCategories", JSON.stringify(updated));
    showToast(`Category "${newCategory.label}" created!`);
  };

  const handleDeleteCategory = (key: string) => {
    const updated = userCustomCategories.filter((c) => c.key !== key);
    setUserCustomCategories(updated);
    localStorage.setItem("userCustomCategories", JSON.stringify(updated));
    showToast("Category removed");
  };

  // Subscriptions Actions
  const handleAddSubscription = (
    name: string,
    amount: number,
    dueDate: number,
  ) => {
    const newSub: Subscription = {
      id: Date.now().toString(),
      name,
      amount,
      dueDate,
      status: "unpaid",
    };
    const updated = [...subscriptions, newSub];
    setSubscriptions(updated);
    localStorage.setItem("subscriptions", JSON.stringify(updated));
    setShowAddSubModal(false);
    showToast(`${name} added to recurring bills!`);
  };

  const handleToggleSubStatus = (id: string) => {
    const updated = subscriptions.map((s) =>
      s.id === id
        ? {
            ...s,
            status: (s.status === "paid" ? "unpaid" : "paid") as
              | "paid"
              | "unpaid",
          }
        : s,
    );
    setSubscriptions(updated);
    localStorage.setItem("subscriptions", JSON.stringify(updated));
    showToast("Bill status updated!");
  };

  const handleDeleteSubscription = (id: string) => {
    const updated = subscriptions.filter((s) => s.id !== id);
    setSubscriptions(updated);
    localStorage.setItem("subscriptions", JSON.stringify(updated));
    showToast("Subscription deleted");
  };

  // Budget History Actions
  const handleEditHistoryRow = (entry: HistoryEntry) => {
    setSalary(entry.salary);
    setGrocery(entry.grocery);
    setVegetables(entry.vegetables);
    setFruits(entry.fruits);
    setTransport(entry.transport);
    setMobile(entry.mobile);
    showToast("Row loaded for editing");
  };

  const handleDeleteHistoryRow = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem("budgetHistory", JSON.stringify(updated));
    showToast("Record deleted");
  };

  const handleClearMonthlyData = () => {
    if (!confirm("Clear monthly comparison history?")) return;
    setMonthlyHistory([]);
    localStorage.removeItem("monthlyHistory");
    showToast("Monthly comparison cleared");
  };

  // PIN Lock Handlers
  const handleUnlockPin = (inputPin: string) => {
    if (inputPin === appPin) {
      setIsLocked(false);
      setPinOverlayMode(null);
      localStorage.setItem("isAppLocked", "false");
      showToast("App Unlocked!");
      return true;
    } else {
      showToast("Incorrect PIN!", "error");
      return false;
    }
  };

  const handleSetPin = (newPin: string) => {
    setAppPin(newPin);
    setIsLocked(true);
    setPinOverlayMode(null);
    localStorage.setItem("appPin", newPin);
    localStorage.setItem("isAppLocked", "true");
    showToast("PIN Lock Enabled!");
  };

  const handleDisablePin = (inputPin: string) => {
    if (inputPin === appPin) {
      setAppPin("");
      setIsLocked(false);
      setPinOverlayMode(null);
      localStorage.removeItem("appPin");
      localStorage.setItem("isAppLocked", "false");
      showToast("PIN Lock Disabled");
      return true;
    } else {
      showToast("Incorrect PIN!", "error");
      return false;
    }
  };

  const handlePinToggleClick = () => {
    if (appPin === "") {
      // No PIN set yet - open setup overlay
      setPinOverlayMode("setup");
    } else {
      // PIN already set - open disable overlay
      setPinOverlayMode("disable");
    }
  };

  // Tool Select Handler
  const handleSelectToolSection = (value: string) => {
    const allTools: ToolKey[] = [
      "chart",
      "insights",
      "subscriptions",
      "calendar",
      "comparison",
      "history",
      "alert",
    ];
    if (value === "all") {
      setVisibleTools({
        chart: true,
        insights: true,
        subscriptions: true,
        calendar: true,
        comparison: true,
        history: true,
        alert: true,
      });
    } else if (value === "none") {
      setVisibleTools({
        chart: false,
        insights: false,
        subscriptions: false,
        calendar: false,
        comparison: false,
        history: false,
        alert: false,
      });
    } else {
      const newVisibility = {} as Record<ToolKey, boolean>;
      allTools.forEach((t) => {
        newVisibility[t] = t === value;
      });
      setVisibleTools(newVisibility);
    }
  };

  const toggleTool = (tool: ToolKey) => {
    setVisibleTools((prev) => ({ ...prev, [tool]: !prev[tool] }));
  };

  return (
    <>
      {/* Background Floating Orbs */}
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <div className="bg-orb bg-orb-3"></div>

      {/* Alert Banner */}
      <AlertBanner
        show={showAlertBanner}
        text={alertBannerText}
        onDismiss={() => setShowAlertBanner(false)}
      />

      {/* PIN Lock Overlay - Unlock (app start) */}
      <PinLockOverlay
        show={isLocked && pinOverlayMode === null}
        mode="unlock"
        onUnlock={handleUnlockPin}
      />

      {/* PIN Lock Overlay - Setup new PIN */}
      <PinLockOverlay
        show={pinOverlayMode === "setup"}
        mode="setup"
        onUnlock={() => false}
        onSetPin={handleSetPin}
        onCancel={() => setPinOverlayMode(null)}
      />

      {/* PIN Lock Overlay - Disable PIN */}
      <PinLockOverlay
        show={pinOverlayMode === "disable"}
        mode="disable"
        onUnlock={() => false}
        onDisablePin={handleDisablePin}
        onCancel={() => setPinOverlayMode(null)}
      />

      <div className="app-wrapper">
        {/* Header */}
        <Header
          currency={currency}
          onCurrencyChange={changeCurrency}
          onPinClick={handlePinToggleClick}
          theme={theme}
          onThemeToggle={toggleTheme}
        />

        {/* Summary Cards */}
        <SummaryCards
          salary={salary}
          expenses={totalExpenses}
          remaining={remaining}
          currency={currency}
        />

        {/* Usage Progress */}
        <UsageProgress salary={salary} expenses={totalExpenses} />

        {/* Input Form */}
        <BudgetForm
          salary={salary}
          grocery={grocery}
          vegetables={vegetables}
          fruits={fruits}
          transport={transport}
          mobile={mobile}
          goal={goal}
          currency={currency}
          onSalaryChange={handleSalaryChange}
          onGroceryChange={handleGroceryChange}
          onVegetablesChange={handleVegetablesChange}
          onFruitsChange={handleFruitsChange}
          onTransportChange={handleTransportChange}
          onMobileChange={handleMobileChange}
          onGoalChange={handleGoalChange}
          onRefresh={handleRefresh}
          onSave={handleSave}
          onReset={handleReset}
        />

        {/* Result Summary */}
        <ResultSummary
          totalExpenses={totalExpenses}
          remaining={remaining}
          currency={currency}
        />

        {/* Savings Goal */}
        <SavingsGoal goal={goal} remaining={remaining} currency={currency} />

        {/* Custom Expenses */}
        <CustomExpenses
          expenses={customExpenses}
          currency={currency}
          categoriesMap={categoriesMap}
          onDelete={handleDeleteCustomExpense}
          onClearAll={handleClearAllCustomExpenses}
        />

        {/* Tools Toolbar */}
        <ToolsBar
          visibleTools={visibleTools}
          onToggleTool={toggleTool}
          onSelectOption={handleSelectToolSection}
        />

        {/* Tool 1: Donut Chart */}
        {visibleTools.chart && (
          <DonutChart
            grocery={grocery}
            vegetables={vegetables}
            fruits={fruits}
            transport={transport}
            mobile={mobile}
            customExpenses={customExpenses}
            currency={currency}
            categoriesMap={categoriesMap}
          />
        )}

        {/* Tool 2: Smart Financial Insights */}
        {visibleTools.insights && (
          <SmartInsights
            salary={salary}
            grocery={grocery}
            vegetables={vegetables}
            fruits={fruits}
            transport={transport}
            mobile={mobile}
            total={totalExpenses}
            remaining={remaining}
            goal={goal}
            customExpenses={customExpenses}
            currency={currency}
            categoriesMap={categoriesMap}
          />
        )}

        {/* Tool 3: Subscriptions */}
        {visibleTools.subscriptions && (
          <Subscriptions
            subscriptions={subscriptions}
            currency={currency}
            onToggleStatus={handleToggleSubStatus}
            onDelete={handleDeleteSubscription}
            onAddClick={() => setShowAddSubModal(true)}
          />
        )}

        {/* Tool 4: Daily Spending Calendar */}
        {visibleTools.calendar && (
          <SpendingCalendar customExpenses={customExpenses} />
        )}

        {/* Tool 5: Monthly Comparison */}
        {visibleTools.comparison && (
          <MonthlyComparison
            monthlyHistory={monthlyHistory}
            currency={currency}
            onClear={handleClearMonthlyData}
          />
        )}

        {/* Tool 6: Budget History */}
        {visibleTools.history && (
          <BudgetHistory
            history={history}
            currency={currency}
            onEdit={handleEditHistoryRow}
            onDelete={handleDeleteHistoryRow}
          />
        )}

        {/* Tool 7: Alert Settings */}
        {visibleTools.alert && (
          <AlertSettings
            enabled={alertSettings.enabled}
            threshold={alertSettings.threshold}
            onToggle={() => {
              const updated = {
                ...alertSettings,
                enabled: !alertSettings.enabled,
              };
              setAlertSettings(updated);
              localStorage.setItem(
                "budgetAlertSettings",
                JSON.stringify(updated),
              );
            }}
            onThresholdChange={(val) => {
              const updated = { ...alertSettings, threshold: val };
              setAlertSettings(updated);
              localStorage.setItem(
                "budgetAlertSettings",
                JSON.stringify(updated),
              );
            }}
          />
        )}
      </div>

      {/* FAB & Modal */}
      <FAB onClick={() => setShowAddExpenseModal(true)} />
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

      {/* Subscription Modal */}
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
