<?php

namespace Database\Seeders;

use App\Models\Score;
use App\Models\Team;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ScoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teams = Team::all();
        $challenges = [
            'Défi Initial',
            'Challenge Technique',
            'Épreuve Créative',
            'Défi Bonus',
            'Challenge Final',
        ];

        foreach ($teams as $team) {
            // Générer 3-5 scores aléatoires par équipe
            $scoreCount = rand(3, 5);
            
            for ($i = 0; $i < $scoreCount; $i++) {
                Score::create([
                    'team_id' => $team->id,
                    'points' => rand(10, 100),
                    'challenge_name' => $challenges[array_rand($challenges)],
                    'description' => 'Score obtenu lors du challenge',
                    'achieved_at' => now()->subHours(rand(1, 48)),
                    'metadata' => [
                        'difficulty' => ['easy', 'medium', 'hard'][array_rand(['easy', 'medium', 'hard'])],
                        'time_taken' => rand(5, 120),
                    ],
                ]);
            }
        }

        // Mettre à jour les rangs après avoir créé les scores
        Team::updateAllRanks();
    }
}
