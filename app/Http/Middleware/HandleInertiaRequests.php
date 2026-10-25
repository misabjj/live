<?php

namespace App\Http\Middleware;

use App\Navigation\Navigation;
use App\Support\Toast;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => auth()->user()->id,
                    'handle' => auth()->user()->handle,
                    'display_name' => auth()->user()->display_name,
                    'email' => auth()->user()->email,
                    'profile_photo' => auth()->user()->getProfilePhotoUrl(),
                    'accepting_donations' => auth()->user()->accepting_donations,
                    'created_at' => auth()->user()->created_at,
                ] : null,
            ],
            'locale' => app()->getLocale(),
            'navigation' => $this->shouldShowPanel($request) ? Navigation::getNavigationItems(
                $request->user()
            ) : null,
            'toasts' => Toast::pull(),
        ];
    }

    /**
     * Determine if the current request should show the panel layout.
     */
    protected function shouldShowPanel(Request $request): bool
    {
        // Don't show panel for unauthenticated users
        if (! $request->user()) {
            return false;
        }

        $routeName = $request->route()?->getName();

        // List of routes that should NOT have panel layout
        $excludedRoutes = [
            'donate.show',
            'donate.store',
            'home',
            'welcome',
            // Auth routes
            'login',
            'register',
            'password.email',
            'password.reset',
            'password.update',
            'password.confirm',
            'verification.notice',
            'verification.verify',
            'verification.send',
        ];

        // Exclude auth routes pattern
        if ($routeName && (
            str_starts_with($routeName, 'login') ||
            str_starts_with($routeName, 'register') ||
            str_starts_with($routeName, 'password.') ||
            str_starts_with($routeName, 'verification.')
        )) {
            return false;
        }

        // Exclude specific routes
        if (in_array($routeName, $excludedRoutes)) {
            return false;
        }

        // Show panel for authenticated users on dashboard, donations, admin routes, etc.
        return true;
    }
}
