
import React from 'react';
import { Goal } from '../types';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Goal) => void;
}

const GOAL_TEMPLATES = [
  { type: 'Viagem', icon: '✈️', color: 'bg-blue-500' },
  { type: 'Férias', icon: '🌴', color: 'bg-green-500' },
  { type: 'Casamento', icon: '💍', color: 'bg-pink-500' },
  { type: 'Educação', icon: '🎓', color: 'bg-yellow-500' },
  { type: 'Reserva', icon: '🛡️', color: 'bg-brand-500' },
  { type: 'Carro', icon: '🚗', color: 'bg-orange-500' },
  { type: 'Casa', icon: '🏠', color: 'bg-indigo-500' },
  { type: 'Outros', icon: '🎯', color: 'bg-gray-500' },
];

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = React.useState('');
  const [target, setTarget] = React.useState('');
  const [current, setCurrent] = React.useState('0');
  const [selectedType, setSelectedType] = React.useState(GOAL_TEMPLATES[0].type);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const template = GOAL_TEMPLATES.find(t => t.type === selectedType) || GOAL_TEMPLATES[0];
    
    onSave({
      id: crypto.randomUUID(),
      name,
      target: parseFloat(target.replace(/\./g, '').replace(',', '.')),
      current: parseFloat(current.replace(/\./g, '').replace(',', '.')),
      type: selectedType,
      icon: template.icon,
      color: template.color
    });

    setName('');
    setTarget('');
    setCurrent('0');
    onClose();
  };

  const formatBRL = (val: string) => {
    let value = val.replace(/\D/g, '');
    if (value === '') return '';
    const num = Number(value) / 100;
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(num);
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 z-[70]">
      <div className="bg-dark-card border-t sm:border border-dark-border rounded-t-[3rem] sm:rounded-[3rem] w-full max-w-lg p-10 animate-in slide-in-from-bottom-20 duration-500">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Definir Meta</h2>
            <p className="text-sm font-medium text-gray-500 mt-1">Dê um propósito ao seu capital</p>
          </div>
          <button onClick={onClose} className="p-3 text-gray-500 hover:text-white transition-colors bg-dark-bg rounded-2xl border border-dark-border">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3">Nome da Meta</label>
              <input
                autoFocus
                className="w-full px-6 py-5 bg-dark-bg border border-dark-border rounded-2xl focus:border-brand-500/50 outline-none text-white font-bold"
                placeholder="Ex: Viagem para o Chile"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3">Tipo de Meta</label>
              <div className="grid grid-cols-4 gap-2">
                {GOAL_TEMPLATES.map(t => (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => setSelectedType(t.type)}
                    className={`py-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${
                      selectedType === t.type 
                        ? 'border-brand-500 bg-brand-500/10 text-brand-400' 
                        : 'border-dark-border bg-dark-bg text-gray-600'
                    }`}
                  >
                    <span className="text-xl">{t.icon}</span>
                    <span className="text-[8px] font-black uppercase tracking-widest">{t.type}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3">Valor Alvo (R$)</label>
                <input
                  className="w-full px-6 py-5 bg-dark-bg border border-dark-border rounded-2xl focus:border-brand-500/50 outline-none text-white font-black"
                  placeholder="0,00"
                  value={target}
                  onChange={(e) => setTarget(formatBRL(e.target.value))}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3">Já Tenho (R$)</label>
                <input
                  className="w-full px-6 py-5 bg-dark-bg border border-dark-border rounded-2xl focus:border-brand-500/50 outline-none text-white font-black"
                  placeholder="0,00"
                  value={current}
                  onChange={(e) => setCurrent(formatBRL(e.target.value))}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-6 bg-brand-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-brand-700 transition-all shadow-xl"
          >
            Criar Meta Ativa
          </button>
        </form>
      </div>
    </div>
  );
};
