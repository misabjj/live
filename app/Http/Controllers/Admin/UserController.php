<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = QueryBuilder::for(User::query())
            ->allowedFilters(
                AllowedFilter::partial('display_name'),
                AllowedFilter::partial('email'),
                AllowedFilter::partial('handle'),
            )
            ->defaultSort('-created_at')
            ->paginate()
            ->withQueryString()
            ->through(fn (User $user) => [
                'id' => $user->id,
                'display_name' => $user->display_name,
                'email' => $user->email,
                'handle' => $user->handle,
                'is_admin' => $user->is_admin,
                'accepting_donations' => $user->accepting_donations,
                'created_at' => $user->created_at->format('d/m/Y H:i'),
            ]);

        return inertia('admin/users/index', [
            'users' => $users,
            'filter' => [
                'display_name' => $request->query('filter.display_name', ''),
                'email' => $request->query('filter.email', ''),
                'handle' => $request->query('filter.handle', ''),
            ],
        ]);
    }
}
