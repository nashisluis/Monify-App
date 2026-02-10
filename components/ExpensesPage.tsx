
import React from 'react';
import { Transaction, TransactionStatus, TransactionType } from '../types';

interface ExpensesPageProps {
  transactions: Transaction[];
  onAddClick: () => void;
  onEditClick: (t: Transaction) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (t: Transaction) => void;
  privacyMode?: boolean;
}

export const ExpensesPage: React.FC<ExpensesPageProps> = ({ 
  transactions, 
  onAddClick, 
  onEditClick,
  onDelete, 
  onToggleStatus,
  privacyMode
}) => {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<TransactionStatus | 'ALL'>('ALL');

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleWhatsAppAlert = (t: Transaction) => {
    const msg = `Olá! Estou organizando minhas finanças no Monify e vi que o pagamento de "${t.description}" no valor de R$ ${t.amount.toLocaleString('pt-BR')} ${t.dueDay ? `vence dia ${t.dueDay}` : 'está pendente'}.`;
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const formatValue = (val: number) => {
    if (privacyMode) return 'R$ ••••••';
    return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 lg:pb-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-1 uppercase tracking-tighter">Fluxo Total</h2>
          <p className="text-gray-500 font-medium text-sm lg:text-base">Gerenciamento granular de registros.</p>
        </div>
        <button 
          onClick={onAddClick}
          className="w-full md:w-auto bg-brand-600 hover:bg-brand-700 text-white px-10 py-5 rounded-[2rem] font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-brand-600/20 active:scale-95 text-xs uppercase tracking-widest"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M12 4v16m8-8H4" /></svg>
          Adicionar
        </button>
      </header>

      <div className="bg-dark-card border border-dark-border rounded-[3rem] p-6 lg:p-10 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-full">
            <div className="relative group flex-[2]">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-700 group-focus-within:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input 
                type="text"
                placeholder="Pesquisar despesa ou categoria..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-dark-bg border border-dark-border rounded-[1.5rem] py-5 pl-14 pr-8 text-sm text-white focus:border-brand-500 outline-none transition-all w-full font-bold placeholder:text-gray-500"
              />
            </div>

            <div className="relative flex-1">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-dark-bg border border-dark-border rounded-[1.5rem] py-5 pl-8 pr-12 text-sm text-white focus:border-brand-500 outline-none appearance-none transition-all cursor-pointer w-full font-black uppercase tracking-widest"
              >
                <option value="ALL">Status: Todos</option>
                <option value={TransactionStatus.PAID}>Liquidados</option>
                <option value={TransactionStatus.PENDING}>Pendentes</option>
                <option value={TransactionStatus.OVERDUE}>Atrasados</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-gray-800 border-2 border-dashed border-dark-border rounded-[2.5rem]">
            <svg className="w-20 h-20 mb-6 opacity-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <p className="font-black uppercase tracking-[0.3em] text-[10px]">Sem registros encontrados</p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredTransactions.map(t => (
              <div 
                key={t.id} 
                className="bg-dark-bg border border-dark-border p-6 lg:p-8 rounded-[2rem] flex flex-col sm:flex-row sm:items-center justify-between hover:bg-white/[0.02] hover:border-brand-500/20 transition-all group gap-8"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-[1.5rem] bg-dark-card flex items-center justify-center text-2xl font-black transition-colors border border-dark-border ${
                    t.type === TransactionType.INCOME ? 'text-green-500 group-hover:bg-green-500/10' : 'text-gray-500 group-hover:text-brand-400 group-hover:bg-brand-500/10'
                  }`}>
                    {t.description.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <h4 className="font-black text-white text-xl lg:text-2xl truncate leading-tight tracking-tight">{t.description}</h4>
                      {t.isRecurring && (
                        <span className="bg-brand-600/10 text-brand-400 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border border-brand-500/20">Fixo</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] transition-all ${
                        t.status === TransactionStatus.PAID 
                          ? 'bg-green-500/10 text-green-500 border border-green-500/10' 
                          : t.status === TransactionStatus.OVERDUE 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/10' 
                            : 'bg-orange-500/10 text-orange-400 border border-orange-500/10'
                      }`}>
                        {t.status}
                      </span>
                      <span className="text-[10px] text-gray-600 font-black tracking-widest uppercase flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {new Date(t.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-dark-border pt-6 sm:pt-0 sm:border-0">
                  <p className="text-2xl lg:text-3xl font-black text-white sm:mr-4 whitespace-nowrap">
                    {formatValue(t.amount)}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    {t.status !== TransactionStatus.PAID && t.type === TransactionType.EXPENSE && (
                      <button 
                        onClick={() => handleWhatsAppAlert(t)}
                        title="Alertar via WhatsApp"
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-dark-card border border-dark-border text-gray-600 hover:text-green-500 hover:border-green-500/30 transition-all active:scale-90"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </button>
                    )}

                    <button 
                      onClick={() => onEditClick(t)}
                      title="Editar Registro"
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-dark-card border border-dark-border text-gray-600 hover:text-brand-400 hover:border-brand-500/30 transition-all active:scale-90"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>

                    {t.type === TransactionType.EXPENSE && (
                      <button 
                        onClick={() => onToggleStatus(t)}
                        title={t.status === TransactionStatus.PAID ? "Marcar como Pendente" : "Marcar como Pago"}
                        className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all active:scale-90 shadow-lg ${
                          t.status === TransactionStatus.PAID 
                            ? 'bg-green-500 text-white shadow-green-500/40' 
                            : 'bg-dark-card border border-dark-border text-gray-600 hover:text-green-500 hover:border-green-500/30'
                        }`}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                      </button>
                    )}
                    
                    <button 
                      onClick={() => onDelete(t.id)}
                      title="Excluir Registro"
                      className="w-12 h-12 flex items-center justify-center bg-dark-card border border-dark-border text-gray-700 hover:text-red-400 hover:border-red-400/40 rounded-xl transition-all active:scale-90"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
