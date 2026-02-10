
import React from 'react';
import { Type } from "@google/genai";
import { Transaction, TransactionType, TransactionStatus } from '../types';
import { withRetry, getAIClient } from '../services/ai';
import { CATEGORIES } from '../constants';

interface CommandBarProps {
  onAddTransaction: (t: Transaction) => void;
  onAddTransactions?: (items: Transaction[]) => void;
  transactions: Transaction[];
  monthlyBudget: number;
  goals?: any[];
}

export const CommandBar: React.FC<CommandBarProps> = ({ 
  onAddTransaction, 
  onAddTransactions,
  transactions, 
  monthlyBudget,
  goals = []
}) => {
  const [prompt, setPrompt] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ text: string; type: 'info' | 'success' | 'error' | 'warning' | 'sandbox'; sources?: any[] } | null>(null);

  const getButtonLabel = () => {
    if (isLoading) return '...';
    const p = prompt.toLowerCase().trim();
    if (!p) return 'Analisar';
    
    const isLaunch = p.match(/\d/) || p.includes('ganhei') || p.includes('gastei') || p.includes('recebi') || p.includes('paguei') || p.includes('lance') || p.includes('comprei');
    const isSimulation = p.includes('se ') || p.includes('comprar') || p.includes('preço') || p.includes('custo') || p.includes('queria') || p.includes('vale a pena') || p.includes('pretendo') || p.includes('posso');
    
    if (isLaunch) return 'Lançar';
    if (isSimulation) return 'Simular';
    
    return 'Analisar';
  };

  const processCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setFeedback(null);

    try {
      const ai = getAIClient();
      const p = prompt.toLowerCase();
      
      // Inteligência de Roteamento de Ferramentas
      // A API do Gemini não permite Search + Outras Tools juntas.
      const isLaunchIntent = p.match(/\d/) || p.includes('ganhei') || p.includes('gastei') || p.includes('recebi') || p.includes('paguei') || p.includes('lance') || p.includes('comprei');
      const isSearchIntent = p.includes('preço') || p.includes('custo') || p.includes('quanto') || p.includes('onde comprar') || p.includes('melhor preço') || p.includes('mercado');

      const totalExpense = transactions.reduce((acc, t) => acc + (t.type === TransactionType.EXPENSE ? t.amount : 0), 0);
      const totalIncome = transactions.reduce((acc, t) => acc + (t.type === TransactionType.INCOME ? t.amount : 0), 0);
      const balance = (monthlyBudget + totalIncome) - totalExpense;

      const financialContext = {
        currentBalance: balance,
        monthlyBudget,
        goals: goals.map(g => `${g.name}: Alvo ${g.target}, Atual ${g.current}`),
      };

      const systemInstruction = `Você é o Monify Advisor. Seja EXTREMAMENTE conciso e direto.
      
      REGRAS:
      - Use Bullet Points (•).
      - Destaque valores em **negrito**.
      - Se for um lançamento, peça confirmação indireta.
      - Se for uma simulação de compra, diga o impacto % no saldo livre de R$ ${balance.toFixed(2)}.

      Sempre termine com um "Veredito": Pode comprar / Melhor esperar / Lançamento efetuado.`;

      // Se for intenção de lançamento, usamos Function Calling. Caso contrário, priorizamos Busca/Simulação.
      const tools = isLaunchIntent ? [
        {
          functionDeclarations: [{
            name: 'add_transactions',
            description: 'Lança registros financeiros reais no banco de dados do usuário.',
            parameters: {
              type: Type.OBJECT,
              properties: {
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      description: { type: Type.STRING },
                      amount: { type: Type.NUMBER },
                      type: { type: Type.STRING, enum: ['INCOME', 'EXPENSE'] },
                      category: { type: Type.STRING, description: 'Categoria apropriada (Alimentação, Lazer, etc)' }
                    },
                    required: ['description', 'amount', 'type', 'category']
                  }
                }
              },
              required: ['items']
            }
          }]
        }
      ] : [
        { googleSearch: {} }
      ];

      const response = await withRetry(async () => {
        return await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Usuário diz: "${prompt}". Contexto financeiro: ${JSON.stringify(financialContext)}`,
          config: {
            systemInstruction: systemInstruction,
            tools: tools
          }
        });
      });

      if (response.functionCalls && response.functionCalls.length > 0) {
        const call = response.functionCalls[0];
        if (call.name === 'add_transactions') {
          const { items } = call.args as { items: any[] };
          const newTransactions: Transaction[] = items.map(args => ({
            id: crypto.randomUUID(),
            description: args.description,
            amount: args.amount,
            type: args.type as TransactionType,
            status: args.type === 'INCOME' ? TransactionStatus.PAID : TransactionStatus.PENDING,
            date: new Date().toISOString(),
            category: args.category || 'Outros'
          }));

          if (onAddTransactions) onAddTransactions(newTransactions);
          setFeedback({ text: `Perfeito! Registrei:\n• ${items.map(i => `${i.description} (**R$ ${i.amount}**)`).join('\n• ')}\n\n**Veredito:** Lançamento efetuado com sucesso.`, type: 'success' });
          setPrompt('');
          setTimeout(() => setFeedback(null), 5000);
        }
      } else {
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        setFeedback({ 
          text: response.text || "Ops, não consegui analisar isso agora.", 
          type: isSearchIntent ? 'sandbox' : 'info',
          sources: sources
        });
        setPrompt('');
      }
    } catch (error: any) {
      console.error("Erro no Advisor:", error);
      setFeedback({ text: "Ocorreu um erro ao processar sua solicitação. Tente reformular o comando.", type: 'error' });
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 lg:bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-[55]">
      {feedback && (
        <div className={`mb-6 rounded-[2.5rem] border animate-in slide-in-from-bottom-10 duration-500 shadow-2xl backdrop-blur-3xl relative overflow-hidden flex flex-col ${
          feedback.type === 'sandbox' 
            ? 'bg-dark-card/95 border-brand-500/50' 
            : feedback.type === 'success' 
              ? 'bg-green-500/10 border-green-500/30'
              : feedback.type === 'error'
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-dark-card/95 border-dark-border'
        }`}>
          
          <div className="p-5 border-b border-white/5 flex items-center justify-between sticky top-0 bg-dark-card/80 backdrop-blur-md z-20">
             <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${
                  feedback.type === 'sandbox' ? 'bg-brand-500/20 text-brand-400' : 'bg-white/5 text-gray-500'
                }`}>
                  {feedback.type === 'sandbox' ? '✨' : feedback.type === 'success' ? '✅' : '💬'}
                </div>
                <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest">Monify Advisor</span>
             </div>
             <button 
              onClick={() => setFeedback(null)} 
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all active:scale-90"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="p-8 max-h-[40vh] overflow-y-auto custom-scrollbar">
            <div className={`font-black leading-relaxed tracking-tight space-y-4 ${
              feedback.type === 'success' ? 'text-green-500 text-sm lg:text-base' : 'text-gray-100 text-sm lg:text-base'
            }`}>
              <div className="whitespace-pre-line prose prose-invert max-w-none">
                {feedback.text}
              </div>
              
              {feedback.sources && feedback.sources.length > 0 && (
                <div className="pt-6 border-t border-white/5 flex flex-wrap gap-2">
                  {feedback.sources.map((chunk: any, i: number) => chunk.web && (
                    <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-brand-400 font-bold hover:bg-white/20 transition-all flex items-center gap-2">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      {chunk.web.title || "Fonte"}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <form 
        onSubmit={processCommand}
        className="relative group bg-dark-card border border-white/5 p-2 rounded-full lg:rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] transition-all focus-within:border-brand-500/50 ring-4 ring-black/80"
      >
        <div className="flex items-center gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full lg:rounded-[1.25rem] flex items-center justify-center transition-all ${isLoading ? 'bg-brand-500/20 text-brand-500 animate-pulse' : 'bg-dark-bg text-gray-100'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div className="flex-1">
            <input 
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Lance um gasto ou peça uma simulação..."
              className="w-full bg-transparent border-none outline-none text-white placeholder:text-gray-700 font-black text-sm lg:text-lg tracking-tight py-4"
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="w-12 h-12 lg:w-auto lg:px-10 bg-brand-600 hover:bg-brand-700 disabled:opacity-30 text-white font-black rounded-full lg:rounded-[1.5rem] transition-all shadow-[0_10px_30px_rgba(124,58,237,0.3)] active:scale-95 text-[10px] lg:text-xs uppercase tracking-widest relative overflow-hidden group/btn flex items-center justify-center shrink-0"
          >
            <span className="hidden lg:inline relative z-10">{getButtonLabel()}</span>
            <span className="lg:hidden relative z-10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
