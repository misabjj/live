<?php

namespace App\Policies;

use App\Models\Donation;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class DonationPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Donation $donation): Response
    {
        if ($donation->streamer_id !== $user->id) {
            return $this->denyAsNotFound();
        }

        return $this->allow();
    }
}
