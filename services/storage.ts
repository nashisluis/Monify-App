
import { Transaction, Goal } from '../types';

const TRANSACTIONS_KEY = 'monify_data_v2_main';
const BACKUP_KEY = 'monify_data_v2_backup';
const BUDGET_KEY = 'monify_budget_v2';
const VIEW_KEY = 'monify_view_v2';
const GOALS_KEY = 'monify_goals_v2';

export const storage = {
  getTransactions: (): Transaction[] => {
    try {
      const mainData = localStorage.getItem(TRANSACTIONS_KEY);
      const backupData = localStorage.getItem(BACKUP_KEY);
      if (!mainData && backupData) {
        localStorage.setItem(TRANSACTIONS_KEY, backupData);
        return JSON.parse(backupData);
      }
      return mainData ? JSON.parse(mainData) : [];
    } catch (e) {
      return [];
    }
  },

  saveTransactions: (transactions: Transaction[]) => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    localStorage.setItem(BACKUP_KEY, JSON.stringify(transactions));
  },

  getBudget: (): number => {
    const data = localStorage.getItem(BUDGET_KEY);
    return data ? parseFloat(data) : 12816;
  },

  saveBudget: (amount: number) => {
    localStorage.setItem(BUDGET_KEY, amount.toString());
  },

  getGoals: (): Goal[] => {
    const data = localStorage.getItem(GOALS_KEY);
    if (!data) {
      // Metas padrão iniciais
      return [
        { id: '1', name: 'Viagem Japão 2026', type: 'Viagem', target: 25000, current: 8400, color: 'bg-blue-500', icon: '✈️' },
        { id: '2', name: 'Reserva de Emergência', type: 'Reserva', target: 50000, current: 15000, color: 'bg-brand-500', icon: '🛡️' }
      ];
    }
    return JSON.parse(data);
  },

  saveGoals: (goals: Goal[]) => {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  },

  getLastView: (fallback: any): any => {
    return localStorage.getItem(VIEW_KEY) || fallback;
  },

  saveLastView: (view: string) => {
    localStorage.setItem(VIEW_KEY, view);
  }
};
