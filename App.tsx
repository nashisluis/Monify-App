
import React from 'react';
import { Layout } from './components/Layout';
import { Transaction, TransactionType, TransactionStatus, MonthlySummary, AppView, Goal, User } from './types';
import { storage } from './services/storage';
import { TransactionModal } from './components/TransactionModal';
import { GoalModal } from './components/GoalModal';
import { AportModal } from './components/AportModal';
import { ActionSuggestions } from './components/ActionSuggestions';
import { Toast, ToastMessage } from './components/Toast';
import { BudgetPage } from './components/BudgetPage';
import { ExpensesPage } from './components/ExpensesPage';
import { CommandBar } from './components/CommandBar';
import { MarketTicker } from './components/MarketTicker';
import { LoginPage } from './components/LoginPage';

const ReportsPage: React.FC<{ transactions: Transaction[], budget: number, privacyMode: boolean }> = ({ transactions, budget, privacyMode }) => {
  const categories = [...new Set(transactions.filter(t => t.type === TransactionType.EXPENSE).map(t => t.category))];
  const data = categories.map(cat => ({
    name: cat,
    value: transactions.filter(t => t.category === cat && t.type === TransactionType.EXPENSE).reduce((acc, t) => acc + t.amount, 0)
  })).sort((a, b) => b.value - a.value);

  const totalExpense = data.reduce((acc, d) => acc + d.value, 0);

  const formatValue = (val: number) => {
    if (privacyMode) return 'R$ ••••••';
    return `R$ ${val.toLocaleString('pt-BR')}`;
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">Relatórios Analíticos</h2>
        <p className="text-gray-500 font-medium">Visualização detalhada do seu comportamento financeiro.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-dark-card border border-dark-border rounded-[3rem] p-10">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-10">Gastos por Categoria</h3>
          <div className="space-y-8">
            {data.map(item => (
              <div key={item.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.name}</span>
                  <span className="text-sm font-black text-white">{formatValue(item.value)}</span>
                </div>
                <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(item.value / (totalExpense || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {data.length === 0 && <p className="text-gray-600 text-sm font-bold uppercase tracking-widest text-center py-10">Nenhum dado para exibir</p>}
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-[3rem] p-10 flex flex-col items-center justify-center text-center">
           <div className="w-64 h-64 flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center z-10">
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Utilizado</p>
                  <p className="text-3xl font-black text-white">{((totalExpense / (budget || 1)) * 100).toFixed(1)}%</p>
                </div>
              </div>
              <svg className="w-full h-full -rotate-90">
                <circle 
                  cx="128" cy="128" r="90" 
                  fill="transparent" 
                  stroke="#1E232E" 
                  strokeWidth="24"
                />
                <circle 
                  cx="128" cy="128" r="90" 
                  fill="transparent" 
                  stroke="#8b5cf6" 
                  strokeWidth="24" 
                  className="transition-all duration-1000"
                  strokeDasharray="565.48"
                  strokeDashoffset={565.48 - (565.48 * (Math.min(totalExpense / (budget || 1), 1)))}
                  strokeLinecap="round"
                />
              </svg>
           </div>
           <div className="mt-10">
              <h4 className="text-lg font-black text-white mb-2">Saúde do Orçamento</h4>
              <p className="text-sm text-gray-500 max-w-xs">Você consumiu {((totalExpense / (budget || 1)) * 100).toFixed(1)}% da sua meta mensal de {formatValue(budget)}.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = React.useState<User | null>(null);
  
  const [transactions, setTransactions] = React.useState<Transaction[]>(() => storage.getTransactions());
  const [goals, setGoals] = React.useState<Goal[]>(() => storage.getGoals());
  const [monthlyBudget, setMonthlyBudget] = React.useState(() => storage.getBudget());
  const [currentView, setCurrentView] = React.useState<AppView>(() => storage.getLastView('DASHBOARD'));
  const [privacyMode, setPrivacyMode] = React.useState(false);
  const [alertTriggered, setAlertTriggered] = React.useState(false);
  
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = React.useState(false);
  const [isAportModalOpen, setIsAportModalOpen] = React.useState(false);
  const [selectedGoalForAport, setSelectedGoalForAport] = React.useState<Goal | null>(null);
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  React.useEffect(() => {
    storage.saveLastView(currentView);
  }, [currentView]);

  const summary: MonthlySummary = React.useMemo(() => {
    const s = transactions.reduce((acc, t) => {
      const amount = t.amount;
      if (t.type === TransactionType.INCOME) acc.totalIncome += amount;
      else {
        acc.totalExpense += amount;
        if (t.status !== TransactionStatus.PAID) acc.pendingExpense += amount;
      }
      acc.balance = (monthlyBudget + acc.totalIncome) - acc.totalExpense;
      return acc;
    }, { totalIncome: 0, totalExpense: 0, balance: monthlyBudget, pendingExpense: 0 });

    if (s.balance < (monthlyBudget * 0.1) && s.balance > 0 && !alertTriggered) {
      addToast('Atenção: Saldo baixo!', 'warning');
      setAlertTriggered(true);
    }

    return s;
  }, [transactions, monthlyBudget, alertTriggered]);

  const handleSaveTransaction = (t: Transaction) => {
    let updated: Transaction[];
    const exists = transactions.find(item => item.id === t.id);
    
    if (exists) {
      updated = transactions.map(item => item.id === t.id ? t : item);
      addToast('Alterações salvas!', 'success');
    } else {
      updated = [t, ...transactions];
      addToast('Registro salvo!', 'success');
    }
    
    storage.saveTransactions(updated);
    setTransactions(updated);
    setEditingTransaction(null);
  };

  const handleSaveTransactions = (newItems: Transaction[]) => {
    const updated = [...newItems, ...transactions];
    storage.saveTransactions(updated);
    setTransactions(updated);
    addToast('Registros salvos!', 'success');
  };

  const handleConfirmAport = (amount: number) => {
    if (!selectedGoalForAport) return;
    
    const updatedGoals = goals.map(g => g.id === selectedGoalForAport.id ? { ...g, current: g.current + amount } : g);
    storage.saveGoals(updatedGoals);
    setGoals(updatedGoals);

    const transferRecord: Transaction = {
      id: crypto.randomUUID(),
      description: `Aceleração: ${selectedGoalForAport.name}`,
      amount: amount,
      type: TransactionType.EXPENSE,
      status: TransactionStatus.PAID,
      date: new Date().toISOString(),
      category: 'Lazer/Viagens'
    };
    handleSaveTransaction(transferRecord);
    addToast(`Você acelerou seu sonho em ${formatValue(amount)}!`, 'success');
    setIsAportModalOpen(false);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    storage.saveTransactions(updated);
    setTransactions(updated);
    addToast('Removido.', 'info');
  };

  const handleToggleStatus = (t: Transaction) => {
    const updated = transactions.map(item => item.id === t.id ? { ...item, status: t.status === TransactionStatus.PAID ? TransactionStatus.PENDING : TransactionStatus.PAID } : item);
    storage.saveTransactions(updated);
    setTransactions(updated);
  };

  const handleUpdateBudget = (amount: number) => {
    setMonthlyBudget(amount);
    storage.saveBudget(amount);
    setAlertTriggered(false);
    addToast('Orçamento atualizado!', 'success');
  };

  const handleSaveGoal = (goal: Goal) => {
    const updated = [goal, ...goals];
    storage.saveGoals(updated);
    setGoals(updated);
    addToast('Meta definida!', 'success');
  };

  const handleDeleteGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    storage.saveGoals(updated);
    setGoals(updated);
    addToast('Meta removida.', 'info');
  };

  const handleAutomateRecurring = (description: string) => {
    const updated = transactions.map(t => 
      t.description.toLowerCase().includes(description.toLowerCase()) 
        ? { ...t, isRecurring: true } 
        : t
    );
    storage.saveTransactions(updated);
    setTransactions(updated);
    addToast(`"${description}" marcado como fixo mensal!`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('DASHBOARD');
  };

  const addToast = (text: string, type: ToastMessage['type'] = 'info') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const formatValue = (val: number) => {
    if (privacyMode) return 'R$ ••••••';
    return `R$ ${val.toLocaleString('pt-BR')}`;
  };

  if (!user || !user.isAuthenticated) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <Layout 
      user={user} 
      currentView={currentView} 
      onNavigate={setCurrentView} 
      privacyMode={privacyMode} 
      onTogglePrivacy={() => setPrivacyMode(!privacyMode)}
      onLogout={handleLogout}
    >
      <MarketTicker />
      
      <div className="pt-4 lg:pt-8 pb-20 lg:pb-0 relative">
        {currentView === 'DASHBOARD' ? (
          <>
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h2 className="text-3xl lg:text-5xl font-black text-white mb-2 tracking-tighter">Monify</h2>
                <p className="text-gray-500 font-medium text-sm lg:text-base tracking-tight">Tudo organizado e uma mãozinha da I.A. para você decidir.</p>
              </div>
              <button 
                onClick={() => {
                  setEditingTransaction(null);
                  setIsModalOpen(true);
                }}
                className="bg-brand-600 hover:bg-brand-700 text-white px-10 py-5 rounded-[2rem] font-black transition-all shadow-2xl shadow-brand-600/20 active:scale-95 text-xs uppercase tracking-[0.2em]"
              >
                Novo Lançamento
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-dark-card border border-dark-border p-8 rounded-[2.5rem] shadow-xl">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-4">Orçamento Base</span>
                <p className="text-3xl font-black text-white">{formatValue(monthlyBudget)}</p>
              </div>
              <div className="bg-dark-card border border-dark-border p-8 rounded-[2.5rem] shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Total Saídas</span>
                </div>
                <p className="text-3xl font-black text-red-500">{formatValue(summary.totalExpense)}</p>
              </div>
              <div className={`bg-dark-card border p-8 rounded-[2.5rem] shadow-xl transition-all ${summary.balance < (monthlyBudget * 0.1) ? 'border-red-500/50' : 'border-brand-500/30'}`}>
                <span className={`text-[10px] font-black uppercase tracking-widest block mb-4 ${summary.balance < (monthlyBudget * 0.1) ? 'text-red-500' : 'text-brand-500'}`}>Saldo Seguro Agora</span>
                <p className={`text-3xl font-black ${summary.balance < (monthlyBudget * 0.1) ? 'text-red-500' : 'text-green-500'}`}>{formatValue(summary.balance)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-dark-card border border-dark-border rounded-[3rem] p-6 lg:p-10 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-8 lg:mb-10">
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Caminho da Liberdade</h3>
                    <button 
                      onClick={() => setIsGoalModalOpen(true)}
                      className="text-[10px] font-black text-brand-400 bg-brand-500/10 px-4 py-2 rounded-full uppercase tracking-widest hover:bg-brand-500/20 transition-all flex items-center gap-2 border border-brand-500/20"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                      Definir Meta
                    </button>
                  </div>
                  <div className="space-y-6">
                    {goals.map(goal => (
                      <div key={goal.id} className="relative pt-16 lg:pt-20 pb-8 lg:pb-10 px-6 lg:px-10 bg-dark-card/40 border border-dark-border/50 rounded-[2.5rem] hover:border-brand-500/40 transition-all shadow-sm group min-h-[220px] flex flex-col justify-end">
                        
                        {/* BOTÃO ACELERAR SONHO: Canto Superior Direito Absoluto */}
                        <div className="absolute top-5 right-6 lg:top-8 lg:right-10">
                           <button 
                              onClick={() => {
                                setSelectedGoalForAport(goal);
                                setIsAportModalOpen(true);
                              }}
                              className="text-[9px] lg:text-[10px] font-black text-brand-400 bg-brand-500/10 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full uppercase tracking-widest hover:bg-brand-500/20 transition-all border border-brand-500/20 shadow-sm active:scale-95 whitespace-nowrap"
                           >
                             Acelerar Sonho
                           </button>
                        </div>

                        {/* INFO DA META: Alinhamento Stack no Mobile, Row no Desktop */}
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 sm:gap-6 mb-8">
                          
                          {/* LADO ESQUERDO: Ícone e Nome/Tipo */}
                          <div className="flex items-center gap-5 lg:gap-6 min-w-0">
                            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-dark-bg border border-dark-border flex items-center justify-center text-3xl lg:text-4xl shadow-inner shrink-0">
                              {goal.icon}
                            </div>
                            <div className="min-w-0">
                              <span className="block text-[8px] lg:text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-1">{goal.type}</span>
                              <h4 className="font-black text-white text-xl lg:text-2xl tracking-tight leading-tight block truncate">
                                {goal.name}
                              </h4>
                            </div>
                          </div>
                          
                          {/* LADO DIREITO: Valores e Excluir */}
                          <div className="flex items-center justify-between sm:justify-end gap-6 lg:gap-8 shrink-0 border-t border-dark-border/30 pt-4 sm:pt-0 sm:border-0">
                             <div className="text-left sm:text-right">
                                <p className="text-2xl lg:text-3xl font-black text-white leading-none mb-1">{formatValue(goal.current)}</p>
                                <p className="text-[9px] lg:text-[11px] font-bold text-gray-600 uppercase tracking-widest leading-none">Alvo: {formatValue(goal.target)}</p>
                             </div>

                             <button 
                               onClick={() => handleDeleteGoal(goal.id)}
                               className="p-2.5 bg-dark-bg border border-white/5 rounded-xl text-gray-700 hover:text-red-500 hover:border-red-500/50 transition-all shadow-lg self-center"
                               title="Excluir meta"
                             >
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                             </button>
                          </div>
                        </div>
                        
                        {/* BARRA DE PROGRESSO */}
                        <div className="w-full h-3 bg-dark-bg rounded-full overflow-hidden border border-dark-border/30 p-0.5">
                          <div 
                            className={`h-full ${goal.color} rounded-full transition-all duration-[2s] ease-out shadow-[0_0_15px_rgba(139,92,246,0.2)]`} 
                            style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    {goals.length === 0 && <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest text-center py-10">Nenhuma meta ativa ainda</p>}
                  </div>
                </div>

                <div className="bg-dark-card border border-dark-border rounded-[3rem] p-10">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Atividade Recente</h3>
                      <button onClick={() => setCurrentView('EXPENSES')} className="text-[10px] font-black text-brand-400 uppercase tracking-widest hover:text-brand-300">Ver Histórico</button>
                   </div>
                   <div className="space-y-4">
                      {transactions.slice(0, 4).map(t => (
                        <div key={t.id} className="flex items-center justify-between p-4 bg-dark-bg rounded-2xl border border-dark-border/50 transition-all">
                           <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${t.type === TransactionType.INCOME ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                 {t.description.charAt(0)}
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-white leading-tight">{t.description}</p>
                                 <div className="flex items-center gap-2">
                                   <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{t.category}</p>
                                   {t.isRecurring && <span className="bg-brand-500/10 text-brand-400 text-[8px] px-1.5 py-0.5 rounded font-black uppercase">Fixo</span>}
                                 </div>
                              </div>
                           </div>
                           <p className={`font-black ${t.type === TransactionType.INCOME ? 'text-green-500' : 'text-white'}`}>{formatValue(t.amount)}</p>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <ActionSuggestions 
                  balance={summary.balance} 
                  transactions={transactions} 
                  onAutomate={handleAutomateRecurring}
                  privacyMode={privacyMode}
                />
              </div>
            </div>
          </>
        ) : currentView === 'BUDGET' ? (
          <BudgetPage 
            currentBudget={monthlyBudget} 
            onSaveBudget={handleUpdateBudget} 
            isPro={user.isPro} 
            privacyMode={privacyMode}
          />
        ) : currentView === 'REPORTS' ? (
          <ReportsPage transactions={transactions} budget={monthlyBudget} privacyMode={privacyMode} />
        ) : (
          <ExpensesPage 
            transactions={transactions}
            onAddClick={() => {
              setEditingTransaction(null);
              setIsModalOpen(true);
            }}
            onEditClick={(t) => {
              setEditingTransaction(t);
              setIsModalOpen(true);
            }}
            onDelete={handleDeleteTransaction}
            onToggleStatus={handleToggleStatus}
            privacyMode={privacyMode}
          />
        )}
      </div>

      <CommandBar 
        onAddTransaction={handleSaveTransaction}
        onAddTransactions={handleSaveTransactions}
        transactions={transactions} 
        monthlyBudget={monthlyBudget}
        goals={goals}
      />

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }} 
        onSave={handleSaveTransaction}
        initialData={editingTransaction}
      />
      <GoalModal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} onSave={handleSaveGoal} />
      <AportModal 
        isOpen={isAportModalOpen} 
        onClose={() => setIsAportModalOpen(false)} 
        goal={selectedGoalForAport} 
        safeBalance={summary.balance} 
        onConfirm={handleConfirmAport}
      />
      <Toast toasts={toasts} onRemove={(id) => setToasts(p => p.filter(t => t.id !== id))} />
    </Layout>
  );
};

export default App;
