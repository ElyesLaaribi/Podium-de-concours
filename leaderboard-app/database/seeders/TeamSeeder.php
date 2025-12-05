<?php

namespace Database\Seeders;

use App\Models\Team;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teams = [
            [
                'name' => 'Les Champions',
                'code' => 'CHAMP001',
                'description' => 'Équipe déterminée à remporter la victoire',
                'color' => '#FF6B6B',
                'is_active' => true,
            ],
            [
                'name' => 'Code Masters',
                'code' => 'CODE001',
                'description' => 'Spécialistes en développement',
                'color' => '#4ECDC4',
                'is_active' => true,
            ],
            [
                'name' => 'Innovation Squad',
                'code' => 'INNO001',
                'description' => 'Pionniers de nouvelles solutions',
                'color' => '#95E1D3',
                'is_active' => true,
            ],
            [
                'name' => 'Tech Warriors',
                'code' => 'TECH001',
                'description' => 'Guerriers de la technologie',
                'color' => '#F38181',
                'is_active' => true,
            ],
            [
                'name' => 'Digital Ninjas',
                'code' => 'NINJ001',
                'description' => 'Maîtres du numérique',
                'color' => '#AA96DA',
                'is_active' => true,
            ],
        ];

        foreach ($teams as $team) {
            Team::create($team);
        }
    }
}
