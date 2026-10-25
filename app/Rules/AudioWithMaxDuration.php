<?php

namespace App\Rules;

use Closure;
use FFMpeg\FFMpeg;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;
use Illuminate\Translation\PotentiallyTranslatedString;

class AudioWithMaxDuration implements ValidationRule
{
    /**
     * Create a new rule instance.
     *
     * @param  int  $maxDuration  Maximum duration in seconds
     */
    public function __construct(private int $maxDuration = 300) {}

    /**
     * Run the validation rule.
     *
     * @param  Closure(string): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Check duration using FFmpeg
        $duration = $this->getAudioDuration($value);

        if ($duration === null) {
            $fail('Unable to determine the duration of the audio file.');

            return;
        }

        if ($duration > $this->maxDuration) {
            $fail('The :attribute must not exceed '.$this->formatDuration($this->maxDuration).'.');

            return;
        }
    }

    /**
     * Get audio duration using FFmpeg.
     *
     * @return int|null Duration in seconds or null if unable to determine
     */
    private function getAudioDuration(UploadedFile $file): ?int
    {
        $ffmpeg = FFMpeg::create([
            'ffmpeg.binaries' => config('laravel-ffmpeg.ffmpeg.binaries', '/opt/homebrew/bin/ffmpeg'),
            'ffprobe.binaries' => config('laravel-ffmpeg.ffprobe.binaries', '/opt/homebrew/bin/ffprobe'),
        ]);

        $media = $ffmpeg->open($file->getRealPath());

        $stream = $media->getStreams()->first();

        if (! $stream) {
            return null;
        }

        return $stream->get('duration');
    }

    /**
     * Format duration in seconds to human-readable format.
     */
    private function formatDuration(int $seconds): string
    {
        $hours = intdiv($seconds, 3600);
        $minutes = intdiv($seconds % 3600, 60);
        $secs = $seconds % 60;

        if ($hours > 0) {
            return sprintf('%d:%02d:%02d', $hours, $minutes, $secs);
        }

        return sprintf('%d:%02d', $minutes, $secs);
    }
}
