<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsAdmin
{
    /**
     * Only let admins through. Everyone else is sent back to their
     * own dashboard instead of seeing a raw 403 page.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (! $request->user() || $request->user()->role !== 'admin') {
            abort(403, 'You do not have access to this page.');
        }

        return $next($request);
    }
}
