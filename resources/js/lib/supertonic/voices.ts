import type { SupertonicVoice } from './browser-tts';

export interface SupertonicVoiceOption {
    id: SupertonicVoice;
    name: string;
    audioSrc: string;
}

export const supertonicVoiceOptions: SupertonicVoiceOption[] = [
    { id: 'M1', name: 'Alex', audioSrc: '/audio/narrators/supertonic/m1.wav' },
    { id: 'M2', name: 'James', audioSrc: '/audio/narrators/supertonic/m2.wav' },
    { id: 'M3', name: 'Robert', audioSrc: '/audio/narrators/supertonic/m3.wav' },
    { id: 'M4', name: 'Sam', audioSrc: '/audio/narrators/supertonic/m4.wav' },
    { id: 'M5', name: 'Daniel', audioSrc: '/audio/narrators/supertonic/m5.wav' },
    { id: 'F1', name: 'Sarah', audioSrc: '/audio/narrators/supertonic/f1.wav' },
    { id: 'F2', name: 'Lily', audioSrc: '/audio/narrators/supertonic/f2.wav' },
    { id: 'F3', name: 'Jessica', audioSrc: '/audio/narrators/supertonic/f3.wav' },
    { id: 'F4', name: 'Olivia', audioSrc: '/audio/narrators/supertonic/f4.wav' },
    { id: 'F5', name: 'Emily', audioSrc: '/audio/narrators/supertonic/f5.wav' },
];

const voiceTileStyles: Record<SupertonicVoice, string> = {
    M1: 'bg-sky-100 text-sky-900',
    M2: 'bg-zinc-200 text-zinc-900',
    M3: 'bg-emerald-100 text-emerald-900',
    M4: 'bg-cyan-100 text-cyan-900',
    M5: 'bg-lime-100 text-lime-900',
    F1: 'bg-rose-100 text-rose-900',
    F2: 'bg-amber-100 text-amber-900',
    F3: 'bg-indigo-100 text-indigo-900',
    F4: 'bg-fuchsia-100 text-fuchsia-900',
    F5: 'bg-teal-100 text-teal-900',
};

export function getVoiceTileStyle(voiceId: string): string {
    return voiceTileStyles[voiceId as SupertonicVoice] ?? 'bg-gray-100 text-gray-900';
}
