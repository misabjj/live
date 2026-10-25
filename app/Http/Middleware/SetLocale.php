<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    private array $supportedLocales = ['pt', 'en', 'es'];

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        //        $urlLocale = $request->route('locale');
        //
        //        if ($urlLocale && in_array($urlLocale, $this->supportedLocales)) {
        //            app()->setLocale($urlLocale);
        //        } else {
        //            app()->setLocale(
        //                $this->getPreferredLocale($request)
        //            );
        //        }

        // Add locale data to all Inertia responses
        Inertia::share([
            'locale' => app()->getLocale(),
        ]);

        return $next($request);
    }

    /**
     * Get user's preferred language from browser Accept-Language header
     */
    private function getPreferredLocale(Request $request): string
    {
        $acceptLanguage = $request->header('Accept-Language', '');

        // Parse Accept-Language header (e.g., "en-US,en;q=0.9,pt;q=0.8")
        $languages = [];
        if (preg_match_all('/([a-z]{2})(?:-[A-Z]{2})?(?:;q=([0-9.]+))?/i', $acceptLanguage, $matches, PREG_SET_ORDER)) {
            foreach ($matches as $match) {
                $lang = strtolower($match[1]);
                $quality = isset($match[2]) ? (float) $match[2] : 1.0;
                $languages[$lang] = $quality;
            }

            // Sort by quality (preference)
            arsort($languages);

            // Check if we support any of the preferred languages
            foreach (array_keys($languages) as $lang) {
                if (in_array($lang, $this->supportedLocales)) {
                    return $lang;
                }
            }
        }

        // Default to pt if no supported language found
        return 'pt';
    }
}
