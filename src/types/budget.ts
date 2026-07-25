export type CategoryKey = 
  | 'general' 
  | 'food' 
  | 'bills' 
  | 'health' 
  | 'shopping' 
  | 'education' 
  | 'entertainment' 
  | 'other';

export interface CategoryInfo {
  label: string;
  color: string;
  iconName: string;
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
