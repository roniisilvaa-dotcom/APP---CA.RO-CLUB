import React, { useState } from 'react';
import { Player, FinancialEntry } from '../types';
import { ArrowUpRight, ArrowDownRight, Filter, ShieldAlert, MessageCircle, Plus } from 'lucide-react';

interface FinancialViewProps {
  players: Player[];
  financials: FinancialEntry[];
  onToggleFeeStatus: (playerId: string, feeId: string) => void;
  onAddTransaction: (entry: Omit<FinancialEntry, 'id'>) => void;
}

export default function FinancialView({
  players,
  financials,
  onToggleFeeStatus,
  onAddTransaction
}: FinancialViewProps) {
  const [filterType, setFilterType] = useState<'ALL' | 'REVENUE' | 'EXPENSE'>('ALL');
  
  // State for recording a quick invoice movement
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Manutenção');
  const [movementType, setMovementType] = useState<'REVENUE' | 'EXPENSE'>('EXPENSE');

  const handleCreateMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amount) return;
    onAddTransaction({
      date: new Date().toISOString().split('T')[0],
      type: movementType,
      category,
      amount: parseFloat(amount) || 0,
      description: desc,
      status: 'COMPLETED'
    });
    setDesc('');
    setAmount('');
  };

  // Math aggregates
  const totalRevenues = financials.filter(f => f.type === 'REVENUE').reduce((sum, f) => sum + f.amount, 0);
  const totalExpenses = financials.filter(f => f.type === 'EXPENSE').reduce((sum, f) => sum + f.amount, 0);
  const netProfit = totalRevenues - totalExpenses;

  const totalMonthlyOverdueAmount = players.reduce((acc, p) => {
    return acc + p.subscriptions.filter(s => s.status === 'OVERDUE').reduce((sum, s) => sum + s.amount, 0);
  }, 0);

  const filteredLogs = financials.filter(f => {
    if (filterType === 'ALL') return true;
    return f.type === filterType;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Caixa do Time & Rachão</h1>
        <p className="text-xs text-slate-400">Controle financeiro do time de várzea: caixinha de jogo, mensalidades dos boleiros, patrocínios locais e churrasco de pós-jogo.</p>
      </div>

      {/* Grid summarizing cash health indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#111113] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
          <span className="text-xs text-slate-450 text-slate-400 font-medium uppercase tracking-wider">Caixinha do Time</span>
          <div className="mt-3">
            <span className={`text-3xl font-bold block ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-405 text-rose-400'}`}>
              R$ {netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">Saldo consolidado em caixa</span>
          </div>
        </div>

        <div className="bg-[#111113] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
          <span className="text-xs text-slate-405 text-slate-400 font-medium uppercase tracking-wider">Mensalidades & Aportes</span>
          <div className="mt-3">
            <span className="text-3xl font-bold text-white block">
              R$ {totalRevenues.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center mt-1 font-mono">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              Rachões, festas e patrocinadores
            </span>
          </div>
        </div>

        <div className="bg-[#111113] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
          <span className="text-xs text-rose-400 font-medium uppercase tracking-wider font-mono">Boleiros com Débito</span>
          <div className="mt-3">
            <span className="text-3xl font-bold text-rose-400 block">
              R$ {totalMonthlyOverdueAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-500 flex items-center mt-1">
              Valores em atraso por cobrar
            </span>
          </div>
        </div>

        <div className="bg-[#111113] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
          <span className="text-xs text-slate-405 text-slate-400 font-medium uppercase tracking-wider">Despesas de Campo</span>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-205 text-slate-200 block">
              R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-500 flex items-center mt-1">
              Água, bolas, lavagem de coletes e churrasco
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column - Ledger sheet and logs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111113] border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest text-[11px]">Livro Diário de Lançamentos</h3>
              <div className="flex gap-1.5 self-start sm:self-auto">
                {[
                  { id: 'ALL', label: 'Todos' },
                  { id: 'REVENUE', label: 'Receitas' },
                  { id: 'EXPENSE', label: 'Despesas' }
                ].map(b => (
                  <button
                    key={b.id}
                    onClick={() => setFilterType(b.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      filterType === b.id
                        ? 'bg-blue-600/10 text-blue-405 text-blue-400 border border-blue-500/20 shadow-inner'
                        : 'bg-[#09090B] border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-350 font-sans">
                <thead>
                  <tr className="border-b border-slate-800/80 text-slate-400 text-[10px] uppercase tracking-wider">
                    <th className="pb-3">Data</th>
                    <th className="pb-3">Descrição Geral</th>
                    <th className="pb-3">Categoria</th>
                    <th className="pb-3 text-right">Valor Líquido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#18181B]/40 transition-colors">
                      <td className="py-3.5 font-mono text-slate-500">{log.date}</td>
                      <td className="py-3.5 font-semibold text-slate-200">{log.description}</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 bg-[#09090B] border border-slate-800 text-slate-400 rounded-md text-[10px]">
                          {log.category}
                        </span>
                      </td>
                      <td className={`py-3.5 text-right font-bold font-mono ${
                        log.type === 'REVENUE' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {log.type === 'REVENUE' ? `+ R$ ${log.amount}` : `- R$ ${log.amount}`}
                      </td>
                    </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500 font-medium">Nenhum lançamento sob este filtro.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAINEL DE COBRANÇA DE ALUNOS COM INTEGRAÇÃO DE WHATSAPP */}
          {(() => {
            const outstandingList: Array<{ player: Player; fee: any }> = [];
            players.forEach(p => {
              p.subscriptions.forEach(s => {
                if (s.status === 'OVERDUE' || s.status === 'PENDING') {
                  outstandingList.push({ player: p, fee: s });
                }
              });
            });

            return (
              <div className="bg-[#111113] border border-slate-800 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest text-[11px] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      Cobrança Amistosa (Rachão & Vaquinha)
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Notifique pendências de mensalidades e rateios diretamente aos boleiros ou pais pelo WhatsApp.</p>
                  </div>
                  <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded font-mono font-bold">
                    {outstandingList.length} Boleiros Pendentes
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1">
                  {outstandingList.map(({ player, fee }) => {
                    const isOverdue = fee.status === 'OVERDUE';
                    return (
                      <div 
                        key={`${player.id}-${fee.id}`} 
                        className={`p-4 bg-[#09090b] border rounded-xl flex items-center justify-between gap-3 text-xs leading-normal transition-all hover:bg-[#0f0f12] ${
                          isOverdue ? 'border-rose-500/20 bg-rose-500/5' : 'border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={player.avatarUrl} 
                            alt={player.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow" 
                          />
                          <div>
                            <span className="font-bold text-white block max-w-[150px] truncate">{player.name}</span>
                            <span className="text-[10px] text-slate-500 block font-mono mt-0.5 mt-0.5">
                              {player.category} • Venc: <strong className={isOverdue ? 'text-rose-400' : 'text-slate-400'}>{fee.dueDate}</strong>
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`font-mono font-bold block ${isOverdue ? 'text-rose-450 text-rose-400' : 'text-amber-550 text-amber-550 text-amber-500'}`}>
                            R$ {fee.amount},00
                          </span>
                          <button
                            onClick={() => {
                              const phoneNum = player.guardian?.phone 
                                ? player.guardian.phone.replace(/\D/g, '') 
                                : '';
                              const text = `*CAIXINHA DO TIME — MENSALIDADE DA VÁRZEA*\n\n` +
                                `Fala, campeão! Tudo certo? Passando para lembrar da contribuição/caixinha do time referente à rodada/mensalidade de *${fee.dueDate}* no valor de *R$ ${fee.amount},00*.\n\n` +
                                `Esse valor é fundamental para manter os fardamentos em dia, pagar as bolas e o rateio do nosso campo/churrasco de fim de semana.\n\n` +
                                `Boleiro: *${player.name}* ${player.nickname ? `("${player.nickname}")` : ''}\n` +
                                `Súmula de Inscrição: *${player.card.cardNumber}*\n\n` +
                                `Agradecemos a contribuição com o nosso glorioso futebol amador! Se puder fortalecer o PIX do clube hoje, manda o comprovante por aqui. Tamo junto!`;
                              
                              const url = phoneNum 
                                ? `https://api.whatsapp.com/send?phone=55${phoneNum}&text=${encodeURIComponent(text)}`
                                : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
                              window.open(url, '_blank');
                            }}
                            className="mt-2 px-2.5 py-1 bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
                            title="Cobrar pelo Whatsapp"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                            Cobrar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {outstandingList.length === 0 && (
                    <div className="col-span-full py-8 text-center text-slate-500 border border-slate-800 border-dashed rounded-xl bg-[#09090B]/30">
                      Nenhuma parcela em aberto no momento. Todos os alunos estão em dia!
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Right column - Expense logging form and quick alerts */}
        <div className="space-y-6">
          <form onSubmit={handleCreateMovement} className="bg-[#111113] border border-slate-800 p-6 rounded-2xl space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest text-[11px]">Lançar Novo Movimento</h3>
              <p className="text-[10px] text-slate-500 mt-1">Registre novos aportes, vendas esportivas ou desembolsos operacionais.</p>
            </div>

            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setMovementType('REVENUE');
                  setCategory('Mensalidades');
                }}
                className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all tracking-wider border cursor-pointer ${
                  movementType === 'REVENUE'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-555 border-emerald-500/30 shadow'
                    : 'bg-[#09090B] text-slate-500 border-slate-800 hover:text-slate-400'
                }`}
              >
                💵 Receita (Aporte)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMovementType('EXPENSE');
                  setCategory('Manutenção');
                }}
                className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all tracking-wider border cursor-pointer ${
                  movementType === 'EXPENSE'
                    ? 'bg-rose-500/10 text-rose-450 text-rose-400 border-rose-500/30'
                    : 'bg-[#09090B] text-slate-500 border-slate-800 hover:text-slate-400'
                }`}
              >
                💸 Despesa (Custo)
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Descrição do Lançamento</label>
                <input
                  type="text"
                  placeholder={movementType === 'REVENUE' ? "Ex: Uniformes novos Sub-15 vendidos" : "Ex: Nota Fiscal nº 994 - Arbitragem"}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-[#09090B] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Valor Nominal (R$)</label>
                <input
                  type="number"
                  placeholder="Ex: 350.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#09090B] border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Categoria de Rateio</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#09090B] border border-slate-800 rounded-lg p-2.5 text-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
                >
                  {movementType === 'REVENUE' ? (
                    <>
                      <option value="Mensalidades">Mensalidades de Atletas</option>
                      <option value="Doação (Patrocinador)">Patrocínio / Doação</option>
                      <option value="Venda de Uniforme">Venda de Material / Uniforme</option>
                      <option value="Inscrição de Torneio">Inscrições de Copas</option>
                      <option value="Outros">Outras Receitas Diversas</option>
                    </>
                  ) : (
                    <>
                      <option value="Arbitragem">Taxa de Arbitragem</option>
                      <option value="Manutenção">Manutenção Geral do Gramado</option>
                      <option value="Equipamento">Equipamento de Treino (Bolas, Coletes)</option>
                      <option value="Confraternização">Gasolina & Viagens coletivas</option>
                      <option value="Alimentação">Suplementos & Lanches de atletas</option>
                      <option value="Outros">Outras Despesas Diversas</option>
                    </>
                  )}
                </select>
              </div>

              <button
                type="submit"
                className={`w-full text-white font-bold py-2.5 rounded-lg text-xs transition active:scale-[0.98] shadow-md cursor-pointer ${
                  movementType === 'REVENUE'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/15'
                    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-950/15'
                }`}
              >
                Salvar Movimentação
              </button>
            </div>
          </form>

          {/* Quick billing policy widget */}
          <div className="bg-[#111113] border border-slate-805 border-slate-800 rounded-2xl p-5 text-xs text-slate-400 leading-relaxed text-justify space-y-3">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5 uppercase text-[10px] tracking-wider text-rose-400">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              Alerta de Bloqueio Automático
            </h4>
            <p>
              Atletas suspensos por inadimplência fiduciária superior a 45 dias não terão acesso à liberação de súmulas nem ao cartão QR Code em competições interclubes organizadas pela Federação, em conformidade com as regras transacionais.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
