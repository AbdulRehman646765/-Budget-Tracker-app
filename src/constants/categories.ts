import { CategoryConfig, CategoryInfo } from '@/types/budget';

export const DEFAULT_CATEGORIES: CategoryConfig[] = [
  { key: 'general',       label: 'General',       color: '#64748b', iconName: 'fa-solid fa-tag' },
  { key: 'food',          label: 'Food',          color: '#f59e0b', iconName: 'fa-solid fa-utensils' },
  { key: 'bills',         label: 'Bills',         color: '#ef4444', iconName: 'fa-solid fa-file-invoice-dollar' },
  { key: 'health',        label: 'Health',        color: '#ec4899', iconName: 'fa-solid fa-heart-pulse' },
  { key: 'shopping',      label: 'Shopping',      color: '#8b5cf6', iconName: 'fa-solid fa-bag-shopping' },
  { key: 'education',     label: 'Education',     color: '#3b82f6', iconName: 'fa-solid fa-graduation-cap' },
  { key: 'entertainment', label: 'Entertainment', color: '#10b981', iconName: 'fa-solid fa-film' },
  { key: 'other',         label: 'Other',         color: '#6b7280', iconName: 'fa-solid fa-ellipsis' },
];

export const CATEGORIES: Record<string, CategoryInfo> = DEFAULT_CATEGORIES.reduce((acc, cat) => {
  acc[cat.key] = { label: cat.label, color: cat.color, iconName: cat.iconName };
  return acc;
}, {} as Record<string, CategoryInfo>);

export function buildCategoriesMap(customCategories: CategoryConfig[] = []): Record<string, CategoryInfo> {
  const map: Record<string, CategoryInfo> = {};
  [...DEFAULT_CATEGORIES, ...customCategories].forEach((cat) => {
    map[cat.key] = { label: cat.label, color: cat.color, iconName: cat.iconName };
  });
  return map;
}
