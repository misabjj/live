<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadProfilePhotoRequest;
use App\Support\Str;
use App\Support\Toast;
use Illuminate\Support\Facades\Storage;

class ProfilePhotoController extends Controller
{
    public function store(UploadProfilePhotoRequest $request)
    {
        $user = auth()->user();

        if ($user->profile_photo) {
            if (! Str::containsHttps($user->profile_photo)) {
                Storage::disk('public')->delete($user->profile_photo);
            }
        }

        $file = $request->file('photo');
        $filename = 'profile-photos/'.$user->id.'-'.time().'.'.$file->getClientOriginalExtension();

        $path = Storage::disk('public')->putFileAs('/', $file, $filename);

        $user->update(['profile_photo' => $path]);

        Toast::success('Foto de perfil atualizada com sucesso!');

        return back();
    }

    public function destroy()
    {
        $user = auth()->user();

        if ($user->profile_photo) {
            if (! Str::containsHttps($user->profile_photo)) {
                Storage::disk('public')->delete($user->profile_photo);
            }

            $user->update(['profile_photo' => null]);
        }

        Toast::success('Foto de perfil removida com sucesso!');

        return back();
    }
}
