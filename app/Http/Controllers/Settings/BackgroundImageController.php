<?php

namespace App\Http\Controllers\Settings;

use App\Actions\Settings\DeleteBackgroundImage;
use App\Actions\Settings\StoreBackgroundImage;
use App\Http\Controllers\Controller;
use App\Http\Requests\UploadBackgroundImageRequest;
use App\Support\AuthenticatedUser;
use App\Support\Toast;
use Illuminate\Http\RedirectResponse;

class BackgroundImageController extends Controller
{
    public function store(UploadBackgroundImageRequest $request, StoreBackgroundImage $storeBackgroundImage): RedirectResponse
    {
        $storeBackgroundImage->handle(app(AuthenticatedUser::class)->get(), $request->file('photo'));

        Toast::success(__('toasts.background_image_updated'));

        return back();
    }

    public function destroy(DeleteBackgroundImage $deleteBackgroundImage): RedirectResponse
    {
        $deleteBackgroundImage->handle(app(AuthenticatedUser::class)->get());

        Toast::success(__('toasts.background_image_removed'));

        return back();
    }
}
