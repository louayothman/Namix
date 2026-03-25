
export type UserRole = 'USER' | 'ADMIN';

export type User = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  balance: number;
  total_profits: number;
  created_at: string;
};

export type InvestmentPlan = {
  id: string;
  title: string;
  min_amount: number;
  max_amount: number;
  profit_percentage: number;
  duration_days: number;
  description: string;
  is_active: boolean;
};

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'PROFIT';
export type TransactionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  transaction_id?: string; // For blockchain or bank reference
  receipt_url?: string;
  created_at: string;
  updated_at: string;
};

export type Investment = {
  id: string;
  user_id: string;
  plan_id: string;
  amount: number;
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'COMPLETED';
  progress: number;
};
