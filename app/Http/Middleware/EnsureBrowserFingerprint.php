<?php

namespace App\Http\Middleware;

use App\Support\BrowserFingerprint;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureBrowserFingerprint
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! BrowserFingerprint::getFingerprint()) {
            BrowserFingerprint::setFingerprint(
                BrowserFingerprint::generateFingerprint()
            );
        }

        return $next($request);
    }
}
