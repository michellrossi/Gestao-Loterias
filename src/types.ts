export interface Participant {
  id: number;
  name: string;
  active: number;
  created_at: string;
}

export interface Contribution {
  id: number;
  participant_id: number;
  participant_name?: string;
  amount: number;
  month: string;
  paid_at: string;
}

export interface Draw {
  id: number;
  name: string;
  date: string;
  realized: number;
  result: string | null;
  prize: number;
  allocation_percentage: number;
}

export interface Bet {
  id: number;
  draw_id: number;
  description: string;
  amount: number;
  date: string;
}

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'viewer';
}

export interface DashboardStats {
  totalCollected: number;
  totalInvested: number;
  cashAvailable: number;
  activeParticipants: number;
  nextDraw: Draw | null;
}
