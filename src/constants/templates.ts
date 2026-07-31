import { DashboardTemplate } from '@/types/budget';

export interface TemplateDefinition {
  id: DashboardTemplate;
  name: string;
  description: string;
  icon: string;
}

export const DASHBOARD_TEMPLATES: Record<DashboardTemplate, TemplateDefinition> = {
  classic: {
    id: 'classic',
    name: 'Classic View',
    description: 'Full feature dashboard with summary, charts, and custom tools.',
    icon: 'fa-table-cells-large',
  },
  compact: {
    id: 'compact',
    name: 'Compact Summary',
    description: 'Minimalist view focused on salary, total expenses, and balance.',
    icon: 'fa-border-all',
  },
  analytics: {
    id: 'analytics',
    name: 'Analytics Focus',
    description: 'Visual insights, spending charts, donut breakdowns, and comparisons.',
    icon: 'fa-chart-pie',
  },
  ledger: {
    id: 'ledger',
    name: 'Detailed Ledger',
    description: 'Transaction-focused layout with detailed expenses, debts, and history.',
    icon: 'fa-list-check',
  },
};
