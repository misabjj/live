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
        Schema::create('goals', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('background_color');
            $table->string('progress_bar_color');
            $table->string('text_color');
            $table->decimal('raised_amount', 10, 2)->default(0)->unsigned();
            $table->decimal('target_amount', 10, 2)->unsigned();
            $table->boolean('show_profile_link');
            $table->boolean('is_active')->index();
            $table->timestamps();
            $table->timestamp('closes_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('goals');
    }
};
