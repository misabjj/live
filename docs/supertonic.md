# Supertonic browser integration

Live runs Supertonic 3 directly in the streamer's donation-alert browser source. Laravel broadcasts the normalized Portuguese transcript and the selected voice code; the browser uses ONNX Runtime Web to generate a 44.1 kHz WAV and plays it without sending the text to a TTS service.

## Architecture

- The alert widget preloads Supertonic when the page opens.
- Laravel Reverb delivers donation events to the widget over a public WebSocket channel.
- WebGPU is preferred when available, with WebAssembly as the automatic fallback.
- Model and voice-style files are fetched from the configured public model CDN, while ONNX Runtime Web is fetched from jsDelivr. The Laravel server does not proxy browser inference assets.
- New TTS donations do not have a stored `content_path`. Legacy donations retain their generated files and use them when their old voice is not a Supertonic preset.
- The ten supported voice codes are `M1` through `M5` and `F1` through `F5`.

## Local setup with Sail

Start Sail, install dependencies, download the model assets, and migrate:

```bash
./vendor/bin/sail up -d
./vendor/bin/sail npm install
./vendor/bin/sail npm run supertonic:download
./vendor/bin/sail artisan migrate
./vendor/bin/sail npm run dev -- --host 0.0.0.0
```

The model and ONNX Runtime Web files occupy approximately 430 MB. They are written to `public/supertonic`, which is intentionally ignored by Git. Running the command again skips files that are already present, so the cache survives Sail rebuilds as part of the working tree.

Sail starts `reverb` and a Redis-backed `queue` worker from `docker-compose.yml`. Laravel publishes internally to `reverb:8080`; the local browser connects to `ws://localhost:8081` because host port `8080` is already used by phpMyAdmin. Set `VITE_REVERB_HOST`, `VITE_REVERB_PORT`, and `VITE_REVERB_SCHEME` to the public WebSocket endpoint when deploying. Replace the example Reverb app ID, key, and secret in production.

## Deployment

Run `npm run supertonic:download` during image or release preparation so `public/supertonic` exists on every web server. Do not route `/supertonic` through Laravel. Serve it as static content with long-lived browser cache headers; model filenames should be versioned or caches purged when upgrading the model.

The widget source should be opened before a stream starts so the model can load before the first donation. No Python process, TTS API key, or additional Sail service is required.

## Synthesis configuration

```dotenv
SUPERTONIC_TEST_VOICE=M3
VITE_SUPERTONIC_LANGUAGE=pt
VITE_SUPERTONIC_STEPS=8
VITE_SUPERTONIC_SPEED=1.0
VITE_SUPERTONIC_MODEL_BASE_URL=https://huggingface.co/Supertone/supertonic-3/resolve/main
VITE_SUPERTONIC_ORT_BASE_URL=https://cdn.jsdelivr.net/npm/onnxruntime-web@1.27.0/dist
```

`SUPERTONIC_TEST_VOICE` selects the narrator used by the built-in Cristiano Ronaldo widget test. Real donations use the narrator selected by the donor. Supertonic exposes Portuguese as `pt`; it does not provide separate `pt-BR` and `pt-PT` language codes. The `VITE_` values are compiled into the browser bundle, so restart the Vite development server or rebuild assets after changing them.

## Health and manual checks

Check that the largest model and a voice style are available:

```bash
curl -I "$VITE_SUPERTONIC_MODEL_BASE_URL/onnx/vector_estimator.onnx"
curl -I "$VITE_SUPERTONIC_MODEL_BASE_URL/voice_styles/M1.json"
curl -I "$VITE_SUPERTONIC_ORT_BASE_URL/ort-wasm-simd-threaded.jsep.wasm"
```

Open the donation-alert widget and inspect the browser console. Successful initialization logs `Using WebAssembly/WebGPU for inference`. On first load, the browser downloads the model; subsequent loads should use its HTTP cache. A generated file must report RIFF/WAVE, mono PCM, 16-bit samples, and a 44,100 Hz sample rate.

## Voice catalog

| Code | Descriptor |
| --- | --- |
| `M1` | Alex |
| `M2` | James |
| `M3` | Robert |
| `M4` | Sam |
| `M5` | Daniel |
| `F1` | Sarah |
| `F2` | Lily |
| `F3` | Jessica |
| `F4` | Olivia |
| `F5` | Emily |

## Voice previews

Committed preview WAVs live in `public/audio/narrators/supertonic`. Regenerate them after a model or voice-style update with Python 3.9 or newer:

```bash
pip install supertonic==1.3.1
python scripts/generate-supertonic-previews.py
```

The script uses the already-downloaded files in `public/supertonic` and the same Portuguese language, eight inference steps, and `1.0` speed used by the browser.

## Troubleshooting

- A model URL error means the configured CDN base URL is missing a compatible `onnx` or `voice_styles` directory.
- A WebSocket connection error means the `reverb` service is not ready or the `VITE_REVERB_*` values do not describe the browser-accessible endpoint. Check it with `./vendor/bin/sail ps` and `./vendor/bin/sail logs reverb`.
- Donation events are queued. If the widget connects but receives nothing, check `./vendor/bin/sail logs queue` and the failed-jobs table.
- WebGPU initialization failures automatically fall back to WebAssembly. WebAssembly is slower and uses more CPU.
- Out-of-memory failures are most likely on constrained devices. Keep donation text within the configured 200-character platform limit and open the widget in a current browser or OBS release.
- If the first alert waits before speaking, leave the widget open long enough to finish its initial model download. The alert page preloads the model as soon as it mounts.
- A regular browser can block event-driven audio with `NotAllowedError` until the page receives a user gesture. The hosted Supertonic demo avoids this because synthesis starts from its Generate button. OBS browser sources should have audio playback enabled and should not be shut down while hidden.
- If model downloads restart on every refresh, verify CDN cache headers and that privacy settings are not disabling the HTTP cache. The model CDN must allow CORS from the deployed application origin.
- Legacy narrator IDs are intentionally inactive. Their previously stored audio remains playable, but they cannot be selected for new donations.
- A voice that does not match the preview usually means the built-in test voice or the donation's narrator differs from the preview. Check `SUPERTONIC_TEST_VOICE` for the test alert and `voice_id` in the broadcast payload for real donations.

## Licensing and disclosure

The adapted browser helper comes from [supertone-inc/supertonic](https://github.com/supertone-inc/supertonic) under the MIT License. Supertonic 3 model weights are distributed under the [OpenRAIL-M License](https://huggingface.co/Supertone/supertonic-3/blob/main/LICENSE). The alert widget visibly labels synthesized speech as “Voz gerada por IA,” and the legacy persona voices are not available for new synthesis.
