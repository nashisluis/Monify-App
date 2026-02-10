
import React from 'react';
import { withRetry, getAIClient } from '../services/ai';
import { Transaction } from '../types';

interface ActionSuggestionsProps {
  balance: number;
  transactions: Transaction[];
  onAutomate?: (description: string) => void;
  privacyMode?: boolean;
}

export const ActionSuggestions: React.FC<ActionSuggestionsProps> = ({ balance, transactions, onAutomate, privacyMode }) => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<{ travel: string; invest: string } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  
  const recurringSuggestions = React.useMemo(() => {
    const counts: Record<string, number> = {};
    const commonFixedNames = ['aluguel', 'condomínio', 'carro', 'seguro', 'cnpj', 'contadora', 'internet', 'netflix', 'spotify', 'mercado'];
    
    transactions.forEach(t => {
      if (t.isRecurring) return;
      const desc = t.description.toLowerCase();
      counts[desc] = (counts[desc] || 0) + 1;
    });

    return Object.entries(counts)
      .filter(([name, count]) => count >= 2 || commonFixedNames.some(fixed => name.includes(fixed)))
      .map(([name]) => name.charAt(0).toUpperCase() + name.slice(1))
      .slice(0, 2);
  }, [transactions]);

  const getSmartSuggestions = async () => {
    if (balance <= 0) return;
    setLoading(true);
    setError(null);
    try {
      const ai = getAIClient();
      
      const response = await withRetry(async () => {
        return await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Analise um saldo disponível de R$ ${balance.toFixed(2)}. 
          Retorne um JSON com:
          - "travel": Uma frase curta sugerindo uma viagem ou lazer acessível.
          - "invest": Uma frase curta sugerindo um tipo de investimento para este valor.
          Linguagem motivadora.`,
          config: { responseMimeType: "application/json" }
        });
      });
      
      const parsed = JSON.parse(response.text);
      setData(parsed);
    } catch (err: any) {
      console.error("Erro nas sugestões:", err);
      setError("Não foi possível carregar sugestões personalizadas agora.");
      setData({
        travel: "Com este saldo, você pode planejar um jantar especial ou um passeio cultural local.",
        invest: "Considere guardar este valor em uma reserva de emergência com liquidez diária."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConsultLazer = () => {
    const query = data?.travel || "viagens baratas";
    window.open(`https://www.decolar.com/search/flights/ANY/ANY?from=...&query=${encodeURIComponent(query)}`, '_blank');
  };

  const handleConsultInvest = () => {
    window.open(`https://www.google.com/finance/quote/IBOV:INDEXBV?hl=pt-BR&q=investimentos+para+${balance}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {recurringSuggestions.length > 0 && (
        <div className="bg-brand-600/10 border border-brand-500/30 rounded-3xl p-6 relative overflow-hidden group">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
             </div>
             <span className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Smart Recurring</span>
          </div>
          <h4 className="text-sm font-black text-white mb-2">Lançamento Fixo Detectado?</h4>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            Notei que você lança <strong>"{recurringSuggestions[0]}"</strong> com frequência. Deseja marcar como despesa fixa mensal?
          </p>
          <button 
            onClick={() => onAutomate?.(recurringSuggestions[0])}
            className="w-full py-2.5 bg-brand-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-700 transition-all shadow-lg"
          >
            Automatizar
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Consultoria IA</h3>
        {!data && !loading && (
          <button 
            onClick={getSmartSuggestions}
            className="text-[10px] font-black text-brand-400 hover:text-brand-300 uppercase tracking-widest flex items-center gap-1 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Gerar
          </button>
        )}
      </div>
      
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 font-medium leading-tight">
          {error}
        </div>
      )}

      <div className="bg-dark-card border border-dark-border p-6 rounded-3xl relative overflow-hidden group">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </div>
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Lazer</span>
        </div>
        <h4 className="text-lg font-bold mb-2">Estilo de Vida</h4>
        <p className="text-sm text-gray-400 mb-6 leading-relaxed min-h-[40px]">
          {loading ? "Pensando nas melhores opções..." : (data?.travel || "Sugestões de lazer baseadas no seu saldo livre.")}
        </p>
        <button 
          onClick={handleConsultLazer}
          disabled={!data}
          className="w-full py-3 bg-dark-bg border border-dark-border rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Ver Detalhes <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7-7m7-7H3" /></svg>
        </button>
      </div>

      <div className="bg-dark-card border border-dark-border p-6 rounded-3xl relative overflow-hidden group">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
             <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Investir</span>
        </div>
        <h4 className="text-lg font-bold mb-2">Potencializar Saldo</h4>
        <p className="text-sm text-gray-400 mb-6 leading-relaxed min-h-[40px]">
           {loading ? "Analisando mercado..." : (data?.invest || "Como multiplicar seu saldo restante com segurança.")}
        </p>
        <button 
          onClick={handleConsultInvest}
          disabled={!data}
          className="w-full py-3 bg-dark-bg border border-dark-border rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Simular <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7-7m7-7H3" /></svg>
        </button>
      </div>
    </div>
  );
};
