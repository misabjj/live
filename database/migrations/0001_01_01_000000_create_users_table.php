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
        Schema::create('users', function (Blueprint $table) {
            $table->ulid('id')->primary();

            // Basic user information
            $table->string('display_name'); // Nome de exibição
            $table->string('email')->unique();
            $table->string('handle', 30)->unique(); // Nome de usuário único (@handle)

            // Verification timestamps
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('verified_at')->nullable();

            // Authentication
            $table->string('password')->nullable();
            $table->string('provider_id')->nullable();
            $table->text('provider_token')->nullable();
            $table->string('provider_name')->nullable();

            $table->boolean('is_admin')->default(false);

            $table->string('profile_photo')->nullable();
            $table->string('background_image')->nullable();
            $table->string('background_color')->nullable();

            // Streaming features
            $table->boolean('accepting_donations')->default(false);
            $table->boolean('queue_paused')->default(false);

            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });
    }
};
