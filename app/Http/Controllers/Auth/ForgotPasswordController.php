<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\SendPasswordResetLink;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ForgotPasswordController extends Controller
{
    /**
     * Show the password reset link request page.
     */
    public function create(Request $request): Response
    {
        syncLangFiles('auth/forgot-password');

        return Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws ValidationException
     */
    public function store(Request $request, SendPasswordResetLink $sendPasswordResetLink): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $sendPasswordResetLink->handle($request->string('email')->toString());

        return back()->with('status', __('A reset link will be sent if the account exists.'));
    }
}
