
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum TransactionStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  OVERDUE = 'OVERDUE'
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  date: string; // ISO string
  category: string;
  dueDay?: number;
  isRecurring?: boolean;
}

export interface Goal {
  id: string;
  name: string;
  type: string;
  target: number;
  current: number;
  icon: string;
  color: string;
}

export interface MonthlySummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  pendingExpense: number;
}

export interface User {
  name: string;
  email?: string;
  isAuthenticated: boolean;
  isPro: boolean;
}

export type AppView = 'DASHBOARD' | 'BUDGET' | 'EXPENSES' | 'REPORTS';
