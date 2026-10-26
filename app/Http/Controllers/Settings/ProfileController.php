<?php

namespace App\Http\Controllers\Settings;

use App\Actions\Settings\UpdateProfile;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateProfileRequest;
use App\Support\AuthenticatedUser;
use App\Support\Toast;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function show(): Response
    {
        $user = app(AuthenticatedUser::class)->get();

        return Inertia::render('settings/profile', [
            'user' => [
                'display_name' => $user->display_name,
                'email' => $user->email,
                'handle' => $user->handle,
                'profile_photo' => $user->getProfilePhotoUrl(),
                'background_image' => $user->getBackgroundImageUrl(),
                'background_color' => $user->background_color,
                'profile_url' => $user->getShortProfileUrl(),
            ],
        ]);
    }

    /**
     * @throws \Throwable
     */
    public function update(UpdateProfileRequest $request, UpdateProfile $updateProfile): RedirectResponse
    {
        $user = app(AuthenticatedUser::class)->get();

        $updateProfile->handle($user, $request->validated(), $request->file('background_image'));

        Toast::success(__('toasts.profile_updated'));

        return back();
    }
}
