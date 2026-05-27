import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Club } from '../types';
import {
  getClubsDatabase, registerNewClub,
  PRE_REGISTERED_CLUBS, SIMULATED_FEDERATION_CLUBS
} from '../clubStorage';
import {
  ShieldCheck, Search, Plus, ArrowRight, Mail, Lock,
  Globe, Building2, Key, Info, CheckCircle2, AlertTriangle,
  Users, TrendingUp, Trophy, Zap, Sparkles
} from 'lucide-react';

interface ClubLoginProps { onLoginSuccess: (club: Club) => void; }

export default function ClubLogin({ onLoginSuccess }: ClubLoginProps) {
  const [mode, setMode]         = useState<'login' | 'register'>('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [search, setSearch]     = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [regName, setRegName]   = useState('');
  const [regCity, setRegCity]   = useState('');
  const [regFocus, setRegFocus] = useState('Categoria de Base Completa');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass]   = useState('');

  const db = getClubsDatabase();

  const searchResults = (() => {
    if (!search) return [];
    const q = search.toLowerCase();
    const db2 = db.filter(c => c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q));
    const pre = PRE_REGISTERED_CLUBS.filter(c => !db2.some(d => d.id === c.id) && (c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q)));
    const sim = SIMULATED_FEDERATION_CLUBS.filter(c => !db2.some(d => d.id === c.id) && !pre.some(p => p.id === c.id) && (c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q)));
    return [...db2, ...pre, ...sim].slice(0, 4);
  })();

  const showError   = (m: string) => { setError(m);   setTimeout(() => setError(null), 5000); };
  const showSuccess = (m: string) => { setSuccess(m); setTimeout(() => setSuccess(null), 4000); };

  const doMasterLogin = () => {
    onLoginSuccess({
      id: 'master_admin', name: 'Federação Master', city: 'Nacional',
      categoryFocus: 'Controle Global', adminEmail: 'master@clubos.com.br',
      passwordHash: 'admin123', players: [], financials: [], registeredAt: '2026-05-27'
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { showError('Informe e-mail e senha.'); return; }
    setLoading(true);
    const em = email.trim().toLowerCase();
    setTimeout(() => {
      setLoading(false);
      const MASTERS = [
        { e: 'dadoskagiva@gmail.com', p: 'admin' },
        { e: 'master@clubos.com.br',  p: 'admin123' },
        { e: 'master@clubos.com.br',  p: 'admin' },
        { e: 'admin@clubos.com.br',   p: 'admin123' },
      ];
      if (MASTERS.some(m => m.e === em && m.p === password)) { doMasterLogin(); return; }
      const found = db.find(c => c.adminEmail === em && c.passwordHash === password);
      if (found) { onLoginSuccess(found); return; }
      const sim = SIMULATED_FEDERATION_CLUBS.find(c => c.email.toLowerCase() === em);
      if (sim && password === '123') { onLoginSuccess(registerNewClub(sim.name, sim.city, sim.focus, sim.email, '123')); return; }
      showError('Credenciais inválidas. Use o acesso rápido abaixo para demonstração.');
    }, 500);
  };

  const handleFastLogin = (club: typeof PRE_REGISTERED_CLUBS[0]) => {
    if (club.id === 'master_admin') { doMasterLogin(); return; }
    const found = db.find(c => c.id === club.id);
    onLoginSuccess(found ?? registerNewClub(club.name, club.city, club.focus, club.email, club.password));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regCity || !regEmail || !regPass) { showError('Preencha todos os campos.'); return; }
    if (db.some(c => c.adminEmail === regEmail.trim().toLowerCase())) { showError('E-mail já cadastrado.'); return; }
    const newClub = registerNewClub(regName, regCity, regFocus, regEmail, regPass);
    showSuccess(`${regName} credenciado!`);
    setTimeout(() => onLoginSuccess(newClub), 800);
  };

  /* features — só desktop */
  const features = [
    { icon: Users,      color: 'blue',    title: 'Gestão de Atletas',       desc: 'Prontuários completos, carteirinhas QR Code e histórico de performance.' },
    { icon: TrendingUp, color: 'emerald', title: 'Financeiro Completo',     desc: 'Mensalidades, inadimplência, patrocinadores e fluxo de caixa.' },
    { icon: Trophy,     color: 'amber',   title: 'Rankings & Avaliações',   desc: 'Score técnico, tático, físico e disciplinar. Relatórios automáticos.' },
    { icon: Zap,        color: 'violet',  title: 'Plataforma Multi-Clube',  desc: 'Suporte a 700+ clubes com acesso federativo hierárquico.' },
  ];
  const clr: Record<string,string> = {
    blue:   'bg-blue-500/10 border-blue-500/20 text-blue-400',
    emerald:'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    amber:  'bg-amber-500/10 border-amber-500/20 text-amber-400',
    violet: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
  };

  /* ── campo de input reutilizável ─────────────────────────────────────── */
  const Field = ({ icon: Icon, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ElementType }) => (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
      <input
        {...props}
        className="w-full bg-[#080809] border border-slate-800 rounded-xl py-3 pl-10 pr-4
                   text-white placeholder-slate-600
                   focus:outline-none focus:border-blue-500/60 transition-colors"
      />
    </div>
  );

  return (
    /*
     * A página de login precisa scrollar livremente.
     * O body NÃO tem overflow:hidden aqui (só quando logado, via classe app-active).
     */
    <div className="min-h-dvh bg-[#060608] text-slate-200">

      {/* blobs de fundo */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div animate={{ scale:[1,1.2,1], opacity:[.07,.14,.07] }}
          transition={{ duration:9, repeat:Infinity, ease:'easeInOut' }}
          className="absolute -top-1/4 -left-1/4 w-[80vw] h-[80vw] bg-blue-600 rounded-full blur-[140px]" />
        <motion.div animate={{ scale:[1,1.25,1], opacity:[.04,.09,.04] }}
          transition={{ duration:13, repeat:Infinity, ease:'easeInOut', delay:3 }}
          className="absolute -bottom-1/4 -right-1/4 w-[70vw] h-[70vw] bg-violet-600 rounded-full blur-[120px]" />
      </div>

      {/* ── layout: 1 coluna mobile / 2 colunas desktop ──────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-0 lg:min-h-dvh
                      flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">

        {/* ── coluna esquerda: brand + features ─────────────────────── */}
        <motion.div
          initial={{ opacity:0, x:-24 }} animate={{ opacity:1, x:0 }}
          transition={{ duration:.7, ease:[.16,1,.3,1] }}
          className="lg:flex-1 flex flex-col gap-6 lg:py-12"
        >
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center
                            font-black text-white text-xl shadow-xl shadow-blue-600/30 shrink-0">C</div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white leading-none">
                CLUB<span className="text-blue-400 italic">OS</span>
              </h1>
              <p className="text-[9px] text-slate-500 font-mono tracking-[.2em] uppercase mt-0.5">by CA.RO TECH</p>
            </div>
          </div>

          {/* Headline */}
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-[1.15] tracking-tight mb-3">
              O sistema que{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Federações e Clubes
              </span>{' '}
              precisavam.
            </h2>
            {/* Descrição — oculta em telas muito pequenas para economizar espaço */}
            <p className="hidden sm:block text-sm text-slate-400 leading-relaxed max-w-lg">
              Gerencie atletas, mensalidades, presenças e rankings — tudo em um painel unificado.
              Do Sub‑15 ao time principal, do amador ao semiprofissional. Tecnologia de ponta
              para o futebol de base brasileiro.
            </p>
          </div>

          {/* Feature cards — só aparece em desktop */}
          <div className="hidden lg:grid grid-cols-2 gap-3">
            {features.map(({ icon: Icon, color, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:.35+i*.08, duration:.5 }}
                className="bg-white/[.03] border border-white/[.06] rounded-2xl p-4 hover:bg-white/[.05] transition-colors"
              >
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center mb-3 ${clr[color]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-white mb-1">{title}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Social proof */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.65 }}
            className="flex items-center gap-4 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {['bg-blue-500','bg-emerald-500','bg-amber-500','bg-violet-500'].map((c,i) => (
                  <div key={i} className={`w-5 h-5 rounded-full border-2 border-[#060608] ${c}`} />
                ))}
              </div>
              <span><strong className="text-white">742+</strong> clubes</span>
            </div>
            <span className="text-slate-700">•</span>
            <span><strong className="text-white">8.400+</strong> atletas</span>
          </motion.div>
        </motion.div>

        {/* ── coluna direita: card de autenticação ──────────────────── */}
        <motion.div
          initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }}
          transition={{ duration:.7, delay:.12, ease:[.16,1,.3,1] }}
          className="w-full lg:w-[420px] lg:shrink-0 lg:py-12"
        >
          <div className="bg-[#0f0f12] border border-white/[.07] rounded-3xl shadow-2xl p-5 sm:p-7">

            {/* Tabs login / cadastro */}
            <div className="flex border-b border-slate-800/80 pb-3 mb-5 gap-1">
              {(['login','register'] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); setError(null); }}
                  className={`relative pb-2 px-3 text-sm font-bold transition-colors ${
                    mode === m ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {m === 'login' ? 'Entrar' : 'Novo clube'}
                  {mode === m && (
                    <motion.span layoutId="underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Search de clube (só login) */}
            {mode === 'login' && (
              <div className="mb-4 relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar clube federado…"
                    className="w-full bg-[#080809] border border-slate-800 rounded-xl py-3 pl-10 pr-4
                               text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition-colors" />
                </div>
                <AnimatePresence>
                  {search && (
                    <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
                      className="absolute left-0 right-0 mt-2 bg-[#18181b] border border-slate-800
                                 rounded-2xl shadow-2xl z-50 p-2 space-y-1">
                      {searchResults.length === 0
                        ? <p className="p-3 text-center text-xs text-slate-500">Nenhum clube encontrado</p>
                        : searchResults.map(c => (
                          <div key={c.id} onClick={() => { setEmail((c as any).email || (c as any).adminEmail); setPassword('123'); setSearch(''); }}
                            className="flex items-center gap-2.5 p-2.5 hover:bg-white/5 rounded-xl cursor-pointer">
                            <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{c.name}</p>
                              <p className="text-[10px] text-slate-500">{c.city}</p>
                            </div>
                          </div>
                        ))
                      }
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Alertas */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                  className="overflow-hidden mb-4">
                  <div className="bg-rose-500/5 border border-rose-500/20 p-3 rounded-xl flex gap-2 text-xs text-rose-400">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /><span>{error}</span>
                  </div>
                </motion.div>
              )}
              {success && (
                <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                  className="overflow-hidden mb-4">
                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl flex gap-2 text-xs text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /><span>{success}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">

              {/* ── FORMULÁRIO LOGIN ──────────────────────────────────── */}
              {mode === 'login' && (
                <motion.form key="login"
                  initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                  exit={{ opacity:0, x:12 }} transition={{ duration:.22 }}
                  onSubmit={handleLogin} className="space-y-3"
                >
                  <Field icon={Mail} type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="email@clube.com.br" required />
                  <Field icon={Lock} type="password" value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Senha de acesso" required />

                  <button type="submit" disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-60
                               text-white font-bold py-3 rounded-xl transition-colors
                               flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30">
                    {loading
                      ? <motion.span animate={{ rotate:360 }} transition={{ duration:.8, repeat:Infinity, ease:'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                      : <><span className="text-sm">Acessar painel</span><ArrowRight className="w-4 h-4" /></>
                    }
                  </button>

                  {/* Acesso rápido */}
                  <div className="pt-3 border-t border-slate-800/60 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Acesso rápido</span>
                    </div>

                    {/* Master Admin */}
                    <motion.button whileTap={{ scale:.97 }} type="button"
                      onClick={() => handleFastLogin({ id:'master_admin', name:'Federação Master', city:'Nacional', focus:'Controle Global', email:'master@clubos.com.br', password:'admin123', avatar:'' })}
                      className="w-full flex items-center justify-between gap-3 p-3
                                 bg-amber-500/8 border border-amber-500/30 rounded-2xl
                                 hover:border-amber-500/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 bg-amber-500/15 border border-amber-500/25 rounded-xl
                                        flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wide">Master Admin</p>
                          <p className="text-[10px] text-slate-500 font-mono truncate">master@clubos.com.br</p>
                        </div>
                      </div>
                      <span className="shrink-0 bg-amber-500 text-slate-900 text-[9px] font-black uppercase
                                       tracking-wider px-2.5 py-1 rounded-lg">
                        Entrar
                      </span>
                    </motion.button>

                    {/* Clubes demo */}
                    <div className="grid grid-cols-3 gap-2">
                      {PRE_REGISTERED_CLUBS.slice(0,3).map(demo => (
                        <motion.button key={demo.id} whileTap={{ scale:.95 }} type="button"
                          onClick={() => handleFastLogin(demo)}
                          className="flex flex-col items-center gap-1.5 p-2.5
                                     bg-[#090909] border border-slate-800/80
                                     hover:border-slate-700 rounded-xl transition-colors cursor-pointer"
                        >
                          <img src={demo.avatar} alt={demo.name} referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-full object-cover border border-slate-700" />
                          <span className="text-[9px] font-bold text-slate-300 text-center line-clamp-1 w-full">
                            {demo.name.split(' ')[0]}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.form>
              )}

              {/* ── FORMULÁRIO REGISTRO ───────────────────────────────── */}
              {mode === 'register' && (
                <motion.form key="register"
                  initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }}
                  exit={{ opacity:0, x:-12 }} transition={{ duration:.22 }}
                  onSubmit={handleRegister} className="space-y-3"
                >
                  <Field icon={Building2} type="text" value={regName} onChange={e => setRegName(e.target.value)}
                    placeholder="Nome do clube" required />
                  <div className="grid grid-cols-2 gap-3">
                    <Field icon={Globe} type="text" value={regCity} onChange={e => setRegCity(e.target.value)}
                      placeholder="Cidade — UF" required />
                    <Field icon={Mail} type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                      placeholder="E-mail admin" required />
                  </div>
                  <Field icon={Key} type="password" value={regPass} onChange={e => setRegPass(e.target.value)}
                    placeholder="Crie uma senha" required />
                  <select value={regFocus} onChange={e => setRegFocus(e.target.value)}
                    className="w-full bg-[#080809] border border-slate-800 rounded-xl py-3 px-4
                               text-slate-300 focus:outline-none focus:border-blue-500/60 transition-colors">
                    <option>Categoria de Base Completa</option>
                    <option>Futebol Amador Adulto / Veteranos</option>
                    <option>Iniciação Infantil (Sub-9 ao Sub-13)</option>
                    <option>Futebol Profissional Rendimento</option>
                  </select>

                  <div className="bg-blue-500/5 border border-blue-500/15 p-3 rounded-xl flex gap-2 text-[11px] text-slate-400">
                    <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>Clube inicializado com atletas e histórico financeiro de demonstração.</span>
                  </div>

                  <button type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700
                               text-white font-bold py-3 rounded-xl transition-colors
                               flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30">
                    <span className="text-sm">Credenciar meu clube</span>
                    <Plus className="w-4 h-4" />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
