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
        Schema::create('profile_qr_codes', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('gradient_color_1', 7);
            $table->string('gradient_color_2', 7);
            $table->string('gradient_type');
            $table->integer('gradient_rotation');
            $table->string('dots_type', 20);
            $table->string('text_color', 7);
            $table->string('background_color', 7);
            $table->string('message', 64)->nullable();
            $table->timestamp('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profile_qr_codes');
    }
};
