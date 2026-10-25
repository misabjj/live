<?php

namespace App\Http\Requests;

use App\Enums\DonationContentType;
use App\Models\User;
use App\Rules\AudioWithMaxDuration;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDonationRequest extends FormRequest
{
    public function rules(): array
    {
        $contentType = DonationContentType::tryFrom($this->input('content_type'));

        return match ($contentType) {
            DonationContentType::Text => $this->getTextRules(),
            DonationContentType::TextToSpeech => $this->getTextToSpeechRules(),
            DonationContentType::Audio => $this->getAudioRules(),
        };
    }

    private function getTextRules(): array
    {
        /** @var User $streamer */
        $streamer = $this->route('streamer');
        $donationRules = $streamer->donationRules;

        return [
            'donor_name' => [
                'required',
                'string',
                'min:2',
                'max:20',
                'regex:/^[a-zA-ZÀ-ÿ0-9\s\-_.]+$/',
            ],
            'content_type' => [
                'required',
                Rule::enum(DonationContentType::class),
            ],
            'payment_processor' => [
                'required',
                'string',
            ],
            'payment_method' => [
                'required',
                'string',
            ],
            'content_text' => [
                'string',
                'nullable',
                'max:'.$donationRules->max_characters_text,
            ],
            'amount' => [
                'required',
                'numeric',
                'min:'.$donationRules->min_amount_text,
                'max:5000.00',
                'decimal:0,2',
            ],
        ];
    }

    private function getTextToSpeechRules(): array
    {
        /** @var User $streamer */
        $streamer = $this->route('streamer');
        $donationRules = $streamer->donationRules;

        $rules = [
            'donor_name' => [
                'required',
                'string',
                'min:2',
                'max:20',
                'regex:/^[a-zA-ZÀ-ÿ0-9\s\-_.]+$/',
            ],
            'content_type' => [
                'required',
                Rule::enum(DonationContentType::class),
            ],
            'payment_processor' => [
                'required',
                'string',
            ],
            'payment_method' => [
                'required',
                'string',
            ],
            'content_text' => [
                'required',
                'string',
                'nullable',
                'max:'.$donationRules->max_characters_text_to_speech,
            ],
            'amount' => [
                'required',
                'numeric',
                'min:'.$donationRules->min_amount_text_to_speech,
                'max:5000.00',
                'decimal:0,2',
            ],
            'narrator_id' => [
                'required',
                'string',
                Rule::exists('narrators', 'id')->where('is_active', true),
            ],
        ];

        if (! $donationRules->accept_ai_audio) {
            $rules['content_type'][] = 'in:text,audio';
        }

        return $rules;
    }

    private function getAudioRules(): array
    {
        /** @var User $streamer */
        $streamer = $this->route('streamer');
        $donationRules = $streamer->donationRules;

        $rules = [
            'donor_name' => [
                'required',
                'string',
                'min:2',
                'max:20',
                'regex:/^[a-zA-ZÀ-ÿ0-9\s\-_.]+$/',
            ],
            'content_type' => [
                'required',
                Rule::enum(DonationContentType::class),
            ],
            'payment_processor' => [
                'required',
                'string',
            ],
            'payment_method' => [
                'required',
                'string',
            ],
            'amount' => [
                'required',
                'numeric',
                'min:'.$donationRules->min_amount_audio,
                'max:5000.00',
                'decimal:0,2',
            ],
            'audio_file' => [
                'required',
                'file',
                new AudioWithMaxDuration($donationRules->max_audio_duration),
            ],
        ];

        if (! $donationRules->accept_donor_audio) {
            $rules['content_type'][] = 'in:text,text_to_speech';
        }

        return $rules;
    }
}
