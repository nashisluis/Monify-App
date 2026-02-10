
import React from 'react';
import { Goal } from '../types';

interface AportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  goal: Goal | null;
  safeBalance: number;
}

export const AportModal: React.FC<AportModalProps> = ({ isOpen, onClose, onConfirm, goal, safeBalance }) => {
  const [amount, setAmount] = React.useState('');
  const [selectedPercent, setSelectedPercent] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setAmount('');
      setSelectedPercent(null);
    }
  }, [isOpen]);

  if (!isOpen || !goal) return null;

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handlePercentClick = (percent: number) => {
    const calculated = safeBalance * (percent / 100);
    setAmount(new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(calculated));
    setSelectedPercent(percent);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value === '') {
      setAmount('');
      setSelectedPercent(null);
      return;
    }
    const num = Number(value) / 100;
    setAmount(new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(num));
    setSelectedPercent(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
    if (!isNaN(parsed) && parsed > 0) {
      onConfirm(parsed);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 z-[80]">
      <div className="bg-dark-card border-t sm:border border-dark-border rounded-t-[3rem] sm:rounded-[3rem] w-full max-w-md p-10 animate-in slide-in-from-bottom-20 duration-500 shadow-[0_40px_100px_rgba(0,0,0,1)]">
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{goal.icon}</span>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Acelerar Sonho</h2>
            </div>
            <p className="text-sm font-medium text-gray-500">Quanto deseja aportar em <span className="text-white font-bold">"{goal.name}"</span>?</p>
          </div>
          <button onClick={onClose} className="p-3 text-gray-500 hover:text-white transition-colors bg-dark-bg rounded-2xl border border-dark-border">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="bg-dark-bg/50 border border-dark-border rounded-2xl p-4 mb-8">
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Saldo Seguro Disponível</p>
          <p className="text-xl font-black text-green-500">{formatBRL(safeBalance)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Valor do Aporte (R$)</label>
            <input
              autoFocus
              className="w-full px-6 py-6 bg-dark-bg border border-dark-border rounded-2xl focus:border-brand-500 outline-none text-white font-black text-3xl transition-all"
              placeholder="0,00"
              value={amount}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[10, 25, 50, 100].map(p => (
              <button
                key={p}
                type="button"
                onClick={() => handlePercentClick(p)}
                className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedPercent === p 
                    ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-600/30' 
                    : 'bg-dark-bg border-dark-border text-gray-500 hover:text-white hover:border-white/20'
                }`}
              >
                {p}%
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-6 bg-brand-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-brand-700 transition-all shadow-xl active:scale-95"
          >
            Confirmar Aporte
          </button>
        </form>
      </div>
    </div>
  );
};
