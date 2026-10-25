<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Users\CreateUser;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class OAuthController extends Controller
{
    public function __construct(
        private readonly CreateUser $createUser,
    ) {}

    /**
     * Redirect to OAuth provider
     */
    public function redirect(string $provider): RedirectResponse
    {
        $this->validateProvider($provider);

        return Socialite::driver($provider)->redirect();
    }

    /**
     * Handle OAuth callback
     *
     * @throws Throwable
     */
    public function callback(string $provider): RedirectResponse
    {
        $this->validateProvider($provider);

        $providerUser = Socialite::driver($provider)->user();

        $user = $this->loginOrRegisterWithOAuth(
            $provider,
            $providerUser->id,
            $providerUser->name,
            $providerUser->email,
            $providerUser->avatar,
            $providerUser->token,
            $providerUser->refreshToken
        );

        Auth::login($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Login or register a user via OAuth
     *
     * @throws Throwable
     */
    private function loginOrRegisterWithOAuth(
        string $provider,
        string $providerId,
        string $name,
        string $email,
        ?string $avatar = null,
        ?string $token = null,
        ?string $refreshToken = null
    ): User {
        return DB::transaction(function () use ($provider, $providerId, $name, $email, $avatar, $token) {
            // Look for existing user by email or provider ID
            $user = User::where('email', $email)
                ->orWhere(function ($query) use ($provider, $providerId) {
                    $query->where('provider_name', $provider)
                        ->where('provider_id', $providerId);
                })
                ->first();

            if ($user) {
                // Update OAuth information if needed
                $user->update([
                    'provider_name' => $provider,
                    'provider_id' => $providerId,
                    'profile_photo' => $avatar,
                    'provider_token' => $token,
                ]);

                return $user;
            }

            return $this->createUser->handle(
                displayName: $name,
                email: $email,
                password: null,
                emailVerifiedAt: now(),
                providerName: $provider,
                providerId: $providerId,
                profilePhoto: $avatar,
                providerToken: $token,
            );
        });
    }

    /**
     * Validate the OAuth provider
     */
    private function validateProvider(string $provider): void
    {
        $supportedProviders = ['google', 'apple'];

        if (! in_array($provider, $supportedProviders)) {
            abort(404, __('messages.provider_not_supported'));
        }
    }
}
