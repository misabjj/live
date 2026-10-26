<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\ConfirmPassword;
use App\Http\Controllers\Controller;
use App\Support\AuthenticatedUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ConfirmablePasswordController extends Controller
{
    /**
     * Show the confirm password page.
     */
    public function show(): Response
    {
        syncLangFiles('auth/confirm-password');

        return Inertia::render('auth/confirm-password');
    }

    /**
     * Confirm the user's password.
     */
    public function store(Request $request, ConfirmPassword $confirmPassword): RedirectResponse
    {
        $confirmPassword->handle(app(AuthenticatedUser::class)->get(), $request->string('password')->toString(), $request->session());

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
