import { CategoryKey, CategoryInfo } from '@/types/budget';

export const CATEGORIES: Record<CategoryKey, CategoryInfo> = {
  general: { label: 'General', color: '#64748b', iconName: 'Tag' },
  food: { label: 'Food', color: '#f59e0b', iconName: 'Utensils' },
  bills: { label: 'Bills', color: '#ef4444', iconName: 'FileText' },
  health: { label: 'Health', color: '#ec4899', iconName: 'HeartPulse' },
  shopping: { label: 'Shopping', color: '#8b5cf6', iconName: 'ShoppingBag' },
  education: { label: 'Education', color: '#3b82f6', iconName: 'GraduationCap' },
  entertainment: { label: 'Entertainment', color: '#10b981', iconName: 'Film' },
  other: { label: 'Other', color: '#6b7280', iconName: 'MoreHorizontal' },
};
