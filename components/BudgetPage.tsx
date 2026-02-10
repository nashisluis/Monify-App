
import React from 'react';

interface BudgetPageProps {
  currentBudget: number;
  onSaveBudget: (amount: number) => void;
  isPro: boolean;
  privacyMode?: boolean;
}

export const BudgetPage: React.FC<BudgetPageProps> = ({ currentBudget, onSaveBudget, isPro, privacyMode }) => {
  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const [displayValue, setDisplayValue] = React.useState(formatBRL(currentBudget));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value === '') {
      setDisplayValue('0,00');
      return;
    }
    const amount = Number(value) / 100;
    setDisplayValue(formatBRL(amount));
  };

  const handleSave = () => {
    const rawValue = displayValue.replace(/\./g, '').replace(',', '.');
    const amount = parseFloat(rawValue);
    if (!isNaN(amount) && amount >= 0) {
      onSaveBudget(amount);
    }
  };

  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-4xl font-bold text-white mb-2 uppercase tracking-tighter">Configurações</h2>
        <p className="text-gray-400 font-medium">Configure suas preferências financeiras.</p>
      </header>

      <section className="bg-dark-card border border-dark-border p-8 rounded-[2.5rem]">
        <h3 className="text-xl font-bold text-white mb-2">Orçamento Base Mensal</h3>
        <p className="text-sm text-gray-500 mb-8">Defina seu limite de gastos para o planejamento.</p>
        
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Valor Sugerido (R$)</label>
            <div className="relative">
              <input 
                type="text"
                inputMode="numeric"
                value={privacyMode ? '••••••' : displayValue}
                onChange={handleInputChange}
                disabled={privacyMode}
                className={`w-full px-6 py-5 bg-dark-bg border border-dark-border rounded-2xl focus:border-brand-500 outline-none text-white text-3xl font-black transition-all ${privacyMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="0,00"
              />
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={privacyMode}
            className="px-8 py-5 bg-brand-600 hover:bg-brand-700 disabled:opacity-30 text-white rounded-2xl font-black transition-all shadow-lg shadow-brand-600/20 active:scale-95 whitespace-nowrap uppercase tracking-widest text-xs"
          >
            Salvar
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-gradient-to-br from-indigo-950/40 to-dark-card border border-dark-border p-10 rounded-[2.5rem] flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600/10 blur-[60px] rounded-full"></div>
          <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-brand-600/40">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <h4 className="text-3xl font-black text-white mb-2">Monify Pro</h4>
          <p className="text-gray-400 mb-8">Melhore por apenas R$ 19,90/mês</p>
          <div className="bg-green-500/10 border border-green-500/20 px-6 py-3 rounded-full flex items-center gap-3">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
            <span className="text-green-500 font-black uppercase tracking-widest text-xs">Assinatura Ativa</span>
          </div>
        </section>
      </div>
    </div>
  );
};
