import React from 'react';
import { DashboardTemplate } from '@/types/budget';
import { DASHBOARD_TEMPLATES } from '@/constants/templates';

export interface DashboardLayoutProps {
  template: DashboardTemplate;
  children: {
    summaryCards?: React.ReactNode;
    usageProgress?: React.ReactNode;
    budgetForm?: React.ReactNode;
    resultSummary?: React.ReactNode;
    savingsGoal?: React.ReactNode;
    customExpenses?: React.ReactNode;
    toolsBar?: React.ReactNode;
    chart?: React.ReactNode;
    insights?: React.ReactNode;
    subscriptions?: React.ReactNode;
    calendar?: React.ReactNode;
    comparison?: React.ReactNode;
    history?: React.ReactNode;
    alert?: React.ReactNode;
  };
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ template, children }) => {
  const def = DASHBOARD_TEMPLATES[template];

  const renderBadge = (iconClass: string) => (
    <div style={{ textAlign: 'center', padding: '12px 0 6px' }}>
      <span
        style={{
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          padding: '6px 14px',
          borderRadius: '20px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <i className={iconClass} />
        {def.name} — {def.description}
      </span>
    </div>
  );

  // Classic: show everything in order
  if (template === 'classic') {
    return (
      <>
        {children.summaryCards}
        {children.usageProgress}
        {children.budgetForm}
        {children.resultSummary}
        {children.savingsGoal}
        {children.customExpenses}
        {children.toolsBar}
        {children.chart}
        {children.insights}
        {children.subscriptions}
        {children.calendar}
        {children.comparison}
        {children.history}
        {children.alert}
      </>
    );
  }

  // Compact: Only summary, usage, result, savings
  if (template === 'compact') {
    return (
      <>
        {renderBadge('fa-solid fa-border-all')}
        {children.summaryCards}
        {children.usageProgress}
        {children.resultSummary}
        {children.savingsGoal}
        {children.customExpenses}
        {children.toolsBar}
      </>
    );
  }

  // Analytics: Charts, insights, comparison first — form secondary
  if (template === 'analytics') {
    return (
      <>
        {renderBadge('fa-solid fa-chart-pie')}
        {children.summaryCards}
        {children.usageProgress}
        {children.chart}
        {children.insights}
        {children.comparison}
        {children.calendar}
        {children.budgetForm}
        {children.resultSummary}
        {children.savingsGoal}
        {children.subscriptions}
        {children.toolsBar}
        {children.history}
        {children.alert}
      </>
    );
  }

  // Ledger: Form + expenses + history + debts focused
  if (template === 'ledger') {
    return (
      <>
        {renderBadge('fa-solid fa-list-check')}
        {children.budgetForm}
        {children.customExpenses}
        {children.subscriptions}
        {children.history}
        {children.summaryCards}
        {children.resultSummary}
        {children.usageProgress}
        {children.savingsGoal}
        {children.toolsBar}
        {children.chart}
        {children.insights}
        {children.alert}
      </>
    );
  }

  // Fallback: classic
  return <>{Object.values(children)}</>;
};
