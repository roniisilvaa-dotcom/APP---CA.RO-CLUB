import React, { useState, useEffect } from 'react';
import { Player, FinancialEntry, PlayerHistoryEvent, Club } from './types';
import { updateClubData } from './clubStorage';

// Import views
import DashboardView from './components/DashboardView';
import PlayersView from './components/PlayersView';
import PlayerDrawer from './components/PlayerDrawer';
import FinancialView from './components/FinancialView';
import RankingsView from './components/RankingsView';
import SaaSSpecsView from './components/SaaSSpecsView';
import AttendanceView from './components/AttendanceView';
import ClubLogin from './components/ClubLogin';
import MasterAdminView from './components/MasterAdminView';

// Import icons
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Award, 
  BookOpen, 
  UserCheck, 
  ShieldAlert, 
  Sparkles, 
  LogOut, 
  CheckSquare, 
  X, 
  CalendarCheck, 
  LogOut as LogoutIcon,
  ShieldCheck,
  FolderLock
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'master' | 'dashboard' | 'players' | 'financial' | 'rankings' | 'attendance' | 'specifications'>('dashboard');
  
  // Multi-tenant club states
  const [currentClub, setCurrentClub] = useState<Club | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [financials, setFinancials] = useState<FinancialEntry[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  // Master administrative tenant impersonation
  const [impersonateClub, setImpersonateClub] = useState<Club | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Auto-restore login session from localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem('CLUBOS_ACTIVE_SESSION');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession) as Club;
        
        if (parsed.id === 'master_admin') {
          setCurrentClub(parsed);
          setActiveTab('master');
          return;
        }

        // Read fresh DB to get latest players/financials
        const rawDB = localStorage.getItem('CLUBOS_CLUBS');
        if (rawDB) {
          const freshClubs = JSON.parse(rawDB) as Club[];
          const foundFresh = freshClubs.find(c => c.id === parsed.id);
          if (foundFresh) {
            setCurrentClub(foundFresh);
            setPlayers(foundFresh.players);
            setFinancials(foundFresh.financials);
            return;
          }
        }
        // Fallback to parsed if not in DB
        setCurrentClub(parsed);
        setPlayers(parsed.players);
        setFinancials(parsed.financials);
      } catch (e) {
        console.error('Failed to parse active club session', e);
      }
    }
  }, []);

  // Trava o scroll do body só quando logado (evita conflito com a tela de login)
  useEffect(() => {
    if (currentClub) {
      document.body.classList.add('app-active');
    } else {
      document.body.classList.remove('app-active');
    }
    return () => document.body.classList.remove('app-active');
  }, [currentClub]);

  // Update tabs automatically depending on master admin status
  useEffect(() => {
    if (currentClub) {
      if (currentClub.id === 'master_admin') {
        if (!impersonateClub) {
          setActiveTab('master');
        }
      } else {
        setActiveTab('dashboard');
      }
    }
  }, [currentClub]);

  // Sync to database whenever records change inside the active club instance
  useEffect(() => {
    if (currentClub) {
      if (currentClub.id === 'master_admin' && impersonateClub) {
        updateClubData(impersonateClub.id, players, financials);
        
        // Sync back changes to the impersonation layer reference
        const updatedImpersonation = { ...impersonateClub, players, financials };
        setImpersonateClub(updatedImpersonation);
      } else if (currentClub.id !== 'master_admin') {
        updateClubData(currentClub.id, players, financials);
        
        // Keep session updated
        const updatedSessionClub = { ...currentClub, players, financials };
        localStorage.setItem('CLUBOS_ACTIVE_SESSION', JSON.stringify(updatedSessionClub));
      }
    }
  }, [players, financials]);

  const handleLoginSuccess = (club: Club) => {
    setCurrentClub(club);
    if (club.id === 'master_admin') {
      setActiveTab('master');
      setPlayers([]);
      setFinancials([]);
    } else {
      setPlayers(club.players);
      setFinancials(club.financials);
      setActiveTab('dashboard');
    }
    localStorage.setItem('CLUBOS_ACTIVE_SESSION', JSON.stringify(club));
  };

  const handleLogout = () => {
    setCurrentClub(null);
    setImpersonateClub(null);
    setPlayers([]);
    setFinancials([]);
    localStorage.removeItem('CLUBOS_ACTIVE_SESSION');
  };

  const handleImpersonate = (club: Club) => {
    setImpersonateClub(club);
    setPlayers(club.players);
    setFinancials(club.financials);
    setActiveTab('dashboard');
  };

  const handleExitImpersonation = () => {
    setImpersonateClub(null);
    setPlayers([]);
    setFinancials([]);
    setActiveTab('master');
  };
  
  // Registration Athlete Modal State
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerBirth, setNewPlayerBirth] = useState('');
  const [newPlayerPosition, setNewPlayerPosition] = useState<'Goleiro' | 'Zagueiro' | 'Lateral' | 'Meio-Campo' | 'Atacante'>('Atacante');
  const [newPlayerCategory, setNewPlayerCategory] = useState<'Sub-15' | 'Sub-17' | 'Sub-20' | 'Principal' | 'Veteranos'>('Sub-15');
  const [newPlayerCPF, setNewPlayerCPF] = useState('');
  const [newPlayerFoot, setNewPlayerFoot] = useState<'Canhoto' | 'Destro' | 'Ambidestro'>('Destro');
  const [newPlayerAvatar, setNewPlayerAvatar] = useState('');
  const [newGuardianName, setNewGuardianName] = useState('');
  const [newGuardianCPF, setNewGuardianCPF] = useState('');
  const [newGuardianPhone, setNewGuardianPhone] = useState('');
  const [newGuardianRel, setNewGuardianRel] = useState('Pai');

  // Callback to change dynamic profile picture
  const handleChangePlayerAvatar = (playerId: string, newAvatarUrl: string) => {
    setPlayers(prevPlayers => {
      return prevPlayers.map(player => {
        if (player.id !== playerId) return player;
        return {
          ...player,
          avatarUrl: newAvatarUrl
        };
      });
    });
  };

  // Find currently active selected player
  const selectedPlayer = players.find(p => p.id === selectedPlayerId);

  // Toggle single billing fee from player profile, update cash logs & metrics automatically
  const handleToggleFeeStatus = (playerId: string, feeId: string) => {
    setPlayers(prevPlayers => {
      return prevPlayers.map(player => {
        if (player.id !== playerId) return player;
        
        const updatedSubs = player.subscriptions.map(sub => {
          if (sub.id !== feeId) return sub;
          
          const newStatus = sub.status === 'PAID' ? 'OVERDUE' : 'PAID';
          
          // SIDE EFFECT: Dynamically update ledger logs on fee quittance!
          if (newStatus === 'PAID') {
            const newLogEntry: FinancialEntry = {
              id: 'f_sub_' + Math.random().toString(36).substring(4),
              date: new Date().toISOString().split('T')[0],
              type: 'REVENUE',
              category: 'Mensalidades',
              amount: sub.amount,
              description: `Mensalidade Quitada: ${player.name} (Ref. ${sub.dueDate})`,
              status: 'COMPLETED'
            };
            setFinancials(prev => [newLogEntry, ...prev]);
          } else {
            // Remove the log when toggled back
            setFinancials(prev => prev.filter(f => !f.description.includes(`Ref. ${sub.dueDate}`) || !f.description.includes(player.name)));
          }

          return {
            ...sub,
            status: newStatus,
            paidAt: newStatus === 'PAID' ? new Date().toISOString().split('T')[0] : undefined,
            paymentMethod: newStatus === 'PAID' ? 'PIX' : undefined
          };
        });

        // If subscriptions has overdue, mark as suspended, otherwise active
        const hasOverdue = updatedSubs.some(s => s.status === 'OVERDUE');
        const newStatus = hasOverdue ? 'SUSPENDED' : (player.registrationProgress === 100 ? 'ACTIVE' : 'PENDING_DOCS');

        return {
          ...player,
          subscriptions: updatedSubs,
          status: newStatus
        };
      });
    });
  };

  // Add historical performance event to player, instantly recalculating rank score
  const handleAddHistoryEvent = (playerId: string, title: string, type: 'PERFORMANCE' | 'DISCIPLINARY', desc: string, goals = 0, yellowCards = 0) => {
    setPlayers(prevPlayers => {
      return prevPlayers.map(player => {
        if (player.id !== playerId) return player;

        const newEvent: PlayerHistoryEvent = {
          id: 'ev_' + Math.random().toString(36).substring(4),
          date: new Date().toISOString().split('T')[0],
          type,
          title,
          description: desc,
          categoryName: player.category,
          stats: goals > 0 || yellowCards > 0 ? { goals, yellowCards, minutesPlayed: 90 } : undefined
        };

        // Recalculate score
        let scoreAdjustment = 0;
        if (type === 'PERFORMANCE') {
          scoreAdjustment += 10 + (goals * 8);
        } else if (type === 'DISCIPLINARY') {
          scoreAdjustment -= (15 + (yellowCards * 5));
        }

        const calculatedScore = Math.max(10, Math.min(100, player.rankingScore + scoreAdjustment));

        return {
          ...player,
          history: [newEvent, ...player.history],
          rankingScore: calculatedScore
        };
      });
    });
  };

  // Handler to record miscellaneous expenditure
  const handleAddTransaction = (entry: Omit<FinancialEntry, 'id'>) => {
    const freshLog: FinancialEntry = {
      ...entry,
      id: 'txn_' + Math.random().toString(36).substring(4)
    };
    setFinancials(prev => [freshLog, ...prev]);
  };

  // Onboarding new athlete with parenting validation rules for minors
  const handleCreateNewPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName || !newPlayerBirth || !newPlayerCPF) {
      alert('Por favor, preencha os dados obrigatórios do atleta (Nome, Nascimento, CPF).');
      return;
    }

    // Determine age
    const playerAge = new Date().getFullYear() - new Date(newPlayerBirth).getFullYear();
    const athleteIsMinor = playerAge < 18;

    // Guardian requirement guard validation rule (Section 13)
    if (athleteIsMinor && (!newGuardianName || !newGuardianCPF || !newGuardianPhone)) {
      alert('Negado! Conforme as regras do sistema de base, atletas menores de 18 anos exigem obrigatoriamente um responsável legal com CPF e telefone válidos.');
      return;
    }

    const assignedId = String(players.length + 1);

    const generatedAthlete: Player = {
      id: assignedId,
      name: newPlayerName,
      nickname: newPlayerName.split(' ')[0],
      avatarUrl: newPlayerAvatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=250&auto=format&fit=crop',
      birthDate: newPlayerBirth,
      cpf: newPlayerCPF,
      category: newPlayerCategory,
      status: 'ACTIVE',
      joinDate: new Date().toISOString().split('T')[0],
      position: newPlayerPosition,
      foot: newPlayerFoot,
      registrationProgress: athleteIsMinor ? 100 : 90, // minor with guardian goes 100
      rankingScore: 80,
      rankingPosition: players.length + 1,
      guardian: athleteIsMinor ? {
        name: newGuardianName,
        relationship: newGuardianRel,
        phone: newGuardianPhone,
        cpf: newGuardianCPF,
        email: ''
      } : undefined,
      documents: [
        { id: `doc_${assignedId}_1`, type: 'RG', name: `rg_${newPlayerName.split(' ')[0].toLowerCase()}.pdf`, status: 'APPROVED', uploadedAt: new Date().toISOString().split('T')[0] },
        { id: `doc_${assignedId}_2`, type: 'CPF', name: `cpf_${newPlayerName.split(' ')[0].toLowerCase()}.pdf`, status: 'APPROVED', uploadedAt: new Date().toISOString().split('T')[0] }
      ],
      card: {
        cardNumber: `COP-2026-00${10 + players.length}`,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=COP-2026-00${10 + players.length}`,
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: '2027-04-12',
        status: 'ACTIVE'
      },
      history: [
        { id: `h_${assignedId}_1`, date: new Date().toISOString().split('T')[0], type: 'REGISTRATION', title: 'Admissão ao Clube', description: `Atleta registrado e incorporado ao elenco da categoria ${newPlayerCategory}.` }
      ],
      evaluations: [
        { id: `ev_${assignedId}_1`, date: new Date().toISOString().split('T')[0], technical: 80, tactical: 80, physical: 80, discipline: 85, attendanceRate: 100, evaluatorName: 'Secretaria Geral' }
      ],
      subscriptions: [
        { id: `sub_${assignedId}_1`, dueDate: '2026-06-10', amount: 120, status: 'PENDING' }
      ]
    };

    setPlayers(prev => [generatedAthlete, ...prev]);
    setIsAddPlayerModalOpen(false);
    
    // Reset inputs
    setNewPlayerName('');
    setNewPlayerBirth('');
    setNewPlayerCPF('');
    setNewPlayerAvatar('');
    setNewGuardianName('');
    setNewGuardianCPF('');
    setNewGuardianPhone('');
    alert(`Sucesso! O atleta ${newPlayerName} foi pré-inscrito sob status Ativo com prontuário indexado.`);
  };

  // Build aggregated metrics for Dashboard
  const activeCount = players.filter(p => p.status === 'ACTIVE').length;
  const pendingDocsCount = players.filter(p => p.status === 'PENDING_DOCS').length;
  const monthlyRevenueTotal = players.reduce((sum, p) => {
    return sum + p.subscriptions.filter(s => s.status === 'PAID').reduce((add, s) => add + s.amount, 0);
  }, 0) + financials.filter(f => f.type === 'REVENUE' && f.category === 'Doação (Patrocinador)').reduce((add, f) => add + f.amount, 0);

  const calculatedStats = {
    totalPlayers: players.length,
    activePlayers: activeCount,
    pendingDocsPlayers: pendingDocsCount,
    monthlyRevenue: monthlyRevenueTotal,
    expenseRate: 30, // static target
    defaultersCount: players.filter(p => p.subscriptions.some(s => s.status === 'OVERDUE')).length,
    totalSubscribers: players.length
  };

  if (!currentClub) {
    return <ClubLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // Mobile nav items
  const mobileNavItems = [
    ...(currentClub.id === 'master_admin' ? [{ id: 'master', label: 'Master', icon: FolderLock }] : []),
    { id: 'dashboard',      label: 'Início',     icon: LayoutDashboard },
    { id: 'players',        label: 'Atletas',    icon: Users },
    { id: 'financial',      label: 'Financeiro', icon: CreditCard },
    { id: 'attendance',     label: 'Chamada',    icon: CalendarCheck },
    { id: 'rankings',       label: 'Rankings',   icon: Award },
    { id: 'specifications', label: 'SaaS',       icon: BookOpen },
  ];

  const activeClubName  = (impersonateClub ?? currentClub).name;
  const activeClubLogo  = (impersonateClub ?? currentClub).logoUrl;

  return (
    /* ── raiz: altura exata da viewport, sem bounce ───────────────────────── */
    <div className="h-dvh bg-[#09090B] flex font-sans text-slate-200 overflow-hidden">

      {/* ── SIDEBAR — só desktop ─────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 bg-[#111113] border-r border-[#1a1a1f] flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)]">C</div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                CLUB<span className="text-blue-500 font-black italic">OS</span>
              </h1>
            </div>
          </div>

          <div className="p-4 space-y-1">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 ml-2">Gestão Estratégica</div>

            {currentClub.id === 'master_admin' && (
              <button
                onClick={() => setActiveTab('master')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all border mb-3 ${
                  activeTab === 'master'
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                    : 'text-amber-400 border-transparent hover:bg-slate-800/40 hover:text-amber-300'
                }`}
              >
                <FolderLock className="w-4 h-4 text-amber-500 shrink-0" />
                Painel Master Governança
              </button>
            )}

            {[
              { id: 'dashboard',      label: 'Dashboard',           icon: LayoutDashboard },
              { id: 'players',        label: 'Atletas & Categorias', icon: Users },
              { id: 'financial',      label: 'Financeiro Premium',  icon: CreditCard },
              { id: 'attendance',     label: 'Controle de Chamada', icon: CalendarCheck },
              { id: 'rankings',       label: 'Avaliações & Rankings',icon: Award },
              { id: 'specifications', label: 'Especificações SaaS', icon: BookOpen },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activeTab === id
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-inner'
                    : 'text-slate-400 border border-transparent hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-[#18181B] p-3 rounded-xl border border-[#1d1d21]">
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-wide mb-1">
              {currentClub.id === 'master_admin' ? 'Acesso Master • Federação' : 'Clube • Diretor Ativo'}
            </p>
            <p className="text-xs text-white font-semibold truncate">{currentClub.adminEmail}</p>
            <p className="text-[10px] text-blue-400 font-bold mt-1.5 flex items-center justify-between">
              <span>{currentClub.id === 'master_admin' ? 'Master Authority' : 'Enterprise Hub'}</span>
              <span className="text-amber-500 font-extrabold text-[8px] tracking-widest bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">CA.RO TECH</span>
            </p>
          </div>
          <p className="text-center mt-2.5 text-[9px] text-slate-500 font-semibold tracking-wider">
            Desenvolvedor: <span className="font-bold">CA.RO TECH</span>
          </p>
        </div>
      </aside>

      {/* ── ÁREA PRINCIPAL ────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0B] overflow-hidden">

        {/* HEADER FIXO — não mexe nunca, nem no scroll nem na barra do browser */}
        <header className="flex-none h-14 border-b border-[#1b1b22] flex items-center justify-between px-4
                           bg-[#09090B] lg:bg-[#09090B]/90 lg:backdrop-blur-md z-30
                           safe-top">
          {/* Logo — só mobile */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-md">C</div>
            <span className="text-base font-bold tracking-tight text-white">
              CLUB<span className="text-blue-500 font-black italic">OS</span>
            </span>
          </div>

          {/* Status do clube — desktop */}
          <div className="hidden lg:flex items-center gap-2 text-slate-400 font-mono text-[10px]">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Painel: <strong className="text-white font-black ml-1">{activeClubName}</strong>
          </div>

          {/* Ações direita */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Status mobile */}
            <div className="flex lg:hidden items-center gap-1.5 bg-[#111113] px-2.5 py-1.5 rounded-lg border border-slate-800 text-[10px] text-slate-400 max-w-[140px]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
              <span className="truncate font-semibold text-white">{activeClubName}</span>
            </div>

            {/* Avatar */}
            {activeClubLogo ? (
              <img src={activeClubLogo} alt={activeClubName} referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#111113] border border-slate-800 flex items-center justify-center font-black text-blue-400 text-xs shrink-0">
                {activeClubName.slice(0, 2).toUpperCase()}
              </div>
            )}

            {/* Botão Sair */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-600/10 hover:bg-rose-600/20 active:bg-rose-600/30
                         border border-rose-500/25 text-rose-400 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Sair"
            >
              <LogoutIcon className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline text-[10px] font-bold uppercase tracking-wider">Sair</span>
            </button>
          </div>
        </header>

        {/* Banner de impersonação (master auditando clube) */}
        {currentClub.id === 'master_admin' && impersonateClub && (
          <div className="flex-none bg-gradient-to-r from-amber-600 to-amber-700 text-slate-100 px-4 py-3
                          border-b border-amber-600/30 flex items-center justify-between gap-3 z-20">
            <div className="flex items-center gap-2 min-w-0">
              <ShieldCheck className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
              <div className="text-[11px] leading-tight min-w-0">
                <span className="font-extrabold uppercase tracking-wider text-amber-200 block text-[9px]">MODO AUDITORIA</span>
                <span className="truncate block">Auditando <strong className="text-white">{impersonateClub.name}</strong></span>
              </div>
            </div>
            <button
              onClick={handleExitImpersonation}
              className="shrink-0 bg-white text-slate-950 font-black text-[9px] tracking-wide uppercase px-3 py-1.5 rounded-lg cursor-pointer"
            >
              Sair
            </button>
          </div>
        )}

        {/* CONTEÚDO — só esta div scrolla */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 lg:p-8
                        pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-8">

          {/* TAB: CENTRAL MASTER ADMIN */}
          {activeTab === 'master' && currentClub.id === 'master_admin' && (
            <MasterAdminView
              onImpersonateClub={handleImpersonate}
              onRefreshDB={() => setRefreshTrigger(p => p + 1)}
              activeClubId={impersonateClub ? impersonateClub.id : ''}
            />
          )}
          
          {/* TAB: VISÃO GERAL */}
          {activeTab === 'dashboard' && (
            <DashboardView
              players={players}
              financials={financials}
              stats={calculatedStats}
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectPlayer={(p) => setSelectedPlayerId(p.id)}
              onOpenAddPlayerModal={() => setIsAddPlayerModalOpen(true)}
            />
          )}

          {/* TAB: ATLETAS */}
          {activeTab === 'players' && (
            <PlayersView
              players={players}
              onSelectPlayer={(p) => setSelectedPlayerId(p.id)}
              onOpenAddPlayerModal={() => setIsAddPlayerModalOpen(true)}
            />
          )}

          {/* TAB: FINANCEIRO DIÁRIO */}
          {activeTab === 'financial' && (
            <FinancialView
              players={players}
              financials={financials}
              onToggleFeeStatus={handleToggleFeeStatus}
              onAddTransaction={handleAddTransaction}
            />
          )}

          {/* TAB: RANKINGS */}
          {activeTab === 'rankings' && (
            <RankingsView
              players={players}
              onSelectPlayer={(p) => setSelectedPlayerId(p.id)}
            />
          )}

          {/* TAB: MANUAL COMPLETO SAAS */}
          {activeTab === 'specifications' && (
            <SaaSSpecsView />
          )}

          {/* TAB: CONTROLE DE FREQUÊNCIA & PRESENÇAS */}
          {activeTab === 'attendance' && (
            <AttendanceView
              players={players}
              onAddHistoryEvent={handleAddHistoryEvent}
            />
          )}

        </div>
      </main>

      {/* DETAILED PLAYER PROFILE DRAWER MODAL (Surgical overlay) */}
      {selectedPlayerId && selectedPlayer && (
        <PlayerDrawer
          player={selectedPlayer}
          onClose={() => setSelectedPlayerId(null)}
          onToggleFeeStatus={handleToggleFeeStatus}
          onAddHistoryEvent={handleAddHistoryEvent}
          onChangeAvatar={handleChangePlayerAvatar}
        />
      )}

      {/* PRE-REGISTER ATHLETE POPUP MODAL */}
      {isAddPlayerModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#09090B]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111113] border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative">
            <button
              onClick={() => setIsAddPlayerModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5 border-b border-slate-800 pb-2 mb-4">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              Formulário de Pré-Inscrição de Atleta
            </h2>

            <form onSubmit={handleCreateNewPlayer} className="space-y-4 text-xs font-sans">
              
              {/* Photo Upload preview */}
              <div className="flex items-center gap-4 bg-[#09090B] p-3.5 border border-slate-800 rounded-xl">
                <div className="relative shrink-0">
                  <img
                    src={newPlayerAvatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=250&auto=format&fit=crop'}
                    alt="Foto do atleta"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border border-slate-700 shadow"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-slate-400 block mb-1 font-semibold">Carregar Foto do Atleta</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewPlayerAvatar(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-[10px] text-slate-400 file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-blue-600/15 file:text-blue-400 hover:file:bg-blue-600/25 cursor-pointer file:transition-colors"
                  />
                </div>
              </div>
              
              {/* Core athlete fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-slate-400 block mb-1">Nome Completo do Atleta</label>
                  <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    placeholder="Ex: João Vitor de Souza"
                    className="w-full bg-[#09090B] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-mono">Nascimento</label>
                  <input
                    type="date"
                    value={newPlayerBirth}
                    onChange={(e) => setNewPlayerBirth(e.target.value)}
                    className="w-full bg-[#09090B] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">CPF do Atleta</label>
                  <input
                    type="text"
                    value={newPlayerCPF}
                    onChange={(e) => setNewPlayerCPF(e.target.value)}
                    placeholder="Ex: 554.112.332-90"
                    className="w-full bg-[#09090B] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Posição</label>
                  <select
                    value={newPlayerPosition}
                    onChange={(e) => setNewPlayerPosition(e.target.value as any)}
                    className="w-full bg-[#09090B] border border-slate-800 rounded-lg p-2.5 text-slate-300 focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="Atacante">Atacante</option>
                    <option value="Meio-Campo">Meio-Campo</option>
                    <option value="Lateral">Lateral</option>
                    <option value="Zagueiro">Zagueiro</option>
                    <option value="Goleiro">Goleiro</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Pé Favorito</label>
                  <select
                    value={newPlayerFoot}
                    onChange={(e) => setNewPlayerFoot(e.target.value as any)}
                    className="w-full bg-[#09090B] border border-slate-800 rounded-lg p-2.5 text-slate-300 focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="Destro">Destro</option>
                    <option value="Canhoto">Canhoto</option>
                    <option value="Ambidestro">Ambidestro</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-slate-400 block mb-1">Categoria por Faixa Etária</label>
                  <select
                    value={newPlayerCategory}
                    onChange={(e) => setNewPlayerCategory(e.target.value as any)}
                    className="w-full bg-[#09090B] border border-slate-800 rounded-lg p-2.5 text-slate-300 font-mono focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="Sub-15">Sub-15 (Infantil)</option>
                    <option value="Sub-17">Sub-17 (Juvenil)</option>
                    <option value="Sub-20">Sub-20 (Juniores)</option>
                    <option value="Principal">Principal (Adulto Amador)</option>
                    <option value="Veteranos">Veteranos (+35 anos)</option>
                  </select>
                </div>
              </div>

              {/* GUARDIAN ACCORDION (VIRTUAL RULE SIGNAL) */}
              <div className="bg-[#09090B] p-4 border border-slate-800 rounded-xl space-y-3">
                <span className="text-blue-400 font-bold block mb-1 flex items-center justify-between">
                  Responsável Legal (Exigência para menores de 18 anos)
                  <ShieldAlert className="w-4 h-4 text-blue-400 animate-pulse" />
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs leading-tight">
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="Nome do Responsável Legal"
                      value={newGuardianName}
                      onChange={(e) => setNewGuardianName(e.target.value)}
                      className="w-full bg-[#111113] border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="CPF do Responsável"
                      value={newGuardianCPF}
                      onChange={(e) => setNewGuardianCPF(e.target.value)}
                      className="w-full bg-[#111113] border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Telefone do Responsável"
                      value={newGuardianPhone}
                      onChange={(e) => setNewGuardianPhone(e.target.value)}
                      className="w-full bg-[#111113] border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg text-xs transition shadow-md shadow-blue-900/10 active:scale-[0.98]"
              >
                Salvar Matrícula de Atleta
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── TAB BAR FIXA MOBILE (bottom nav como app nativo) ─────────────── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40
                      bg-[#0D0D0F]/95 backdrop-blur-xl
                      border-t border-[#1e1e24]
                      flex items-stretch
                      safe-bottom"
           style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {mobileNavItems.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          const isMaster = id === 'master';
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 min-w-0
                          transition-colors active:scale-95
                          ${active
                            ? isMaster ? 'text-amber-400' : 'text-blue-400'
                            : 'text-slate-500'
                          }`}
            >
              <div className={`relative flex items-center justify-center w-9 h-7 rounded-xl transition-colors
                              ${active
                                ? isMaster ? 'bg-amber-500/12' : 'bg-blue-500/12'
                                : ''
                              }`}>
                <Icon className="w-[18px] h-[18px]" />
                {active && (
                  <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full
                                   ${isMaster ? 'bg-amber-400' : 'bg-blue-400'}`} />
                )}
              </div>
              <span className="text-[9px] font-semibold tracking-wide truncate w-full text-center leading-tight">
                {label}
              </span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
