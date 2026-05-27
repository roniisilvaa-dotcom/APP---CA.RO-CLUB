import React, { useState } from 'react';
import { Database, ShieldAlert, BadgeCent, Sparkles, Sliders, Server, UserCheck, Layout, ListCollapse } from 'lucide-react';

export default function SaaSSpecsView() {
  const [activeSection, setActiveSection] = useState<'posicionamento' | 'visao' | 'perfis' | 'modulos' | 'ficha' | 'database' | 'regras_api' | 'monetizacao'>('posicionamento');

  return (
    <div className="bg-[#111113] border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-2xl">
      <div className="flex flex-col lg:flex-row gap-6 mb-6 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold font-sans text-blue-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            Manuais de Engenharia e Produto: Club OS
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Selecione uma área abaixo para navegar pelas especificações técnicas, arquitetura de banco de dados PostgreSQL e regras de negócio.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
        {[
          { id: 'posicionamento', label: '1 & 2. Posicionar', icon: Sparkles },
          { id: 'visao', label: '3. Perfis', icon: UserCheck },
          { id: 'perfis', label: '4. Módulos SaaS', icon: Layout },
          { id: 'modulos', label: '5 & 6. Ficha Técnico', icon: ListCollapse },
          { id: 'ficha', label: '7 & 8. Cartões/Glow', icon: Sliders },
          { id: 'database', label: '12. Banco real', icon: Database },
          { id: 'regras_api', label: '13 & 14. Regras/Endp', icon: Server },
          { id: 'monetizacao', label: '15-18. Finanças/Planos', icon: BadgeCent }
        ].map((sec) => {
          const Icon = sec.icon;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                activeSection === sec.id
                  ? 'bg-blue-600/10 border-blue-500 text-blue-450 text-blue-400 font-semibold shadow-inner'
                  : 'bg-[#09090B] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="w-5 h-5 mb-1.5" />
              <span className="text-[10px] leading-tight font-medium">{sec.label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-[#09090B] p-5 rounded-xl border border-slate-850 border-slate-800 font-sans leading-relaxed text-sm overflow-y-auto max-h-[600px] text-slate-350">
        {activeSection === 'posicionamento' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-2 border-b border-slate-800 pb-1.5 uppercase tracking-wider text-[12px] text-blue-400">SEÇÃO 1 — POSICIONAMENTO E PROPÓSITO DO PRODUTO</h3>
            <p>
              <strong className="text-blue-400">Nome Conceitual do Produto:</strong> <strong>Club OS (ou Club Pro ERP)</strong> - O sistema definitivo para gestão esportiva, administrativa e financeira de clubes de futebol de base, escolinhas, projetos sociais e seleções de várzea.
            </p>
            <p>
              <strong className="text-blue-400">Proposta de Valor:</strong> Colocar os clubes de futebol amador e de base no patamar de grandes equipes internacionais através da padronização e digitalização de todos os processos operacionais, de captação de talentos e de gestão financeira.
            </p>
            <p className="font-bold text-white uppercase tracking-wider text-[10px] pt-2">Dificuldades Reais que o Sistema Resolve:</p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-400">
              <li><strong>Falta de prontuário do jogador:</strong> Clubes de futebol amador perdem o histórico de passagem, gols, e exames médicos importantes quando transferem o jogador de forma informal ou mudam de comissão técnica.</li>
              <li><strong>Inadimplência de mensalidades:</strong> Em escolinhas e clubes de base, pais de atletas esquecem mensalidades recorrentes, as planilhas se tornam obsoletas e o clube opera no vermelho.</li>
              <li><strong>Pais sem controle de menores:</strong> Crianças treinam sem autorizações legais assinadas ou sem atestado médico renovado, criando risco jurídico imenso para os diretores do time.</li>
              <li><strong>Danos com extravio de documentos físicos:</strong> RG, prontuários de vacinação e contratos perdidos em salas de almoxarifado úmidas.</li>
            </ul>
            <p className="bg-[#111113] p-4 border border-slate-800 rounded-xl">
              <strong className="text-blue-400 block mb-1">Discurso Comercial Premium:</strong> 
              <i>"Parem de gerenciar seu clube usando cadernos e WhatsApp. O Club OS reúne tudo — desde a ficha médica, o desempenho de campo rastreado por nota técnica, até o controle automático de mensalidades por PIX — em uma única plataforma premium para profissionalizar seu negócio esportivo."</i>
            </p>

            <h3 className="text-base font-bold text-white mt-6 mb-2 border-b border-slate-800 pb-1.5 uppercase tracking-wider text-[12px] text-blue-400">SEÇÃO 2 — VISÃO ESTRATÉGICA DO CLUBE</h3>
            <p className="text-xs">
              O clube é o núcleo operacional. A plataforma serve como o ERP definitivo do esporte. O sistema ajuda os diretores nas seguintes áreas cruciais de controle:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="bg-[#111113] p-4 rounded-xl border border-slate-800">
                <h4 className="font-semibold text-slate-100 flex items-center gap-1.5 text-xs"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Operacional & Blindagem Jurídica</h4>
                <p className="text-[11px] text-slate-400 mt-1">Garantia de que nenhum atleta menor de idade treinará sem um responsável legal com CPF válido associado no prontuário digital e sem o Atestado Médico Ativo.</p>
              </div>
              <div className="bg-[#111113] p-4 rounded-xl border border-slate-800">
                <h4 className="font-semibold text-slate-100 flex items-center gap-1.5 text-xs"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Redução de Inadimplência</h4>
                <p className="text-[11px] text-slate-400 mt-1">Alertas automatizados sobre mensalidades vencidas bloqueiam a emissão de vistos, súmulas coletivas e cartões de treino do jogador, incentivando sua regularização física.</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'visao' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-2 border-b border-slate-800 pb-1.5 uppercase tracking-wider text-[12px] text-blue-400">SEÇÃO 3 — PERFIS DE USUÁRIO E PERMISSÕES</h3>
            <p className="text-xs text-slate-400">O Club OS opera sob o modelo <strong>RBAC (Role Based Access Control)</strong> altamente protegido, garantindo a privacidade das informações físicas e cadastrais dos menores.</p>
            
            <div className="space-y-3">
              <div className="bg-[#111113] p-4 rounded-xl border border-slate-805 border-slate-800">
                <h4 className="font-bold text-slate-200 text-xs">1. Presidente / Dono do Clube</h4>
                <p className="text-[11px] text-slate-400 mt-1"><strong className="text-blue-450 text-blue-400">Objetivo:</strong> Ver KPIs macros de faturamento global, folha salarial de atletas de alto nível, despesas gerais e investimentos fiscais.</p>
                <p className="text-[11px] text-slate-500"><strong className="text-yellow-500 font-mono">Permissão:</strong> Leitura e escrita irrestrita em todos os módulos fiscais, esportivos e diretivos de categorias.</p>
              </div>
              <div className="bg-[#111113] p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-slate-200 text-xs">2. Diretor / Gestor do Clube</h4>
                <p className="text-[11px] text-slate-400 mt-1"><strong className="text-blue-450 text-blue-400">Objetivo:</strong> Supervisionar transferências, acompanhar renovações de patroleis, aprovar documentação do onboarding.</p>
                <p className="text-[11px] text-slate-500"><strong className="text-yellow-500 font-mono">Permissão:</strong> Acesso total a cadastros, relatórios e documentos, mas não permite desativar histórico de auditorias.</p>
              </div>
              <div className="bg-[#111113] p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-slate-200 text-xs">3. Tesoureiro / Diretor Financeiro</h4>
                <p className="text-[11px] text-slate-400 mt-1"><strong className="text-blue-450 text-blue-400">Objetivo:</strong> Baixar faturas, renegociar mensalidades, conceder bolsas, registrar despesas operacionais do clube.</p>
                <p className="text-[11px] text-slate-500"><strong className="text-yellow-500 font-mono">Permissão:</strong> Domínio Financeiro completo. Bloqueado de alterações no prontuário de avaliações médicas confidenciais.</p>
              </div>
              <div className="bg-[#111113] p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-slate-200 text-xs">4. Comissão Técnica (Treinador & Auxiliares)</h4>
                <p className="text-[11px] text-slate-400 mt-1"><strong className="text-blue-450 text-blue-400">Objetivo:</strong> Avaliar atletas técnica/taticamente, controlar frequências e registrar suspensões no prontuário de campo.</p>
                <p className="text-[11px] text-slate-500"><strong className="text-yellow-500 font-mono">Permissão:</strong> Modificação completa sobre Notas, Súmulas e Presenças de treino. Bloqueado de receitas contábeis.</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'perfis' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-2 border-b border-slate-800 pb-1.5 uppercase tracking-wider text-[12px] text-blue-400">SEÇÃO 4 — ESTRUTURA METÓDICA DE MÓDULOS</h3>
            <div className="space-y-3 text-xs font-mono">
              <div className="p-4 bg-[#111113] rounded-xl border border-slate-800">
                <span className="text-blue-400 font-bold block mb-1">M1: Dashboard Executivo</span>
                Análise macro de faturamento global, índice de adimplência, contagem de ativos por categorias federadas e controle de pendências severas.
              </div>
              <div className="p-4 bg-[#111113] rounded-xl border border-slate-800">
                <span className="text-blue-400 font-bold block mb-1">M2 & M3: Prontuário Clínico & Cadastro Mestre</span>
                Ficha mestre contendo campos como CPF, RG, perna dominante, posição, peso acadêmico, altura e controles de carteira de vacinas.
              </div>
              <div className="p-4 bg-[#111113] rounded-xl border border-slate-800">
                <span className="text-blue-400 font-bold block mb-1">M4 & M5: Responsabilidade e Validação Legal</span>
                Associação compulsória de CPFs de pais para atletas menores de idade na plataforma civil.
              </div>
              <div className="p-4 bg-[#111113] rounded-xl border border-slate-800">
                <span className="text-blue-400 font-bold block mb-1">M10 & M11: Motor de Mensalidades Financeiras</span>
                Gestão contábil e transicional integrada ao visto de jogo do atleta, permitindo suspensões do prontuário digital pelo financeiro.
              </div>
            </div>
          </div>
        )}

        {activeSection === 'modulos' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-2 border-b border-slate-800 pb-1.5 uppercase tracking-wider text-[12px] text-blue-400">SEÇÃO 5 — ESTRUTURA COMPLETA DA FICHA DO JOGADOR</h3>
            <p className="text-xs text-slate-400">Campos metódicos estruturados para visualização em telas de alta densidade no Club OS:</p>
            <table className="w-full text-xs text-left text-slate-300 border border-slate-800/80 mb-6">
              <thead>
                <tr className="bg-[#111113] text-slate-100 border-b border-slate-805 border-slate-805">
                  <th className="p-3">Bloco de Dados</th>
                  <th className="p-3">Campos Cruciais do Sistema</th>
                  <th className="p-3">Regra de Negócio Crucial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="p-3 font-bold text-white text-[11px]">Dados Pessoais</td>
                  <td className="p-3">Nome Completo, Apelido, CPF, Nascimento, Contatos do Jogador.</td>
                  <td className="p-3 text-slate-400">CPF obrigatório; vinculação a responsáveis se menor de 18 federado.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white text-[11px]">Dados Esportivos</td>
                  <td className="p-3">Posição Primária, Pé Dominante, Peso, Altura, Categoria, Visto.</td>
                  <td className="p-3 text-slate-400">Categorização civil (Sub-15, Sub-17) calibrada pela data de nascimento.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white text-[11px]">Responsável Legal</td>
                  <td className="p-3">Grau de Parentesco, CPF, Telefone de Urgência, Nome Completo.</td>
                  <td className="p-3 text-slate-400 font-bold text-yellow-500">MANDATÓRIO se Nascimento acusar idade &lt; 18.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white text-[11px]">Documentação Eletrônica</td>
                  <td className="p-3">RG Escaneado, CPF, Atestado de Saúde válido.</td>
                  <td className="p-3 text-slate-400">Atestado médico vencido suspende temporariamente o visto ativo de campo.</td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-base font-bold text-white mt-6 mb-2 border-b border-slate-800 pb-1.5 uppercase tracking-wider text-[12px] text-blue-400">SEÇÃO 6 — LINHA DO TEMPO E REGISTRO HISTÓRICO</h3>
            <p className="text-xs">
              Módulo de auditoria esportiva. Registros perpétuos que geram histórico visual:
            </p>
            <div className="bg-[#111113] border border-slate-800 p-4 rounded-xl text-xs leading-relaxed space-y-2.5 font-mono">
              <p className="text-blue-400">[20/02/2026] Registro Inicial • Criado sob categoria ativa Sub-15.</p>
              <p className="text-blue-550 text-blue-400">[12/03/2026] Exame de Cardiologia • Aprovado pelo Dr. Henrique Neto.</p>
              <p className="text-emerald-400">[15/05/2026] Súmula do Jogo • Registrado 1 gol, 1 assistência oficial.</p>
              <p className="text-rose-455 text-rose-400">[20/05/2026] Cartão Amarelo • Punido na rodada 4 por conduta antidesportiva.</p>
            </div>
          </div>
        )}

        {activeSection === 'ficha' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-2 border-b border-slate-800 pb-1.5 uppercase tracking-wider text-[12px] text-blue-400">SEÇÃO 7 — CARTÃO DIGITAL PREMIUM E VALIDATÓRIO</h3>
            <p className="text-xs">
              Módulo de identidade esportiva digital de alto nível contendo as seguintes tecnologias embarcadas:
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-2 text-xs text-slate-400">
              <li><strong>Interface de Ficha:</strong> Foto do garoto, brasão de licença, e dados de nascimento para atestar autenticidade esportiva de categoria.</li>
              <li><strong>Barramento de Pendências:</strong> Cartão muda de cor para âmbar ou vermelho caso haja inadimplência financeira superior a 45 dias ou falta de atestados civis.</li>
              <li><strong>Leitor QR:</strong> Endpoints de segurança que garantem a autenticação da ficha mestre por árbitros em campo de base do interclubes.</li>
            </ul>

            <h3 className="text-base font-bold text-white mt-6 mb-2 border-b border-slate-800 pb-1.5 uppercase tracking-wider text-[12px] text-blue-400">SEÇÃO 8 — SISTEMA MULTIDIMENSIONAL DE PONTUAÇÕES</h3>
            <p className="text-xs">
              Comissão técnica e gestores usam um motor técnico-comunicativo para gamificar e premiar a dedicação dos atletas. O Club OS calcula a pontuação global dinâmica baseada em:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-[#111113] p-4 rounded-xl border border-slate-800">
                <span className="text-blue-400 font-bold block mb-1.5">Métricas de Frequência e Campo (+)</span>
                - Presença de treinamento: +5 pts<br />
                - Avaliação mensal de desempenho: +15 pts<br />
                - Gols e providência em partida oficial: +20 pts<br />
                - Pontualidade de faturamentos: +5 pts
              </div>
              <div className="bg-[#111113] p-4 rounded-xl border border-slate-800">
                <span className="text-rose-400 font-bold block mb-1.5">Métricas Corretivas (-)</span>
                - Ausência injustificada a treino: -10 pts<br />
                - Advertência disciplinar de comissão: -5 pts<br />
                - Cartão Amarelo na rodada: -5 pts<br />
                - Bloqueio por falta de atestado de saúde: -15 pts
              </div>
            </div>
          </div>
        )}

        {activeSection === 'database' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-2 border-b border-slate-800 pb-1.5 uppercase tracking-wider text-[12px] text-blue-400">SEÇÃO 12 — ARQUITETURA DE BANCO DE DADOS (POSTGRESQL REAL)</h3>
            <p className="text-xs text-slate-400">Estrutura relacional do postgresql, garantindo a privacidade das informações físicas e transações:</p>
            
            <pre className="p-4 bg-[#111113] font-mono text-[11px] leading-relaxed border border-slate-800 rounded-xl text-amber-200 overflow-x-auto max-h-[400px]">
{`-- 1. CLUBS (O núcleo do sistema de multitenancy)
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  cnpj VARCHAR(18) UNIQUE,
  logo_url TEXT,
  colors JSONB, -- Ex: {"primary": "#3B82F6", "secondary": "#09090B"}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. USERS (Membros administrativos, técnicos ou externos)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_name VARCHAR(50) NOT NULL, -- PRESIDENT/COACH/PLAYER/GUARDIAN
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PLAYERS (Ficha cadastral esportiva)
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  nickname VARCHAR(80),
  birth_date DATE NOT NULL,
  cpf VARCHAR(14) UNIQUE,
  category VARCHAR(50) NOT NULL, -- SUB-15, SUB-17, PRINCIPAL, etc.
  status VARCHAR(30) DEFAULT 'ACTIVE', -- ACTIVE, PENDING_DOCS, SUSPENDED
  position VARCHAR(50) NOT NULL,
  foot VARCHAR(30) NOT NULL,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  join_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 4. PLAYER GUARDIANS (Se menor de idade)
CREATE TABLE player_guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  relationship VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  cpf VARCHAR(14) NOT NULL
);

-- 5. CONTRACTS & SUBSCRIPTIONS
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  due_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(30) DEFAULT 'PENDING'
);`}
            </pre>
          </div>
        )}

        {activeSection === 'regras_api' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-2 border-b border-slate-800 pb-1.5 uppercase tracking-wider text-[12px] text-blue-400">SEÇÃO 13 — REGRAS DE NEGÓCIO INESQUECÍVEIS</h3>
            <div className="space-y-4 text-xs">
              <p>
                <strong className="text-blue-400">RN01 - Responsabilidade Integral de Menores:</strong> Caso o nascimento do jogador aponte idade &lt; 18 anos, a gravação de banco obrigatoriamente exige o CPF e telefone do guardião legal para fins de cobertura contra litígios.
              </p>
              <p>
                <strong className="text-blue-400">RN02 - Aptidão Médica Proativa:</strong> Nenhum atleta figurará em súmula de torneios sob a alcunha de "Liberado" no sistema caso seu arquivo de atestado médico esteja ausente ou vencido há mais de 12 meses.
              </p>
              <p>
                <strong className="text-blue-400">RN03 - Bloqueio de Cartão por Inadimplência:</strong> Caso existam duas ou mais parcelas em aberto, o sistema automatizado de súmulas revoga temporariamente a liberação QR do jogador em jogos oficiais.
              </p>
            </div>

            <h3 className="text-base font-bold text-white mt-6 mb-2 border-b border-slate-800 pb-1.5 uppercase tracking-wider text-[12px] text-blue-400">SEÇÃO 14 — ENDPOINTS RESTFUL API (EXPRESS)</h3>
            <pre className="p-4 bg-[#111113] font-mono text-[11px] leading-relaxed border border-slate-800 rounded-xl text-sky-455 text-sky-300 overflow-x-auto">
{`// Autenticação unificada por JWT de escopo rígido
POST /api/v1/auth/login     -> Login administrativo/atleta
POST /api/v1/auth/register  -> Criação de novo clube matriz

// Atletas & Documentação
GET  /api/v1/players        -> Listagem de elenco com filtros de categoria
POST /api/v1/players        -> Cadastro de atleta (Valida se é menor)
GET  /api/v1/players/:id    -> Ficha individual mestre

// Upload de documentos seguros
POST /api/v1/players/:id/docs -> Upload via Multipart/Form S3 proxy
PUT  /api/v1/players/:id/docs/:docId -> Aprovação/Rejeição para diretores`}
            </pre>
          </div>
        )}

        {activeSection === 'monetizacao' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-2 border-b border-slate-800 pb-1.5 uppercase tracking-wider text-[12px] text-blue-400">SEÇÕES 15 & 16 — DIRETRIZES VISUAIS PREMIUM</h3>
            <p className="text-xs text-slate-400">Visual focado no estilo **Futebol Escuro Premium (Athletic Onyx)**:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
              <li><strong>Interface Abissal:</strong> Cores escuras para alta legibilidade e menor fadiga visual em análises de comissões técnicas.</li>
              <li><strong>Alvos de Ação:</strong> Utilização pontual de azul dinâmico para destacar cliques e botões de comando.</li>
              <li><strong>Tipografia Monospace:</strong> Números e estatísticas moldados com clareza em fontes mono de alta precisão.</li>
            </ul>

            <h3 className="text-base font-bold text-white mt-6 mb-2 border-b border-slate-800 pb-1.5 uppercase tracking-wider text-[12px] text-blue-400">SEÇÃO 17 — MODELO DE MONETIZAÇÃO SAAS (B2B)</h3>
            <p className="text-xs text-slate-400 mb-2">Planos estruturados com foco no ticket médio recorrente de escolinhas e clubes de base:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-[#111113] border border-slate-800 rounded-xl">
                <span className="font-bold text-slate-100 block mb-1 text-sm bg-[#09090B] px-2 py-0.5 rounded text-center">🏆 VÁRZEA PREMIUM</span>
                <p className="font-semibold text-blue-400 mb-2 mt-2 text-center text-md">R$ 149 /mês</p>
                <ul className="space-y-1 text-slate-400 text-[11px] leading-tight">
                  <li>- Até 40 Atletas cadastrados</li>
                  <li>- Emissão de Cartão Digital</li>
                  <li>- Linha do Tempo básica</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-600/10 border border-blue-500 rounded-xl relative shadow-[0_0_20px_-10px_rgba(59,130,246,0.25)]">
                <span className="absolute -top-2.5 right-3 bg-blue-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">RECOMENDADO</span>
                <span className="font-bold text-white block mb-1 text-sm bg-blue-600/20 px-2 py-0.5 rounded text-center">⭐ CHUTE DE OURO</span>
                <p className="font-semibold text-blue-400 mb-2 mt-2 text-center text-md">R$ 299 /mês</p>
                <ul className="space-y-1 text-slate-205 text-[11px] leading-tight text-slate-300">
                  <li>- Até 150 Atletas gerenciados</li>
                  <li>- Motor de Avaliações Técnicas</li>
                  <li>- Recorrência integradora por QR Code</li>
                  <li>- Prontuário de Pais & Responsáveis</li>
                </ul>
              </div>
              <div className="p-4 bg-[#111113] border border-slate-800 rounded-xl">
                <span className="font-bold text-slate-100 block mb-1 text-sm bg-[#09090B] px-2 py-0.5 rounded text-center">🔥 ARENA ENTERPRISE</span>
                <p className="font-semibold text-blue-400 mb-2 mt-2 text-center text-md">R$ 599+ /mês</p>
                <ul className="space-y-1 text-slate-400 text-[11px] leading-tight">
                  <li>- Atletas Ilimitados</li>
                  <li>- Módulos avançados de Scout</li>
                  <li>- Relatórios para Olheiros e Clubes</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
