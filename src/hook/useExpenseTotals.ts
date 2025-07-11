import { useMemo } from 'react';

export type ExpenseValues = Record<string, string | number>;

export interface ExpenseTotals {
  totalDutch: number;
  totalFrench: number;
  totalCombined: number;
}

/**
 * Calculates totals for Dutch, French, and combined expenses.
 * @param expenses - Object with all expense values (string or number)
 * @param dutchKeys - Keys for Dutch-side expenses
 * @param frenchKeys - Keys for French-side expenses
 */
export function useExpenseTotals(
  expenses: ExpenseValues,
  dutchKeys: string[],
  frenchKeys: string[]
): ExpenseTotals {
  return useMemo(() => {
    const totalDutch = dutchKeys.reduce(
      (sum, key) => sum + (parseFloat(expenses[key] as string) || 0),
      0
    );
    const totalFrench = frenchKeys.reduce(
      (sum, key) => sum + (parseFloat(expenses[key] as string) || 0),
      0
    );
    return {
      totalDutch,
      totalFrench,
      totalCombined: totalDutch + totalFrench,
    };
  }, [expenses, dutchKeys, frenchKeys]);
} 