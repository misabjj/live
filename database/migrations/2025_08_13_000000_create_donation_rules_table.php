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
        Schema::create('donation_rules', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('user_id')->unique()->constrained()->cascadeOnDelete();

            $table->boolean('accept_ai_audio');
            $table->boolean('accept_donor_audio');

            // Minimum amounts per content type
            $table->decimal('min_amount_text', 8, 2);
            $table->decimal('min_amount_text_to_speech', 8, 2);
            $table->decimal('min_amount_audio', 8, 2);

            // Maximum characters for text-based content
            $table->integer('max_characters_text');
            $table->integer('max_characters_text_to_speech');

            // Maximum audio duration in seconds
            $table->integer('max_audio_duration');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donation_rules');
    }
};
