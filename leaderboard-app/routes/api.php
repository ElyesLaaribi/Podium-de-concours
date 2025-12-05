<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\LeaderboardController;
use App\Http\Controllers\Api\ScoreController;
use App\Http\Controllers\Api\ProgressController;

// Routes pour les équipes
Route::prefix('teams')->group(function () {
    Route::get('/', [TeamController::class, 'index']);
    Route::post('/', [TeamController::class, 'store']);
    Route::get('/{id}', [TeamController::class, 'show']);
    Route::put('/{id}', [TeamController::class, 'update']);
    Route::patch('/{id}', [TeamController::class, 'update']);
    Route::delete('/{id}', [TeamController::class, 'destroy']);
});

// Routes pour le classement
Route::prefix('leaderboard')->group(function () {
    Route::get('/', [LeaderboardController::class, 'index']);
    Route::get('/top', [LeaderboardController::class, 'top']);
    Route::get('/stats', [LeaderboardController::class, 'stats']);
});

// Routes pour les scores
Route::prefix('scores')->group(function () {
    Route::get('/', [ScoreController::class, 'index']);
    Route::post('/', [ScoreController::class, 'store']);
    Route::post('/add-points', [ScoreController::class, 'addPoints']);
    Route::get('/{id}', [ScoreController::class, 'show']);
    Route::put('/{id}', [ScoreController::class, 'update']);
    Route::patch('/{id}', [ScoreController::class, 'update']);
    Route::delete('/{id}', [ScoreController::class, 'destroy']);
});

// Routes pour la progression
Route::prefix('progress')->group(function () {
    Route::get('/', [ProgressController::class, 'index']);
    Route::post('/', [ProgressController::class, 'store']);
    Route::get('/{id}', [ProgressController::class, 'show']);
    Route::put('/{id}', [ProgressController::class, 'update']);
    Route::patch('/{id}', [ProgressController::class, 'update']);
    Route::delete('/{id}', [ProgressController::class, 'destroy']);
});


