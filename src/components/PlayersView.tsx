import React, { useState } from 'react';
import { Player } from '../types';
import { Search, Filter, HelpCircle, BadgeAlert, Eye } from 'lucide-react';

interface PlayersViewProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
  onOpenAddPlayerModal: () => void;
}

export default function PlayersView({
  players,
  onSelectPlayer,
  onOpenAddPlayerModal
}: PlayersViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filter players
  const filteredPlayers = players.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.nickname && p.nickname.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          p.position.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Elenco & Fichas de Jogo</h1>
          <p className="text-xs text-slate-400">Inscrição de boleiros, convocação por categorias (Aspirantes/Veteranos), exames e controle físico.</p>
        </div>
        <button
          onClick={onOpenAddPlayerModal}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs tracking-wide transition shadow-lg shadow-blue-500/10 cursor-pointer self-start"
        >
          + Cadastrar Boleiro
        </button>
      </div>

      {/* Filter and control panel */}
      <div className="bg-[#111113] border border-slate-800 p-4 rounded-2xl space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar boleiro por nome de guerra, apelido ou posição..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#09090B] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 placeholder-slate-500 transition"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#09090B] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-350 focus:outline-none focus:border-blue-500 font-mono"
            >
              <option value="ALL">Todas as Categorias</option>
              <option value="Sub-15">Sub-15 (Fraldinha/Dente de Leite)</option>
              <option value="Sub-17">Sub-17 (Juvenil)</option>
              <option value="Sub-20">Sub-20 (Juniores)</option>
              <option value="Principal">Principal (Aspirante/Amador)</option>
              <option value="Veteranos">Veteranos (+35 / Cinquentão)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto bg-[#09090B] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-350 focus:outline-none focus:border-blue-500 font-mono"
            >
              <option value="ALL">Todas as Situações</option>
              <option value="ACTIVE">Liberado pro Jogo (Ativo)</option>
              <option value="PENDING_DOCS">Pendente (Sem RG / Ficha)</option>
              <option value="SUSPENDED">Suspenso (Atraso/Vermelho)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid containing athlete summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map((player) => {
            const isMinor = new Date().getFullYear() - new Date(player.birthDate).getFullYear() < 18;
            const overdueFees = player.subscriptions.filter(s => s.status === 'OVERDUE').length;

            return (
              <div
                key={player.id}
                className="bg-[#111113] border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between"
              >
                {/* General data and avatar */}
                <div>
                  <div className="flex items-start gap-4">
                    <img
                      src={player.avatarUrl}
                      alt={player.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-800 shadow"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span 
                          className="text-xs font-bold text-white block truncate hover:text-blue-400 cursor-pointer transition-colors" 
                          onClick={() => onSelectPlayer(player)}
                        >
                          {player.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                        {player.nickname ? `"${player.nickname}"` : player.position} • {player.position}
                      </span>
                      <span className="text-[9px] text-slate-500 block">Nasc: {player.birthDate}</span>
                    </div>
                  </div>

                  {/* Badges for warning and categories */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-[#09090B] border border-slate-800 text-slate-300 rounded-md">
                      {player.category}
                    </span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md ${
                      player.status === 'ACTIVE'
                        ? 'bg-blue-550/10 text-blue-400 border border-blue-500/10'
                        : player.status === 'PENDING_DOCS'
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/15'
                        : 'bg-rose-500/10 text-rose-500 border border-rose-500/15'
                    }`}>
                      {player.status === 'ACTIVE' ? 'LIBERADO' : player.status === 'PENDING_DOCS' ? 'PENDENTE' : 'SUSPENSO'}
                    </span>
                    {isMinor && (
                      <span className="px-2 py-0.5 text-[9px] font-semibold bg-indigo-505 bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 rounded-md">
                        Menor de Idade
                      </span>
                    )}
                  </div>

                  {/* Registration progress and documents checklist */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Inscrição na Liga</span>
                      <span className="font-bold text-slate-300">{player.registrationProgress}%</span>
                    </div>
                    <div className="w-full bg-[#09090B] rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          player.registrationProgress === 100 ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${player.registrationProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Warning signals */}
                  <div className="mt-4 pt-3 border-t border-slate-800/60 space-y-1.5">
                    {!player.documents.some(d => d.type === 'MEDICAL_EXAM' && d.status === 'APPROVED') && (
                      <div className="flex items-center gap-1.5 text-[9px] text-amber-500 font-mono font-bold">
                        <BadgeAlert className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        ⚠️ Exame ou Termo Médico Pendente!
                      </div>
                    )}
                    {overdueFees > 0 && (
                      <div className="flex items-center gap-1.5 text-[9px] text-rose-455 text-rose-400 font-mono">
                        <BadgeAlert className="w-3.5 h-3.5" />
                        Caixinha/Rachão Atrasado ({overdueFees} faturas)
                      </div>
                    )}
                    {isMinor && !player.guardian && (
                      <div className="flex items-center gap-1.5 text-[9px] text-amber-400 font-mono">
                        <BadgeAlert className="w-3.5 h-3.5" />
                        Base sem aval dos pais
                      </div>
                    )}
                    {player.documents.some(d => d.status === 'PENDING') && (
                      <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-mono">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                        Documentação sob análise
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer and visual preview */}
                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[9px] text-slate-500 font-mono font-bold uppercase">Inscrição: {player.card.cardNumber}</span>
                  <button
                    onClick={() => onSelectPlayer(player)}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold cursor-pointer py-1"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Ficha Técnica
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500 border border-slate-800 border-dashed rounded-2xl p-6 bg-[#111113]/30">
            Nenhum atleta encontrado sob estes filtros de elenco.
          </div>
        )}
      </div>
    </div>
  );
}
