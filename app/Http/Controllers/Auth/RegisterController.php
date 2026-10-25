<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Users\CreateUser;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        syncLangFiles('auth/register');

        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(RegisterRequest $request, CreateUser $createUser): RedirectResponse
    {
        $user = $createUser->handle(
            displayName: $request->display_name,
            email: $request->email,
            password: $request->password,
        );

        Auth::login($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
