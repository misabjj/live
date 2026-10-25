<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadBackgroundImageRequest;
use App\Support\Toast;
use Illuminate\Support\Facades\Storage;

class BackgroundImageController extends Controller
{
    public function store(UploadBackgroundImageRequest $request)
    {
        $user = auth()->user();

        if ($user->background_image) {
            Storage::disk('public')->delete($user->background_image);
        }

        $file = $request->file('photo');
        $filename = 'background-images/'.$user->id.'-'.time().$file->getClientOriginalExtension();

        $path = Storage::disk('public')->putFileAs('/', $file, $filename);

        $user->update(['background_image' => $path]);

        Toast::success('Imagem de fundo atualizada com sucesso!');

        return back();
    }

    public function destroy()
    {
        $user = auth()->user();

        if ($user->background_image) {
            Storage::disk('public')->delete($user->background_image);

            $user->update(['background_image' => null]);
        }

        Toast::success('Imagem de fundo removida com sucesso!');

        return back();
    }
}
