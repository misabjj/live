<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class MakeUserAdmin extends Command
{
    protected $signature = 'user:toggle-admin {email : The email address of the user}';

    protected $description = 'Toggle admin status for a user by their email address';

    public function handle(): int
    {
        $email = $this->argument('email');

        $user = User::where('email', $email)->first();

        if (! $user) {
            $this->error("User with email '{$email}' not found.");

            return self::FAILURE;
        }

        $user->update(['is_admin' => ! $user->is_admin]);

        $status = $user->is_admin ? 'now an admin' : 'no longer an admin';

        $this->info("User '{$user->display_name}' ({$email}) is {$status}.");

        return self::SUCCESS;
    }
}
