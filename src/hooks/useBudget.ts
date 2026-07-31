import { useState, useEffect, useCallback } from 'react';
import {
  CurrencySymbol,
  CustomExpense,
  Subscription,
  HistoryEntry,
  MonthlySummary,
  CategoryConfig,
  CustomFormField,
  FieldVisibilityMap,
  CustomFieldValuesMap,
  DebtEntry,
  AppDataBackup,
  DashboardTemplate,
} from '@/types/budget';
import { syncService } from '@/services/syncService';
import { useUndo } from './useUndo';
import { checkForDuplicates } from '@/utils/duplicateDetector';

export type ToolKey =
  | 'chart'
  | 'insights'
  | 'subscriptions'
  | 'calendar'
  | 'comparison'
  | 'history'
  | 'alert';

export function useBudget() {
  const { pushUndo, popUndo, latestUndo, dismissLatestUndo } = useUndo();

  // App Currency & Template
  const [currency, setCurrency] = useState<CurrencySymbol>('Rs.');
  const [dashboardTemplate, setDashboardTemplate] = useState<DashboardTemplate>('classic');

  // PIN Lock State
  const [appPin, setAppPin] = useState<string>('');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [pinOverlayMode, setPinOverlayMode] = useState<'unlock' | 'setup' | 'disable' | null>(null);

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
    { id: '1', name: 'Netflix', amount: 1500, dueDate: 5, status: 'unpaid' },
    { id: '2', name: 'Wifi / Internet', amount: 2000, dueDate: 10, status: 'paid' },
    { id: '3', name: 'Electricity Bill', amount: 4500, dueDate: 15, status: 'unpaid' },
  ]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [monthlyHistory, setMonthlyHistory] = useState<MonthlySummary[]>([]);
  const [alertSettings, setAlertSettings] = useState<{ enabled: boolean; threshold: number }>({
    enabled: true,
    threshold: 80,
  });

  const [userCustomCategories, setUserCustomCategories] = useState<CategoryConfig[]>([]);
  const [customFormFields, setCustomFormFields] = useState<CustomFormField[]>([]);
  const [customFieldValues, setCustomFieldValues] = useState<CustomFieldValuesMap>({});
  const [fieldVisibility, setFieldVisibility] = useState<FieldVisibilityMap>({});
  const [debts, setDebts] = useState<DebtEntry[]>([]);

  // Sync Status state
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing'>('synced');

  // Modals state
  const [showAddExpenseModal, setShowAddExpenseModal] = useState<boolean>(false);
  const [showAddSubModal, setShowAddSubModal] = useState<boolean>(false);
  const [showCategoryManagerModal, setShowCategoryManagerModal] = useState<boolean>(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showDebtsModal, setShowDebtsModal] = useState<boolean>(false);
  const [showConverterModal, setShowConverterModal] = useState<boolean>(false);

  // Duplicate Banner Warning state
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

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

  // Restore State from LocalStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedCurr = localStorage.getItem('selectedCurrency') as CurrencySymbol | null;
    if (savedCurr) setCurrency(savedCurr);

    const savedTpl = localStorage.getItem('dashboardTemplate') as DashboardTemplate | null;
    if (savedTpl) setDashboardTemplate(savedTpl);

    const pin = localStorage.getItem('appPin') || '';
    setAppPin(pin);
    if (pin) {
      setIsLocked(true);
    }

    const savedCustom = localStorage.getItem('customExpenses');
    if (savedCustom) setCustomExpenses(JSON.parse(savedCustom));

    const savedSubs = localStorage.getItem('subscriptions');
    if (savedSubs) setSubscriptions(JSON.parse(savedSubs));

    const savedHistory = localStorage.getItem('budgetHistory');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedMonthly = localStorage.getItem('monthlyHistory');
    if (savedMonthly) setMonthlyHistory(JSON.parse(savedMonthly));

    const savedAlerts = localStorage.getItem('budgetAlertSettings');
    if (savedAlerts) setAlertSettings(JSON.parse(savedAlerts));

    const savedUserCat = localStorage.getItem('userCustomCategories');
    if (savedUserCat) setUserCustomCategories(JSON.parse(savedUserCat));

    setSalary(Number(localStorage.getItem('salary')) || 0);
    setGrocery(Number(localStorage.getItem('grocery')) || 0);
    setVegetables(Number(localStorage.getItem('vegetables')) || 0);
    setFruits(Number(localStorage.getItem('fruits')) || 0);
    setTransport(Number(localStorage.getItem('transport')) || 0);
    setMobile(Number(localStorage.getItem('mobile')) || 0);
    setGoal(Number(localStorage.getItem('goal')) || 0);

    const savedFormFields = localStorage.getItem('customFormFields');
    if (savedFormFields) setCustomFormFields(JSON.parse(savedFormFields));

    const savedFieldValues = localStorage.getItem('customFieldValues');
    if (savedFieldValues) setCustomFieldValues(JSON.parse(savedFieldValues));

    const savedVisibility = localStorage.getItem('budgetFieldVisibility');
    if (savedVisibility) setFieldVisibility(JSON.parse(savedVisibility));

    const savedDebts = localStorage.getItem('debtsAndDues');
    if (savedDebts) setDebts(JSON.parse(savedDebts));
  }, []);

  // Multi-tab BroadcastChannel listener
  useEffect(() => {
    const unsubscribe = syncService.subscribe((remoteData) => {
      setSyncStatus('syncing');
      if (remoteData.customExpenses) setCustomExpenses(remoteData.customExpenses);
      if (remoteData.subscriptions) setSubscriptions(remoteData.subscriptions);
      if (remoteData.salary !== undefined) setSalary(remoteData.salary);
      if (remoteData.debts) setDebts(remoteData.debts);
      if (remoteData.userCustomCategories) setUserCustomCategories(remoteData.userCustomCategories);
      setTimeout(() => setSyncStatus('synced'), 400);
    });
    return () => unsubscribe();
  }, []);

  // Helper to persist & sync broadcast
  const notifyChanges = useCallback((updatedState: Partial<AppDataBackup>) => {
    setSyncStatus('syncing');
    syncService.notifyUpdate(updatedState);
    setTimeout(() => setSyncStatus('synced'), 300);
  }, []);

  // Custom Expense Operations
  const addCustomExpense = (expense: Omit<CustomExpense, 'id'>) => {
    const dup = checkForDuplicates(expense.name, expense.amount, customExpenses, subscriptions);
    if (dup) {
      setDuplicateWarning(`Duplicate detected: "${expense.name}" with amount ${expense.amount} already exists!`);
    } else {
      setDuplicateWarning(null);
    }

    const newExpense: CustomExpense = {
      ...expense,
      id: Math.random().toString(36).substring(2, 9),
    };
    const updated = [...customExpenses, newExpense];
    setCustomExpenses(updated);
    localStorage.setItem('customExpenses', JSON.stringify(updated));
    notifyChanges({ customExpenses: updated });
  };

  const deleteCustomExpense = (id: string) => {
    const target = customExpenses.find((e) => e.id === id);
    if (target) {
      pushUndo({
        type: 'customExpense',
        description: `Deleted expense "${target.name}"`,
        item: target,
      });
    }
    const updated = customExpenses.filter((e) => e.id !== id);
    setCustomExpenses(updated);
    localStorage.setItem('customExpenses', JSON.stringify(updated));
    notifyChanges({ customExpenses: updated });
  };

  // Subscription Operations
  const addSubscription = (sub: Omit<Subscription, 'id' | 'status'>) => {
    const dup = checkForDuplicates(sub.name, sub.amount, customExpenses, subscriptions);
    if (dup) {
      setDuplicateWarning(`Duplicate detected: Subscription "${sub.name}" matches an existing entry.`);
    }

    const newSub: Subscription = {
      ...sub,
      id: Math.random().toString(36).substring(2, 9),
      status: 'unpaid',
    };
    const updated = [...subscriptions, newSub];
    setSubscriptions(updated);
    localStorage.setItem('subscriptions', JSON.stringify(updated));
    notifyChanges({ subscriptions: updated });
  };

  const deleteSubscription = (id: string) => {
    const target = subscriptions.find((s) => s.id === id);
    if (target) {
      pushUndo({
        type: 'subscription',
        description: `Deleted subscription "${target.name}"`,
        item: target,
      });
    }
    const updated = subscriptions.filter((s) => s.id !== id);
    setSubscriptions(updated);
    localStorage.setItem('subscriptions', JSON.stringify(updated));
    notifyChanges({ subscriptions: updated });
  };

  // Debt Operations
  const addDebt = (debt: Omit<DebtEntry, 'id'>) => {
    const newDebt: DebtEntry = {
      ...debt,
      id: Math.random().toString(36).substring(2, 9),
    };
    const updated = [...debts, newDebt];
    setDebts(updated);
    localStorage.setItem('debtsAndDues', JSON.stringify(updated));
    notifyChanges({ debts: updated });
  };

  const deleteDebt = (id: string) => {
    const target = debts.find((d) => d.id === id);
    if (target) {
      pushUndo({
        type: 'debt',
        description: `Deleted debt/due for "${target.personName}"`,
        item: target,
      });
    }
    const updated = debts.filter((d) => d.id !== id);
    setDebts(updated);
    localStorage.setItem('debtsAndDues', JSON.stringify(updated));
    notifyChanges({ debts: updated });
  };

  // Undo Handler
  const handleUndo = () => {
    const action = popUndo();
    if (!action) return;

    if (action.type === 'customExpense') {
      const restored = [...customExpenses, action.item];
      setCustomExpenses(restored);
      localStorage.setItem('customExpenses', JSON.stringify(restored));
    } else if (action.type === 'subscription') {
      const restored = [...subscriptions, action.item];
      setSubscriptions(restored);
      localStorage.setItem('subscriptions', JSON.stringify(restored));
    } else if (action.type === 'debt') {
      const restored = [...debts, action.item];
      setDebts(restored);
      localStorage.setItem('debtsAndDues', JSON.stringify(restored));
    }
  };

  return {
    // Currency & Template
    currency,
    setCurrency: (c: CurrencySymbol) => {
      setCurrency(c);
      localStorage.setItem('selectedCurrency', c);
    },
    dashboardTemplate,
    setDashboardTemplate: (t: DashboardTemplate) => {
      setDashboardTemplate(t);
      localStorage.setItem('dashboardTemplate', t);
    },

    // PIN State
    appPin,
    setAppPin,
    isLocked,
    setIsLocked,
    pinOverlayMode,
    setPinOverlayMode,

    // Form inputs state
    salary,
    setSalary: (val: number) => {
      setSalary(val);
      localStorage.setItem('salary', String(val));
    },
    grocery,
    setGrocery: (val: number) => {
      setGrocery(val);
      localStorage.setItem('grocery', String(val));
    },
    vegetables,
    setVegetables: (val: number) => {
      setVegetables(val);
      localStorage.setItem('vegetables', String(val));
    },
    fruits,
    setFruits: (val: number) => {
      setFruits(val);
      localStorage.setItem('fruits', String(val));
    },
    transport,
    setTransport: (val: number) => {
      setTransport(val);
      localStorage.setItem('transport', String(val));
    },
    mobile,
    setMobile: (val: number) => {
      setMobile(val);
      localStorage.setItem('mobile', String(val));
    },
    goal,
    setGoal: (val: number) => {
      setGoal(val);
      localStorage.setItem('goal', String(val));
    },

    // Collections
    customExpenses,
    setCustomExpenses,
    addCustomExpense,
    deleteCustomExpense,

    subscriptions,
    setSubscriptions,
    addSubscription,
    deleteSubscription,

    history,
    setHistory,
    monthlyHistory,
    setMonthlyHistory,
    alertSettings,
    setAlertSettings,

    userCustomCategories,
    setUserCustomCategories: (cats: CategoryConfig[]) => {
      setUserCustomCategories(cats);
      localStorage.setItem('userCustomCategories', JSON.stringify(cats));
    },

    customFormFields,
    setCustomFormFields,
    customFieldValues,
    setCustomFieldValues,
    fieldVisibility,
    setFieldVisibility,

    debts,
    setDebts,
    addDebt,
    deleteDebt,

    // Modals
    showAddExpenseModal,
    setShowAddExpenseModal,
    showAddSubModal,
    setShowAddSubModal,
    showCategoryManagerModal,
    setShowCategoryManagerModal,
    showCalculatorModal,
    setShowCalculatorModal,
    showSettingsModal,
    setShowSettingsModal,
    showDebtsModal,
    setShowDebtsModal,
    showConverterModal,
    setShowConverterModal,

    // Tool Toggles
    visibleTools,
    setVisibleTools,

    // Sync & Duplicates & Undo
    syncStatus,
    duplicateWarning,
    clearDuplicateWarning: () => setDuplicateWarning(null),
    latestUndo,
    dismissLatestUndo,
    handleUndo,
  };
}
