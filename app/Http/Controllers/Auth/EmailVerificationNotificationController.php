<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\SendEmailVerificationNotification;
use App\Http\Controllers\Controller;
use App\Support\AuthenticatedUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request, SendEmailVerificationNotification $sendVerificationNotification): RedirectResponse
    {
        $user = app(AuthenticatedUser::class)->get();

        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        $sendVerificationNotification->handle($user);

        return back()->with('status', 'verification-link-sent');
    }
}
