
import React from 'react';

export const MarketTicker: React.FC = () => {
  const [prices, setPrices] = React.useState({
    usd: '5.12',
    btc: '324.512',
    selic: '13.75'
  });

  // Simulando atualização de preços (em um app real viria de uma API como CoinGecko ou AwesomeAPI)
  React.useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => ({
        ...prev,
        usd: (parseFloat(prev.usd) + (Math.random() * 0.02 - 0.01)).toFixed(2),
        btc: (parseFloat(prev.btc.replace('.', '')) + (Math.random() * 100 - 50)).toLocaleString('pt-BR')
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-brand-950/40 border-b border-dark-border py-2 overflow-hidden whitespace-nowrap z-50">
      <div className="flex items-center gap-8 animate-[scroll_30s_linear_infinite] px-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">USD/BRL</span>
          <span className="text-xs font-mono font-bold text-green-400">R$ {prices.usd}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">BITCOIN</span>
          <span className="text-xs font-mono font-bold text-brand-400">R$ {prices.btc}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">SELIC</span>
          <span className="text-xs font-mono font-bold text-blue-400">{prices.selic}%</span>
        </div>
        {/* Duplicando para o scroll infinito parecer fluido */}
        <div className="flex items-center gap-8 opacity-50">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">USD/BRL</span>
            <span className="text-xs font-mono font-bold text-green-400">R$ {prices.usd}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">BITCOIN</span>
            <span className="text-xs font-mono font-bold text-brand-400">R$ {prices.btc}</span>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
