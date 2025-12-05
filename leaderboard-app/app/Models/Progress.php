<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Progress extends Model
{
    use HasFactory;

    protected $fillable = [
        'team_id',
        'milestone',
        'percentage',
        'notes',
        'completed_at',
    ];

    protected $casts = [
        'percentage' => 'integer',
        'completed_at' => 'datetime',
    ];

    /**
     * Relation avec l'équipe
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
