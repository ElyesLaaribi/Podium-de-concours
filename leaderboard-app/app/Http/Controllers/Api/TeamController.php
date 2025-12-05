<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $teams = Team::where('is_active', true)
            ->with(['scores' => function ($query) {
                $query->latest()->limit(5);
            }])
            ->orderBy('rank', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $teams,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:teams,code',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
            'logo_url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $team = Team::create($request->all());
        $team->updateRank();

        return response()->json([
            'success' => true,
            'data' => $team,
            'message' => 'Équipe créée avec succès',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $team = Team::with(['scores', 'progress'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $team,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $team = Team::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|max:50|unique:teams,code,' . $id,
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
            'logo_url' => 'nullable|url',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $team->update($request->all());
        $team->updateRank();

        return response()->json([
            'success' => true,
            'data' => $team,
            'message' => 'Équipe mise à jour avec succès',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $team = Team::findOrFail($id);
        $team->delete();
        Team::updateAllRanks();

        return response()->json([
            'success' => true,
            'message' => 'Équipe supprimée avec succès',
        ]);
    }
}
