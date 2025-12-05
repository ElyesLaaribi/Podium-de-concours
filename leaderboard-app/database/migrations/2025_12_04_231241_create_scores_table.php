<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained()->onDelete('cascade');
            $table->integer('points'); // Points gagnés
            $table->string('challenge_name'); // Nom du défi/challenge
            $table->text('description')->nullable();
            $table->timestamp('achieved_at'); // Date/heure de l'obtention
            $table->json('metadata')->nullable(); // Données supplémentaires
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scores');
    }
};
