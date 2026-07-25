import { CategoryKey, CategoryInfo } from '@/types/budget';

export const CATEGORIES: Record<CategoryKey, CategoryInfo> = {
  general:       { label: 'General',       color: '#64748b', iconName: 'fa-solid fa-tag' },
  food:          { label: 'Food',          color: '#f59e0b', iconName: 'fa-solid fa-utensils' },
  bills:         { label: 'Bills',         color: '#ef4444', iconName: 'fa-solid fa-file-invoice-dollar' },
  health:        { label: 'Health',        color: '#ec4899', iconName: 'fa-solid fa-heart-pulse' },
  shopping:      { label: 'Shopping',      color: '#8b5cf6', iconName: 'fa-solid fa-bag-shopping' },
  education:     { label: 'Education',     color: '#3b82f6', iconName: 'fa-solid fa-graduation-cap' },
  entertainment: { label: 'Entertainment', color: '#10b981', iconName: 'fa-solid fa-film' },
  other:         { label: 'Other',         color: '#6b7280', iconName: 'fa-solid fa-ellipsis' },
};
