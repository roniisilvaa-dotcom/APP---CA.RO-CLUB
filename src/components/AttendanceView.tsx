import React, { useState } from 'react';
import { Player } from '../types';
import { Check, X, AlertCircle, MessageCircle, Save, Calendar, Filter, Star, Info, UserCheck } from 'lucide-react';

interface AttendanceViewProps {
  players: Player[];
  onAddHistoryEvent: (playerId: string, title: string, type: 'PERFORMANCE' | 'DISCIPLINARY', desc: string, goals?: number, yellowCards?: number) => void;
}

export default function AttendanceView({ players, onAddHistoryEvent }: AttendanceViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<'Sub-15' | 'Sub-17' | 'Sub-20' | 'Principal' | 'Veteranos'>('Sub-15');
  const [trainingDate, setTrainingDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [trainingTopic, setTrainingTopic] = useState<string>('Treino Técnico & Tático Coletivo');
  
  // Local state for current attendance list
  // Key: playerId, Value: 'PRESENT' | 'ABSENT' | 'JUSTIFIED'
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'JUSTIFIED'>>({});
  const [toast, setToast] = useState<string | null>(null);

  const filteredPlayers = players.filter(p => p.category === selectedCategory);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleStatusChange = (playerId: string, status: 'PRESENT' | 'ABSENT' | 'JUSTIFIED') => {
    setAttendanceMap(prev => ({
      ...prev,
      [playerId]: status
    }));
  };

  const handleMarkAllPresent = () => {
    const freshMap = { ...attendanceMap };
    filteredPlayers.forEach(p => {
      freshMap[p.id] = 'PRESENT';
    });
    setAttendanceMap(freshMap);
    triggerToast(`Todos os atletas da categoria ${selectedCategory} foram marcados como Presente.`);
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    
    let savedCount = 0;
    filteredPlayers.forEach(p => {
      const status = attendanceMap[p.id] || 'PRESENT'; // default to present if untouched
      let title = '';
      let desc = '';
      let type: 'PERFORMANCE' | 'DISCIPLINARY' = 'PERFORMANCE';

      if (status === 'PRESENT') {
        title = 'Presença registrada em Treino';
        desc = `Compareceu ao treino coletivo sobre: "${trainingTopic}" em ${trainingDate}.`;
        type = 'PERFORMANCE';
        // Add performance log (+5 points automatically calculated in onAddHistoryEvent)
        onAddHistoryEvent(p.id, title, type, desc, 0, 0);
        savedCount++;
      } else if (status === 'ABSENT') {
        title = 'Falta registrada em Treino';
        desc = `Ausente sem justificativa prévia no treino "${trainingTopic}" em ${trainingDate}.`;
        type = 'DISCIPLINARY';
        // Add disciplinary log (-10 points automatically calculated)
        onAddHistoryEvent(p.id, title, type, desc, 0, 0);
        savedCount++;
      } else if (status === 'JUSTIFIED') {
        title = 'Ausência Justificada';
        desc = `Ausente do treino "${trainingTopic}" em ${trainingDate}. Justificativa apresentada previamente.`;
        // For justified absence, we can add a performance log to keep it neutral (doesn't trigger big penalty)
        onAddHistoryEvent(p.id, title, 'PERFORMANCE', desc, 0, 0);
        savedCount++;
      }
    });

    triggerToast(`Chamada salva! Registrado histórico e coeficientes esportivos atualizados para os ${savedCount} atletas do ${selectedCategory}.`);
  };

  const handleNotifyParentWhatsApp = (player: Player) => {
    const guardian = player.guardian;
    const phoneNum = guardian?.phone ? guardian.phone.replace(/\D/g, '') : '';
    
    const text = `*CLUB OS — CONTROLE OPERACIONAL — FALTA REGISTRADA*\n\n` +
      `Olá, responsável pelo atleta *${player.name}* (${player.category}),\n\n` +
      `Gostaríamos de informar que o atleta *não compareceu* ao treino agendado para hoje, dia *${trainingDate}*\n` +
      `Assunto do treino: *${trainingTopic}*.\n\n` +
      `A segurança e a assiduidade dos garotos são prioridades para nós. Se desejar enviar atestado ou justificativa técnica, responda a esta mensagem.\n\n` +
      `_Comissão Técnica do Clube — Desenvolvido por CA.RO TECH_`;

    const url = phoneNum 
      ? `https://api.whatsapp.com/send?phone=55${phoneNum}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      
    window.open(url, '_blank');
    triggerToast(`Direcionamento para WhatsApp do responsável pelo atleta ${player.name} iniciado!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#111113] border-l-4 border-emerald-500 text-slate-100 p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up">
          <div className="bg-emerald-500/15 p-1.5 rounded-lg text-emerald-400">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-200">Sucesso na Chamada</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{toast}</p>
          </div>
        </div>
      )}

      {/* Intro Header */}
      <div className="bg-[#111113] border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-blue-400 text-xs font-black tracking-widest uppercase font-mono bg-blue-600/10 px-2.5 py-1 rounded">Módulos de Campo</span>
            <h2 className="text-xl font-bold font-sans text-white mt-3 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-500" />
              Controle de Frequência & Lista de Presenças
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Gerencie a chamada por categoria, aplique bonificações táticas/técnicas no ranking de atletas e notifique pais imediatamente em caso de ausência.
            </p>
          </div>
          <button
            onClick={handleMarkAllPresent}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition cursor-pointer shrink-0"
          >
            Marcar Todos Presentes (✓)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Call Selection Form */}
        <div className="bg-[#111113] border border-slate-800 p-6 rounded-2xl h-fit space-y-5">
          <div>
            <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest text-[9px]">Configurar Sessão de Treino</h3>
            <p className="text-[10px] text-slate-500 mt-1">Estes dados alimentarão o prontuário esportivo de cada participante de campo.</p>
          </div>

          <form onSubmit={handleSaveAttendance} className="space-y-4 text-xs font-sans">
            <div>
              <label className="text-slate-400 block mb-1">Selecione a Categoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value as any);
                  setAttendanceMap({}); // clear map upon category switch to avoid spilling state
                }}
                className="w-full bg-[#09090B] border border-slate-800 rounded-lg p-2.5 text-slate-300 font-mono focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Sub-15">Sub-15 (Infantil)</option>
                <option value="Sub-17">Sub-17 (Juvenil)</option>
                <option value="Sub-20">Sub-20 (Juniores)</option>
                <option value="Principal">Principal (Adulto Amador)</option>
                <option value="Veteranos">Veteranos (+35 anos)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Data da Chamada</label>
              <input
                type="date"
                value={trainingDate}
                onChange={(e) => setTrainingDate(e.target.value)}
                className="w-full bg-[#09090B] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 font-mono transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Título/Tema do Treino</label>
              <input
                type="text"
                value={trainingTopic}
                onChange={(e) => setTrainingTopic(e.target.value)}
                placeholder="Ex: Treino Técnico Coletivo Extra"
                className="w-full bg-[#09090B] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div className="bg-[#09090B] border border-slate-800/80 p-3 rounded-lg flex items-start gap-2.5 text-[10px] text-slate-400 leading-normal">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-200 uppercase mb-0.5">Influência no Score de Rankings</p>
                Presentes recebem evolução de assiduidade (<strong className="text-green-400">+5 pts</strong>). Faltas não justificadas penalizam a disciplina do atleta no ranking (<strong className="text-rose-400">-10 pts</strong>).
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg text-xs transition shadow-md shadow-blue-900/15 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Concluir & Atualizar Atletas
            </button>
          </form>
        </div>

        {/* Players Call Sheet Checkbox Selection */}
        <div className="lg:col-span-2 bg-[#111113] border border-slate-800 rounded-2xl p-6 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest text-[9px]">DIÁRIO DE CAMPO • CATEGORIA {selectedCategory.toUpperCase()}</h3>
              <p className="text-[10px] text-slate-500 mt-1">Marque o status correspondente de cada atleta nesta rodada.</p>
            </div>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-350">
              {filteredPlayers.length} Inscritos
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[460px]">
            {filteredPlayers.map(p => {
              const currentStatus = attendanceMap[p.id] || 'PRESENT';
              const isMinor = p.guardian !== undefined;

              return (
                <div 
                  key={p.id} 
                  className="p-4 bg-[#09090B] border border-slate-800/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-slate-700/80"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={p.avatarUrl} 
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-800" 
                    />
                    <div>
                      <span className="font-bold text-white block truncate max-w-[200px] text-xs">{p.name}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] text-slate-500 block font-mono">
                          Pé: {p.foot} • Posição: {p.position}
                        </span>
                        {isMinor && (
                          <span className="text-[8px] bg-blue-500/10 text-blue-400 px-1 py-0.2 rounded border border-blue-500/10">Menor</span>
                        )}
                        {p.status === 'SUSPENDED' && (
                          <span className="text-[8px] bg-rose-500/10 text-rose-400 px-1 py-0.2 rounded font-extrabold border border-rose-500/20">Suspenso Fin.</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Attendance Selector Buttons */}
                    <div className="flex bg-[#111113] p-1 rounded-lg border border-slate-800 gap-1 text-[10px]">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(p.id, 'PRESENT')}
                        className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                          currentStatus === 'PRESENT'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'text-slate-500 hover:text-slate-350 bg-transparent'
                        }`}
                      >
                        Presente
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(p.id, 'ABSENT')}
                        className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                          currentStatus === 'ABSENT'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow'
                            : 'text-slate-500 hover:text-slate-350 bg-transparent'
                        }`}
                      >
                        Falta
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(p.id, 'JUSTIFIED')}
                        className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                          currentStatus === 'JUSTIFIED'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            : 'text-slate-500 hover:text-slate-350 bg-transparent'
                        }`}
                      >
                        Justificado
                      </button>
                    </div>

                    {/* Absent notification alarm via Whatsapp for junior parents */}
                    {currentStatus === 'ABSENT' && (
                      <button
                        type="button"
                        onClick={() => handleNotifyParentWhatsApp(p)}
                        className="p-2 bg-emerald-600/15 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs leading-none transition-all flex items-center gap-1 cursor-pointer border border-emerald-500/20 animate-pulse"
                        title="Alertar responsável no WhatsApp sobre a desobediência acadêmica"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[9px] font-bold">Avisar Pais</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredPlayers.length === 0 && (
              <div className="py-12 text-center text-slate-500 border border-slate-800 border-dashed rounded-xl bg-[#09090B]/30 font-sans">
                Nenhum atleta matriculado atualmente na categoria {selectedCategory}.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
