<?php

namespace App\Actions\Settings;

use App\Models\User;
use App\Support\Str;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class StoreProfilePhoto
{
    public function handle(User $user, UploadedFile $file): void
    {
        if ($user->profile_photo && ! Str::containsHttps($user->profile_photo)) {
            Storage::disk('public')->delete($user->profile_photo);
        }

        $filename = 'profile-photos/'.$user->id.'-'.time().'.'.$file->getClientOriginalExtension();
        $path = Storage::disk('public')->putFileAs('/', $file, $filename);
        $user->update(['profile_photo' => $path]);
    }
}
