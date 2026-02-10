
import React from 'react';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulação de delay de rede para UX
    setTimeout(() => {
      onLogin({
        name: email.split('@')[0] || 'Usuário',
        email: email,
        isAuthenticated: true,
        isPro: true
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        name: 'Luis Monify',
        email: 'luis@monify.app',
        isAuthenticated: true,
        isPro: true
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Aurora Mesh Gradient - Apple Premium Style */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-dark-bg">
        {/* Camada Roxo Monify */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-600/20 blur-[120px] rounded-full animate-aurora-1"></div>
        {/* Camada Azul Profundo */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 blur-[140px] rounded-full animate-aurora-2"></div>
        {/* Camada Verde Esmeralda */}
        <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[110px] rounded-full animate-aurora-3"></div>
        
        {/* Overlay Dark para manter contraste */}
        <div className="absolute inset-0 bg-dark-bg/40 backdrop-blur-[20px]"></div>
      </div>

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center neon-glow mb-6">
            <span className="text-white text-3xl font-black">M</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2 uppercase">Monify</h1>
          <p className="text-gray-400 font-medium px-8 leading-relaxed">Domine suas finanças. <br/><span className="text-white font-bold">Conquiste sua liberdade.</span></p>
        </div>

        <div className="bg-dark-card/60 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-8 lg:p-10 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3 ml-2">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full px-6 py-5 bg-dark-bg/50 border border-dark-border rounded-2xl focus:border-brand-500 outline-none text-white transition-all font-bold placeholder:text-gray-800"
              />
            </div>

            <div className="relative">
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3 ml-2">Senha</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-6 py-5 bg-dark-bg/50 border border-dark-border rounded-2xl focus:border-brand-500 outline-none text-white transition-all font-bold placeholder:text-gray-800"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 bottom-5 text-gray-600 hover:text-gray-400 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="hidden" />
                <div className="w-4 h-4 border border-dark-border rounded bg-dark-bg group-hover:border-brand-500 transition-all flex items-center justify-center">
                   <div className="w-2 h-2 bg-brand-500 rounded-sm opacity-0 group-hover:opacity-100 transition-all"></div>
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Lembrar-me</span>
              </label>
              <button type="button" className="text-[10px] font-bold text-brand-400 hover:text-brand-300 uppercase tracking-widest transition-colors">Esqueceu a senha?</button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 bg-brand-600 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-brand-700 transition-all shadow-xl shadow-brand-600/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : 'Entrar na Plataforma'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-[#151923] px-4 text-gray-700 uppercase">ou acesso rápido</span></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-5 bg-dark-bg/80 border border-white/5 text-white rounded-[2rem] font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-3 active:scale-95 group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google Login
          </button>
        </div>

        <p className="mt-10 text-center text-xs font-bold text-gray-600 uppercase tracking-widest">
          Novo por aqui?{' '}
          <button className="text-brand-400 hover:text-brand-300 transition-colors">Crie sua conta agora</button>
        </p>
      </div>
    </div>
  );
};
