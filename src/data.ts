import { Player, FinancialEntry, ClubStats } from './types';

export const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Gabriel "Gabigol" Silva Nascimento',
    nickname: 'Gabigol da Várzea',
    avatarUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=250&auto=format&fit=crop',
    birthDate: '2011-04-12', // Menor de idade (15 anos em 2026)
    cpf: '456.789.012-34',
    rg: '23.456.789-X',
    phone: '(11) 98765-4321',
    email: 'gabriel.silva@esporte.com',
    category: 'Sub-15',
    status: 'ACTIVE',
    joinDate: '2023-01-15',
    registrationProgress: 100,
    rankingScore: 92,
    rankingPosition: 1,
    position: 'Atacante',
    foot: 'Canhoto',
    weight: 58,
    height: 168,
    guardian: {
      name: 'Marcos Roberto Nascimento',
      relationship: 'Pai',
      phone: '(11) 91234-5678',
      email: 'marcos.nascimento@email.com',
      cpf: '123.456.789-00'
    },
    documents: [
      { id: 'd1_1', type: 'RG', name: 'DOC_RG_Gabriel.pdf', status: 'APPROVED', uploadedAt: '2023-01-15' },
      { id: 'd1_2', type: 'CPF', name: 'DOC_CPF_Gabriel.pdf', status: 'APPROVED', uploadedAt: '2023-01-15' },
      { id: 'd1_3', type: 'REGISTRATION_FORM', name: 'Ficha_Inscricao_Sub15_Firmada.pdf', status: 'APPROVED', uploadedAt: '2023-01-16' },
      { id: 'd1_4', type: 'MEDICAL_EXAM', name: 'Atestado_Medico_2026.pdf', status: 'APPROVED', uploadedAt: '2026-02-10' },
      { id: 'd1_5', type: 'CONTRACT', name: 'Termo_Vinculo_Formacao.pdf', status: 'APPROVED', uploadedAt: '2023-01-17' }
    ],
    card: {
      cardNumber: 'COP-2026-0091',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=COP-2026-0091:GABRIEL_SILVA',
      issueDate: '2026-01-10',
      expiryDate: '2027-01-10',
      status: 'ACTIVE'
    },
    history: [
      { id: 'h1_1', date: '2023-01-15', type: 'REGISTRATION', title: 'Admissão Oficial', description: 'Registrado na categoria Sub-13 do clube.', categoryName: 'Sub-13' },
      { id: 'h1_2', date: '2024-12-05', type: 'CATEGORY_CHANGE', title: 'Promoção por Idade', description: 'Promovido para a categoria Sub-15.', categoryName: 'Sub-15' },
      { id: 'h1_3', date: '2026-05-15', type: 'PERFORMANCE', title: 'Excelente Partida (Clássico Várzea)', description: 'Marcou 2 gols e deu 1 assistência na vitória de 3x0 contra o Real Jaraguá.', categoryName: 'Sub-15', stats: { goals: 2, assists: 1, minutesPlayed: 80 } },
      { id: 'h1_4', date: '2026-05-20', type: 'DISCIPLINARY', title: 'Cartão Amarelo por Reclamação', description: 'Admoestado pelo árbitro aos 32 minutos do segundo tempo.', categoryName: 'Sub-15', stats: { yellowCards: 1 } }
    ],
    evaluations: [
      { id: 'ev1_1', date: '2026-05-10', technical: 95, tactical: 82, physical: 88, discipline: 90, attendanceRate: 98, evaluatorName: 'Prof. Renato Santos' },
      { id: 'ev1_2', date: '2026-03-12', technical: 90, tactical: 78, physical: 84, discipline: 92, attendanceRate: 95, evaluatorName: 'Prof. Renato Santos' }
    ],
    subscriptions: [
      { id: 's1_1', dueDate: '2026-05-10', amount: 120, status: 'PAID', paidAt: '2026-05-08', paymentMethod: 'PIX' },
      { id: 's1_2', dueDate: '2026-04-10', amount: 120, status: 'PAID', paidAt: '2026-04-09', paymentMethod: 'Dinheiro' },
      { id: 's1_3', dueDate: '2026-03-10', amount: 120, status: 'PAID', paidAt: '2026-03-10', paymentMethod: 'PIX' }
    ],
    observations: 'Excelente poder de finalização. Extremamente disciplinado no tático e forte na perna esquerda. Observado por olheiros do Palmeiras e Santos.'
  },
  {
    id: '2',
    name: 'Rodrigo "Diguinho" Mendes Camargo',
    nickname: 'Diguinho Maestro',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250&auto=format&fit=crop',
    birthDate: '2008-08-22', // Menor de idade (17 anos)
    cpf: '889.332.112-90',
    rg: '54.778.112-3',
    phone: '(11) 95543-9988',
    email: 'rodrigo.mendes@esporte.com',
    category: 'Sub-17',
    status: 'PENDING_DOCS',
    joinDate: '2024-02-20',
    registrationProgress: 60,
    rankingScore: 84,
    rankingPosition: 3,
    position: 'Meio-Campo',
    foot: 'Ambidestro',
    weight: 65,
    height: 174,
    guardian: {
      name: 'Patricia Mendes Camargo',
      relationship: 'Mãe',
      phone: '(11) 98877-6655',
      email: 'patmendes@email.com',
      cpf: '223.334.445-67'
    },
    documents: [
      { id: 'd2_1', type: 'RG', name: 'doc_rg_rodrigo.pdf', status: 'APPROVED', uploadedAt: '2024-02-21' },
      { id: 'd2_2', type: 'CPF', name: 'doc_cpf_rodrigo.pdf', status: 'APPROVED', uploadedAt: '2024-02-21' },
      { id: 'd2_3', type: 'REGISTRATION_FORM', name: 'Form_Sub17_Rodrigo.pdf', status: 'APPROVED', uploadedAt: '2024-02-25' },
      { id: 'd2_4', type: 'MEDICAL_EXAM', name: '', status: 'PENDING', notes: 'Necessário renovar o atestado médico esportivo para competição.' }
    ],
    card: {
      cardNumber: 'COP-2026-0155',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=COP-2026-0155:RODRIGO_MENDES',
      issueDate: '2026-02-15',
      expiryDate: '2027-02-15',
      status: 'BLOCKED' // Bloqueado devido a atestado médico pendente
    },
    history: [
      { id: 'h2_1', date: '2024-02-20', type: 'REGISTRATION', title: 'Admissão Sub-17', description: 'Atleta cadastrado para a disputa da Copa do Bairro.', categoryName: 'Sub-17' },
      { id: 'h2_2', date: '2026-04-18', type: 'MEDICAL', title: 'Atestado Médico Vencido', description: 'Notificação emitida para renovação anual do exame cardiológico.', categoryName: 'Sub-17' }
    ],
    evaluations: [
      { id: 'ev2_1', date: '2026-04-01', technical: 88, tactical: 90, physical: 72, discipline: 85, attendanceRate: 88, evaluatorName: 'Prof. Julio Cesar' }
    ],
    subscriptions: [
      { id: 's2_1', dueDate: '2026-05-10', amount: 120, status: 'PENDING' }, // Em aberto
      { id: 's2_2', dueDate: '2026-04-10', amount: 120, status: 'PAID', paidAt: '2026-04-12', paymentMethod: 'PIX' },
      { id: 's2_3', dueDate: '2026-03-10', amount: 120, status: 'PAID', paidAt: '2026-03-14', paymentMethod: 'PIX' }
    ],
    observations: 'Excelente visão de jogo. Meio campista clássico "camisa 10". Ritmo físico é o único gargalo atual.'
  },
  {
    id: '3',
    name: 'Carlos Henrique "Chicão" Oliveira',
    nickname: 'Chicão Xerife',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop',
    birthDate: '1991-11-03', // Adulto (34 anos) - Veterano
    cpf: '332.113.884-12',
    phone: '(11) 94432-1111',
    email: 'chicao.oliveira@gbrass.com.br',
    category: 'Veteranos',
    status: 'ACTIVE',
    joinDate: '2021-05-10',
    registrationProgress: 100,
    rankingScore: 89,
    rankingPosition: 2,
    position: 'Zagueiro',
    foot: 'Destro',
    weight: 85,
    height: 188,
    documents: [
      { id: 'd3_1', type: 'RG', name: 'RG_Chicao_Oliveira.pdf', status: 'APPROVED', uploadedAt: '2021-05-11' },
      { id: 'd3_2', type: 'CPF', name: 'CPF_Chicao_Oliveira.pdf', status: 'APPROVED', uploadedAt: '2021-05-11' },
      { id: 'd3_3', type: 'MEDICAL_EXAM', name: 'Laudo_Cardio_Chicao_2026.pdf', status: 'APPROVED', uploadedAt: '2026-01-20' }
    ],
    card: {
      cardNumber: 'COP-2026-0004',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=COP-2026-0004:CARLOS_OLIVEIRA',
      issueDate: '2026-01-01',
      expiryDate: '2026-12-31',
      status: 'ACTIVE'
    },
    history: [
      { id: 'h3_1', date: '2021-05-10', type: 'REGISTRATION', title: 'Assinatura com Veteranos', description: 'Entrada oficial no elenco principal de veteranos.', categoryName: 'Veteranos' },
      { id: 'h3_2', date: '2025-09-12', type: 'DISCIPLINARY', title: 'Expulsão por entrada temerária', description: 'Suspenso por 2 jogos após carrinho duro no torneio interclubes.', categoryName: 'Veteranos', stats: { redCards: 1 } },
      { id: 'h3_3', date: '2026-05-21', type: 'PERFORMANCE', title: 'Partida Impecável', description: 'Anulou o ataque adversário e liderou a defesa defensiva.', categoryName: 'Veteranos', stats: { minutesPlayed: 90 } }
    ],
    evaluations: [
      { id: 'ev3_1', date: '2026-05-02', technical: 82, tactical: 94, physical: 80, discipline: 88, attendanceRate: 94, evaluatorName: 'Prof. Marco Doni' }
    ],
    subscriptions: [
      { id: 's3_1', dueDate: '2026-05-10', amount: 150, status: 'PAID', paidAt: '2026-05-05', paymentMethod: 'PIX' },
      { id: 's3_2', dueDate: '2026-04-10', amount: 150, status: 'PAID', paidAt: '2026-04-10', paymentMethod: 'PIX' },
      { id: 's3_3', dueDate: '2026-03-10', amount: 150, status: 'PAID', paidAt: '2026-03-09', paymentMethod: 'PIX' }
    ],
    observations: 'Capitão da categoria de Veteranos. Liderança nata, excelente jogo aéreo, imposição física formidável.'
  },
  {
    id: '4',
    name: 'Douglas "Muralha" Souza Bastos',
    nickname: 'Muralha',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=250&auto=format&fit=crop',
    birthDate: '1998-03-14', // Adulto (28 anos) - Categoria Principal
    cpf: '221.439.878-02',
    phone: '(11) 93311-2290',
    email: 'douglas.muralha@email.com',
    category: 'Principal',
    status: 'ACTIVE',
    joinDate: '2022-07-01',
    registrationProgress: 100,
    rankingScore: 81,
    rankingPosition: 4,
    position: 'Goleiro',
    foot: 'Destro',
    weight: 92,
    height: 194,
    documents: [
      { id: 'd4_1', type: 'RG', name: 'RG_Douglas.pdf', status: 'APPROVED', uploadedAt: '2022-07-01' },
      { id: 'd4_2', type: 'MEDICAL_EXAM', name: 'Exame_Ecocardio_Douglas.pdf', status: 'APPROVED', uploadedAt: '2025-11-15' }
    ],
    card: {
      cardNumber: 'COP-2026-0012',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=COP-2026-0012:DOUGLAS_MURALHA',
      issueDate: '2026-01-01',
      expiryDate: '2026-12-31',
      status: 'ACTIVE'
    },
    history: [
      { id: 'h4_1', date: '2022-07-01', type: 'REGISTRATION', title: 'Contratação', description: 'Assinou compromisso para defender o gol da equipe Principal.', categoryName: 'Principal' },
      { id: 'h4_2', date: '2025-08-10', type: 'PERFORMANCE', title: 'Defendeu Pênalti', description: 'Salvou a equipe nas penalidades da semifinal regional.', categoryName: 'Principal' }
    ],
    evaluations: [
      { id: 'ev4_1', date: '2026-04-15', technical: 85, tactical: 80, physical: 83, discipline: 85, attendanceRate: 90, evaluatorName: 'Prof. Treinador de Goleiros Aldo' }
    ],
    subscriptions: [
      { id: 's4_1', dueDate: '2026-05-10', amount: 150, status: 'PAID', paidAt: '2026-05-10', paymentMethod: 'Transferência' },
      { id: 's4_2', dueDate: '2026-04-10', amount: 150, status: 'PAID', paidAt: '2026-04-10', paymentMethod: 'PIX' },
      { id: 's4_3', dueDate: '2026-03-10', amount: 150, status: 'PAID', paidAt: '2026-03-08', paymentMethod: 'PIX' }
    ],
    observations: 'Excelente envergadura e explosão sob as traves. Seguro nas saídas e líder vocal do time de trás.'
  },
  {
    id: '5',
    name: 'Tiago "Tiquinho" Ramos Prado',
    nickname: 'Tiquinho Atacante',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=250&auto=format&fit=crop',
    birthDate: '2012-09-05', // Menor de idade (13 anos)
    cpf: '556.112.334-19',
    category: 'Sub-15',
    status: 'SUSPENDED', // Suspenso devido à inadimplência severa ou falta escolar
    joinDate: '2024-05-20',
    registrationProgress: 80,
    rankingScore: 65,
    rankingPosition: 6,
    position: 'Atacante',
    foot: 'Destro',
    weight: 48,
    height: 155,
    guardian: {
      name: 'Regiane Ramos Prado',
      relationship: 'Mãe',
      phone: '(11) 94444-3322',
      email: 'regi.prado@exemplo.com',
      cpf: '554.332.112-00'
    },
    documents: [
      { id: 'd5_1', type: 'RG', name: 'RG_Tiago.pdf', status: 'APPROVED', uploadedAt: '2024-05-20' },
      { id: 'd5_2', type: 'CPF', name: 'CPF_Tiago.pdf', status: 'APPROVED', uploadedAt: '2024-05-20' },
      { id: 'd5_3', type: 'MEDICAL_EXAM', name: 'Apto_Fisico_Tiaguinho.pdf', status: 'APPROVED', uploadedAt: '2025-06-15' }
    ],
    card: {
      cardNumber: 'COP-2026-0189',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=COP-2026-0189:TIAGO_RAMOS',
      issueDate: '2025-06-20',
      expiryDate: '2026-06-20',
      status: 'BLOCKED'
    },
    history: [
      { id: 'h5_1', date: '2024-05-20', type: 'REGISTRATION', title: 'Admissão Sub-13', description: 'Entrada na base Sub-13.', categoryName: 'Sub-15' },
      { id: 'h5_2', date: '2026-05-15', type: 'FINANCIAL', title: 'Suspensão Financeira', description: 'Regulamento interno: Bloqueio de partidas competitivas por falta de pagamento acumulado superior a 45 dias.', categoryName: 'Sub-15' }
    ],
    evaluations: [
      { id: 'ev5_1', date: '2026-04-10', technical: 75, tactical: 68, physical: 80, discipline: 60, attendanceRate: 75, evaluatorName: 'Prof. Renato Santos' }
    ],
    subscriptions: [
      { id: 's5_1', dueDate: '2026-05-10', amount: 120, status: 'OVERDUE' }, // Atrasada
      { id: 's5_2', dueDate: '2026-04-10', amount: 120, status: 'OVERDUE' }, // Atrasada
      { id: 's5_3', dueDate: '2026-03-10', amount: 120, status: 'PAID', paidAt: '2026-03-18', paymentMethod: 'PIX' }
    ],
    observations: 'Bom talento porém com problemas frequentes de indisciplina extracampo e ausência em treinos. Mãe contatada para renegociação financeira.'
  },
  {
    id: '6',
    name: 'Enzo Gabriel "Ezzy" Ferreira',
    nickname: 'Ezzy Lateral',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=250&auto=format&fit=crop',
    birthDate: '2009-12-11', // Menor de idade (16 anos)
    cpf: '776.554.331-23',
    category: 'Sub-17',
    status: 'ACTIVE',
    joinDate: '2025-02-10',
    registrationProgress: 100,
    rankingScore: 88,
    rankingPosition: 5,
    position: 'Lateral',
    foot: 'Destro',
    weight: 62,
    height: 171,
    guardian: {
      name: 'Sonia Ferreira',
      relationship: 'Avó',
      phone: '(11) 97766-3344',
      email: 'sonia.vofutebol@email.com',
      cpf: '445.667.112-99'
    },
    documents: [
      { id: 'd6_1', type: 'RG', name: 'RG_Enzo.pdf', status: 'APPROVED', uploadedAt: '2025-02-10' },
      { id: 'd6_2', type: 'CPF', name: 'CPF_Enzo.pdf', status: 'APPROVED', uploadedAt: '2025-02-10' },
      { id: 'd6_3', type: 'REGISTRATION_FORM', name: 'Ficha_Sonia_Autorizada.pdf', status: 'APPROVED', uploadedAt: '2025-02-11' },
      { id: 'd6_4', type: 'MEDICAL_EXAM', name: 'Atestado_Enzo_2026.pdf', status: 'APPROVED', uploadedAt: '2026-01-15' }
    ],
    card: {
      cardNumber: 'COP-2026-0212',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=COP-2026-0212:ENZO_FERREIRA',
      issueDate: '2026-01-15',
      expiryDate: '2027-01-15',
      status: 'ACTIVE'
    },
    history: [
      { id: 'h6_1', date: '2025-02-10', type: 'REGISTRATION', title: 'Entrada na categoria Sub-17', description: 'Registro validado sob responsabilidade da Avó.', categoryName: 'Sub-17' },
      { id: 'h6_2', date: '2026-05-01', type: 'PERFORMANCE', title: 'Assistência decisiva', description: 'Cruzamento milimétrico para gol da vitória na Copa Regional.', categoryName: 'Sub-17', stats: { assists: 1, minutesPlayed: 90 } }
    ],
    evaluations: [
      { id: 'ev6_1', date: '2026-05-01', technical: 86, tactical: 88, physical: 90, discipline: 90, attendanceRate: 96, evaluatorName: 'Prof. Renato Santos' }
    ],
    subscriptions: [
      { id: 's6_1', dueDate: '2026-05-10', amount: 120, status: 'WAIVED' }, // Isento por bolsa social
      { id: 's6_2', dueDate: '2026-04-10', amount: 120, status: 'WAIVED' },
      { id: 's6_3', dueDate: '2026-03-10', amount: 120, status: 'WAIVED' }
    ],
    observations: 'Atleta excelente, veloz e focado. Recebeu bolsa integral por mérito técnico e vulnerabilidade social de acordo com a prefeitura local.'
  }
];

export const mockFinancials: FinancialEntry[] = [
  { id: 'f1', date: '2026-05-25', type: 'EXPENSE', category: 'Manutenção', amount: 450, description: 'Manutenção de cortador de grama e tinta para demarcação do campo', status: 'COMPLETED' },
  { id: 'f2', date: '2026-05-24', type: 'EXPENSE', category: 'Arbitragem', amount: 350, description: 'Taxa de arbitragem - Copa de Várzea contra o Vila união', status: 'COMPLETED' },
  { id: 'f3', date: '2026-05-20', type: 'REVENUE', category: 'Mensalidades', amount: 120, description: 'Mensalidade paga por Gabriel Silva Nascimento via PIX', status: 'COMPLETED' },
  { id: 'f4', date: '2026-05-18', type: 'REVENUE', category: 'Doação (Patrocinador)', amount: 1500, description: 'Patrocínio mensal da Padaria São José - Logomarca no colete da base', status: 'COMPLETED' },
  { id: 'f5', date: '2026-05-15', type: 'EXPENSE', category: 'Equipamento', amount: 800, description: 'Compra de 10 bolas profissionais Penalty e 20 coletes de treino', status: 'COMPLETED' },
  { id: 'f6', date: '2026-05-10', type: 'REVENUE', category: 'Mensalidades', amount: 150, description: 'Mensalidade paga por Carlos Henrique Oliveira via PIX', status: 'COMPLETED' },
  { id: 'f7', date: '2026-05-10', type: 'REVENUE', category: 'Mensalidades', amount: 150, description: 'Mensalidade paga por Douglas Souza Bastos via Link de Pagamento', status: 'COMPLETED' },
  { id: 'f8', date: '2026-05-04', type: 'EXPENSE', category: 'Confraternização', amount: 620, description: 'Gasolina e lanche para viagem do time Sub-17 para torneio externo', status: 'COMPLETED' }
];

export const mockStats: ClubStats = {
  totalPlayers: 6,
  activePlayers: 4,
  pendingDocsPlayers: 1,
  monthlyRevenue: 1920, // Mensalidades + Patrocínio
  expenseRate: 34.5, // 34.5% das receitas vão no operacional
  defaultersCount: 1, // Tiago Ramos Prado está inadimplente
  totalSubscribers: 5 // 5 atletas com alguma mensalidade prevista (excluindo isentos ou com dados previstos)
};
