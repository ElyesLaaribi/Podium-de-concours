<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Score extends Model
{
    use HasFactory;

    protected $fillable = [
        'team_id',
        'points',
        'challenge_name',
        'description',
        'achieved_at',
        'metadata',
    ];

    protected $casts = [
        'achieved_at' => 'datetime',
        'metadata' => 'array',
        'points' => 'integer',
    ];

    /**
     * Relation avec l'équipe
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Hook pour mettre à jour le score total de l'équipe après création/modification
     */
    protected static function booted(): void
    {
        static::created(function (Score $score) {
            $score->team->updateTotalScore();
            $score->team->updateRank();
        });

        static::updated(function (Score $score) {
            $score->team->updateTotalScore();
            $score->team->updateRank();
        });

        static::deleted(function (Score $score) {
            $score->team->updateTotalScore();
            $score->team->updateRank();
        });
    }
}
