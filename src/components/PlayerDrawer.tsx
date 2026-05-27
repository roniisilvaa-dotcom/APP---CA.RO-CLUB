import React, { useState } from 'react';
import { Player, PlayerHistoryEvent } from '../types';
import { X, ShieldAlert, Award, Calendar, Phone, Mail, FileText, CheckCircle, Trash2, Plus, RefreshCw, Star, QrCode, ClipboardCheck, MessageCircle, Send } from 'lucide-react';

interface PlayerDrawerProps {
  player: Player;
  onClose: () => void;
  onToggleFeeStatus: (playerId: string, feeId: string) => void;
  onAddHistoryEvent: (playerId: string, title: string, type: 'PERFORMANCE' | 'DISCIPLINARY', desc: string, goals?: number, yellowCards?: number) => void;
  onChangeAvatar: (playerId: string, newAvatarUrl: string) => void;
}

export default function PlayerDrawer({
  player,
  onClose,
  onToggleFeeStatus,
  onAddHistoryEvent,
  onChangeAvatar
}: PlayerDrawerProps) {
  const [activeTab, setActiveTab] = useState<'geral' | 'historico' | 'mensalidades' | 'avaliacao' | 'cartao'>('geral');
  const [toast, setToast] = useState<string | null>(null);
  
  // States for adding history events
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'PERFORMANCE' | 'DISCIPLINARY'>('PERFORMANCE');
  const [newGoals, setNewGoals] = useState('0');
  const [newYellow, setNewYellow] = useState('0');

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;
    onAddHistoryEvent(
      player.id,
      newTitle,
      newType,
      newDesc,
      parseInt(newGoals) || 0,
      parseInt(newYellow) || 0
    );
    // Reset forms and show feedback
    setNewTitle('');
    setNewDesc('');
    setNewGoals('0');
    setNewYellow('0');
    triggerToast('Ocorrência esportiva adicionada com sucesso!');
  };

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const isMinor = new Date().getFullYear() - new Date(player.birthDate).getFullYear() < 18;

  const handleExportCard = () => {
    triggerToast('PDF da Ficha Esportiva gerado para impressão com sucesso!');
  };

  const handleExportWhatsApp = () => {
    const text = `*CLUB OS — FICHA ESPORTIVA DO ATLETA*\n\n` +
      `⚽ *Nome:* ${player.name}\n` +
      `👤 *Apelido:* ${player.nickname || 'Sem apelido'}\n` +
      `📅 *Nascimento:* ${player.birthDate}\n` +
      `🏅 *Categoria:* ${player.category}\n` +
      `🏃 *Posição:* ${player.position}\n` +
      `🦶 *Pé Dominante:* ${player.foot}\n` +
      `📈 *Desempenho Técnico:* ${player.rankingScore}/100\n` +
      `🪪 *Registro Geral:* ${player.card.cardNumber}\n` +
      `✅ *Status:* ${player.status === 'ACTIVE' ? 'LIBERADO (ATIVO)' : player.status === 'PENDING_DOCS' ? 'PENDENTE DE DOCS' : 'SUSPENSO FINANCEIRO'}\n\n` +
      `_Desenvolvido por CA.RO TECH_`;
    
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    triggerToast('Ficha esportiva enviada para o WhatsApp!');
  };

  const handleSendPaymentReminderWhatsApp = (sub: any) => {
    const phoneNum = player.guardian?.phone 
      ? player.guardian.phone.replace(/\D/g, '') 
      : '';
    
    const text = `*CLUB OS — LEMBRETE DE FATURA*\n\n` +
      `Prezado(a) responsável pelo atleta *${player.name}*,\n\n` +
      `Lembramos que a mensalidade vencida em *${sub.dueDate}* no valor de *R$ ${sub.amount},00* está pendente.\n\n` +
      `Por favor, realize o pagamento para manter o cadastro do atleta ativo e garantir sua liberação em súmulas esportivas.\n\n` +
      `_Gestão do Clube — Desenvolvido por CA.RO TECH_`;

    const whatsappUrl = phoneNum 
      ? `https://api.whatsapp.com/send?phone=55${phoneNum}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      
    window.open(whatsappUrl, '_blank');
    triggerToast('Lembrete de cobrança direcionado para o WhatsApp!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#09090B]/80 backdrop-blur-sm flex justify-end">
      
      {/* Toast Feedback Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-55 bg-zinc-900 border border-blue-500/30 text-slate-100 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <ClipboardCheck className="w-5 h-5 text-blue-400" />
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      {/* Drawer box container */}
      <div className="w-full max-w-2xl bg-[#111113] border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header toolbar */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={player.avatarUrl}
              alt={player.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow"
            />
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">{player.name}</h2>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                {player.category} • {player.position}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 px-3 text-slate-450 text-slate-400 hover:text-white hover:bg-slate-850 bg-slate-900 border border-slate-800 rounded-xl transition text-xs flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            <X className="w-3.5 h-3.5" />
            Fechar
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-[#09090B]/50 overflow-x-auto scrollbar-none">
          {[
            { id: 'geral', label: 'Cadastro & Responsável' },
            { id: 'historico', label: 'Histórico & Súmula' },
            { id: 'mensalidades', label: 'Mensalidades' },
            { id: 'avaliacao', label: 'Avaliações' },
            { id: 'cartao', label: 'Cartão Digital' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`p-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-405 text-blue-450 text-blue-400 bg-blue-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic content panel scrollable */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: GENERAL REGISTRATION INFO */}
          {activeTab === 'geral' && (
            <div className="space-y-6">
              {/* Personal Data */}
              <div className="bg-[#09090B]/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 border-b border-slate-800/80">
                  <div className="relative group shrink-0">
                    <img
                      src={player.avatarUrl}
                      alt={player.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-blue-500/20 shadow-md"
                    />
                    <label className="absolute inset-0 bg-black/75 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[9px] text-white font-semibold text-center p-1">
                      <RefreshCw className="w-4 h-4 mb-1 text-blue-400 group-hover:rotate-180 transition-transform duration-500" />
                      <span>Alterar Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              onChangeAvatar(player.id, reader.result as string);
                              triggerToast('Foto do atleta carregada com sucesso!');
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <span className="text-[10px] text-blue-400 font-mono font-bold tracking-wider uppercase block">{player.category} • {player.position}</span>
                    <h4 className="text-base font-bold text-white mt-0.5">{player.name}</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Carregue qualquer imagem do seu dispositivo para atualizar instantaneamente o prontuário.</p>
                  </div>
                </div>

                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest text-[9px] mb-1">Informações Cadastrais</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Nome Completo:</span>
                    <span className="text-white font-semibold mt-0.5 block">{player.name}</span>
                  </div>
                  {player.nickname && (
                    <div>
                      <span className="text-slate-500 block">Apelido:</span>
                      <span className="text-white font-mono mt-0.5 block truncate">"{player.nickname}"</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500 block">Nascimento:</span>
                    <span className="text-slate-300 font-mono mt-0.5 block">{player.birthDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">CPF do Atleta:</span>
                    <span className="text-slate-300 font-mono mt-0.5 block">{player.cpf || 'Não informado'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Posição de Preferência:</span>
                    <span className="text-slate-300 font-mono mt-0.5 block">{player.position}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Pé Dominante:</span>
                    <span className="text-slate-300 font-mono mt-0.5 block">{player.foot}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Categoria Esportiva:</span>
                    <span className="text-blue-400 font-mono font-bold mt-0.5 block">{player.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Data de Entrada:</span>
                    <span className="text-slate-300 font-mono mt-0.5 block">{player.joinDate}</span>
                  </div>
                </div>
              </div>

              {/* Responsible Guardian for Minors */}
              <div className="bg-[#09090B]/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider text-[10px]">Responsável Legal</h3>
                  {isMinor && (
                    <span className="px-2 py-0.5 text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/10 rounded-md">
                      Exigência Legal Ativa
                    </span>
                  )}
                </div>
                {player.guardian ? (
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block">Nome do Responsável:</span>
                      <span className="text-slate-200 font-semibold block mt-0.5">{player.guardian.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Parentesco:</span>
                      <span className="text-slate-300 font-mono block mt-0.5">{player.guardian.relationship}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Telefone de Urgência:</span>
                      <span className="text-slate-205 text-slate-200 font-mono block mt-0.5 font-bold">{player.guardian.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">CPF do Responsável:</span>
                      <span className="text-slate-300 font-mono block mt-0.5">{player.guardian.cpf}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-rose-500/5 border border-rose-500/15 rounded-xl text-rose-450 text-rose-400 text-xs">
                    <ShieldAlert className="w-5 h-5 shrink-0 animate-pulse" />
                    <div>
                      <strong>Atenção:</strong> Atleta menor de idade e desprovido de responsável cadastrado! Regularize para liberação jurídica.
                    </div>
                  </div>
                )}
              </div>

              {/* Secure documents check list */}
              <div className="bg-[#09090B]/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800/80 pb-2 uppercase tracking-wider text-[10px]">Garantia Eletrônica e Documentos</h3>
                <div className="space-y-2.5">
                  {player.documents.map((doc) => (
                    <div key={doc.id} className="p-3.5 bg-[#09090B] border border-slate-800/80 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-205 text-slate-200 block">{doc.type}</span>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{doc.name || 'Arquivo digital ausente'}</span>
                      </div>
                      <div>
                        <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-lg ${
                          doc.status === 'APPROVED'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/10'
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/10'
                        }`}>
                          {doc.status === 'APPROVED' ? 'APROVADO' : 'PENDENTE'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HISTORIC TIMELINE & ADDEVENT FORM */}
          {activeTab === 'historico' && (
            <div className="space-y-6">
              {/* Form to log a new match performance or discipline warning */}
              <form onSubmit={handleAddEvent} className="bg-[#09090B]/60 p-5 border border-slate-800 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider text-[10px]">Adicionar Ocorrência / Súmula</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="col-span-2">
                    <label className="text-[10px] text-slate-500 block mb-1">Título do Evento</label>
                    <input
                      type="text"
                      placeholder="Ex: Marcou gol da vitória, Advertência verbal etc."
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-[#09090B] border border-slate-800 rounded-lg p-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Tipo de Registro</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full bg-[#09090B] border border-slate-800 rounded-lg p-2 text-slate-300 focus:outline-none focus:border-blue-500"
                    >
                      <option value="PERFORMANCE">Desempenho Esportivo (+)</option>
                      <option value="DISCIPLINARY">Ocorrência Disciplinar (-)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Descrição</label>
                    <input
                      type="text"
                      placeholder="Breves notas detalhadas..."
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full bg-[#09090B] border border-slate-800 rounded-lg p-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  {newType === 'PERFORMANCE' && (
                    <>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Gols Marcados</label>
                        <select 
                          value={newGoals} 
                          onChange={(e) => setNewGoals(e.target.value)} 
                          className="w-full bg-[#09090B] border border-slate-800 rounded-lg p-2 text-slate-300 focus:outline-none"
                        >
                          <option value="0">0 Gols</option>
                          <option value="1">1 Gol</option>
                          <option value="2">2 Gols</option>
                          <option value="3">3+ Gols</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Exibiu Cartão Amarelo?</label>
                        <select 
                          value={newYellow} 
                          onChange={(e) => setNewYellow(e.target.value)} 
                          className="w-full bg-[#09090B] border border-slate-800 rounded-lg p-2 text-slate-300 focus:outline-none"
                        >
                          <option value="0">Não</option>
                          <option value="1">Sim (1 Cartão)</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg text-xs transition shadow cursor-pointer active:scale-95"
                >
                  Registrar na Linha do Tempo
                </button>
              </form>

              {/* Historic feed */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest text-[10px]">Linha de Vida Esportiva</h3>
                <div className="relative border-l-2 border-slate-850 pl-4 ml-2 space-y-5">
                  {player.history.map((evt) => (
                    <div key={evt.id} className="relative">
                      {/* Circle bullet representation */}
                      <span className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border border-slate-900 ${
                        evt.type === 'DISCIPLINARY' ? 'bg-rose-500' : 'bg-blue-500'
                      }`}></span>
                      <div className="bg-[#09090B]/60 border border-slate-800 p-4 rounded-xl">
                        <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                          <span className="text-slate-500">{evt.date}</span>
                          <span className={`font-semibold ${evt.type === 'DISCIPLINARY' ? 'text-rose-450 text-rose-400' : 'text-blue-400'}`}>
                            {evt.type === 'DISCIPLINARY' ? 'DISCIPLINAR' : 'ESPORTIVO'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-200">{evt.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">{evt.description}</p>
                        {evt.stats && (
                          <div className="flex gap-2.5 mt-2.5 pt-2 border-t border-slate-800/40 text-[9px] font-mono text-slate-500">
                            {evt.stats.goals && evt.stats.goals > 0 ? (
                              <span className="text-emerald-400 font-bold">⚽ Gols: {evt.stats.goals}</span>
                            ):null}
                            {evt.stats.yellowCards && evt.stats.yellowCards > 0 ? (
                              <span className="text-yellow-500 font-bold">🟨 Cartão Amarelo</span>
                            ):null}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BILLINGS RECONCILIATION */}
          {activeTab === 'mensalidades' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                <h4 className="text-xs font-bold text-blue-450 text-blue-400 mb-1 uppercase tracking-wider text-[10px]">Conciliação de Mensalidades</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Clique para quitar débitos em atraso ou alterar históricos. Isto influencia os alertas financeiros gerais do clube em tempo real.
                </p>
              </div>

              <div className="space-y-3">
                {player.subscriptions.map((sub) => (
                  <div key={sub.id} className="p-4 bg-[#09090B]/60 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block">Vencimento: {sub.dueDate}</span>
                      <span className="text-sm font-bold text-white mt-1 block">R$ {sub.amount},00</span>
                      {sub.paidAt && (
                        <span className="text-[9px] text-slate-500 block mt-1">Pago em: {sub.paidAt} via {sub.paymentMethod}</span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          onToggleFeeStatus(player.id, sub.id);
                          triggerToast('Fatura de mensalidade atualizada com sucesso!');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                          sub.status === 'PAID'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 hover:bg-emerald-500/20'
                            : sub.status === 'OVERDUE'
                            ? 'bg-rose-500/10 text-rose-450 text-rose-400 border border-rose-500/10 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/20'
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/10 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/20'
                        }`}
                      >
                        {sub.status === 'PAID' ? '✓ PAGO' : sub.status === 'OVERDUE' ? '⌛ ATRASADO (QUITAR)' : '⌛ PENDENTE (QUITAR)'}
                      </button>
                      {sub.status !== 'PAID' && (
                        <button
                          onClick={() => handleSendPaymentReminderWhatsApp(sub)}
                          className="px-3 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-450 text-emerald-450 text-emerald-400 border border-emerald-555 border-emerald-500/25 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Enviar lembrete de mensalidade no WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-450" />
                          Cobrar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PHYSICAL PERFORMANCE INDEX */}
          {activeTab === 'avaliacao' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#09090B]/40 rounded-xl border border-slate-800 space-y-1">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest text-[10px]">Avaliações Médicas & Quadrimestrais</h4>
                <p className="text-[10px] text-slate-400">Indicadores táticos avaliados em jogos treino pela comissão.</p>
              </div>

              {player.evaluations.map((ev) => (
                <div key={ev.id} className="bg-[#09090B]/40 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-[10px] font-bold text-slate-300 font-mono">Boletim: {ev.date}</span>
                    <span className="text-[10px] text-slate-500">Avaliador: {ev.evaluatorName}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Visão Tática', val: ev.tactical, desc: 'Aproveitamento espacial' },
                      { label: 'Poder Técnico', val: ev.technical, desc: 'Passe, finalização, drible' },
                      { label: 'Condicionamento Físico', val: ev.physical, desc: 'Resistência geral' },
                      { label: 'Disciplina & Postura', val: ev.discipline, desc: 'Cartões, respeito tático' }
                    ].map((metric) => (
                      <div key={metric.label} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-405 text-slate-400 font-semibold">{metric.label}</span>
                          <span className="font-mono text-blue-400 font-bold">{metric.val}/100</span>
                        </div>
                        <div className="w-full bg-[#09090B] rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-1.5 rounded-full bg-blue-550 bg-blue-500 transition-all"
                            style={{ width: `${metric.val}%` }}
                          ></div>
                        </div>
                        <span className="text-[9px] text-slate-500 block">{metric.desc}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-between text-[10px] font-mono text-slate-500">
                    <span>Assiduidade em Treinos</span>
                    <span className="font-bold text-slate-200">{ev.attendanceRate}% de Presença</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: DIGITAL PLAYER ID CARD */}
          {activeTab === 'cartao' && (
            <div className="space-y-6 flex flex-col items-center">
              
              {/* Premium Athletic Digital Ticket Rendering Card */}
              <div className="w-71 sm:w-80 bg-gradient-to-br from-[#09090B] via-zinc-950 to-[#111113] border border-blue-500/30 rounded-2xl p-6 shadow-[0_0_40px_-15px_rgba(59,130,246,0.3)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-xl rounded-full"></div>
                
                {/* Header Badge ID */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500 flex items-center justify-center font-black text-[9px] text-blue-450 text-blue-400">
                      ★
                    </div>
                    <span className="text-[9px] font-bold text-slate-200 tracking-wider font-sans uppercase">CLUB PRO DIGITAL ID</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[8px] font-bold rounded-lg tracking-wider ${
                    player.status === 'ACTIVE' 
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/10' 
                      : 'bg-rose-500/10 text-rose-455 text-rose-400 border border-rose-500/10'
                  }`}>
                    {player.status === 'ACTIVE' ? 'LIBERADO' : 'RESTREITO'}
                  </span>
                </div>

                {/* Body metadata side-by-side */}
                <div className="flex gap-4">
                  <div className="space-y-3 flex-1 min-w-0">
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Nome do Atleta</span>
                      <span className="text-xs font-black text-white truncate block">{player.name}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Categoria</span>
                      <span className="text-xs font-bold text-blue-400 font-mono block">{player.category}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Posição</span>
                      <span className="text-[10px] font-bold text-slate-300 font-mono block">{player.position}</span>
                    </div>
                  </div>

                  {/* Picture container */}
                  <div className="text-center shrink-0">
                    <img
                      src={player.avatarUrl}
                      alt={player.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-xl object-cover border-2 border-slate-800 shadow-md"
                    />
                    <span className="text-[8px] text-slate-500 font-mono mt-1.5 block">Nasc: {player.birthDate}</span>
                  </div>
                </div>

                {/* Footer and Security QR Code */}
                <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between bg-[#111113]/80 p-2.5 rounded-xl">
                  <div className="space-y-1">
                    <span className="text-[8px] text-slate-500 block font-mono">Licença: {player.card.cardNumber}</span>
                    <span className="text-[8px] text-slate-400 block font-mono font-bold">Lançamento: {player.joinDate}</span>
                  </div>
                  {/* Mock representation of QR code */}
                  <div className="p-1 bg-white rounded-lg shrink-0">
                    <QrCode className="w-8 h-8 text-black" />
                  </div>
                </div>
              </div>

              {/* Share & Download actions */}
              <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-[320px]">
                <button
                  onClick={handleExportCard}
                  className="flex-1 bg-[#18181b] hover:bg-zinc-800 text-slate-200 text-xs px-3 py-2.5 rounded-xl font-semibold transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-slate-800"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  Gerar PDF Termo
                </button>
                <button
                  onClick={handleExportWhatsApp}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-2.5 rounded-xl font-semibold transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-lg shadow-emerald-500/10 animate-pulse-subtle"
                >
                  <MessageCircle className="w-4 h-4" />
                  Exportar WhatsApp
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
