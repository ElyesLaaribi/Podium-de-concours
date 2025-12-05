import axios, { AxiosInstance } from 'axios';
import type {
  Team,
  Score,
  Progress,
  LeaderboardStats,
  ApiResponse,
  PaginatedResponse,
  CreateTeamRequest,
  UpdateTeamRequest,
  CreateScoreRequest,
  AddPointsRequest,
  CreateProgressRequest,
  UpdateProgressRequest,
} from '../types';

// API Base URL - adjust this to match your Laravel backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // ==================== Teams ====================
  
  /**
   * Get all teams
   */
  async getTeams(): Promise<ApiResponse<Team[]>> {
    const response = await this.api.get<ApiResponse<Team[]>>('/teams');
    return response.data;
  }

  /**
   * Get a single team by ID
   */
  async getTeam(id: number): Promise<ApiResponse<Team>> {
    const response = await this.api.get<ApiResponse<Team>>(`/teams/${id}`);
    return response.data;
  }

  /**
   * Create a new team
   */
  async createTeam(data: CreateTeamRequest): Promise<ApiResponse<Team>> {
    const response = await this.api.post<ApiResponse<Team>>('/teams', data);
    return response.data;
  }

  /**
   * Update a team
   */
  async updateTeam(id: number, data: UpdateTeamRequest): Promise<ApiResponse<Team>> {
    const response = await this.api.put<ApiResponse<Team>>(`/teams/${id}`, data);
    return response.data;
  }

  /**
   * Delete a team
   */
  async deleteTeam(id: number): Promise<ApiResponse<void>> {
    const response = await this.api.delete<ApiResponse<void>>(`/teams/${id}`);
    return response.data;
  }

  // ==================== Leaderboard ====================
  
  /**
   * Get full leaderboard with pagination
   */
  async getLeaderboard(limit = 50, offset = 0): Promise<PaginatedResponse<Team>> {
    const response = await this.api.get<PaginatedResponse<Team>>('/leaderboard', {
      params: { limit, offset },
    });
    return response.data;
  }

  /**
   * Get top N teams
   */
  async getTopTeams(limit = 10): Promise<ApiResponse<Team[]>> {
    const response = await this.api.get<ApiResponse<Team[]>>('/leaderboard/top', {
      params: { limit },
    });
    return response.data;
  }

  /**
   * Get leaderboard statistics
   */
  async getLeaderboardStats(): Promise<ApiResponse<LeaderboardStats>> {
    const response = await this.api.get<ApiResponse<LeaderboardStats>>('/leaderboard/stats');
    return response.data;
  }

  // ==================== Scores ====================
  
  /**
   * Get all scores with optional filters
   */
  async getScores(params?: {
    team_id?: number;
    challenge_name?: string;
    per_page?: number;
  }): Promise<ApiResponse<Score[]>> {
    const response = await this.api.get<ApiResponse<Score[]>>('/scores', { params });
    return response.data;
  }

  /**
   * Get a single score by ID
   */
  async getScore(id: number): Promise<ApiResponse<Score>> {
    const response = await this.api.get<ApiResponse<Score>>(`/scores/${id}`);
    return response.data;
  }

  /**
   * Create a new score
   */
  async createScore(data: CreateScoreRequest): Promise<ApiResponse<Score>> {
    const response = await this.api.post<ApiResponse<Score>>('/scores', data);
    return response.data;
  }

  /**
   * Add points to a team (simplified method)
   */
  async addPoints(data: AddPointsRequest): Promise<ApiResponse<Score>> {
    const response = await this.api.post<ApiResponse<Score>>('/scores/add-points', data);
    return response.data;
  }

  /**
   * Update a score
   */
  async updateScore(id: number, data: Partial<CreateScoreRequest>): Promise<ApiResponse<Score>> {
    const response = await this.api.put<ApiResponse<Score>>(`/scores/${id}`, data);
    return response.data;
  }

  /**
   * Delete a score
   */
  async deleteScore(id: number): Promise<ApiResponse<void>> {
    const response = await this.api.delete<ApiResponse<void>>(`/scores/${id}`);
    return response.data;
  }

  // ==================== Progress ====================
  
  /**
   * Get all progress entries with optional filter
   */
  async getProgress(team_id?: number): Promise<ApiResponse<Progress[]>> {
    const response = await this.api.get<ApiResponse<Progress[]>>('/progress', {
      params: team_id ? { team_id } : {},
    });
    return response.data;
  }

  /**
   * Get a single progress entry by ID
   */
  async getProgressEntry(id: number): Promise<ApiResponse<Progress>> {
    const response = await this.api.get<ApiResponse<Progress>>(`/progress/${id}`);
    return response.data;
  }

  /**
   * Create a new progress entry
   */
  async createProgress(data: CreateProgressRequest): Promise<ApiResponse<Progress>> {
    const response = await this.api.post<ApiResponse<Progress>>('/progress', data);
    return response.data;
  }

  /**
   * Update a progress entry
   */
  async updateProgress(id: number, data: UpdateProgressRequest): Promise<ApiResponse<Progress>> {
    const response = await this.api.put<ApiResponse<Progress>>(`/progress/${id}`, data);
    return response.data;
  }

  /**
   * Delete a progress entry
   */
  async deleteProgress(id: number): Promise<ApiResponse<void>> {
    const response = await this.api.delete<ApiResponse<void>>(`/progress/${id}`);
    return response.data;
  }
}

// Export a singleton instance
export const apiService = new ApiService();
export default apiService;

