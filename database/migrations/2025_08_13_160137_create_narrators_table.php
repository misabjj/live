<?php

use App\Support\SupertonicVoice;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('narrators', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->string('image_path')->nullable();
            $table->string('voice_id')->unique();
            $table->string('voice_preview_path');
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        foreach (SupertonicVoice::all() as $voice) {
            DB::table('narrators')->insert([
                'id' => strtolower((string) Str::ulid()),
                ...$voice,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('narrators');
    }
};
