import { CustomExpense, Subscription } from '@/types/budget';

export interface DuplicateMatch {
  type: 'expense' | 'subscription';
  name: string;
  amount: number;
}

export function checkForDuplicates(
  name: string,
  amount: number,
  existingExpenses: CustomExpense[],
  existingSubscriptions: Subscription[]
): DuplicateMatch | null {
  const normalizedName = name.trim().toLowerCase();

  // Check matching custom expense
  const duplicateExpense = existingExpenses.find(
    (item) => item.name.trim().toLowerCase() === normalizedName && Math.abs(item.amount - amount) < 0.01
  );
  if (duplicateExpense) {
    return { type: 'expense', name: duplicateExpense.name, amount: duplicateExpense.amount };
  }

  // Check matching subscription
  const duplicateSub = existingSubscriptions.find(
    (item) => item.name.trim().toLowerCase() === normalizedName && Math.abs(item.amount - amount) < 0.01
  );
  if (duplicateSub) {
    return { type: 'subscription', name: duplicateSub.name, amount: duplicateSub.amount };
  }

  return null;
}
