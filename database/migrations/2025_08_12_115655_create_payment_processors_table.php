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
        Schema::create('payment_processors', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('user_id')->constrained()->cascadeOnDelete();
            $table->string('processor')->index();
            $table->string('webhook_signing_secret')->index()->unique();
            $table->json('config');
            $table->boolean('is_active');
            $table->timestamps();
            $table->unique(['user_id', 'processor']);
        });
    }
};
