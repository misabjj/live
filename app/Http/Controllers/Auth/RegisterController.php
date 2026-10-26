<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\LoginUser;
use App\Actions\Users\CreateUser;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Http\RedirectResponse;
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
    public function store(RegisterRequest $request, CreateUser $createUser, LoginUser $loginUser): RedirectResponse
    {
        $user = $createUser->handle(
            displayName: $request->display_name,
            email: $request->email,
            password: $request->password,
        );

        $loginUser->handle($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
