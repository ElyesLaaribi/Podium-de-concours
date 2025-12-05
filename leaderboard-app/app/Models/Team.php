<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'color',
        'logo_url',
        'is_active',
        'total_score',
        'rank',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'total_score' => 'integer',
        'rank' => 'integer',
    ];

    /**
     * Relation avec les scores
     */
    public function scores(): HasMany
    {
        return $this->hasMany(Score::class);
    }

    /**
     * Relation avec les progressions
     */
    public function progress(): HasMany
    {
        return $this->hasMany(Progress::class);
    }

    /**
     * Calculer et mettre à jour le score total
     */
    public function updateTotalScore(): void
    {
        $this->total_score = $this->scores()->sum('points');
        $this->save();
    }

    /**
     * Mettre à jour le classement de toutes les équipes
     */
    public static function updateAllRanks(): void
    {
        $teams = self::where('is_active', true)
            ->orderBy('total_score', 'desc')
            ->orderBy('updated_at', 'asc')
            ->get();

        foreach ($teams as $index => $team) {
            $team->rank = $index + 1;
            $team->save();
        }
    }

    /**
     * Mettre à jour le classement de cette équipe
     */
    public function updateRank(): void
    {
        self::updateAllRanks();
    }
}
