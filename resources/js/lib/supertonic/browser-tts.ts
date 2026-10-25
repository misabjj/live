import type { Style, TextToSpeech } from './official-helper';

export const SUPERTONIC_VOICES = ['M1', 'M2', 'M3', 'M4', 'M5', 'F1', 'F2', 'F3', 'F4', 'F5'] as const;

export type SupertonicVoice = (typeof SUPERTONIC_VOICES)[number];
export type SupertonicBackend = 'webgpu' | 'wasm';

const MODEL_BASE_PATH = (
    import.meta.env.VITE_SUPERTONIC_MODEL_BASE_URL ||
    'https://huggingface.co/Supertone/supertonic-3/resolve/main'
).replace(/\/$/, '');
const LANGUAGE = import.meta.env.VITE_SUPERTONIC_LANGUAGE || 'pt';
const STEPS = Number(import.meta.env.VITE_SUPERTONIC_STEPS || 8);
const SPEED = Number(import.meta.env.VITE_SUPERTONIC_SPEED || 1.0);

interface SupertonicHelper {
    loadTextToSpeech: (
        onnxDir: string,
        options: { executionProviders: string[]; graphOptimizationLevel: string },
    ) => Promise<{ textToSpeech: TextToSpeech }>;
    loadVoiceStyle: (paths: string[]) => Promise<Style>;
    writeWavFile: (audioData: number[], sampleRate: number) => ArrayBuffer;
}

type SupertonicEngine = TextToSpeech & { sampleRate: number };

class BrowserTextToSpeech {
    private readonly styles = new Map<SupertonicVoice, Promise<Style>>();

    private constructor(
        private readonly helper: SupertonicHelper,
        private readonly engine: SupertonicEngine,
        readonly backend: SupertonicBackend,
    ) {}

    static async create(): Promise<BrowserTextToSpeech> {
        const helper = (await import('./official-helper')) as SupertonicHelper;

        if ('gpu' in navigator) {
            try {
                const { textToSpeech } = await helper.loadTextToSpeech(`${MODEL_BASE_PATH}/onnx`, {
                    executionProviders: ['webgpu'],
                    graphOptimizationLevel: 'all',
                });

                return new BrowserTextToSpeech(helper, textToSpeech as SupertonicEngine, 'webgpu');
            } catch (error) {
                console.warn('Supertonic WebGPU initialization failed; using WebAssembly.', error);
            }
        }

        const { textToSpeech } = await helper.loadTextToSpeech(`${MODEL_BASE_PATH}/onnx`, {
            executionProviders: ['wasm'],
            graphOptimizationLevel: 'all',
        });

        return new BrowserTextToSpeech(helper, textToSpeech as SupertonicEngine, 'wasm');
    }

    async synthesize(text: string, voice: SupertonicVoice): Promise<Blob> {
        const style = await this.loadStyle(voice);
        const { wav, duration } = await this.engine.call(text, LANGUAGE, style, STEPS, SPEED);
        const wavLength = Math.floor(this.engine.sampleRate * duration[0]);
        const wavBuffer = this.helper.writeWavFile(wav.slice(0, wavLength), this.engine.sampleRate);

        return new Blob([wavBuffer], { type: 'audio/wav' });
    }

    private loadStyle(voice: SupertonicVoice): Promise<Style> {
        const existing = this.styles.get(voice);

        if (existing) {
            return existing;
        }

        const style = this.helper.loadVoiceStyle([`${MODEL_BASE_PATH}/voice_styles/${voice}.json`]);
        this.styles.set(voice, style);

        return style;
    }
}

let enginePromise: Promise<BrowserTextToSpeech> | null = null;

export function isSupertonicVoice(value: string | null | undefined): value is SupertonicVoice {
    return SUPERTONIC_VOICES.includes(value as SupertonicVoice);
}

export function loadBrowserTextToSpeech(): Promise<BrowserTextToSpeech> {
    if (!enginePromise) {
        enginePromise = BrowserTextToSpeech.create().catch((error) => {
            enginePromise = null;
            throw error;
        });
    }

    return enginePromise;
}

export async function synthesizeWithSupertonic(text: string, voice: SupertonicVoice): Promise<Blob> {
    const engine = await loadBrowserTextToSpeech();

    return engine.synthesize(text, voice);
}
