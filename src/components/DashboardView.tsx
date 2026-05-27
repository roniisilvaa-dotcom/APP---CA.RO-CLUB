import React from 'react';
import { Player, FinancialEntry, ClubStats } from '../types';
import { Users, TrendingUp, TrendingDown, CreditCard, Award, FileWarning, ArrowUpRight, ArrowDownRight, UserPlus, AlertTriangle } from 'lucide-react';

interface DashboardViewProps {
  players: Player[];
  financials: FinancialEntry[];
  stats: ClubStats;
  onNavigate: (tab: 'players' | 'financial' | 'rankings') => void;
  onSelectPlayer: (player: Player) => void;
  onOpenAddPlayerModal: () => void;
}

export default function DashboardView({
  players,
  financials,
  stats,
  onNavigate,
  onSelectPlayer,
  onOpenAddPlayerModal
}: DashboardViewProps) {
  // Calculate calculated numbers
  const totalSubAmount = players.reduce((acc, p) => {
    return acc + p.subscriptions.filter(s => s.status === 'PAID').reduce((sum, s) => sum + s.amount, 0);
  }, 0);

  const pendingSubsAmount = players.reduce((acc, p) => {
    return acc + p.subscriptions.filter(s => s.status === 'PENDING' || s.status === 'OVERDUE').reduce((sum, s) => sum + s.amount, 0);
  }, 0);

  const overdueCount = players.filter(p => p.subscriptions.some(s => s.status === 'OVERDUE')).length;
  const missingDocsCount = players.filter(p => p.status === 'PENDING_DOCS' || p.registrationProgress < 100).length;
  const minorsWithoutGuardian = players.filter(p => {
    const age = new Date().getFullYear() - new Date(p.birthDate).getFullYear();
    return age < 18 && !p.guardian;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header with quick actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Painel da Várzea • Diretoria</h1>
          <p className="text-xs text-slate-400">Hub completo para controle de boleiros, mensalidade do rachão, fardamentos e caixinha do time.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onOpenAddPlayerModal}
            className="bg-blue-600 hover:bg-blue-500 active:transform active:scale-95 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-blue-900/10 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Cadastrar Novo Boleiro
          </button>
        </div>
      </div>

      {/* Grid containing high-contrast metric widgets (SaaS Elegant Dark template) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total atletas */}
        <div 
          onClick={() => onNavigate('players')} 
          className="cursor-pointer bg-[#111113] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 hover:bg-[#151518]/70 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Elenco Cadastrado</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/10">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-bold text-white tracking-tight">{players.length}</div>
            <div className="text-[10px] text-emerald-400 flex items-center mt-1 font-mono">
              <TrendingUp className="w-3 h-3 mr-0.5 animate-pulse" />
              {players.filter(p => p.status === 'ACTIVE').length} boleiros em atividade
            </div>
          </div>
        </div>

        {/* Adimplencia */}
        <div 
          onClick={() => onNavigate('financial')} 
          className="cursor-pointer bg-[#111113] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 hover:bg-[#151518]/70 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Arrecadação Rachões</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/10">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-bold text-white tracking-tight">
              {((totalSubAmount / (totalSubAmount + pendingSubsAmount || 1)) * 100).toFixed(1)}%
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(10, (totalSubAmount / (totalSubAmount + pendingSubsAmount || 1)) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Documentação */}
        <div 
          onClick={() => onNavigate('players')} 
          className="cursor-pointer bg-[#111113] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 hover:bg-[#151518]/70 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Ficha Pendente</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/10">
              <FileWarning className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-bold text-red-400 tracking-tight">
              {missingDocsCount.toString().padStart(2, '0')}
            </div>
            <p className="text-[10px] text-slate-500 mt-1 truncate">Sem RG ou Atestado para a Copa</p>
          </div>
        </div>

        {/* Receita MRR */}
        <div 
          onClick={() => onNavigate('financial')} 
          className="cursor-pointer bg-blue-600/10 border border-blue-500/20 p-5 rounded-2xl flex flex-col justify-between shadow-[0_0_30px_-15px_rgba(59,130,246,0.3)] hover:border-blue-500/40 hover:bg-blue-600/15 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-400 font-medium uppercase tracking-widest">Fundo do Time</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 text-white">
            <div className="text-4xl font-bold tracking-tight">R$ {totalSubAmount}</div>
            <div className="text-[10px] text-blue-300/60 mt-1 truncate">Arrecadado de R$ {totalSubAmount + pendingSubsAmount} esperados</div>
          </div>
        </div>

      </div>

      {/* Critical warnings alert banner */}
      {(missingDocsCount > 0 || minorsWithoutGuardian > 0) && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wide">Pendências Críticas de Cadastro Esportivo</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Existem <strong className="text-white">{missingDocsCount} atletas</strong> com documentação física incompleta e <strong className="text-white">{minorsWithoutGuardian} menores de idade</strong> sem responsável legal assinado no prontuário.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('players')}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline shrink-0 cursor-pointer"
          >
            Revisar Fichas &rarr;
          </button>
        </div>
      )}

      {/* Roster & Operations layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns - Quick view of list and Categories status */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111113] border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest text-[11px]">Amostragem Rápida do Elenco</h3>
              <button 
                onClick={() => onNavigate('players')} 
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                Ver todos os atletas
              </button>
            </div>
            <div className="divide-y divide-slate-800/80">
              {players.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectPlayer(p)}
                  className="py-3.5 flex items-center justify-between hover:bg-[#18181B]/50 px-3 -mx-3 rounded-xl cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.avatarUrl}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-700/80 shadow"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-200 block truncate">{p.name}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.5 bg-[#1C1C1E] text-slate-300 rounded-md font-mono text-[9px]">
                          {p.category}
                        </span>
                        • {p.position} • Pé: {p.foot}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="hidden sm:block text-right">
                      <span className="text-xs font-bold text-slate-100 font-mono block">Nota: {p.rankingScore}</span>
                      <span className="text-[9px] text-slate-500 block">Pos: #{p.rankingPosition}º</span>
                    </div>
                    <div>
                      <span className={`inline-block px-2.5 py-0.5 text-[9px] font-bold rounded-lg ${
                        p.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                          : p.status === 'PENDING_DOCS'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/10'
                          : p.status === 'SUSPENDED'
                          ? 'bg-rose-500/10 text-rose-500 border border-rose-500/10'
                          : 'bg-slate-500/10 text-slate-400'
                      }`}>
                        {p.status === 'ACTIVE' ? 'ATIVO' : p.status === 'PENDING_DOCS' ? 'PENDENTE' : p.status === 'SUSPENDED' ? 'SUSPENSO' : 'INATIVO'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Financial Log */}
        <div className="space-y-6">
          <div className="bg-[#111113] border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest text-[11px]">Caixa Recente & Receitas</h3>
              <button 
                onClick={() => onNavigate('financial')} 
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                Fluxo completo
              </button>
            </div>
            <div className="space-y-3">
              {financials.slice(0, 4).map((f) => (
                <div key={f.id} className="p-3.5 bg-[#09090B]/60 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3 hover:bg-[#09090B] transition-all">
                  <div className="min-w-0">
                    <span className="text-[9px] text-slate-500 block font-mono">{f.date}</span>
                    <span className="text-xs font-semibold text-slate-200 block truncate mt-0.5">{f.description}</span>
                    <span className="text-[9px] px-2 py-0.5 bg-[#1C1C1E] text-slate-400 rounded-md inline-block mt-1">
                      {f.category}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-xs font-bold font-mono tracking-tight flex items-center justify-end ${
                      f.type === 'REVENUE' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {f.type === 'REVENUE' ? (
                        <>
                          <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                          + R$ {f.amount}
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                          - R$ {f.amount}
                        </>
                      )}
                    </span>
                    <span className="text-[9px] text-slate-500 block mt-0.5">PIX / Dinheiro</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
