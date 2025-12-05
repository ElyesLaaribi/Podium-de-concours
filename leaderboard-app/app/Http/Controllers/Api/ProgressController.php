<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Progress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProgressController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Progress::with('team');

        if ($request->has('team_id')) {
            $query->where('team_id', $request->team_id);
        }

        $progress = $query->orderBy('completed_at', 'desc')
            ->orderBy('percentage', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $progress,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'team_id' => 'required|exists:teams,id',
            'milestone' => 'required|string|max:255',
            'percentage' => 'required|integer|min:0|max:100',
            'notes' => 'nullable|string',
            'completed_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->all();
        if (!isset($data['completed_at']) && $data['percentage'] === 100) {
            $data['completed_at'] = now();
        }

        $progress = Progress::create($data);

        return response()->json([
            'success' => true,
            'data' => $progress->load('team'),
            'message' => 'Progression enregistrée avec succès',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $progress = Progress::with('team')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $progress,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $progress = Progress::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'team_id' => 'sometimes|exists:teams,id',
            'milestone' => 'sometimes|string|max:255',
            'percentage' => 'sometimes|integer|min:0|max:100',
            'notes' => 'nullable|string',
            'completed_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->all();
        // Si la progression atteint 100% et qu'il n'y a pas de date de complétion
        if (isset($data['percentage']) && $data['percentage'] === 100 && !$progress->completed_at) {
            $data['completed_at'] = now();
        }

        $progress->update($data);

        return response()->json([
            'success' => true,
            'data' => $progress->load('team'),
            'message' => 'Progression mise à jour avec succès',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $progress = Progress::findOrFail($id);
        $progress->delete();

        return response()->json([
            'success' => true,
            'message' => 'Progression supprimée avec succès',
        ]);
    }
}
