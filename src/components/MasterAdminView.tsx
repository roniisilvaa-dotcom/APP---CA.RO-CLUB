import React, { useState, useEffect } from 'react';
import { Club, Player } from '../types';
import { 
  getClubsDatabase, 
  saveClubsDatabase, 
  registerNewClub, 
  PRE_REGISTERED_CLUBS, 
  SIMULATED_FEDERATION_CLUBS 
} from '../clubStorage';
import { 
  ShieldAlert, 
  Search, 
  Settings, 
  UserX, 
  UserCheck2,
  Lock, 
  Unlock,
  AlertOctagon, 
  Eye, 
  Globe2, 
  Building2, 
  Users2, 
  FolderLock,
  Compass, 
  TrendingUp, 
  Coins, 
  Activity, 
  FileCheck2, 
  Trash2,
  Sliders,
  History,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Users,
  ShieldCheck,
  Zap,
  AlertTriangle,
  RefreshCw,
  Scale
} from 'lucide-react';

interface MasterAdminViewProps {
  onImpersonateClub: (club: Club) => void;
  onRefreshDB: () => void;
  activeClubId: string;
}

export default function MasterAdminView({ onImpersonateClub, onRefreshDB, activeClubId }: MasterAdminViewProps) {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED' | 'BASE'>('ALL');
  
  // Universal Athlete Search State
  const [athleteSearchQuery, setAthleteSearchQuery] = useState('');
  
  // Custom states for Master admin operations
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [editClubPassword, setEditClubPassword] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  // Advanced subtabs for rigorous federative control
  const [activeMasterTab, setActiveMasterTab] = useState<'CLUBS' | 'TRANSFERS' | 'BLACKLIST' | 'EMERGENCY'>('CLUBS');
  
  // Blacklist states
  const [blacklist, setBlacklist] = useState<Array<{ cpf: string; name: string; reason: string; date: string }>>([]);
  const [inputBlacklistCpf, setInputBlacklistCpf] = useState('');
  const [inputBlacklistName, setInputBlacklistName] = useState('');
  const [inputBlacklistReason, setInputBlacklistReason] = useState('');

  // Transfer marketplace states
  const [transfers, setTransfers] = useState<Array<{
    id: string;
    name: string;
    cpf: string;
    fromClubId: string;
    fromClubName: string;
    toClubId: string;
    toClubName: string;
    fee: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    requestDate: string;
  }>>([]);

  // Stats Counters
  const [globalStats, setGlobalStats] = useState({
    totalClubs: 742,
    activeAthletesCount: 1845,
    totalRevenueTracked: 145920.00,
    regulatoryPendencies: 14,
    registeredRealClubs: 5
  });

  // System security audit logs (highly realistic)
  const [auditLogs, setAuditLogs] = useState<Array<{
    id: string;
    timestamp: string;
    event: string;
    club: string;
    level: 'INFO' | 'WARNING' | 'CRITICAL';
  }>>([
    { id: '1', timestamp: '13:10:44', event: 'Sessão de treinamento criada para Sub-17', club: 'Kagiva Football Club', level: 'INFO' },
    { id: '2', timestamp: '12:45:12', event: 'Falha de login corporativo registrada (IPv4 corr.)', club: 'Barcelona Academia Jabaquara', level: 'WARNING' },
    { id: '3', timestamp: '11:02:59', event: 'Documento ID-RG aprovado para o Atleta No. 0101', club: 'Flamenguinho de Diadema', level: 'INFO' },
    { id: '4', timestamp: '09:22:15', event: 'Geração automatizada de 12 faturas PIX no lote', club: 'Kagiva Football Club', level: 'INFO' },
    { id: '5', timestamp: '08:55:01', event: 'Alerta: Exame médico expirado detectado', club: 'Real Jaraguá Esporte Clube', level: 'WARNING' },
    { id: '6', timestamp: '07:44:02', event: 'Falha crítica: Emissão de faturas recusada por suspensão', club: 'Vasco da Gama da Várzea', level: 'CRITICAL' }
  ]);

  useEffect(() => {
    loadDatabase();
  }, []);

  const loadDatabase = () => {
    const db = getClubsDatabase();
    setClubs(db);
    
    // Dynamic stats
    let totalPlayers = 0;
    let totalFin = 0;
    db.forEach(c => {
      totalPlayers += c.players.length;
      totalFin += c.financials.reduce((acc, current) => acc + (current.type === 'REVENUE' ? current.amount : 0), 0);
    });

    // Load blacklist
    const rawBlacklist = localStorage.getItem('CLUBOS_BLACKLIST');
    if (rawBlacklist) {
      setBlacklist(JSON.parse(rawBlacklist));
    } else {
      const initialBlacklist = [
        { cpf: '999.888.777-66', name: 'Alisson Douglas de Moura', reason: 'Agressão física registrada contra árbitro licenciado em campo oficial', date: '10/05/2026' },
        { cpf: '555.444.333-22', name: 'Jean Carlos Mendes', reason: 'Atrasos reiterados e litígio contratual pendente na câmara de resolução', date: '20/05/2026' }
      ];
      localStorage.setItem('CLUBOS_BLACKLIST', JSON.stringify(initialBlacklist));
      setBlacklist(initialBlacklist);
    }

    // Load Transfers
    const rawTransfers = localStorage.getItem('CLUBOS_TRANSFERS');
    if (rawTransfers) {
      setTransfers(JSON.parse(rawTransfers));
    } else {
      const initialTransfers = [
        {
          id: 'tr_1',
          name: 'Luiz Felipe da Silva',
          cpf: '111.444.777-11',
          fromClubId: 'kagiva_fc',
          fromClubName: 'Kagiva Football Club',
          toClubId: 'barcelona_jab',
          toClubName: 'Barcelona Academia Jabaquara',
          fee: 1500,
          status: 'PENDING',
          requestDate: '2026-05-26'
        },
        {
          id: 'tr_2',
          name: 'Pedro Henrique Guedes',
          cpf: '222.555.888-22',
          fromClubId: 'flamenguinho',
          fromClubName: 'Flamenguinho de Diadema FC',
          toClubId: 'kagiva_fc',
          toClubName: 'Kagiva Football Club',
          fee: 500,
          status: 'PENDING',
          requestDate: '2026-05-27'
        }
      ];
      localStorage.setItem('CLUBOS_TRANSFERS', JSON.stringify(initialTransfers));
      setTransfers(initialTransfers);
    }

    setGlobalStats({
      totalClubs: 742 + db.length - 5, // pre-seeded counts
      activeAthletesCount: 1820 + totalPlayers,
      totalRevenueTracked: 142000.00 + totalFin,
      regulatoryPendencies: 14 + db.filter(c => c.players.some(p => p.status === 'PENDING_DOCS')).length,
      registeredRealClubs: db.length
    });
  };

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Switch suspension status of a Club overall
  const handleToggleClubSuspension = (clubId: string) => {
    // We can store Suspended state inside a custom list or append a special observation in the club's metadata.
    // For a robust, clean model, let's toggle a temporary state or store suspended clubs in a special LocalStorage key
    const suspendedList = getSuspendedClubIds();
    const isSuspended = suspendedList.includes(clubId);
    
    let newList: string[];
    if (isSuspended) {
      newList = suspendedList.filter(id => id !== clubId);
      triggerToast(`Licença de acesso restaurada com sucesso para o canal.`);
      // Log event
      addAuditLog(`Reativação de licença master autorizada pelo administrador`, getClubNameById(clubId), 'INFO');
    } else {
      newList = [...suspendedList, clubId];
      triggerToast(`Licença bloqueada! O clube selecionado foi desconectado e impedido de logar.`);
      // Log event
      addAuditLog(`BLOQUEIO DE LICENÇA: Clube suspenso devido a pendência operacional / débito`, getClubNameById(clubId), 'CRITICAL');
    }
    
    localStorage.setItem('CLUBOS_SUSPENDED_CLUBS', JSON.stringify(newList));
    loadDatabase();
    onRefreshDB();
  };

  const getSuspendedClubIds = (): string[] => {
    const data = localStorage.getItem('CLUBOS_SUSPENDED_CLUBS');
    return data ? JSON.parse(data) : [];
  };

  const isClubSuspended = (clubId: string) => {
    return getSuspendedClubIds().includes(clubId);
  };

  const getClubNameById = (clubId: string) => {
    const c = clubs.find(cl => cl.id === clubId);
    if (c) return c.name;
    const pre = PRE_REGISTERED_CLUBS.find(p => p.id === clubId);
    if (pre) return pre.name;
    return 'Clube ' + clubId;
  };

  const addAuditLog = (event: string, club: string, level: 'INFO' | 'WARNING' | 'CRITICAL') => {
    const newLog = {
      id: Math.random().toString(),
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      event,
      club,
      level
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 8)]);
  };

  // Reset or change club password remotely
  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClub || !editClubPassword) return;

    const db = getClubsDatabase();
    const idx = db.findIndex(c => c.id === selectedClub.id);
    if (idx !== -1) {
      db[idx].passwordHash = editClubPassword;
      saveClubsDatabase(db);
      triggerToast(`Senha do clube "${selectedClub.name}" alterada com sucesso! Nova chave: ${editClubPassword}`);
      addAuditLog(`Alteração manual de chave de segurança pelo master`, selectedClub.name, 'WARNING');
      setSelectedClub(null);
      setEditClubPassword('');
      loadDatabase();
      onRefreshDB();
    }
  };

  // Delete/De-register a Club
  const handleDeleteClub = (clubId: string, clubName: string) => {
    if (confirm(`Tem certeza absoluta de que deseja EXCLUIR e descredenciar o clube "${clubName}"? Todos os atletas e dados financeiros serão limpos.`)) {
      const db = getClubsDatabase();
      const updated = db.filter(c => c.id !== clubId);
      saveClubsDatabase(updated);
      triggerToast(`Clube "${clubName}" descredenciado de forma permanente.`);
      addAuditLog(`EXCLUSÃO REGULATÓRIA: Clube descredenciado do sistema de ligas`, clubName, 'CRITICAL');
      loadDatabase();
      onRefreshDB();
    }
  };

  // Find all players globally across all registered clubs (Universal Athlete Lookup)
  const getUniversalAthletesMatches = (): Array<{ player: Player; club: Club }> => {
    if (!athleteSearchQuery || athleteSearchQuery.length < 2) return [];
    
    const query = athleteSearchQuery.toLowerCase();
    const matches: Array<{ player: Player; club: Club }> = [];
    
    clubs.forEach(club => {
      club.players.forEach(p => {
        if (
          p.name.toLowerCase().includes(query) || 
          p.cpf.includes(query) || 
          (p.nickname && p.nickname.toLowerCase().includes(query))
        ) {
          matches.push({ player: p, club });
        }
      });
    });
    
    return matches;
  };

  const matchedAthletes = getUniversalAthletesMatches();

  // Approve all document pendencies for an athlete universal override
  const handleApproveAllDocsUniversal = (clubId: string, playerId: string, playerName: string) => {
    const db = getClubsDatabase();
    const clubIdx = db.findIndex(c => c.id === clubId);
    if (clubIdx !== -1) {
      const playerIdx = db[clubIdx].players.findIndex(p => p.id === playerId);
      if (playerIdx !== -1) {
        // Approve each doc
        db[clubIdx].players[playerIdx].documents = db[clubIdx].players[playerIdx].documents.map(d => ({
          ...d,
          status: 'APPROVED'
        }));
        // Update registration meter
        db[clubIdx].players[playerIdx].registrationProgress = 100;
        db[clubIdx].players[playerIdx].status = 'ACTIVE';
        
        saveClubsDatabase(db);
        triggerToast(`Documentos do atleta "${playerName}" aprovados globalmente.`);
        addAuditLog(`Aprovação universal de laudo técnico/médico de atleta`, db[clubIdx].name, 'INFO');
        
        loadDatabase();
        onRefreshDB();
      }
    }
  };

  // Master override: waive all debts of an athlete universal
  const handleWaiveDebtsUniversal = (clubId: string, playerId: string, playerName: string) => {
    const db = getClubsDatabase();
    const clubIdx = db.findIndex(c => c.id === clubId);
    if (clubIdx !== -1) {
      const playerIdx = db[clubIdx].players.findIndex(p => p.id === playerId);
      if (playerIdx !== -1) {
        db[clubIdx].players[playerIdx].subscriptions = db[clubIdx].players[playerIdx].subscriptions.map(s => ({
          ...s,
          status: s.status === 'OVERDUE' || s.status === 'PENDING' ? 'WAIVED' : s.status
        }));
        
        // Also ensure they are not suspended
        if (db[clubIdx].players[playerIdx].status === 'SUSPENDED') {
          db[clubIdx].players[playerIdx].status = 'ACTIVE';
        }

        saveClubsDatabase(db);
        triggerToast(`Isenção tributária de mensalidade deferida para "${playerName}".`);
        addAuditLog(`Anistia financeira aplicada ao prontuário do atleta`, db[clubIdx].name, 'WARNING');
        
        loadDatabase();
        onRefreshDB();
      }
    }
  };

  // --- RIGOROUS CONTROL OF ATHLETES: TRANSFERS & BLACKLIST ---
  
  const handleApproveTransfer = (transferId: string) => {
    const freshTransfers = [...transfers];
    const trIdx = freshTransfers.findIndex(t => t.id === transferId);
    if (trIdx === -1) return;

    const tr = freshTransfers[trIdx];
    const db = getClubsDatabase();

    const fromClub = db.find(c => c.id === tr.fromClubId);
    const toClub = db.find(c => c.id === tr.toClubId);

    if (fromClub && toClub) {
      // Find player
      const playerIdx = fromClub.players.findIndex(p => p.cpf === tr.cpf);
      if (playerIdx !== -1) {
        const player = { ...fromClub.players[playerIdx] };
        
        // Remove from source club
        fromClub.players.splice(playerIdx, 1);
        
        // Update history of transfer on the player
        player.history.unshift({
          id: Math.random().toString(),
          date: new Date().toISOString().split('T')[0],
          type: 'REGISTRATION',
          title: 'Transferência Federativa Homologada',
          description: `Transferido do clube "${fromClub.name}" para o "${toClub.name}" com aval técnico da federação central.`
        });
        
        // Push to target club
        toClub.players.push(player);

        // Update transfer status
        freshTransfers[trIdx].status = 'APPROVED';
        localStorage.setItem('CLUBOS_TRANSFERS', JSON.stringify(freshTransfers));
        setTransfers(freshTransfers);

        saveClubsDatabase(db);
        triggerToast(`Transferência homologada! ${tr.name} agora pertence oficialmente ao ${toClub.name}.`);
        addAuditLog(`Aprovação de transferência: Atleta ${tr.name}`, toClub.name, 'INFO');
        
        loadDatabase();
        onRefreshDB();
      } else {
        // Fallback if player already moved or was removed manual
        freshTransfers[trIdx].status = 'APPROVED';
        localStorage.setItem('CLUBOS_TRANSFERS', JSON.stringify(freshTransfers));
        setTransfers(freshTransfers);
        triggerToast(`Homologação realizada (atleta atualizado).`);
        loadDatabase();
        onRefreshDB();
      }
    } else {
      // simulated or fallback approval
      freshTransfers[trIdx].status = 'APPROVED';
      localStorage.setItem('CLUBOS_TRANSFERS', JSON.stringify(freshTransfers));
      setTransfers(freshTransfers);
      triggerToast(`Homologação de transferência virtual concluída com sucesso.`);
      addAuditLog(`Aprovação virtual: Atleta ${tr.name}`, tr.toClubName, 'INFO');
      loadDatabase();
      onRefreshDB();
    }
  };

  const handleDenyTransfer = (transferId: string) => {
    const freshTransfers = [...transfers];
    const trIdx = freshTransfers.findIndex(t => t.id === transferId);
    if (trIdx !== -1) {
      const tr = freshTransfers[trIdx];
      freshTransfers[trIdx].status = 'REJECTED';
      localStorage.setItem('CLUBOS_TRANSFERS', JSON.stringify(freshTransfers));
      setTransfers(freshTransfers);
      triggerToast(`Transferência do atleta ${tr.name} rejeitada e vetada.`);
      addAuditLog(`VETO DE TRANSFERÊNCIA: Atleta ${tr.name} proibido de transferir`, tr.fromClubName, 'WARNING');
    }
  };

  const handleAddToBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputBlacklistCpf || !inputBlacklistName || !inputBlacklistReason) return;

    const newBlacklist = [
      ...blacklist,
      {
        cpf: inputBlacklistCpf.trim(),
        name: inputBlacklistName.trim(),
        reason: inputBlacklistReason.trim(),
        date: new Date().toLocaleDateString('pt-BR')
      }
    ];

    localStorage.setItem('CLUBOS_BLACKLIST', JSON.stringify(newBlacklist));
    setBlacklist(newBlacklist);

    addAuditLog(`BLOQUEIO DISCIPLINAR: Atleta ${inputBlacklistName} colocado na suspensão central`, 'Sistema Geral', 'CRITICAL');
    
    setInputBlacklistCpf('');
    setInputBlacklistName('');
    setInputBlacklistReason('');
    triggerToast(`Atleta "${inputBlacklistName}" incluído com sucesso na Blacklist Desportiva.`);
    
    // Sync down so the athlete across the clubs will instantly show as SUSPENDED if matched by CPF!
    const db = getClubsDatabase();
    let updatedCount = 0;
    db.forEach(c => {
      c.players.forEach(p => {
        if (p.cpf === inputBlacklistCpf.trim()) {
          p.status = 'SUSPENDED';
          p.card.status = 'BLOCKED';
          updatedCount++;
        }
      });
    });
    if (updatedCount > 0) {
      saveClubsDatabase(db);
      loadDatabase();
      onRefreshDB();
    }
  };

  const handleRemoveFromBlacklist = (cpf: string, name: string) => {
    const updated = blacklist.filter(b => b.cpf !== cpf);
    localStorage.setItem('CLUBOS_BLACKLIST', JSON.stringify(updated));
    setBlacklist(updated);

    addAuditLog(`SUSPENSÃO ATLETA REVOGADA: Atleta ${name} liberado para súmula`, 'Sistema Geral', 'INFO');
    triggerToast(`Atleta "${name}" foi absolvido e liberado para competições.`);

    // Restore status to active in database if appropriate
    const db = getClubsDatabase();
    let updatedCount = 0;
    db.forEach(c => {
      c.players.forEach(p => {
        if (p.cpf === cpf) {
          p.status = 'ACTIVE';
          p.card.status = 'ACTIVE';
          updatedCount++;
        }
      });
    });
    if (updatedCount > 0) {
      saveClubsDatabase(db);
      loadDatabase();
      onRefreshDB();
    }
  };

  const handleToggleEmergencyLockdown = () => {
    const locked = localStorage.getItem('CLUBOS_LOCKDOWN_STATUS') === 'LOCKED';
    if (locked) {
      localStorage.removeItem('CLUBOS_LOCKDOWN_STATUS');
      triggerToast('Bloqueio Geral de Canal de Login Desativado! Acesso restituído.');
      addAuditLog(`BLOQUEIO CORREGEDOR REVOGADO: Acesso aos clubes normalizado`, 'Segurança Central', 'INFO');
    } else {
      localStorage.setItem('CLUBOS_LOCKDOWN_STATUS', 'LOCKED');
      triggerToast('SISTEMA BLOQUEADO! Nenhum clube parceiro consegue acessar o CRM.');
      addAuditLog(`LOCKDOWN SISTÊMICO ACTIVADO: Bloqueio imediato de todas as entradas`, 'Segurança Central', 'CRITICAL');
    }
    loadDatabase();
    onRefreshDB();
  };

  const isSystemLockdownActive = () => {
    return localStorage.getItem('CLUBOS_LOCKDOWN_STATUS') === 'LOCKED';
  };

  // Filter actual registered real clubs
  const displayedClubs = clubs.filter(c => {
    // Simple filter matching search
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.adminEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    const isSusp = isClubSuspended(c.id);
    if (filterState === 'SUSPENDED') return isSusp;
    if (filterState === 'ACTIVE') return !isSusp;
    if (filterState === 'BASE') return c.categoryFocus.includes('Base');
    return true; 
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Banner */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#111113] border-l-4 border-amber-500 text-slate-100 p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up">
          <div className="bg-amber-500/15 p-1.5 rounded-lg text-amber-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-200">Central de Comando Master</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{toast}</p>
          </div>
        </div>
      )}

      {/* Intro Header */}
      <div className="bg-[#0b0c10] border-2 border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-amber-500 text-[10px] font-black tracking-widest uppercase bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                AUDITORIA MÁXIMA (SUPERUSER)
              </span>
              <span className="text-slate-500 text-[10px] font-mono leading-none">ID: Master Admin Root</span>
            </div>
            <h2 className="text-xl font-bold font-sans text-white mt-1 flex items-center gap-2">
              <FolderLock className="w-5 h-5 text-amber-500" />
              Portal de Administração Global & Prontuários Federativos
            </h2>
            <p className="text-xs text-slate-400">
              Controle absoluto e rigoroso para a federação. Monitore todos os <strong className="text-white">742 clubes</strong>, audite mensalidades agregadas, redefina senhas corporativas e bloqueie o uso do software em tempo real.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#12141c] px-4 py-2.5 rounded-xl border border-slate-800 shrink-0">
            <div className="relative">
              <span className="absolute top-0.5 right-0 block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-[10px] uppercase font-mono text-slate-400">
              <span className="text-white block font-black">Online (Tudo Ativo)</span>
              Federado à Federação Nacional
            </div>
          </div>
        </div>
      </div>

      {/* General Core Global Analytics Section */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-[#111113] border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[9px] uppercase tracking-wider font-extrabold font-mono">Clubes Sistêmicos</span>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xl font-mono font-black text-white">{globalStats.totalClubs}</p>
          <span className="text-[9px] text-slate-500 block mt-1">
            <strong className="text-blue-400">{globalStats.registeredRealClubs}</strong> criados por UI / <strong className="text-slate-400">737</strong> simulados
          </span>
        </div>

        <div className="bg-[#111113] border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[9px] uppercase tracking-wider font-extrabold font-mono">Atletas Totais</span>
            <Users2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-mono font-black text-white">{globalStats.activeAthletesCount}</p>
          <span className="text-[9px] text-slate-500 block mt-1">Registrados em todas instâncias</span>
        </div>

        <div className="bg-[#111113] border border-slate-800 p-4 rounded-xl col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[9px] uppercase tracking-wider font-extrabold font-mono">Arrecadação Global</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-mono font-black text-white">
            {globalStats.totalRevenueTracked.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <span className="text-[9px] text-slate-500 block mt-1">Consolidação financeira</span>
        </div>

        <div className="bg-[#111113] border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[9px] uppercase tracking-wider font-extrabold font-mono">Urgências Médicas</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-xl font-mono font-black text-rose-400">{globalStats.regulatoryPendencies}</p>
          <span className="text-[9px] text-slate-500 block mt-1">Atestados vencidos ou pendentes</span>
        </div>

        <div className="bg-[#111113] border border-slate-850 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[9px] uppercase tracking-wider font-extrabold font-mono">Revisão e Auditoria</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl font-mono font-black text-white">100%</p>
          <span className="text-[9px] text-slate-500 block mt-1">Políticas de conformidade</span>
        </div>
      </div>

      {/* GRID SECTION: Universal Athlete Search + Security Logs Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CROSS-CLUB MULTI-TENANT SEARCH (Access to everyone) */}
        <div className="bg-[#111113] border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-500" />
                Busca Universal de Atletas (Acesso a Todos)
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">Localize atletas em QUALQUER um dos clubes federados e aplique overrides autoritativos.</p>
            </div>
            <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded uppercase font-bold">
              Override Master
            </span>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={athleteSearchQuery}
                onChange={(e) => setAthleteSearchQuery(e.target.value)}
                placeholder="Busque atleta por nome, apelido, CPF (Ex: 'Luiz', 'Pedro', 'Muralha')"
                className="w-full bg-[#080809] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            </div>

            {/* Simulated cross lookup outputs */}
            <div className="space-y-3 max-h-[330px] overflow-y-auto pr-1">
              {matchedAthletes.map(({ player, club }) => {
                const isOverdue = player.subscriptions.some(s => s.status === 'OVERDUE');
                const pathMatches = player.documents.some(d => d.type === 'MEDICAL_EXAM' && d.status === 'APPROVED');
                
                return (
                  <div key={player.id} className="p-3 bg-[#080809] border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={player.avatarUrl} 
                          alt={player.name} 
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-slate-800 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-white block text-xs">{player.name} ({player.nickname})</span>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1.5">
                            Filiado: <strong className="text-blue-400">{club.name}</strong> • CPF: {player.cpf}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded font-extrabold uppercase">
                        {player.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-850">
                      <div className="flex items-center gap-1.5 text-[9px] font-mono">
                        {pathMatches ? (
                          <span className="text-emerald-400">✓ Saúde em Dia</span>
                        ) : (
                          <span className="text-amber-400 font-bold">⚠️ Saúde Pendente</span>
                        )}
                        <span>•</span>
                        {isOverdue ? (
                          <span className="text-rose-400 font-bold">Inadimplente</span>
                        ) : (
                          <span className="text-slate-400">Regular</span>
                        )}
                        <span>•</span>
                        <span className="text-blue-400 font-bold">{player.rankingScore} pts</span>
                      </div>

                      {/* Action overrides */}
                      <div className="flex items-center gap-1.5">
                        {!pathMatches && (
                          <button
                            type="button"
                            onClick={() => handleApproveAllDocsUniversal(club.id, player.id, player.name)}
                            className="bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/25 px-2 py-1 rounded text-[9px] font-bold cursor-pointer transition-all"
                            title="Desbloquear laudos do atleta autorizando filiação no campeonato"
                          >
                            Aprovar Prontuário
                          </button>
                        )}
                        {isOverdue && (
                          <button
                            type="button"
                            onClick={() => handleWaiveDebtsUniversal(club.id, player.id, player.name)}
                            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/25 px-2 py-1 rounded text-[9px] font-bold cursor-pointer transition-all"
                            title="Quitar faturas antigas no sistema do clube"
                          >
                            Conceder Anistia
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {athleteSearchQuery && matchedAthletes.length === 0 && (
                <div className="p-4 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl bg-[#080809]/40 font-mono">
                  Nenhum atleta fardado com esse padrão de pesquisa.
                </div>
              )}

              {!athleteSearchQuery && (
                <div className="py-12 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl bg-[#080809]/20">
                  <Sliders className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-pulse" />
                  Digite um termo de pesquisa acima para cruzar os prontuários de todos os clubes.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECURITY AUDIT LOGS STEAM */}
        <div className="bg-[#111113] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <History className="w-4 h-4 text-amber-500" />
                  Logs de Auditoria do Sistema Técnico
                </h3>
                <p className="text-[10px] text-slate-500 mt-1">Atividades e conformidades operacionais reportadas pelas instâncias.</p>
              </div>
              <span className="text-[10px] bg-red-650 text-red-400 bg-rose-600/15 border border-rose-500/20 px-2 py-0.5 rounded font-mono font-bold">
                RIGOROSO
              </span>
            </div>

            <div className="space-y-4 font-mono text-[10px] max-h-[300px] overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-2.5 bg-[#080809] border border-slate-850/80 rounded-lg flex items-start gap-2.5">
                  <span className="text-slate-500 leading-normal font-bold">{log.timestamp}</span>
                  <div className="flex-1 space-y-1">
                    <p className="text-slate-300 font-semibold">{log.event}</p>
                    <p className="text-[9px] text-[#42b883] font-bold">Instância: {log.club}</p>
                  </div>
                  {log.level === 'CRITICAL' && (
                    <span className="text-[8px] font-black uppercase text-rose-500 bg-rose-500/10 border border-rose-500/20 px-1 py-0.2 rounded shrink-0">CRÍTICO</span>
                  )}
                  {log.level === 'WARNING' && (
                    <span className="text-[8px] font-black uppercase text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1 py-0.2 rounded shrink-0">ATENÇÃO</span>
                  )}
                  {log.level === 'INFO' && (
                    <span className="text-[8px] font-black uppercase text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1 py-0.2 rounded shrink-0">INFO</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between text-[10px] text-slate-500">
            <span>Certificado SSL AES-256 Bit Replicant Encrypted</span>
            <button 
              onClick={() => {
                setAuditLogs(prev => [
                  {
                    id: Math.random().toString(),
                    timestamp: new Date().toLocaleTimeString('pt-BR'),
                    event: 'Forçado recálculo de hash criptográfica MD-5',
                    club: 'Painel Central de Federações',
                    level: 'INFO'
                  },
                  ...prev
                ]);
                triggerToast('Auditoria atualizada com verificação MD-5.');
              }}
              className="text-amber-500 hover:underline font-bold bg-transparent border-0 cursor-pointer"
            >
              Forçar Auditoria
            </button>
          </div>
        </div>

      </div>

      {/* SECTOR SUBTABS FOR SUPREME AUDITOR */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#121214] border border-slate-800 rounded-xl max-w-4xl">
        <button
          onClick={() => setActiveMasterTab('CLUBS')}
          className={`py-2 px-4 text-[11px] font-black tracking-wide rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeMasterTab === 'CLUBS'
              ? 'bg-amber-500 text-slate-950 font-black'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          Clubes & Franquias ({globalStats.registeredRealClubs} Ativos / {globalStats.totalClubs} Totais)
        </button>
        
        <button
          onClick={() => setActiveMasterTab('TRANSFERS')}
          className={`py-2 px-4 text-[11px] font-black tracking-wide rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeMasterTab === 'TRANSFERS'
              ? 'bg-amber-500 text-slate-950 font-black'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Scale className="w-3.5 h-3.5 shrink-0 text-amber-500" />
          Mercado de Transferências ({transfers.filter(t => t.status === 'PENDING').length} pendentes)
        </button>

        <button
          onClick={() => setActiveMasterTab('BLACKLIST')}
          className={`py-2 px-4 text-[11px] font-black tracking-wide rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeMasterTab === 'BLACKLIST'
              ? 'bg-amber-500 text-slate-950 font-black'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <UserX className="w-3.5 h-3.5 shrink-0 text-rose-500" />
          Blacklist de Atletas ({blacklist.length} suspensos)
        </button>

        <button
          onClick={() => setActiveMasterTab('EMERGENCY')}
          className={`py-2 px-4 text-[11px] font-black tracking-wide rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeMasterTab === 'EMERGENCY'
              ? 'bg-amber-500 text-slate-950 font-black'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Zap className="w-3.5 h-3.5 shrink-0 text-amber-400 animate-pulse" />
          Lockdown & Segurança Geral {isSystemLockdownActive() && <span className="w-2-h-2 rounded-full bg-red-500 block"></span>}
        </button>
      </div>

      {/* CORE CLUBS MASTER LIST */}
      {activeMasterTab === 'CLUBS' && (
        <div className="bg-[#111113] border border-slate-800 rounded-2xl p-6">
          {/* Navigation Filters & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-5">
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest text-[9px]">Instâncias de Clubes Ativas no Sistema</h3>
              <p className="text-[10px] text-slate-500 mt-1">Verifique as permissões de acesso, credenciais e saúde de cada unidade conveniada.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'ALL', label: 'Todos os Clubes' },
                { id: 'ACTIVE', label: 'Licença Ativa' },
                { id: 'SUSPENDED', label: 'Licença Suspensa' },
                { id: 'BASE', label: 'Foco na Base' }
              ].map((bt) => (
                <button
                  key={bt.id}
                  onClick={() => setFilterState(bt.id as any)}
                  type="button"
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition ${
                    filterState === bt.id 
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' 
                      : 'bg-transparent text-slate-400 hover:text-slate-300 border-slate-800'
                  } cursor-pointer`}
                >
                  {bt.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar clube federado..."
                className="w-full bg-[#080809] border border-slate-800 rounded-xl py-2 px-8 text-[11px] text-white focus:outline-none focus:border-amber-500"
              />
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-600" />
            </div>
          </div>

          {/* Clubs Directory List */}
          <div className="space-y-4">
            {displayedClubs.map(c => {
              const isSuspended = isClubSuspended(c.id);
              const totalPlayers = c.players.length;
              const outstandingOverdue = c.players.filter(p => p.subscriptions.some(s => s.status === 'OVERDUE')).length;

              return (
                <div 
                  key={c.id}
                  className={`p-4 bg-[#080809] border transition-all rounded-xl ${
                    isSuspended 
                      ? 'border-red-500/30 bg-red-950/5' 
                      : activeClubId === c.id
                        ? 'border-amber-500/50 ring-1 ring-amber-500/20'
                        : 'border-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left Column Brand info */}
                    <div className="flex items-center gap-3.5">
                      {c.logoUrl ? (
                        <img 
                          src={c.logoUrl} 
                          alt={c.name} 
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full object-cover border border-slate-700 shadow"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#111113] border border-slate-800 flex items-center justify-center font-black text-amber-500 shadow">
                          {c.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{c.name}</h4>
                          {isSuspended ? (
                            <span className="text-[8px] font-black uppercase text-rose-500 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.2 rounded">
                              SUSPENSO
                            </span>
                          ) : (
                            <span className="text-[8px] font-black uppercase text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.2 rounded">
                              LICENCIADO
                            </span>
                          )}
                          {activeClubId === c.id && (
                            <span className="text-[8px] font-black uppercase text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded animate-pulse">
                              Visualizando
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 font-mono">
                          <span>Polo: <strong className="text-slate-300">{c.city}</strong></span>
                          <span>•</span>
                          <span>Foco: <strong className="text-slate-300">{c.categoryFocus}</strong></span>
                          <span>•</span>
                          <span>Garantia: <strong className="text-slate-300">{c.adminEmail}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column Core quick stats */}
                    <div className="grid grid-cols-3 gap-6 text-[10px] uppercase font-mono max-w-[340px] w-full shrink-0">
                      <div>
                        <span className="text-slate-500 block text-[9px] mb-0.5">Jogadores</span>
                        <strong className="text-white font-mono text-xs">{totalPlayers} fardados</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] mb-0.5">Pendentes</span>
                        <strong className={`font-mono text-xs ${outstandingOverdue > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                          {outstandingOverdue} atletas
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] mb-0.5">Data Registro</span>
                        <strong className="text-white font-mono text-xs">{c.registeredAt}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Sub row actions block of Super Admin over key club */}
                  <div className="mt-4 pt-3 border-t border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px]">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">Chave de Login: <code className="bg-slate-850 px-1.5 py-0.5 rounded text-amber-400 font-mono">{c.passwordHash}</code></span>
                      <button
                        onClick={() => {
                          setSelectedClub(c);
                          setEditClubPassword(c.passwordHash);
                        }}
                        className="text-slate-400 hover:text-white underline cursor-pointer bg-transparent border-0"
                      >
                        Alterar Chave
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onImpersonateClub(c)}
                        className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/25 text-blue-400 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                        title="Navegar no sistema simulando o acesso deste clube"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Visualizar Instância (Ver Tudo)
                      </button>

                      <button
                        onClick={() => handleToggleClubSuspension(c.id)}
                        className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                          isSuspended
                            ? 'bg-emerald-600/10 hover:bg-emerald-600/20 border-emerald-500/25 text-emerald-400'
                            : 'bg-rose-600/10 hover:bg-rose-600/20 border-rose-500/25 text-rose-455 text-rose-400'
                        }`}
                      >
                        {isSuspended ? (
                          <>
                            <Unlock className="w-3.5 h-3.5" />
                            Ativar Entrada
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            Bloquear Licença
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteClub(c.id, c.name)}
                        className="p-1.5 bg-slate-900 border border-slate-800 hover:bg-rose-950/20 hover:border-rose-500/20 text-slate-500 hover:text-rose-400 rounded-lg transition cursor-pointer"
                        title="Descredenciamento Definitivo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {displayedClubs.length === 0 && (
              <div className="py-12 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl bg-[#080809]">
                Nenhum clube federativo corresponde aos parâmetros da sua busca.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TABS: REGULATORY TRANSFER MARKET HOMOLOGATION */}
      {activeMasterTab === 'TRANSFERS' && (
        <div className="bg-[#111113] border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest text-[9px] flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-500" />
              Tribunal de Registros: Homologações de Transferências
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">
              Sendo o órgão fiduciário mór, você decide se os atletas podem mudar de jurisdição. Aprove para transferir o atleta da lista de elenco do clube de origem para o clube destino instantaneamente.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[9px] font-bold">
                  <th className="py-3 px-4">Atleta</th>
                  <th className="py-3 px-4">Clube de Origem</th>
                  <th className="py-3 px-4">Clube de Destino</th>
                  <th className="py-3 px-4">Taxa de Homologação</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Ação Corregedoria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {transfers.map((tr) => (
                  <tr key={tr.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-slate-100">{tr.name}</p>
                        <p className="text-[10px] font-mono text-slate-500">CPF: {tr.cpf}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-rose-300 font-mono font-semibold">{tr.fromClubName}</td>
                    <td className="py-3.5 px-4 text-green-300 font-mono font-semibold">{tr.toClubName}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {tr.fee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {tr.status === 'PENDING' && (
                        <span className="text-[8px] font-black uppercase text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                          Aguardando Homologação
                        </span>
                      )}
                      {tr.status === 'APPROVED' && (
                        <span className="text-[8px] font-black uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                          Homologada & Arquivada
                        </span>
                      )}
                      {tr.status === 'REJECTED' && (
                        <span className="text-[8px] font-black uppercase text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                          VETADO / ARQUIVADO
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {tr.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApproveTransfer(tr.id)}
                            className="px-2.5 py-1.5 bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/25 text-emerald-400 rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            Deferir
                          </button>
                          <button
                            onClick={() => handleDenyTransfer(tr.id)}
                            className="px-2.5 py-1.5 bg-rose-600/15 hover:bg-rose-600/25 border border-rose-500/25 text-rose-400 rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            Vetado
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">Processado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TABS: DISCIPLINARY BLACKLIST */}
      {activeMasterTab === 'BLACKLIST' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#111113] border border-slate-800 rounded-2xl p-6 lg:col-span-1 h-fit">
            <h3 className="text-xs font-black text-white uppercase tracking-widest text-[9px] mb-2 flex items-center gap-1.5">
              <UserX className="w-4 h-4 text-rose-500" />
              Decretar Bloqueio Desportivo Global
            </h3>
            <p className="text-[10px] text-slate-500 mb-4 leading-relaxed">
              Adicione CPFs suspensos de forma sumária. Um atleta na blacklist da federação central fica <strong>impedido de competir</strong>, seu QR Code de carteirinha é bloqueado e todos os conveniados recebem veto instantâneo de fardamento.
            </p>

            <form onSubmit={handleAddToBlacklist} className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1 text-[10px] uppercase font-mono">CPF do Atleta</label>
                <input
                  type="text"
                  value={inputBlacklistCpf}
                  onChange={(e) => setInputBlacklistCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full bg-[#080809] border border-slate-800 rounded-xl p-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 text-[10px] uppercase font-mono">Nome Completo</label>
                <input
                  type="text"
                  value={inputBlacklistName}
                  onChange={(e) => setInputBlacklistName(e.target.value)}
                  placeholder="Nome Civil"
                  className="w-full bg-[#080809] border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 text-[10px] uppercase font-mono">Motivo da Decisão Arbitral / Inadimplência</label>
                <textarea
                  value={inputBlacklistReason}
                  onChange={(e) => setInputBlacklistReason(e.target.value)}
                  placeholder="Descreva o motivo judicial ou fiduciário"
                  className="w-full bg-[#080809] border border-slate-800 rounded-xl p-2 text-xs text-white h-20 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl cursor-pointer transition-colors"
              >
                Decretar Suspensão Total
              </button>
            </form>
          </div>

          <div className="bg-[#111113] border border-slate-800 rounded-2xl p-6 lg:col-span-2">
            <h3 className="text-xs font-black text-white uppercase tracking-widest text-[9px] mb-2 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-rose-500 animate-pulse" />
              Atletas Atualmente Impedidos (Blacklisted)
            </h3>
            <p className="text-[10px] text-slate-500 mb-4">
              Estes atletas foram banidos globalmente de jogar por dividas fiduciárias ou processos disciplinares. Outros clubes não conseguem fardá-los nem criar carteirinhas desportivas.
            </p>

            <div className="space-y-3.5">
              {blacklist.map((b) => (
                <div key={b.cpf} className="p-3.5 bg-[#080809] border border-rose-550/20 rounded-xl flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-100 text-xs font-black">{b.name}</strong>
                      <span className="text-[7.5px] uppercase font-black bg-rose-500/15 border border-rose-500/30 text-rose-400 px-1.5 py-0.2 rounded font-mono">
                        GRAVÍSSIMA
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">CPF: {b.cpf} • Data de Registro: {b.date}</p>
                    <p className="text-[10px] text-amber-500/90 leading-relaxed font-sans mt-1 bg-amber-500/5 p-2 rounded border border-amber-500/10">
                      Motivo: {b.reason}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemoveFromBlacklist(b.cpf, b.name)}
                    className="px-2.5 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-wide cursor-pointer text-nowrap"
                  >
                    Anistiar Atleta
                  </button>
                </div>
              ))}

              {blacklist.length === 0 && (
                <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl font-mono">
                  Nenhum atleta listado sob banimento de ligas desportivas nacionais.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TABS: SYSTEM LOCKDOWN AND ADVANCED EMERGENCY OVERRIDES */}
      {activeMasterTab === 'EMERGENCY' && (
        <div className="bg-[#111113] border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest text-[9px] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Painel de Emergência Corregedora & Lockdown de Servidores
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">
              Controles máximos de conformidade operacional. Em caso de litígio, o comissário master pode desativar logins de conveniados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lockdown panel */}
            <div className="p-5 rounded-2xl border bg-[#080809] flex flex-col justify-between border-slate-800">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className={`w-4 h-4 ${isSystemLockdownActive() ? 'text-rose-500' : 'text-slate-400'}`} />
                  <strong className="text-white text-xs font-bold">Lockdown Integral Desportivo (CRM Veto)</strong>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Se ativado, nenhum diretor de clube, escolinha de base ou polo credenciado poderá fazer login ou ver dados. O sistema entrará em manutenção jurídica emergencial.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-850 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-mono block text-slate-500">Estado Atual</span>
                  {isSystemLockdownActive() ? (
                    <span className="text-[10px] text-rose-500 font-extrabold animate-pulse">LOCKDOWN ATIVO - PORTA FECHADA</span>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-bold">LIVRE ACESSO</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleToggleEmergencyLockdown}
                  className={`px-3 py-2 text-[10px] font-black uppercase rounded-lg cursor-pointer ${
                    isSystemLockdownActive()
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                      : 'bg-rose-600 text-white hover:bg-rose-500'
                  }`}
                >
                  {isSystemLockdownActive() ? 'Desativar Lockdown' : 'Ativar Lockdown Imediato'}
                </button>
              </div>
            </div>

            {/* General Backup panel */}
            <div className="p-5 rounded-2xl border bg-[#080809] border-slate-800 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-blue-400" />
                  <strong className="text-white text-xs font-bold">Extração do Livro de Transferências (Audit XLS)</strong>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Exporte o prontuário geral de todos os atletas federados em formato estruturado fiduciário para prestação de contas governamentais.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-850 flex items-center justify-end">
                <button
                  onClick={() => {
                    const db = getClubsDatabase();
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href", dataStr);
                    downloadAnchor.setAttribute("download", `CLUBOS_FEDERATION_INTEGRAL_BACKUP_${new Date().toISOString().split('T')[0]}.json`);
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                    triggerToast('Backup da Federação exportado com sucesso.');
                  }}
                  className="px-3.5 py-2 rounded-lg bg-[#111113] border border-slate-800 hover:border-slate-700 text-white font-bold text-[10px] uppercase cursor-pointer"
                >
                  Exportar Backup Completo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIG ALTER SECURITY KEY */}
      {selectedClub && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111113] border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setSelectedClub(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-500" />
              Resetar Chave de Segurança (Manual Bypass)
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Você está alterando a senha corporativa de acesso do clube <strong className="text-white">{selectedClub.name}</strong>. Esta ação surtirá efeito instantâneo.
            </p>

            <form onSubmit={handleSaveNewPassword} className="space-y-4">
              <div>
                <label className="text-slate-400 block mb-1.5 text-xs text-[11px]">Nova Senha de Acesso</label>
                <input
                  type="text"
                  value={editClubPassword}
                  onChange={(e) => setEditClubPassword(e.target.value)}
                  className="w-full bg-[#080809] border border-slate-800 rounded-xl p-2.5 text-xs text-white uppercase font-mono focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2 text-[10px] text-slate-500 leading-normal">
                <AlertOctagon className="w-4 h-4 text-amber-500 shrink-0" />
                Um log de auditoria registrará o bypass de credencial no painel administrativo central.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedClub(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Aplicar Nova Chave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
