import { Club, Player, FinancialEntry } from './types';
import { mockPlayers, mockFinancials } from './data';

// A dynamic pool of 750 simulated clubs to support the user's requirement of "over 700 clubs".
// Any of these can be searched and accessed instantly!
export const PRE_REGISTERED_CLUBS = [
  { id: 'kagiva_fc', name: 'Kagiva Football Club', city: 'Cascavel - PR', focus: 'Categoria de Base Completa', email: 'dadoskagiva@gmail.com', password: '123', avatar: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=80&auto=format&fit=crop' },
  { id: 'flamenguinho', name: 'Flamenguinho de Diadema FC', city: 'Diadema - SP', focus: 'Sub-15 & Sub-17', email: 'diadema@flamenguinho.com', password: '123', avatar: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=80&auto=format&fit=crop' },
  { id: 'barcelona_jab', name: 'Barcelona Academia Jabaquara', city: 'São Paulo - SP', focus: 'Futebol de Campo Júnior', email: 'jabaquara@email.com', password: '123', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=80&auto=format&fit=crop' },
  { id: 'vasco_varzea', name: 'Vasco da Gama da Várzea', city: 'Manaus - AM', focus: 'Principal & Veteranos', email: 'vasco.varzea@email.com', password: '123', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=80&auto=format&fit=crop' },
  { id: 'real_jaragua', name: 'Real Jaraguá Esporte Clube', city: 'São Paulo - SP', focus: 'Iniciação Sub-11 ao Sub-15', email: 'jaragua@real.com', password: '123', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=80&auto=format&fit=crop' }
];

// Seed other 740+ club metadata for realistic federated lookup simulator!
export const SIMULATED_FEDERATION_CLUBS: Array<{ id: string; name: string; city: string; focus: string; email: string }> = Array.from({ length: 745 }).map((_, index) => {
  const ids = index + 6;
  const states = ['SP', 'RJ', 'MG', 'PR', 'RS', 'SC', 'GO', 'BA', 'PE', 'CE'];
  const names = ['Atlético', 'Palmeirinhas', 'Santos Base', 'Grêmio', 'Bahia Várzea', 'América Cup', 'Cruzeirinho', 'Inter de Campo', 'Sport', 'Corinthians da Norte', 'Aliança', 'Botafoguinho', 'Goiás Real', 'Fortaleza Base'];
  const suffixes = ['F.C.', 'Esporte Clube', 'Academia de Futebol', 'Associação Esportiva', 'Futebol e Regatas', 'Terrão S.C.'];
  
  const chosenName = `${names[index % names.length]} ${suffixes[index % suffixes.length]} Sub-${(index % 3) * 2 + 15}`;
  const chosentCity = `Cidade ${index + 10} - ${states[index % states.length]}`;
  
  return {
    id: `sim_club_${ids}`,
    name: chosenName,
    city: chosentCity,
    focus: 'Categoria de Base & Rendimento',
    email: `diretoria.club${ids}@federacao.com`
  };
});

// Seed players for secondary clubs so they have nice realistic rosters from start
const generateDummyRoster = (clubName: string): Player[] => {
  const pos = ['Goleiro', 'Zagueiro', 'Lateral', 'Meio-Campo', 'Atacante'] as const;
  const feet = ['Destro', 'Canhoto', 'Ambidestro'] as const;
  
  const basePlayers: Omit<Player, 'id'>[] = [
    {
      name: 'Luiz Felipe da Silva', nickname: 'Felipinho', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop',
      birthDate: '2011-08-14', cpf: '111.444.777-11', category: 'Sub-15', status: 'ACTIVE', joinDate: '2024-01-10', position: 'Atacante', foot: 'Destro', registrationProgress: 100, rankingScore: 88, rankingPosition: 1,
      documents: [{ id: '1', type: 'RG', name: 'RG.pdf', status: 'APPROVED' }, { id: '2', type: 'MEDICAL_EXAM', name: 'Laudo.pdf', status: 'APPROVED' }],
      card: { cardNumber: 'C-0101', qrCodeUrl: 'q1', issueDate: '2026-01-10', expiryDate: '2027-01-10', status: 'ACTIVE' },
      history: [{ id: '1', date: '2026-05-10', type: 'PERFORMANCE', title: 'Excelente fisicamente', description: 'Atleta com maior índice de velocidade nos treinos.' }],
      evaluations: [{ id: '1', date: '2026-05-01', technical: 88, tactical: 85, physical: 92, discipline: 90, attendanceRate: 100, evaluatorName: 'Prof. Treinador' }],
      subscriptions: [{ id: 's1', dueDate: '2026-05-10', amount: 100, status: 'PAID', paidAt: '2026-05-09', paymentMethod: 'PIX' }]
    },
    {
      name: 'Pedro Henrique Guedes', nickname: 'Pedrinho', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=250&auto=format&fit=crop',
      birthDate: '2009-11-20', cpf: '222.555.888-22', category: 'Sub-17', status: 'ACTIVE', joinDate: '2024-02-15', position: 'Meio-Campo', foot: 'Ambidestro', registrationProgress: 100, rankingScore: 85, rankingPosition: 2,
      documents: [{ id: '1', type: 'RG', name: 'RG_pedro.pdf', status: 'APPROVED' }],
      card: { cardNumber: 'C-0102', qrCodeUrl: 'q2', issueDate: '2026-01-11', expiryDate: '2027-01-11', status: 'ACTIVE' },
      history: [{ id: '1', date: '2026-05-15', type: 'REGISTRATION', title: 'Novo Registro', description: 'Atleta cadastrado com boas recomendações federadas.' }],
      evaluations: [{ id: '1', date: '2026-05-02', technical: 85, tactical: 90, physical: 80, discipline: 85, attendanceRate: 95, evaluatorName: 'Prof. Auxiliar' }],
      subscriptions: [{ id: 's2', dueDate: '2026-05-10', amount: 100, status: 'PENDING' }]
    },
    {
      name: 'Matheus "Muralha" Bastos', nickname: 'Bastos', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=250&auto=format&fit=crop',
      birthDate: '1995-03-12', cpf: '333.666.999-33', category: 'Principal', status: 'ACTIVE', joinDate: '2022-04-10', position: 'Goleiro', foot: 'Destro', registrationProgress: 100, rankingScore: 82, rankingPosition: 3,
      documents: [{ id: '1', type: 'RG', name: 'RG.pdf', status: 'APPROVED' }, { id: '2', type: 'MEDICAL_EXAM', name: 'Exame.pdf', status: 'APPROVED' }],
      card: { cardNumber: 'C-0103', qrCodeUrl: 'q3', issueDate: '2026-01-12', expiryDate: '2027-01-12', status: 'ACTIVE' },
      history: [],
      evaluations: [],
      subscriptions: [{ id: 's3', dueDate: '2026-05-10', amount: 120, status: 'PAID', paidAt: '2026-05-05', paymentMethod: 'PIX' }]
    },
    {
      name: 'Thiago Neves de Castro', nickname: 'Castro', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=250&auto=format&fit=crop',
      birthDate: '2010-02-14', cpf: '444.777.000-44', category: 'Sub-15', status: 'SUSPENDED', joinDate: '2025-01-05', position: 'Lateral', foot: 'Canhoto', registrationProgress: 90, rankingScore: 71, rankingPosition: 4,
      documents: [],
      card: { cardNumber: 'C-0104', qrCodeUrl: 'q4', issueDate: '2026-01-14', expiryDate: '2027-01-14', status: 'BLOCKED' },
      history: [],
      evaluations: [],
      subscriptions: [{ id: 's4', dueDate: '2026-05-10', amount: 100, status: 'OVERDUE' }]
    }
  ];

  return basePlayers.map((bp, i) => ({
    ...bp,
    id: `club_p_${Math.random().toString(36).substring(4)}_${i}`,
    name: bp.name.replace('Luiz Felipe', `Luiz Felipe (${clubName.split(' ')[0]})`),
    card: {
      ...bp.card,
      cardNumber: `COP-2026-7${i}${Math.floor(Math.random() * 90) + 10}`
    }
  }));
};

const generateDummyFinancials = (): FinancialEntry[] => {
  return [
    { id: 'f_cl_1', date: '2026-05-25', type: 'REVENUE', category: 'Mensalidades', amount: 320, description: 'Mensalidades de atletas consolidadas no mês', status: 'COMPLETED' },
    { id: 'f_cl_2', date: '2026-05-22', type: 'EXPENSE', category: 'Manutenção', amount: 150, description: 'Compra de coletes adicionais e redes', status: 'COMPLETED' },
    { id: 'f_cl_3', date: '2026-05-18', type: 'REVENUE', category: 'Doação (Patrocinador)', amount: 1000, description: 'Incentivo do comércio local', status: 'COMPLETED' }
  ];
};

/**
 * Initializes and returns the master club database array.
 * Stores/retrieves list from localStorage to handle full persistent multi-tenancy.
 */
export function getClubsDatabase(): Club[] {
  const stored = localStorage.getItem('CLUBOS_CLUBS');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing stored clubs, resetting...', e);
    }
  }

  // Seeding base database with pre-registered templates
  const initialClubs: Club[] = PRE_REGISTERED_CLUBS.map((bc, idx) => {
    // Kagiva gets the main highly detailed mock data
    const isKagiva = bc.id === 'kagiva_fc';
    return {
      id: bc.id,
      name: bc.name,
      logoUrl: bc.avatar,
      city: bc.city,
      categoryFocus: bc.focus,
      adminEmail: bc.email,
      passwordHash: bc.password, // Standard password for demo
      players: isKagiva ? mockPlayers : generateDummyRoster(bc.name),
      financials: isKagiva ? mockFinancials : generateDummyFinancials(),
      registeredAt: '2026-01-01'
    };
  });

  localStorage.setItem('CLUBOS_CLUBS', JSON.stringify(initialClubs));
  return initialClubs;
}

/**
 * Saves the full updated list of clubs back to localStorage.
 */
export function saveClubsDatabase(clubs: Club[]): void {
  localStorage.setItem('CLUBOS_CLUBS', JSON.stringify(clubs));
}

/**
 * Persists changes made on a single club back into the global database registry.
 */
export function updateClubData(clubId: string, updatedPlayers: Player[], updatedFinancials: FinancialEntry[]): void {
  const clubs = getClubsDatabase();
  const index = clubs.findIndex(c => c.id === clubId);
  if (index !== -1) {
    clubs[index].players = updatedPlayers;
    clubs[index].financials = updatedFinancials;
    saveClubsDatabase(clubs);
  }
}

/**
 * Adds a brand new club to the federation database.
 */
export function registerNewClub(name: string, city: string, focus: string, email: string, pass: string): Club {
  const clubs = getClubsDatabase();
  
  // Custom unique seed logo based on random sports image
  const randomLogoIndex = Math.floor(Math.random() * 5);
  const logos = [
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=80&auto=format&fit=crop'
  ];

  const newClub: Club = {
    id: 'club_' + Math.random().toString(36).substring(4),
    name,
    city,
    categoryFocus: focus,
    adminEmail: email.toLowerCase(),
    passwordHash: pass,
    logoUrl: logos[randomLogoIndex],
    players: generateDummyRoster(name), // seed nice base roster
    financials: generateDummyFinancials(), // seed nice transactions
    registeredAt: new Date().toISOString().split('T')[0]
  };

  clubs.push(newClub);
  saveClubsDatabase(clubs);
  return newClub;
}
