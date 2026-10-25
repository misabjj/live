<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donations', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('streamer_id')->constrained(table: 'users');
            $table->foreignUlid('goal_id')->nullable()->constrained();

            $table->char('currency', 3);
            $table->decimal('amount')->unsigned();

            $table->string('donor_name');
            $table->string('donor_browser_fingerprint');
            $table->ipAddress('donor_ip_address');
            $table->foreignUlid('donor_id')->nullable()->constrained(table: 'users');

            $table->string('status');

            $table->string('payment_processor');
            $table->string('payment_method');

            $table->string('payment_id')->unique();
            $table->longText('payment_reference');
            $table->string('payment_split_id')->nullable();

            $table->string('content_type');
            $table->longText('content_text')->nullable();
            $table->string('content_path')->nullable();

            $table->foreignUlid('narrator_id')->nullable()->constrained();

            $table->timestamp('created_at');

            $table->timestamp('approved_at')->nullable();

            $table->timestamp('expires_at');
            $table->timestamp('expired_at')->nullable();

            $table->boolean('in_queue')->default(false);

            $table->timestamp('banned_at')->nullable();

            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
