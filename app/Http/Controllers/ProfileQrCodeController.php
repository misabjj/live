<?php

namespace App\Http\Controllers;

use App\Actions\Settings\UpdateProfileQrCode;
use App\Enums\QrCodeDotsType;
use App\Enums\QrCodeGradientType;
use App\Http\Requests\ProfileQrCodeRequest;
use App\Models\Widget;
use App\Support\AuthenticatedUser;
use App\Support\Toast;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProfileQrCodeController extends Controller
{
    public function index(): Response
    {
        $user = app(AuthenticatedUser::class)->get();
        $profileQrCode = $user->profileQrCode;
        $widget = Widget::profileQrCode()->where('user_id', $user->id)->first();

        return Inertia::render('settings/profile-qr-code', [
            'user' => ['profile_url' => $user->getShortProfileUrl()],
            'profile_qr_code' => [
                'gradient_color_1' => $profileQrCode->gradient_color_1,
                'gradient_color_2' => $profileQrCode->gradient_color_2,
                'gradient_type' => $profileQrCode->gradient_type,
                'gradient_rotation' => $profileQrCode->gradient_rotation,
                'dots_type' => $profileQrCode->dots_type,
                'text_color' => $profileQrCode->text_color,
                'background_color' => $profileQrCode->background_color,
                'message' => $profileQrCode->message,
            ],
            'gradient_type_options' => QrCodeGradientType::options(),
            'dot_type_options' => QrCodeDotsType::options(),
            'widget' => $widget ? ['id' => $widget->id, 'url' => $widget->getUrl()] : null,
        ]);
    }

    /**
     * @throws \Throwable
     */
    public function store(ProfileQrCodeRequest $request, UpdateProfileQrCode $updateProfileQrCode): RedirectResponse
    {
        $updateProfileQrCode->handle(app(AuthenticatedUser::class)->get(), $request->validated());

        Toast::success(__('toasts.profile_qr_code_saved'));

        return back();
    }
}
