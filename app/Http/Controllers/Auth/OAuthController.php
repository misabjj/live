<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\LoginOrRegisterWithOAuth;
use App\Actions\Auth\LoginUser;
use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Throwable;

class OAuthController extends Controller
{
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
    public function callback(string $provider, LoginOrRegisterWithOAuth $loginOrRegisterWithOAuth, LoginUser $loginUser): RedirectResponse
    {
        $this->validateProvider($provider);

        $providerUser = Socialite::driver($provider)->user();

        $user = $loginOrRegisterWithOAuth->handle(
            $provider,
            $providerUser->getId(),
            $providerUser->getName() ?? '',
            $providerUser->getEmail() ?? '',
            $providerUser->getAvatar(),
            $providerUser->token ?? null
        );

        $loginUser->handle($user);

        return redirect()->intended(route('dashboard', absolute: false));
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
