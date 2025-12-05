// TypeScript interfaces for the Leaderboard API

export interface Team {
  id: number;
  name: string;
  code: string;
  description?: string;
  color?: string;
  logo_url?: string;
  is_active: boolean;
  total_score: number;
  rank: number;
  created_at?: string;
  updated_at?: string;
  scores?: Score[];
  progress?: Progress[];
}

export interface Score {
  id: number;
  team_id: number;
  points: number;
  challenge_name?: string;
  description?: string;
  achieved_at?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  team?: Team;
}

export interface Progress {
  id: number;
  team_id: number;
  milestone: string;
  percentage: number;
  notes?: string;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
  team?: Team;
}

export interface LeaderboardStats {
  total_teams: number;
  total_scores: number;
  total_points: number;
  average_score: number;
  top_team: Team | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface CreateTeamRequest {
  name: string;
  code: string;
  description?: string;
  color?: string;
  logo_url?: string;
}

export interface UpdateTeamRequest {
  name?: string;
  code?: string;
  description?: string;
  color?: string;
  logo_url?: string;
  is_active?: boolean;
}

export interface CreateScoreRequest {
  team_id: number;
  points: number;
  challenge_name?: string;
  description?: string;
  achieved_at?: string;
  metadata?: Record<string, any>;
}

export interface AddPointsRequest {
  team_id: number;
  points: number;
  challenge_name?: string;
  description?: string;
}

export interface CreateProgressRequest {
  team_id: number;
  milestone: string;
  percentage: number;
  notes?: string;
  completed_at?: string;
}

export interface UpdateProgressRequest {
  milestone?: string;
  percentage?: number;
  notes?: string;
  completed_at?: string;
}

