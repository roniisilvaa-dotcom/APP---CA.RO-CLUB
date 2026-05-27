import React from 'react';
import { Player } from '../types';
import { Award, Star, TrendingUp, Sparkles, UserCheck, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface RankingsViewProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
}

export default function RankingsView({ players, onSelectPlayer }: RankingsViewProps) {
  // Sort players by score
  const sortedPlayers = [...players].sort((a, b) => b.rankingScore - a.rankingScore);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Avaliações & Rankings</h1>
        <p className="text-xs text-slate-400 font-sans">
          Módulo de gamificação e produtividade esportiva baseado em comportamento tático, presenças oficiais e disciplina extracampo.
        </p>
      </div>

      {/* Podium grid for the top 3 star athletes with luxurious dark-gloss aesthetics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {sortedPlayers.slice(0, 3).map((p, index) => {
          const medalColors = [
            'border-yellow-500/30 text-yellow-500 bg-gradient-to-b from-[#1E1E16] to-[#111113]', 
            'border-slate-400/30 text-slate-300 bg-gradient-to-b from-[#18181D] to-[#111113]', 
            'border-amber-700/30 text-amber-600 bg-gradient-to-b from-[#1C1714] to-[#111113]'
          ];
          const badgeGlows = [
            'shadow-[0_0_30px_-15px_rgba(234,179,8,0.2)]',
            'shadow-[0_0_30px_-15px_rgba(148,163,184,0.15)]',
            'shadow-[0_0_30px_-15px_rgba(194,65,12,0.15)]'
          ];
          const rankingNames = ['1º Geral (Ouro)', '2º Geral (Prata)', '3º Geral (Bronze)'];
          
          return (
            <div
              key={p.id}
              onClick={() => onSelectPlayer(p)}
              className={`border p-6 rounded-2xl text-center relative overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border-slate-600 ${
                medalColors[index] || 'border-slate-800 text-slate-300 bg-[#111113]'
              } ${badgeGlows[index]}`}
            >
              <div className="absolute top-3 right-3 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-yellow-500/80 animate-pulse" />
              </div>
              
              <span className="text-[9px] uppercase font-bold tracking-widest block font-mono text-slate-450 text-slate-400">
                {rankingNames[index] || `#${index + 1} Colocação`}
              </span>

              <div className="my-4 flex justify-center">
                <img
                  src={p.avatarUrl}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-700 mx-auto shadow-md"
                />
              </div>

              <span className="text-sm font-bold text-white block mt-2 truncate max-w-[180px] mx-auto">{p.name}</span>
              <span className="text-[10px] text-zinc-400 font-mono block mt-1">{p.category} • {p.position}</span>
              
              <div className="mt-5 inline-block bg-[#09090B] p-2 px-4 rounded-full border border-slate-800 text-xs font-mono font-bold text-white">
                Nota Técnica: <span className="text-blue-400">{p.rankingScore}</span> pts
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid containing rules and the leaderboard listing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table scoreboard leaderboard */}
        <div className="lg:col-span-2 bg-[#111113] border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest text-[11px] mb-5">Classificação Geral de Rendimento</h3>
          
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left text-slate-300">
              <thead>
                <tr className="border-b border-slate-800/80 text-[10px] text-slate-500 uppercase tracking-wider">
                  <th className="pb-3 text-left">Posição</th>
                  <th className="pb-3 text-left">Atleta</th>
                  <th className="pb-3 text-left">Categoria</th>
                  <th className="pb-3 text-right">Nota Geral</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {sortedPlayers.map((p, idx) => (
                  <tr
                    key={p.id}
                    onClick={() => onSelectPlayer(p)}
                    className="hover:bg-[#18181B]/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 font-mono font-bold text-slate-400">#{idx + 1}º</td>
                    <td className="py-3.5 flex items-center gap-3">
                      <img
                        src={p.avatarUrl}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border border-slate-800 focus:outline-none"
                      />
                      <div>
                        <span className="font-bold text-slate-200 block">{p.name}</span>
                        <span className="text-[9px] text-slate-500 font-mono block mt-0.5">{p.position}</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 bg-[#09090B] text-slate-350 rounded-md text-[9px] font-mono border border-slate-800">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-mono font-bold text-blue-400">
                      {p.rankingScore} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Breakdown values explanations */}
        <div className="space-y-6">
          <div className="bg-[#111113] border border-slate-800 p-6 rounded-2xl space-y-5">
            <h4 className="text-sm font-bold text-slate-100 uppercase tracking-widest text-[11px]">Critérios de Rendimento</h4>
            <div className="space-y-3.5 text-xs leading-relaxed text-slate-400">
              <div className="p-4 bg-[#09090B] rounded-xl border border-slate-800 font-mono">
                <span className="text-blue-400 font-bold block mb-1.5 flex items-center justify-between">
                  Presença &amp; Pontualidade
                  <ArrowUpRight className="w-4 h-4 text-blue-400" />
                </span>
                Atendimento pontual e assiduidade a aulas gera pontuação regular positiva no prontuário esportivo.
              </div>
              <div className="p-4 bg-[#09090B] rounded-xl border border-slate-800 font-mono">
                <span className="text-rose-400 font-bold block mb-1.5 flex items-center justify-between">
                  Faltas &amp; Penalizações
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                </span>
                Ausências injustificadas, cartões disciplinares em treinos de campo e pendências cadastrais influenciam de forma corretiva a nota técnica.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
