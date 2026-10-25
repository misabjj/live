<?php

namespace App\Http\Controllers\Settings;

use App\Events\Widgets\ProfileQrCodeUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateProfileRequest;
use App\Support\Toast;
use Illuminate\Support\Facades\DB;

class ProfileController extends Controller
{
    public function show()
    {
        $user = auth()->user();

        return inertia('settings/profile', [
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
    public function update(UpdateProfileRequest $request)
    {
        $user = auth()->user();

        DB::transaction(function () use ($user, $request) {
            $oldHandle = $user->handle;

            $user->update([
                'display_name' => $request->input('display_name'),
                'handle' => $request->input('handle'),

                'background_image' => $request->hasFile('background_image')
                    ? $request->file('background_image')->store('background-images', 'public')
                    : $user->background_image,

                'background_color' => $request->input('background_color'),
            ]);

            if ($oldHandle !== $user->handle) {
                broadcast(new ProfileQrCodeUpdated($user->profileQrCode));
            }
        });

        Toast::success('Atualizado com sucesso!');

        return back();
    }
}
