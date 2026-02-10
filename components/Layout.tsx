
import React from 'react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: { name: string; isPro: boolean };
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  privacyMode: boolean;
  onTogglePrivacy: () => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  currentView, 
  onNavigate, 
  privacyMode, 
  onTogglePrivacy,
  onLogout
}) => {
  return (
    <div className="flex min-h-screen bg-dark-bg text-gray-100">
      {/* Sidebar Desktop */}
      <aside className="w-64 border-r border-dark-border flex flex-col fixed inset-y-0 hidden lg:flex bg-dark-bg z-30">
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center neon-glow">
              <span className="text-white font-bold">M</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Monify</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => onNavigate('DASHBOARD')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${currentView === 'DASHBOARD' ? 'sidebar-active text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Painel
          </button>
          <button 
            onClick={() => onNavigate('EXPENSES')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${currentView === 'EXPENSES' ? 'sidebar-active text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Despesas
          </button>
          <button 
            onClick={() => onNavigate('REPORTS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${currentView === 'REPORTS' ? 'sidebar-active text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            Relatórios
          </button>
          <button 
            onClick={() => onNavigate('BUDGET')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${currentView === 'BUDGET' ? 'sidebar-active text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Orçamento
          </button>
        </nav>

        <div className="px-4 py-8 border-t border-dark-border mt-auto space-y-8 bg-dark-bg/50">
          {/* Botão de Privacidade isolado */}
          <button 
            onClick={onTogglePrivacy}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] transition-all ${privacyMode ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' : 'text-gray-600 hover:text-gray-400 border border-transparent'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
            {privacyMode ? 'Público: ON' : 'Modo Privado'}
          </button>

          {/* Área de Perfil sem o botão Sair grudado */}
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 rounded-full bg-dark-card flex items-center justify-center text-lg font-black border border-dark-border text-brand-400 shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-black truncate leading-none text-white uppercase tracking-tight">{user.name}</p>
              {user.isPro && <span className="text-[9px] text-brand-500 font-bold uppercase tracking-widest block mt-1">👑 Pro Member</span>}
            </div>
          </div>

          {/* Botão Sair isolado no rodapé */}
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-[10px] font-black text-gray-700 hover:text-red-500 hover:bg-red-500/5 uppercase tracking-[0.3em] transition-all border border-transparent hover:border-red-500/10 group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-dark-card/90 backdrop-blur-2xl border-t border-dark-border z-40 px-4 py-3 flex justify-around items-center rounded-t-[2rem]">
        <button 
          onClick={() => onNavigate('DASHBOARD')}
          className={`flex flex-col items-center gap-1 transition-all ${currentView === 'DASHBOARD' ? 'text-brand-500 scale-110' : 'text-gray-500'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[8px] font-bold uppercase tracking-widest">Painel</span>
        </button>
        <button 
          onClick={() => onNavigate('EXPENSES')}
          className={`flex flex-col items-center gap-1 transition-all ${currentView === 'EXPENSES' ? 'text-brand-500 scale-110' : 'text-gray-500'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-[8px] font-bold uppercase tracking-widest">Gastos</span>
        </button>
        <button 
          onClick={onTogglePrivacy}
          className={`flex flex-col items-center gap-1 transition-all ${privacyMode ? 'text-brand-500 scale-125' : 'text-gray-500'}`}
        >
          {privacyMode ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          )}
          <span className="text-[8px] font-bold uppercase tracking-widest">{privacyMode ? 'Visível' : 'Privado'}</span>
        </button>
        <button 
          onClick={onLogout}
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-red-400 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span className="text-[8px] font-bold uppercase tracking-widest">Sair</span>
        </button>
      </nav>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-10 min-h-screen pb-40 lg:pb-10 overflow-x-hidden">
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
};
