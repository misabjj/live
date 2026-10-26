<?php

namespace App\Http\Controllers\Settings;

use App\Actions\Settings\DeleteProfilePhoto;
use App\Actions\Settings\StoreProfilePhoto;
use App\Http\Controllers\Controller;
use App\Http\Requests\UploadProfilePhotoRequest;
use App\Support\AuthenticatedUser;
use App\Support\Toast;
use Illuminate\Http\RedirectResponse;

class ProfilePhotoController extends Controller
{
    public function store(UploadProfilePhotoRequest $request, StoreProfilePhoto $storeProfilePhoto): RedirectResponse
    {
        $storeProfilePhoto->handle(app(AuthenticatedUser::class)->get(), $request->file('photo'));

        Toast::success(__('toasts.profile_photo_updated'));

        return back();
    }

    public function destroy(DeleteProfilePhoto $deleteProfilePhoto): RedirectResponse
    {
        $deleteProfilePhoto->handle(app(AuthenticatedUser::class)->get());

        Toast::success(__('toasts.profile_photo_removed'));

        return back();
    }
}
