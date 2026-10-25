<?php

namespace App\Actions\Notifications;

use Illuminate\Support\Facades\Http;

class SendDiscordMessage
{
    public function handle(string|array $message): void
    {
        $webhookUrl = config('services.discord.webhook_url');

        if (! $webhookUrl) {
            return;
        }

        Http::post($webhookUrl, [
            'embeds' => [
                $this->createEmbed($message),
                $this->createEmbed([
                    'date' => now(),
                    'triggerer_id' => auth()?->id(),
                    'app_url' => request()->getHttpHost(),
                ]),
            ],
        ]);
    }

    private function createEmbed(string|array $message): array
    {
        return [
            'title' => is_array($message) ? json_encode($message) : $message,
            'color' => '3066993',
            'description' => null,
        ];
    }
}
