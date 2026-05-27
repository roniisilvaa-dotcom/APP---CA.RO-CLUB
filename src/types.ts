export type PlayerStatus = 'ACTIVE' | 'PENDING_DOCS' | 'INACTIVE' | 'SUSPENDED';

export interface PlayerGuardian {
  name: string;
  phone: string;
  email: string;
  relationship: string;
  cpf: string;
}

export interface PlayerDocument {
  id: string;
  type: 'RG' | 'CPF' | 'REGISTRATION_FORM' | 'MEDICAL_EXAM' | 'CONTRACT';
  name: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  uploadedAt?: string;
  fileUrl?: string;
  notes?: string;
}

export interface PlayerCard {
  cardNumber: string;
  qrCodeUrl: string;
  issueDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'BLOCKED';
}

export interface PlayerHistoryEvent {
  id: string;
  date: string;
  type: 'REGISTRATION' | 'CATEGORY_CHANGE' | 'PERFORMANCE' | 'MEDICAL' | 'DISCIPLINARY' | 'FINANCIAL';
  title: string;
  description: string;
  categoryName?: string;
  stats?: {
    goals?: number;
    assists?: number;
    yellowCards?: number;
    redCards?: number;
    minutesPlayed?: number;
  };
}

export interface PlayerEvaluation {
  id: string;
  date: string;
  technical: number; // 0-100
  tactical: number;  // 0-100
  physical: number;  // 0-100
  discipline: number; // 0-100
  attendanceRate: number; // 0-100
  evaluatorName: string;
}

export interface SubscriptionFee {
  id: string;
  dueDate: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'WAIVED';
  paidAt?: string;
  paymentMethod?: string;
}

export interface Player {
  id: string;
  name: string;
  avatarUrl: string;
  nickname?: string;
  birthDate: string;
  cpf: string;
  rg?: string;
  phone?: string;
  email?: string;
  category: 'Aspirantes' | 'Veteranos' | 'Sub-15' | 'Sub-17' | 'Sub-20' | 'Principal';
  status: PlayerStatus;
  joinDate: string;
  registrationProgress: number; // 0-100
  rankingScore: number; // 0-100
  rankingPosition: number;
  guardian?: PlayerGuardian;
  documents: PlayerDocument[];
  card: PlayerCard;
  history: PlayerHistoryEvent[];
  evaluations: PlayerEvaluation[];
  subscriptions: SubscriptionFee[];
  observations?: string;
  position: 'Goleiro' | 'Zagueiro' | 'Lateral' | 'Meio-Campo' | 'Atacante';
  foot: 'Canhoto' | 'Destro' | 'Ambidestro';
  weight?: number; // kg
  height?: number; // cm
}

export interface FinancialEntry {
  id: string;
  date: string;
  type: 'REVENUE' | 'EXPENSE';
  category: string;
  amount: number;
  description: string;
  status: 'COMPLETED' | 'PENDING';
}

export interface ClubStats {
  totalPlayers: number;
  activePlayers: number;
  pendingDocsPlayers: number;
  monthlyRevenue: number;
  expenseRate: number;
  defaultersCount: number; // inadimplentes
  totalSubscribers: number;
}

export interface Club {
  id: string;
  name: string;
  logoUrl?: string;
  city: string;
  categoryFocus: string;
  adminEmail: string;
  passwordHash: string;
  players: Player[];
  financials: FinancialEntry[];
  registeredAt: string;
}

