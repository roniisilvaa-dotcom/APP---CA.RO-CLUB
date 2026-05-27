import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Club } from '../types';
import {
  getClubsDatabase,
  registerNewClub,
  PRE_REGISTERED_CLUBS,
  SIMULATED_FEDERATION_CLUBS
} from '../clubStorage';
import {
  ShieldCheck, Search, Plus, Sparkles, ArrowRight, Mail, Lock,
  Globe, Building2, Award, Key, Info, CheckCircle2, AlertTriangle,
  Users, TrendingUp, Trophy, Zap
} from 'lucide-react';

interface ClubLoginProps {
  onLoginSuccess: (club: Club) => void;
}

export default function ClubLogin({ onLoginSuccess }: ClubLoginProps) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg]   = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [regName, setRegName]     = useState('');
  const [regCity, setRegCity]     = useState('');
  const [regFocus, setRegFocus]   = useState('Categoria de Base Completa');
  const [regEmail, setRegEmail]   = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [loading, setLoading]     = useState(false);

  const currentDB = getClubsDatabase();

  const handleClubSearch = () => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    const dbMatches  = currentDB.filter(c => c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q));
    const preMatched = PRE_REGISTERED_CLUBS.filter(c => !dbMatches.some(d => d.id === c.id) && (c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q)));
    const simMatched = SIMULATED_FEDERATION_CLUBS.filter(c => !dbMatches.some(d => d.id === c.id) && !preMatched.some(p => p.id === c.id) && (c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q)));
    return [...dbMatches, ...preMatched, ...simMatched].slice(0, 5);
  };
  const searchResults = handleClubSearch();

  const triggerError   = (msg: string) => { setErrorMsg(msg);   setTimeout(() => setErrorMsg(null), 5000); };
  const triggerSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(null), 4000); };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { triggerError('Informe o e-mail e a senha de acesso.'); return; }
    setLoading(true);

    const cleanedEmail = email.trim().toLowerCase();

    const MASTER_CREDS = [
      { email: 'dadoskagiva@gmail.com', pass: 'admin' },
      { email: 'master@clubos.com.br',  pass: 'admin123' },
      { email: 'master@clubos.com.br',  pass: 'admin' },
      { email: 'admin@clubos.com.br',   pass: 'admin123' },
    ];

    setTimeout(() => {
      setLoading(false);

      if (MASTER_CREDS.some(c => c.email === cleanedEmail && c.pass === password)) {
        const masterClub: Club = {
          id: 'master_admin', name: 'Federação Master', city: 'Nacional',
          categoryFocus: 'Controle Global', adminEmail: cleanedEmail,
          passwordHash: password, players: [], financials: [], registeredAt: '2026-05-27'
        };
        triggerSuccess('Acesso master validado!');
        setTimeout(() => onLoginSuccess(masterClub), 800);
        return;
      }

      const found = currentDB.find(c => c.adminEmail === cleanedEmail && c.passwordHash === password);
      if (found) {
        if (localStorage.getItem('CLUBOS_LOCKDOWN_STATUS') === 'LOCKED') { triggerError('Portal em lockdown emergencial. Acesso restrito ao Master.'); return; }
        const suspended = localStorage.getItem('CLUBOS_SUSPENDED_CLUBS');
        if (suspended && JSON.parse(suspended).includes(found.id)) { triggerError('Licença deste clube suspensa pela Federação.'); return; }
        onLoginSuccess(found);
        return;
      }

      const sim = SIMULATED_FEDERATION_CLUBS.find(c => c.email.toLowerCase() === cleanedEmail);
      if (sim && password === '123') {
        const seeded = registerNewClub(sim.name, sim.city, sim.focus, sim.email, '123');
        onLoginSuccess(seeded);
        return;
      }

      triggerError('Credenciais inválidas. Verifique o e-mail ou use o acesso rápido abaixo.');
    }, 600);
  };

  const handleFastLogin = (demoClub: typeof PRE_REGISTERED_CLUBS[0]) => {
    if (demoClub.id === 'master_admin') {
      const masterClub: Club = {
        id: 'master_admin', name: 'Federação Master', city: 'Nacional',
        categoryFocus: 'Controle Global', adminEmail: 'master@clubos.com.br',
        passwordHash: 'admin123', players: [], financials: [], registeredAt: '2026-05-27'
      };
      onLoginSuccess(masterClub);
      return;
    }
    const found = currentDB.find(c => c.id === demoClub.id);
    if (found) { onLoginSuccess(found); return; }
    onLoginSuccess(registerNewClub(demoClub.name, demoClub.city, demoClub.focus, demoClub.email, demoClub.password));
  };

  const handleResultClick = (club: any) => {
    setEmail(club.email || club.adminEmail);
    setPassword('123');
    setSearchQuery('');
    triggerSuccess(`Login preenchido para ${club.name}. Senha padrão: 123`);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regCity || !regEmail || !regPassword) { triggerError('Preencha todos os campos obrigatórios.'); return; }
    if (currentDB.some(c => c.adminEmail === regEmail.trim().toLowerCase())) { triggerError('E-mail já cadastrado.'); return; }
    const newClub = registerNewClub(regName, regCity, regFocus, regEmail, regPassword);
    triggerSuccess(`${regName} credenciado! Inicializando painel...`);
    setTimeout(() => onLoginSuccess(newClub), 900);
  };

  /* ── FEATURES (cards de benefícios) ──────────────────────────────────── */
  const features = [
    { icon: Users,     color: 'blue',   title: 'Gestão de Atletas',   desc: 'Prontuários completos, carteirinhas QR Code, histórico de performance e documentação digital.' },
    { icon: TrendingUp,color: 'emerald',title: 'Financeiro Completo', desc: 'Controle de mensalidades, inadimplência, receitas de patrocinadores e fluxo de caixa.' },
    { icon: Trophy,    color: 'amber',  title: 'Rankings & Avaliações',desc: 'Score individual por desempenho técnico, tático, físico e disciplina. Relatórios automáticos.' },
    { icon: Zap,       color: 'violet', title: 'Multi-Clube em Tempo Real', desc: 'Plataforma federativa com suporte a 700+ clubes cadastrados. Acesso hierárquico.' },
  ];

  const colorMap: Record<string, string> = {
    blue:   'bg-blue-500/10 border-blue-500/20 text-blue-400',
    emerald:'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    amber:  'bg-amber-500/10 border-amber-500/20 text-amber-400',
    violet: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
  };

  return (
    <div className="min-h-dvh bg-[#060608] flex items-center justify-center p-4 md:p-6 text-slate-200 overflow-auto">

      {/* Fundo animado */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-blue-600 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] bg-violet-600 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

        {/* ── COLUNA ESQUERDA: Copy & Features ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 flex flex-col gap-8"
        >
          {/* Brand */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-xl shadow-blue-600/30">
                C
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white leading-none">
                  CLUB<span className="text-blue-400 italic">OS</span>
                </h1>
                <p className="text-[10px] text-slate-500 font-mono tracking-[0.2em] uppercase mt-0.5">by CA.RO TECH</p>
              </div>
            </motion.div>

            {/* Headline principal */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl sm:text-4xl font-black text-white leading-[1.15] tracking-tight mb-4"
            >
              O Sistema que{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Federações e Clubes
              </span>{' '}
              precisavam.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-sm text-slate-400 leading-relaxed max-w-lg"
            >
              Gerencie atletas, mensalidades, presenças e rankings — tudo em um painel unificado.
              Do Sub‑15 ao time principal, do amador ao semiprofissional. Tecnologia de ponta
              para o futebol de base brasileiro.
            </motion.p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map(({ icon: Icon, color, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.08, duration: 0.5 }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.05] transition-colors"
              >
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center mb-3 ${colorMap[color]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-white mb-1">{title}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex items-center gap-4 text-[11px] text-slate-500"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['bg-blue-500','bg-emerald-500','bg-amber-500','bg-violet-500'].map((c,i) => (
                  <div key={i} className={`w-6 h-6 rounded-full border-2 border-[#060608] ${c}`} />
                ))}
              </div>
              <span><strong className="text-white">742+</strong> clubes ativos</span>
            </div>
            <span className="text-slate-700">•</span>
            <span><strong className="text-white">8.400+</strong> atletas gerenciados</span>
          </motion.div>
        </motion.div>

        {/* ── COLUNA DIREITA: Card de login ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 bg-[#0f0f12] border border-white/[0.07] rounded-3xl shadow-2xl p-6 sm:p-8"
        >
          {/* Tabs */}
          <div className="flex border-b border-slate-800/80 pb-4 mb-6 gap-1">
            {[
              { label: 'Entrar no clube', mode: false },
              { label: 'Novo credenciamento', mode: true },
            ].map(({ label, mode }) => (
              <button
                key={label}
                onClick={() => { setIsRegisterMode(mode); setErrorMsg(null); }}
                className={`relative pb-2 px-3 text-sm font-bold tracking-wide transition-colors ${
                  isRegisterMode === mode ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {label}
                {isRegisterMode === mode && (
                  <motion.span layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          {!isRegisterMode && (
            <div className="mb-5 relative">
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar clube (ex: Barcelona, Real Jaraguá...)"
                  className="w-full bg-[#080809] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition"
                />
              </div>
              <AnimatePresence>
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="absolute left-0 right-0 mt-2 bg-[#18181b] border border-slate-800 rounded-2xl shadow-2xl z-50 p-2 space-y-1"
                  >
                    <p className="text-[9px] text-slate-500 font-black uppercase px-2 py-1">
                      {searchResults.length} resultado(s)
                    </p>
                    {searchResults.map(club => (
                      <div key={club.id} onClick={() => handleResultClick(club)}
                        className="p-2.5 hover:bg-white/5 rounded-xl transition-colors cursor-pointer flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-white">{club.name}</p>
                            <p className="text-[10px] text-slate-500">{club.city}</p>
                          </div>
                        </div>
                        <span className="text-[9px] bg-blue-600/10 text-blue-400 px-2 py-0.5 rounded-lg font-bold">Preencher</span>
                      </div>
                    ))}
                    {searchResults.length === 0 && (
                      <p className="p-3 text-center text-slate-500 text-xs">Nenhum clube encontrado</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Alertas */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="bg-rose-500/5 border border-rose-500/20 p-3 rounded-xl flex gap-2.5 text-xs text-rose-400 mb-5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
            {successMsg && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl flex gap-2.5 text-xs text-emerald-400 mb-5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* ── FORMULÁRIO LOGIN ──────────────────────────────────────── */}
            {!isRegisterMode ? (
              <motion.form key="login" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.25 }}
                onSubmit={handleLogin} className="space-y-4">

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1.5">E-mail do gestor</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="email@clube.com.br" required
                      className="w-full bg-[#080809] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1.5">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Sua senha de acesso" required
                      className="w-full bg-[#080809] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition" />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-60
                             text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30">
                  {loading ? (
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <><span>Acessar painel</span><ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                {/* Acesso rápido */}
                <div className="pt-4 border-t border-slate-800/60 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Acesso rápido — demonstração</span>
                  </div>

                  {/* Master */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleFastLogin({ id: 'master_admin', name: 'Federação Master', city: 'Nacional', focus: 'Controle Global', email: 'master@clubos.com.br', password: 'admin123', avatar: '' })}
                    type="button"
                    className="w-full flex items-center justify-between gap-3 p-3.5
                               bg-gradient-to-r from-amber-500/10 to-amber-400/5
                               border border-amber-500/30 rounded-2xl cursor-pointer
                               hover:border-amber-500/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 bg-amber-500/15 border border-amber-500/30 rounded-xl flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5 text-amber-400" />
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="text-xs font-extrabold text-amber-300 uppercase tracking-wide leading-tight">Master Admin</p>
                        <p className="text-[10px] text-slate-500 font-mono truncate">master@clubos.com.br</p>
                      </div>
                    </div>
                    <span className="shrink-0 bg-amber-500 text-slate-900 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg animate-pulse">
                      Entrar
                    </span>
                  </motion.button>

                  {/* Clubes demo */}
                  <div className="grid grid-cols-3 gap-2">
                    {PRE_REGISTERED_CLUBS.slice(0, 3).map(demo => (
                      <motion.button
                        key={demo.id}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleFastLogin(demo)}
                        type="button"
                        className="flex flex-col items-center gap-1.5 p-2.5 bg-[#090909] border border-slate-800/80
                                   hover:border-slate-700 rounded-xl transition-colors cursor-pointer"
                      >
                        <img src={demo.avatar} alt={demo.name} referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0" />
                        <span className="text-[9px] font-bold text-slate-300 text-center leading-tight line-clamp-1">
                          {demo.name.split(' ')[0]}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.form>

            ) : (
              /* ── FORMULÁRIO REGISTRO ──────────────────────────────────── */
              <motion.form key="register" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}
                onSubmit={handleRegister} className="space-y-4">

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-[11px] text-slate-400 font-semibold block mb-1.5">Nome do clube</label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                      <input type="text" value={regName} onChange={e => setRegName(e.target.value)}
                        placeholder="Ex: Real Jabaquara F.C." required
                        className="w-full bg-[#080809] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block mb-1.5">Cidade — UF</label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                      <input type="text" value={regCity} onChange={e => setRegCity(e.target.value)}
                        placeholder="Santos — SP" required
                        className="w-full bg-[#080809] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block mb-1.5">E-mail admin</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                      <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                        placeholder="dir@clube.com" required
                        className="w-full bg-[#080809] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[11px] text-slate-400 font-semibold block mb-1.5">Senha</label>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                      <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)}
                        placeholder="Crie sua senha" required
                        className="w-full bg-[#080809] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[11px] text-slate-400 font-semibold block mb-1.5">Foco esportivo</label>
                    <select value={regFocus} onChange={e => setRegFocus(e.target.value)}
                      className="w-full bg-[#080809] border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-300 focus:outline-none focus:border-blue-500/60 transition">
                      <option>Categoria de Base Completa</option>
                      <option>Futebol Amador Adulto / Veteranos</option>
                      <option>Iniciação Infantil (Sub-9 ao Sub-13)</option>
                      <option>Futebol Profissional Rendimento</option>
                    </select>
                  </div>
                </div>

                <div className="bg-blue-500/5 border border-blue-500/15 p-3 rounded-xl flex gap-2.5 text-[11px] text-slate-400">
                  <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Seu clube será inicializado com 4 atletas de demonstração e histórico financeiro de base.</span>
                </div>

                <button type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700
                             text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30">
                  <span>Credenciar meu clube</span>
                  <Plus className="w-4 h-4" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
