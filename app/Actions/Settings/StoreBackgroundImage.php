<?php

namespace App\Actions\Settings;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class StoreBackgroundImage
{
    public function handle(User $user, UploadedFile $file): void
    {
        if ($user->background_image) {
            Storage::disk('public')->delete($user->background_image);
        }

        $filename = 'background-images/'.$user->id.'-'.time().'.'.$file->getClientOriginalExtension();
        $path = Storage::disk('public')->putFileAs('/', $file, $filename);
        $user->update(['background_image' => $path]);
    }
}
