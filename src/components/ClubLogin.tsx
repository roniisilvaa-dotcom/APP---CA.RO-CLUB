import React, { useState } from 'react';
import { Club } from '../types';
import { 
  getClubsDatabase, 
  registerNewClub, 
  PRE_REGISTERED_CLUBS, 
  SIMULATED_FEDERATION_CLUBS 
} from '../clubStorage';
import { 
  ShieldCheck, 
  Search, 
  Plus, 
  Sparkles, 
  ArrowRight, 
  Mail, 
  Lock, 
  Globe, 
  Users, 
  Building2, 
  Award,
  Key,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface ClubLoginProps {
  onLoginSuccess: (club: Club) => void;
}

export default function ClubLogin({ onLoginSuccess }: ClubLoginProps) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Registration fields
  const [regName, setRegName] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regFocus, setRegFocus] = useState('Categoria de Base Completa');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Active db of clubs
  const currentDB = getClubsDatabase();

  // Matched list of pre-registered & simulated federation clubs
  const handleClubSearch = () => {
    if (!searchQuery) return [];
    
    const query = searchQuery.toLowerCase();
    
    // First, find from actual DB (registered or demo)
    const dbMatches = currentDB.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.city.toLowerCase().includes(query)
    );

    // Second, find from pre-registered config list
    const preMatched = PRE_REGISTERED_CLUBS.filter(c => 
      !dbMatches.some(db => db.id === c.id) &&
      (c.name.toLowerCase().includes(query) || c.city.toLowerCase().includes(query))
    );

    // Third, find from the federated lookups simulator (740+ other clubs)
    const simulatedMatched = SIMULATED_FEDERATION_CLUBS.filter(c =>
      !dbMatches.some(db => db.id === c.id) &&
      !preMatched.some(p => p.id === c.id) &&
      (c.name.toLowerCase().includes(query) || c.city.toLowerCase().includes(query))
    );

    return [...dbMatches, ...preMatched, ...simulatedMatched].slice(0, 5);
  };

  const searchResults = handleClubSearch();

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 5000);
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Submit standard Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      triggerError('Por favor, informe seu e-mail e sua senha de acesso.');
      return;
    }

    const cleanedEmail = email.trim().toLowerCase();

    // 1. Check if login matches Superuser/Master credentials
    if (cleanedEmail === 'dadoskagiva@gmail.com' && password === 'admin') {
      const masterClub: Club = {
        id: 'master_admin',
        name: 'Federação Central (Master Admin)',
        city: 'Cascavel - PR',
        categoryFocus: 'Controle Global Regulatório',
        adminEmail: 'dadoskagiva@gmail.com',
        passwordHash: 'admin',
        players: [],
        financials: [],
        registeredAt: '2026-05-27'
      };
      
      triggerSuccess('Credenciais administrativas validadas! Iniciando Painel Regulador...');
      setTimeout(() => {
        onLoginSuccess(masterClub);
      }, 1000);
      return;
    }
    
    // Find in the modern DB
    const foundClub = currentDB.find(c => 
      c.adminEmail === cleanedEmail && 
      c.passwordHash === password
    );

    if (foundClub) {
      // Check for global lockdown status first
      if (localStorage.getItem('CLUBOS_LOCKDOWN_STATUS') === 'LOCKED') {
        triggerError('VETO DO CORREGEDOR: O Portal está operando sob lockdown técnico emergencial. Acesso restrito a Master.');
        return;
      }
      
      // Check if suspended
      const suspendedList = localStorage.getItem('CLUBOS_SUSPENDED_CLUBS');
      const isSusp = suspendedList ? JSON.parse(suspendedList).includes(foundClub.id) : false;
      if (isSusp) {
        triggerError('ACESSO BLOQUEADO: A licença deste clube foi suspensa pela Federação Master.');
        return;
      }
      onLoginSuccess(foundClub);
    } else {
      // Check if it exists in the 742 simulated list, if so registered on the fly for ease!
      const simMatch = SIMULATED_FEDERATION_CLUBS.find(c => c.email.toLowerCase() === cleanedEmail);
      if (simMatch && password === '123') {
        if (localStorage.getItem('CLUBOS_LOCKDOWN_STATUS') === 'LOCKED') {
          triggerError('VETO DO CORREGEDOR: O Portal está operando sob lockdown técnico emergencial. Acesso restrito a Master.');
          return;
        }
        const newlySeeded = registerNewClub(
          simMatch.name, 
          simMatch.city, 
          simMatch.focus, 
          simMatch.email, 
          '123'
        );
        onLoginSuccess(newlySeeded);
      } else {
        triggerError('Credenciais inválidas. Verifique o e-mail ou utilize o Fast-Login demonstrativo.');
      }
    }
  };

  // Handlers for quick 1-click Fast Login
  const handleFastLogin = (demoClub: typeof PRE_REGISTERED_CLUBS[0]) => {
    const isMasterBypass = demoClub.id === 'master_admin';
    if (isMasterBypass) {
      const masterClub: Club = {
        id: 'master_admin',
        name: 'Federação Central (Master Admin)',
        city: 'Cascavel - PR',
        categoryFocus: 'Controle Global Regulatório',
        adminEmail: 'dadoskagiva@gmail.com',
        passwordHash: 'admin',
        players: [],
        financials: [],
        registeredAt: '2026-05-27'
      };
      onLoginSuccess(masterClub);
      return;
    }

    const found = currentDB.find(c => c.id === demoClub.id);
    if (found) {
      // Check if suspended
      const suspendedList = localStorage.getItem('CLUBOS_SUSPENDED_CLUBS');
      const isSusp = suspendedList ? JSON.parse(suspendedList).includes(found.id) : false;
      if (isSusp) {
        triggerError('ACESSO BLOQUEADO: A licença deste clube foi suspensa pela Federação Master.');
        return;
      }
      onLoginSuccess(found);
    } else {
      const newlySeeded = registerNewClub(
        demoClub.name, 
        demoClub.city, 
        demoClub.focus, 
        demoClub.email, 
        demoClub.password
      );
      onLoginSuccess(newlySeeded);
    }
  };

  // Custom simulation login on result click
  const handleResultClick = (club: any) => {
    setEmail(club.email || club.adminEmail);
    setPassword('123'); // seed default access pass
    setSearchQuery('');
    triggerSuccess(`Preenchido! Login para ${club.name} configurado. Senha padrão: 123.`);
  };

  // Submit register new club
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regCity || !regEmail || !regPassword) {
      triggerError('Campos obrigatórios estão vazios. Preencha Nome, Cidade, E-mail e Senha.');
      return;
    }

    const emailInUse = currentDB.some(c => c.adminEmail === regEmail.trim().toLowerCase());
    if (emailInUse) {
      triggerError('Este e-mail corporativo de diretor de clube já está cadastrado.');
      return;
    }

    // Register & log in instantly
    const newClub = registerNewClub(
      regName,
      regCity,
      regFocus,
      regEmail,
      regPassword
    );

    triggerSuccess(`Clube ${regName} credenciado com sucesso! Inicializando prontuário...`);
    setTimeout(() => {
      onLoginSuccess(newClub);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#070708] flex items-center justify-center p-4 md:p-6 text-slate-200">
      
      {/* Dynamic background lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT COLUMN: Visual Brand & Live Scale Stats */}
        <div className="lg:col-span-5 flex flex-col justify-between py-6 space-y-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 text-lg">
                C
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white leading-none">
                  CLUB<span className="text-blue-500 font-black italic">OS</span>
                </h1>
                <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase block mt-1">Multi-Tenant Grid Control</span>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <h2 className="text-2xl font-black text-white leading-tight font-sans tracking-tight">
                Painel Esportivo Integrado para <span className="text-blue-400">Centenas de Clubes</span>.
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Uma infraestrutura completa de multilocação (sharded data storage). Cada secretaria esportiva possui uma instância isolada para gerenciar atletas, emitir carteirinhas QR Code, registrar mensalidades e gerenciar avaliações.
              </p>
            </div>
          </div>

          {/* Federated Club Counters */}
          <div className="space-y-4">
            <div className="bg-[#111113]/80 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center font-bold shrink-0 text-lg">
                742
              </div>
              <div className="text-xs leading-normal">
                <p className="font-bold text-white">Clubes Ativos Atualmente</p>
                <p className="text-[11px] text-slate-400">Inscritos e monitorados por Federações Estaduais de Várzea e Juniores.</p>
              </div>
            </div>

            <div className="bg-[#111113]/80 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                <Globe className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-xs leading-normal">
                <p className="font-bold text-white">Prontuário Descentralizado</p>
                <p className="text-[11px] text-slate-400">Total segurança de dados com localStorage replicável em Cloud SQL.</p>
              </div>
            </div>
          </div>

          {/* Client Brand Footer */}
          <div className="text-[10px] text-slate-500 leading-normal flex items-center gap-3">
            <span className="bg-slate-800 px-2 py-0.5 rounded font-mono font-bold text-xs text-amber-500">CA.RO TECH</span>
            <span>Enterprise Multi-Club Solution v4.2</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Authentication Card */}
        <div className="lg:col-span-7 bg-[#111113] border border-slate-800/90 rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col justify-between">
          
          <div>
            {/* Mode selection tabs */}
            <div className="flex border-b border-slate-800 pb-4 mb-6">
              <button
                onClick={() => {
                  setIsRegisterMode(false);
                  setErrorMsg(null);
                }}
                className={`pb-2 text-sm font-bold tracking-wide uppercase transition-all relative px-3 ${
                  !isRegisterMode ? 'text-white' : 'text-slate-500 hover:text-slate-350'
                }`}
              >
                {!isRegisterMode && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded"></span>}
                Acessar meu Clube
              </button>
              <button
                onClick={() => {
                  setIsRegisterMode(true);
                  setErrorMsg(null);
                }}
                className={`pb-2 text-sm font-bold tracking-wide uppercase transition-all relative px-3 ml-6 ${
                  isRegisterMode ? 'text-white' : 'text-slate-500 hover:text-slate-350'
                }`}
              >
                {isRegisterMode && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded"></span>}
                Novo Credenciamento
              </button>
            </div>

            {/* Simulated Federation Live Search (Only when logging in to demonstrate the 700+ clubs access) */}
            {!isRegisterMode && (
              <div className="mb-6 relative">
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 tracking-widest flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-blue-400" />
                  Localizador de Clubes Federados (Busca Inteligente)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Digite seu time para carregar (Ex: Barcelona, Bahia, Real Jaraguá...)"
                    className="w-full bg-[#080809] border border-slate-800/80 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                </div>

                {/* Display matched clubs dynamically */}
                {searchQuery && (
                  <div className="absolute left-0 right-0 mt-2 bg-[#18181B] border border-slate-800 rounded-xl shadow-2xl z-50 p-2 space-y-1">
                    <p className="text-[9px] text-slate-500 font-black uppercase px-2 py-1 border-b border-slate-800/50 mb-1">
                      Resultados encontrados ({searchResults.length} de 742 clubes)
                    </p>
                    {searchResults.map((club, idx) => (
                      <div
                        key={club.id}
                        onClick={() => handleResultClick(club)}
                        className="p-2.5 hover:bg-[#202024] rounded-lg transition-colors cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <Building2 className="w-4 h-4 text-blue-400" />
                          <div>
                            <span className="font-bold text-slate-200 block">{club.name}</span>
                            <span className="text-[10px] text-slate-400 block">{club.city}</span>
                          </div>
                        </div>
                        <span className="text-[9px] bg-blue-600/10 text-blue-400 px-2 py-0.5 rounded font-mono font-extrabold uppercase">
                          Clique p/ logar
                        </span>
                      </div>
                    ))}
                    {searchResults.length === 0 && (
                      <div className="p-3 text-center text-slate-500 text-[11px]">
                        Nenhum clube correspondente nos registros federativos. Cadastre como novo clube ao lado!
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Notification messages */}
            {errorMsg && (
              <div className="bg-rose-500/5 border border-rose-500/25 p-3 rounded-xl flex items-start gap-2.5 text-xs text-rose-400 mb-6 font-sans">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="bg-emerald-500/5 border border-emerald-500/25 p-3 rounded-xl flex items-start gap-2.5 text-xs text-emerald-400 mb-6 font-sans">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* MODE 1: LOGIN FORM */}
            {!isRegisterMode ? (
              <form onSubmit={handleLogin} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">E-mail do Gestor Esportivo</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@clube.com"
                      className="w-full bg-[#080809] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">Chave de Segurança (Senha)</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Sua senha corporativa de clube"
                      className="w-full bg-[#080809] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                >
                  Confirmar Acesso à Súmula Geral
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* MODE 2: REGISTER FORM */
              <form onSubmit={handleRegister} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1.5 font-semibold">Nome Oficial do Clube</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Ex: Real Jabaquara F.C."
                        className="w-full bg-[#080809] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        required
                      />
                      <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1.5 font-semibold">Cidade & Estado (UF)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        placeholder="Ex: Santos - SP"
                        className="w-full bg-[#080809] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        required
                      />
                      <Globe className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1.5 font-semibold">E-mail Administrativo</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="Ex: diretoria@clube.com"
                        className="w-full bg-[#080809] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        required
                      />
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1.5 font-semibold">Senha Secreta do Diretor</label>
                    <div className="relative">
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Defina sua senha esportiva"
                        className="w-full bg-[#080809] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        required
                      />
                      <Key className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">Foco Esportivo / Categorias Ativas</label>
                  <select
                    value={regFocus}
                    onChange={(e) => setRegFocus(e.target.value)}
                    className="w-full bg-[#080809] border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="Categoria de Base Completa">Categoria de Base Completa (Sub-15 ao Sub-20)</option>
                    <option value="Futebol Amador Adulto / Veteranos">Futebol Amador Adulto / Veteranos (+35)</option>
                    <option value="Iniciação Infantil">Iniciação Infantil (Sub-9 ao Sub-13)</option>
                    <option value="Futebol Profissional Rendimento">Futebol Profissional Rendimento</option>
                  </select>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 flex items-start gap-2.5 text-[10px] text-slate-450 text-slate-450 text-slate-400 leading-normal">
                  <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Seeding de Atletas Ativo</span>
                    Seu novo clube será inicializado com uma equipe preliminar de 4 grandes atletas prototipados para manter os scores, controle tático de frequências, e fluxo financeiro em pleno funcionamento.
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                >
                  Registrar & Credenciar Unidade Esportiva
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Demonstration Quick Account Bypasses */}
          {!isRegisterMode && (
            <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Fast Access (Demonstrativos CARO TECH)</span>
              </div>
              <p className="text-[10px] text-slate-500">Acesse o portal do clube ou assuma o controle macro da federação imediatamente:</p>
              
              {/* Premium Master Bypass Button */}
              <div className="mb-2.5">
                <button
                  onClick={() => handleFastLogin({ id: 'master_admin', name: 'Federação Central', city: 'Cascavel - PR', focus: 'Controle Global Regulatório', email: 'dadoskagiva@gmail.com', password: 'admin', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=80&auto=format&fit=crop' })}
                  type="button"
                  className="w-full p-3 bg-gradient-to-r from-amber-600/10 to-amber-500/5 hover:from-amber-600/15 hover:to-amber-500/10 border border-amber-500/30 text-left transition flex items-center justify-between rounded-xl text-xs cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <span className="font-extrabold text-amber-400 block uppercase tracking-wider text-[10px]">Portal de Controle Master Admin (Federação)</span>
                      <span className="text-[9px] text-slate-400 block font-mono">Supervisor Global • dadoskagiva@gmail.com</span>
                    </div>
                  </div>
                  <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-mono font-extrabold uppercase text-[8px] tracking-wider shrink-0 animate-pulse">
                    ACESSAR SUPLEMENTO
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { ...PRE_REGISTERED_CLUBS[0], title: 'Kagiva FC' },
                  { ...PRE_REGISTERED_CLUBS[1], title: 'Flamenguinho' },
                  { ...PRE_REGISTERED_CLUBS[2], title: 'Barcelona' }
                ].map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => handleFastLogin(demo)}
                    type="button"
                    className="p-2 bg-[#09090B] border border-slate-800/85 hover:bg-[#151518] rounded-xl text-left transition flex items-center gap-2 text-[10px] cursor-pointer"
                  >
                    <img 
                      src={demo.avatar} 
                      alt={demo.title} 
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover border border-slate-700 shrink-0" 
                    />
                    <div className="truncate">
                      <span className="font-bold text-white block truncate text-[9px]">{demo.title}</span>
                      <span className="text-[8px] text-slate-500 block font-mono leading-tight">Senha: {demo.password}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
