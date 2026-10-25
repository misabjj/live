<?php

namespace Database\Seeders;

use App\Models\Narrator;
use App\Support\SupertonicVoice;
use Illuminate\Database\Seeder;

class NarratorSeeder extends Seeder
{
    public function run(): void
    {
        Narrator::query()->update(['is_active' => false]);

        foreach (SupertonicVoice::all() as $narrator) {
            Narrator::updateOrCreate(
                ['voice_id' => $narrator['voice_id']],
                $narrator
            );
        }
    }
}
