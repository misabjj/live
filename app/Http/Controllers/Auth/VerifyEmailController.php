<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\VerifyEmail;
use App\Http\Controllers\Controller;
use App\Support\AuthenticatedUser;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request, VerifyEmail $verifyEmail): RedirectResponse
    {
        if (app(AuthenticatedUser::class)->get()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
        }

        $verifyEmail->handle($request);

        return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
    }
}
