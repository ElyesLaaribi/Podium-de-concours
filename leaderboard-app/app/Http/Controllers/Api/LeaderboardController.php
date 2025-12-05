<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    /**
     * Obtenir le classement complet
     */
    public function index(Request $request): JsonResponse
    {
        $limit = $request->get('limit', 50);
        $offset = $request->get('offset', 0);

        // Mettre à jour les rangs avant de récupérer
        Team::updateAllRanks();

        $teams = Team::where('is_active', true)
            ->withCount('scores')
            ->orderBy('rank', 'asc')
            ->orderBy('total_score', 'desc')
            ->skip($offset)
            ->take($limit)
            ->get();

        $total = Team::where('is_active', true)->count();

        return response()->json([
            'success' => true,
            'data' => $teams,
            'meta' => [
                'total' => $total,
                'limit' => $limit,
                'offset' => $offset,
            ],
        ]);
    }

    /**
     * Obtenir le top N des équipes
     */
    public function top(Request $request): JsonResponse
    {
        $limit = $request->get('limit', 10);

        Team::updateAllRanks();

        $teams = Team::where('is_active', true)
            ->with(['scores' => function ($query) {
                $query->latest()->limit(3);
            }])
            ->orderBy('rank', 'asc')
            ->take($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $teams,
        ]);
    }

    /**
     * Obtenir les statistiques globales
     */
    public function stats(): JsonResponse
    {
        $totalTeams = Team::where('is_active', true)->count();
        $totalScores = \App\Models\Score::count();
        $totalPoints = Team::where('is_active', true)->sum('total_score');
        $averageScore = $totalTeams > 0 ? round($totalPoints / $totalTeams, 2) : 0;

        $topTeam = Team::where('is_active', true)
            ->orderBy('total_score', 'desc')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'total_teams' => $totalTeams,
                'total_scores' => $totalScores,
                'total_points' => $totalPoints,
                'average_score' => $averageScore,
                'top_team' => $topTeam,
            ],
        ]);
    }
}
