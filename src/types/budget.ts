export type CategoryKey = string;

export interface CategoryInfo {
  label: string;
  color: string;
  iconName: string;
}

export interface CategoryConfig {
  key: string;
  label: string;
  color: string;
  iconName: string;
  isCustom?: boolean;
}

export interface CustomExpense {
  id: string;
  name: string;
  amount: number;
  category: CategoryKey;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  dueDate: number;
  status: 'paid' | 'unpaid';
}

export interface HistoryEntry {
  id: string;
  date: string;
  salary: number;
  grocery: number;
  vegetables: number;
  fruits: number;
  transport: number;
  mobile: number;
  expense: number;
  remaining: number;
}

export interface MonthlySummary {
  month: string;
  salary: number;
  expense: number;
}

export interface BudgetAlertSettings {
  enabled: boolean;
  threshold: number;
}

export type CurrencySymbol = 'Rs.' | '$' | '€' | 'AED' | 'SR' | '₹';

export interface CustomFormField {
  id: string;
  key: string;
  label: string;
  iconName: string;
  defaultValue?: number;
}

export interface FieldVisibilityMap {
  [key: string]: boolean;
}

export interface CustomFieldValuesMap {
  [key: string]: number;
}

export interface DebtEntry {
  id: string;
  type: 'receivable' | 'payable'; // 'receivable' = Paisy Leny, 'payable' = Paisy Deny
  personName: string;
  amount: number;
  date: string;
  notes?: string;
  status: 'pending' | 'settled';
}

export type AppTheme = 'dark' | 'light' | 'cyberpunk' | 'emerald' | 'sunset' | 'midnight' | 'ocean';

export type DashboardTemplate = 'classic' | 'compact' | 'analytics' | 'ledger';

export interface UndoAction {
  id: string;
  type: 'customExpense' | 'subscription' | 'history' | 'debt' | 'category';
  description: string;
  item: any;
  timestamp: number;
}

export interface ExchangeRates {
  [key: string]: number;
}

export interface AppDataBackup {
  version: string;
  exportDate: string;
  theme?: AppTheme;
  dashboardTemplate?: DashboardTemplate;
  currency: CurrencySymbol;
  salary: number;
  grocery: number;
  vegetables: number;
  fruits: number;
  transport: number;
  mobile: number;
  goal: number;
  customExpenses: CustomExpense[];
  subscriptions: Subscription[];
  history: HistoryEntry[];
  monthlyHistory: MonthlySummary[];
  alertSettings: BudgetAlertSettings;
  userCustomCategories: CategoryConfig[];
  customFormFields: CustomFormField[];
  customFieldValues: CustomFieldValuesMap;
  fieldVisibility: FieldVisibilityMap;
  debts: DebtEntry[];
}



