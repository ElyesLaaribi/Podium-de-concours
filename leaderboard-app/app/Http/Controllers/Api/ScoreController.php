<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Score;
use App\Models\Team;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ScoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Score::with('team');

        // Filtrer par équipe
        if ($request->has('team_id')) {
            $query->where('team_id', $request->team_id);
        }

        // Filtrer par challenge
        if ($request->has('challenge_name')) {
            $query->where('challenge_name', $request->challenge_name);
        }

        $scores = $query->orderBy('achieved_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $scores,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'team_id' => 'required|exists:teams,id',
            'points' => 'required|integer|min:0',
            'challenge_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'achieved_at' => 'nullable|date',
            'metadata' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->all();
        if (!isset($data['achieved_at'])) {
            $data['achieved_at'] = now();
        }

        $score = Score::create($data);

        return response()->json([
            'success' => true,
            'data' => $score->load('team'),
            'message' => 'Score ajouté avec succès',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $score = Score::with('team')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $score,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $score = Score::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'team_id' => 'sometimes|exists:teams,id',
            'points' => 'sometimes|integer|min:0',
            'challenge_name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'achieved_at' => 'nullable|date',
            'metadata' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $score->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $score->load('team'),
            'message' => 'Score mis à jour avec succès',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $score = Score::findOrFail($id);
        $score->delete();

        return response()->json([
            'success' => true,
            'message' => 'Score supprimé avec succès',
        ]);
    }

    /**
     * Ajouter des points à une équipe
     */
    public function addPoints(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'team_id' => 'required|exists:teams,id',
            'points' => 'required|integer',
            'challenge_name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $team = Team::findOrFail($request->team_id);

        $score = Score::create([
            'team_id' => $team->id,
            'points' => $request->points,
            'challenge_name' => $request->challenge_name,
            'description' => $request->description,
            'achieved_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $score->load('team'),
            'message' => 'Points ajoutés avec succès',
        ], 201);
    }
}
