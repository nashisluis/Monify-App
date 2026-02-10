
import React from 'react';
import { TransactionType, TransactionStatus, Transaction } from '../types';
import { CATEGORIES } from '../constants';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (t: Transaction) => void;
  initialData?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState(''); 
  const [type, setType] = React.useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = React.useState('');
  const [status, setStatus] = React.useState<TransactionStatus>(TransactionStatus.PENDING);
  const [isRecurring, setIsRecurring] = React.useState(false);

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  React.useEffect(() => {
    if (isOpen && initialData) {
      setDescription(initialData.description);
      setAmount(formatBRL(initialData.amount));
      setType(initialData.type);
      setCategory(initialData.category);
      setStatus(initialData.status);
      setIsRecurring(!!initialData.isRecurring);
    } else if (isOpen) {
      setDescription('');
      setAmount('');
      setType(TransactionType.EXPENSE);
      setCategory('');
      setStatus(TransactionStatus.PENDING);
      setIsRecurring(false);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value === '') {
      setAmount('');
      return;
    }
    const amountNum = Number(value) / 100;
    setAmount(formatBRL(amountNum));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category) return;

    const rawValue = amount.replace(/\./g, '').replace(',', '.');
    const parsedAmount = parseFloat(rawValue);

    if (isNaN(parsedAmount)) return;

    onSave({
      id: initialData?.id || crypto.randomUUID(),
      description,
      amount: parsedAmount,
      type,
      status: type === TransactionType.INCOME ? TransactionStatus.PAID : status,
      date: initialData?.date || new Date().toISOString(),
      category,
      isRecurring
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-end sm:items-center justify-center p-0 sm:p-4 z-[60] overflow-y-auto">
      <div className="bg-dark-card border-t sm:border border-dark-border rounded-t-[2.5rem] sm:rounded-[3rem] w-full max-w-lg p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-20 duration-500">
        <div className="flex justify-between items-start mb-8 sm:mb-10">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              {initialData ? 'Editar Registro' : 'Novo Registro'}
            </h2>
            <p className="text-sm font-medium text-gray-500 mt-1">Lançamento de fluxo de caixa</p>
          </div>
          <button onClick={onClose} className="p-3 text-gray-500 hover:text-white transition-colors bg-dark-bg rounded-2xl border border-dark-border">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex p-1.5 bg-dark-bg border border-dark-border rounded-[1.5rem]">
            <button
              type="button"
              onClick={() => setType(TransactionType.EXPENSE)}
              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${type === TransactionType.EXPENSE ? 'bg-brand-600 text-white shadow-[0_4px_20px_rgba(124,58,237,0.3)]' : 'text-gray-600 hover:text-gray-400'}`}
            >
              Saída
            </button>
            <button
              type="button"
              onClick={() => setType(TransactionType.INCOME)}
              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${type === TransactionType.INCOME ? 'bg-brand-600 text-white shadow-[0_4px_20px_rgba(124,58,237,0.3)]' : 'text-gray-600 hover:text-gray-400'}`}
            >
              Entrada
            </button>
          </div>

          <div className="space-y-6">
            <div className="group">
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3 ml-1">Descrição</label>
              <input
                autoFocus
                className="w-full px-6 py-5 bg-dark-bg border border-dark-border rounded-2xl focus:border-brand-500 outline-none text-white transition-all font-bold placeholder:text-gray-800"
                placeholder="Ex: Aluguel, Supermercado..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3 ml-1">Valor (R$)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="w-full px-6 py-5 bg-dark-bg border border-dark-border rounded-2xl focus:border-brand-500 outline-none text-white transition-all font-black text-xl"
                  placeholder="0,00"
                  value={amount}
                  onChange={handleAmountChange}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3 ml-1">Categoria</label>
                <div className="relative">
                  <select
                    className="w-full px-6 py-5 bg-dark-bg border border-dark-border rounded-2xl focus:border-brand-500 outline-none text-white appearance-none cursor-pointer font-bold pr-12"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="" disabled>Selecione...</option>
                    {(type === TransactionType.INCOME ? CATEGORIES.INCOME : CATEGORIES.EXPENSE).map(c => (
                      <option key={c} value={c} className="bg-dark-card">{c}</option>
                    ))}
                  </select>
                  <div className="absolute top-1/2 -translate-y-1/2 right-5 pointer-events-none text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-dark-bg border border-dark-border rounded-2xl group transition-all hover:border-brand-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                   <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-widest">Lançamento Fixo?</p>
                  <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-0.5">Repete todos os meses</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsRecurring(!isRecurring)}
                className={`w-12 h-6 rounded-full transition-all relative ${isRecurring ? 'bg-brand-600' : 'bg-gray-800'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isRecurring ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>

          <div className="pt-4 pb-8 sm:pb-0">
            <button
              type="submit"
              className="w-full py-6 bg-brand-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-brand-700 transition-all shadow-[0_10px_30px_rgba(124,58,237,0.4)] active:scale-[0.97]"
            >
              {initialData ? 'Atualizar Registro' : 'Salvar Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
