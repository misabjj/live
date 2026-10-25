<?php

namespace App\Http\Controllers;

use App\Enums\QrCodeDotsType;
use App\Enums\QrCodeGradientType;
use App\Events\Widgets\ProfileQrCodeUpdated;
use App\Http\Requests\ProfileQrCodeRequest;
use App\Models\ProfileQrCode;
use App\Models\Widget;
use App\Support\Toast;
use Inertia\Inertia;

class ProfileQrCodeController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $profileQrCode = $user->profileQrCode;

        $widget = Widget::profileQrCode()->where('user_id', auth()->id())->first();

        return Inertia::render('settings/profile-qr-code', [
            'user' => [
                'profile_url' => $user->getShortProfileUrl(),
            ],
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
            'widget' => $widget ? [
                'id' => $widget->id,
                'url' => $widget->getUrl(),
            ] : null,
        ]);
    }

    /**
     * @throws \Throwable
     */
    public function store(ProfileQrCodeRequest $request)
    {
        \DB::transaction(function () use ($request) {
            $profileQrCode = ProfileQrCode::updateOrCreate([
                'user_id' => auth()->id(),
            ], $request->validated());

            broadcast(new ProfileQrCodeUpdated($profileQrCode));
        });

        Toast::success('QR code salvo com sucesso!');

        return back();
    }
}
