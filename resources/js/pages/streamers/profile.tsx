import { MoneyFormField, TextAreaFormField, TextFormField } from '@/components/form-fields';
import { Avatar } from '@/components/untitled-ui/base/avatar/avatar';
import { Button } from '@/components/untitled-ui/base/buttons/button';
import { Checkbox } from '@/components/untitled-ui/base/checkbox/checkbox';
import { Form } from '@/components/untitled-ui/base/form/form';
import * as RadioGroups from '@/components/untitled-ui/base/radio-groups/radio-groups';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { getVoiceTileStyle } from '@/lib/supertonic/voices';
import { getInitials } from '@/lib/utils';
import { store } from '@/routes/donations';
import { Head, useForm } from '@inertiajs/react';
import { CreditCard02, Microphone01, QrCode02 } from '@untitledui/icons';
import { useEffect, useRef, useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';

interface Streamer {
    id: string;
    profile_photo: string;
    background_image?: string;
    display_name: string;
    handle: string;
    background_color: string;
}

interface Narrator {
    id: string;
    name: string;
    image_path: string | null;
    voice_id: string;
    voice_preview_path: string;
}

interface PaymentProcessor {
    processor: string;
    display_name: string;
    supports_pix: boolean;
    supports_credit_card: boolean;
}

interface DonationRules {
    max_characters_text: number;
    max_characters_text_to_speech: number;
    max_audio_duration: number;
    accept_ai_audio: boolean;
    accept_donor_audio: boolean;
    min_amount_text: number;
    min_amount_text_to_speech: number;
    min_amount_audio: number;
}

interface Props {
    streamer: Streamer;
    narrators: Narrator[];
    payment_processors: PaymentProcessor[];
    donation_rules: DonationRules;
}

// Utility function to detect supported MIME type for audio recording
const getSupportedMimeType = (): string => {
    const types = [
        'audio/mp4', // iOS Safari & cross-platform (primary)
        'audio/webm;codecs=opus', // Best quality for Chrome/Android
        'audio/webm', // Fallback for Chrome/Android
        'audio/wav', // Legacy fallback
    ];

    for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) {
            return type;
        }
    }

    // Safe default if none are detected
    return 'audio/mp4';
};

// Get file extension from MIME type
const getFileExtension = (mimeType: string): string => {
    const mimeToExt: Record<string, string> = {
        'audio/mp4': 'm4a',
        'audio/webm;codecs=opus': 'webm',
        'audio/webm': 'webm',
        'audio/wav': 'wav',
    };

    return mimeToExt[mimeType] || 'm4a';
};

export default function Page({ streamer, narrators, payment_processors, donation_rules }: Props) {
    const { user: donor } = useAuth();
    const toast = useToast();
    const [step, setStep] = useState(1);
    const [selectedNarrator, setSelectedNarrator] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const [playingNarratorId, setPlayingNarratorId] = useState<string | null>(null);
    const [nextStep, setNextStep] = useState<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [audioInputMode, setAudioInputMode] = useState<'text' | 'record'>('text');
    const [recordingTime, setRecordingTime] = useState(0);
    const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [mimeType] = useState(() => getSupportedMimeType());
    const [fileExtension] = useState(() => getFileExtension(getSupportedMimeType()));

    const {
        status: recordingStatus,
        startRecording,
        stopRecording,
        mediaBlobUrl,
        clearBlobUrl,
    } = useReactMediaRecorder({
        audio: true,
        blobPropertyBag: {
            type: mimeType,
        },
        mediaRecorderOptions: {
            mimeType: mimeType,
        },
        onStop: (_blobUrl, _blob) => {
            // Stop the timer when recording stops
            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current);
                recordingTimerRef.current = null;
            }
        },
    });

    const availablePaymentMethods = payment_processors.map((processor) => {
        const paymentMethods = [];
        if (processor.supports_pix) paymentMethods.push('PIX');
        if (processor.supports_credit_card) paymentMethods.push('Cartão');

        return {
            value: processor.processor,
            title: paymentMethods.join(', '),
            secondaryTitle: '',
            description: 'Pagamento',
            icon: processor.supports_pix ? QrCode02 : CreditCard02,
        };
    });

    const form = useForm({
        donor_name: donor?.display_name || '',
        content_text: '',
        content_type: 'text',
        narrator_id: '',
        amount: '',
        payment_processor: '',
        payment_method: '',
        audio_file: null as File | null,
    });

    form.transform((data) => {
        const transformed: Record<string, any> = {
            donor_name: data.donor_name,
            amount: data.amount,
            content_type: data.content_type,
            payment_processor: data.payment_processor,
            payment_method: data.payment_method,
        };

        if (data.content_type === 'text_to_speech') {
            transformed.content_text = data.content_text;
            transformed.narrator_id = data.narrator_id;
        } else if (data.content_type === 'text') {
            transformed.content_text = data.content_text;
        } else if (data.content_type === 'audio' && data.audio_file) {
            transformed.audio_file = data.audio_file;
        }

        return transformed;
    });

    const handleNextStep = () => {
        if (step === 1 && (!form.data.donor_name || !form.data.amount)) {
            toast.error('Campos obrigatórios', 'Por favor, preencha seu nome e o valor da doação');
            return;
        }

        if (step === 1 && audioInputMode === 'record' && !mediaBlobUrl) {
            toast.error('Áudio não gravado', 'Por favor, grave um áudio antes de continuar');
            return;
        }

        const minAmount = getMinAmount();

        if (step === 1 && parseFloat(form.data.amount) < minAmount) {
            toast.error('Valor insuficiente', `O valor mínimo é R$ ${minAmount.toFixed(2)}`);
            return;
        }

        setDirection('right');
        setIsTransitioning(true);

        let targetStep = step;
        if (step === 1 && form.data.content_type === 'text_to_speech') {
            targetStep = 2;
        } else if (step === 1 && form.data.content_type !== 'text_to_speech') {
            targetStep = 3;
        } else if (step === 2) {
            targetStep = 3;
        }

        setNextStep(targetStep);
        setTimeout(() => {
            setStep(targetStep);
            setIsTransitioning(false);
        }, 300);
    };

    const handlePreviousStep = (targetStep: number) => {
        setDirection('left');
        setIsTransitioning(true);
        setNextStep(targetStep);
        setTimeout(() => {
            setStep(targetStep);
            setIsTransitioning(false);
        }, 300);
    };

    const handlePlayVoicePreview = (narrator: Narrator) => {
        if (playingNarratorId === narrator.id) {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            setPlayingNarratorId(null);
            return;
        }

        if (!audioRef.current) {
            audioRef.current = new Audio();
        }

        audioRef.current.src = narrator.voice_preview_path;
        audioRef.current.play();
        setPlayingNarratorId(narrator.id);

        audioRef.current.onended = () => setPlayingNarratorId(null);
    };

    const handleStartRecording = () => {
        setRecordingTime(0);
        startRecording();

        // Start timer using max_audio_duration from donation rules
        recordingTimerRef.current = setInterval(() => {
            setRecordingTime((prev) => {
                const maxDuration = donation_rules.max_audio_duration;
                if (prev >= maxDuration - 1) {
                    stopRecording();
                    if (recordingTimerRef.current) {
                        clearInterval(recordingTimerRef.current);
                        recordingTimerRef.current = null;
                    }
                    return maxDuration;
                }
                return prev + 1;
            });
        }, 1000);
    };

    const handleStopRecording = () => {
        stopRecording();
        if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
            recordingTimerRef.current = null;
        }
    };

    const toggleRecording = () => {
        if (recordingStatus === 'recording') {
            handleStopRecording();
        } else {
            handleStartRecording();
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getMaxCharacters = (): number => {
        if (form.data.content_type === 'text_to_speech') {
            return donation_rules.max_characters_text_to_speech;
        }
        return donation_rules.max_characters_text;
    };

    const getMinAmount = (): number => {
        if (form.data.content_type === 'text_to_speech') {
            return donation_rules.min_amount_text_to_speech ?? 0;
        }
        if (form.data.content_type === 'audio') {
            return donation_rules.min_amount_audio ?? 0;
        }
        return donation_rules.min_amount_text ?? 0;
    };

    useEffect(() => {
        return () => {
            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current);
            }
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (audioInputMode === 'record' && mediaBlobUrl) {
            // Convert blob URL to blob and create File object
            const response = await fetch(mediaBlobUrl);
            const blob = await response.blob();
            const audioFile = new File([blob], `recording.${fileExtension}`, { type: mimeType });

            // Use transform to add the audio file and set content type
            form.transform((data) => ({
                ...data,
                content_type: 'audio',
                audio_file: audioFile,
            }));

            form.submit(store(streamer.id), {
                preserveScroll: true,
            });
        } else {
            form.submit(store(streamer.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <div
            className="flex min-h-dvh flex-col items-center justify-center bg-primary bg-cover bg-center bg-no-repeat px-4 py-12"
            style={{
                backgroundImage: streamer.background_image ? `url(${streamer.background_image})` : 'none',
                backgroundColor: streamer.background_image ? 'transparent' : streamer.background_color || undefined,
                backgroundAttachment: streamer.background_image ? 'fixed' : 'scroll',
            }}
        >
            {streamer.background_image && <div className="absolute inset-0 bg-black/30" />}

            <Head title={`@${streamer.handle}`} />

            <div className="relative z-10 w-full max-w-md">
                <div className="relative rounded-2xl border border-border-primary bg-primary px-4 py-6 shadow-2xl backdrop-blur-3xl sm:px-6">
                    <Avatar
                        src={streamer?.profile_photo}
                        initials={getInitials(streamer.display_name)}
                        size="2xl"
                        className="absolute top-0 right-1/2 size-20 translate-x-1/2 -translate-y-1/2"
                    />

                    <p className={`mt-6 text-center text-2xl font-semibold text-text-primary`}>{streamer.display_name}</p>
                    <p className={`mb-6 text-center text-text-secondary`}>@{streamer.handle}</p>

                    {step === 1 && (
                        <div
                            className={`flex flex-col gap-5 transition-all duration-300 ${
                                isTransitioning && nextStep !== 1
                                    ? direction === 'right'
                                        ? '-translate-x-8 opacity-0'
                                        : 'translate-x-8 opacity-0'
                                    : 'translate-x-0 opacity-100'
                            }`}
                        >
                            <TextFormField
                                title="Nome de usuário"
                                type="text"
                                name="donor_name"
                                placeholder="Seu nome"
                                inputSize="md"
                                value={form.data.donor_name}
                                onChange={(value) => {
                                    const truncated = value.slice(0, 20);
                                    form.setData('donor_name', truncated);
                                }}
                                error={form.errors.donor_name}
                                isRequired
                                labelPosition="over"
                            />

                            {donation_rules.accept_donor_audio && (
                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        size="md"
                                        color={audioInputMode === 'text' ? 'primary' : 'secondary'}
                                        onClick={() => {
                                            setAudioInputMode('text');
                                            clearBlobUrl();
                                            setRecordingTime(0);
                                        }}
                                        className="flex-1"
                                    >
                                        ESCREVER
                                    </Button>
                                    <Button
                                        type="button"
                                        size="md"
                                        color={audioInputMode === 'record' ? 'primary' : 'secondary'}
                                        onClick={() => {
                                            setAudioInputMode('record');
                                            form.setData('content_type', 'audio');
                                        }}
                                        className="flex-1"
                                    >
                                        GRAVAR ÁUDIO
                                    </Button>
                                </div>
                            )}

                            {audioInputMode === 'text' ? (
                                <>
                                    <TextAreaFormField
                                        title="Mensagem"
                                        description={`${form.data.content_text.length}/${getMaxCharacters()} caracteres`}
                                        name="content_text"
                                        placeholder="Sua mensagem"
                                        value={form.data.content_text}
                                        onChange={(value) => {
                                            const maxChars = getMaxCharacters();
                                            const truncated = value.slice(0, maxChars);
                                            form.setData('content_text', truncated);
                                        }}
                                        rows={2}
                                        error={form.errors.content_text}
                                        labelPosition="over"
                                    />

                                    {donation_rules.accept_ai_audio && (
                                        <Checkbox
                                            label="Gerar áudio com IA"
                                            size="md"
                                            isSelected={form.data.content_type === 'text_to_speech'}
                                            onChange={(checked) => form.setData('content_type', checked ? 'text_to_speech' : 'text')}
                                        />
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between rounded-lg border border-border-primary bg-bg-primary p-3">
                                        <span className="font-mono text-sm text-text-secondary">
                                            {formatTime(recordingTime)}/{formatTime(donation_rules.max_audio_duration)}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={toggleRecording}
                                            className={`flex size-8 items-center justify-center rounded-full transition-colors ${
                                                recordingStatus === 'recording' ? 'bg-error-600' : 'bg-brand-solid'
                                            }`}
                                        >
                                            <Microphone01 className="size-4 text-white" />
                                        </button>
                                    </div>
                                    {mediaBlobUrl && recordingStatus !== 'recording' && (
                                        <p className="text-sm text-fg-success-primary">Áudio gravado com sucesso!</p>
                                    )}
                                </div>
                            )}

                            <MoneyFormField
                                title="Valor"
                                name="amount"
                                inputSize="md"
                                value={form.data.amount}
                                onChange={(value) => form.setData('amount', value)}
                                error={form.errors.amount}
                                description={`Mínimo: R$ ${(getMinAmount() || 0).toFixed(2)}`}
                                isRequired
                                labelPosition="over"
                            />

                            <Button type="button" size="lg" onClick={handleNextStep} className="w-full">
                                Continuar
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div
                            className={`flex flex-col gap-5 transition-all duration-300 ${
                                isTransitioning && nextStep !== 2
                                    ? direction === 'right'
                                        ? '-translate-x-8 opacity-0'
                                        : 'translate-x-8 opacity-0'
                                    : 'translate-x-0 opacity-100'
                            }`}
                        >
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-medium text-secondary">Escolha uma voz para ler sua mensagem</label>

                                <div className="grid grid-cols-4 gap-3">
                                    {narrators.map((narrator) => (
                                        <button
                                            key={narrator.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedNarrator(narrator.id);
                                                form.setData('narrator_id', narrator.id);
                                            }}
                                            className="group relative aspect-square overflow-hidden rounded-lg ring-2 transition-all"
                                            style={{
                                                borderColor: selectedNarrator === narrator.id ? '#AB81FD' : 'transparent',
                                            }}
                                        >
                                            <div
                                                className={`absolute inset-0 flex flex-col items-center justify-center gap-1 ${getVoiceTileStyle(narrator.voice_id)}`}
                                            >
                                                <span className="text-2xl font-bold sm:text-3xl">{narrator.voice_id}</span>
                                                <span className="max-w-[90%] truncate text-xs font-semibold sm:text-sm">
                                                    {narrator.name.split(' - ')[1] ?? narrator.name}
                                                </span>
                                            </div>

                                            <div
                                                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handlePlayVoicePreview(narrator);
                                                }}
                                            >
                                                <div className="flex size-10 items-center justify-center rounded-full shadow-lg">
                                                    <svg
                                                        className={`size-5 ${playingNarratorId === narrator.id ? 'text-white' : 'text-gray-900'}`}
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        {playingNarratorId === narrator.id ? (
                                                            <>
                                                                <rect x="6" y="4" width="4" height="16" />
                                                                <rect x="14" y="4" width="4" height="16" />
                                                            </>
                                                        ) : (
                                                            <path d="M8 5v14l11-7z" />
                                                        )}
                                                    </svg>
                                                </div>
                                            </div>

                                            {selectedNarrator === narrator.id && (
                                                <div className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full">
                                                    <svg
                                                        className="size-4 text-white"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={3}
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {form.errors.narrator_id && <p className="text-sm text-fg-error-primary">{form.errors.narrator_id}</p>}
                            </div>

                            <div className="flex gap-3">
                                <Button type="button" size="lg" color="secondary" onClick={() => handlePreviousStep(1)} className="w-full">
                                    Voltar
                                </Button>
                                <Button type="button" size="lg" onClick={handleNextStep} className="w-full">
                                    Continuar
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <Form
                            onSubmit={handleSubmit}
                            className={`flex flex-col gap-5 transition-all duration-300 ${
                                isTransitioning && nextStep !== 3
                                    ? direction === 'right'
                                        ? '-translate-x-8 opacity-0'
                                        : 'translate-x-8 opacity-0'
                                    : 'translate-x-0 opacity-100'
                            }`}
                        >
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-secondary">
                                    Método de pagamento
                                    <span className="ml-1 text-fg-error-primary">*</span>
                                </label>
                                <RadioGroups.IconSimple
                                    aria-label="Método de pagamento"
                                    value={form.data.payment_processor}
                                    onChange={(value) => {
                                        const processor = payment_processors.find((p) => p.processor === value);
                                        // Map payment method based on processor type
                                        let paymentMethod = 'pix';
                                        if (!processor?.supports_pix && processor?.supports_credit_card) {
                                            paymentMethod = value === 'stripe' ? 'card' : 'credit_card';
                                        }

                                        form.setData({
                                            ...form.data,
                                            payment_processor: value,
                                            payment_method: paymentMethod,
                                        });
                                    }}
                                    items={availablePaymentMethods}
                                />
                                {form.errors.payment_processor && <p className="text-sm text-fg-error-primary">{form.errors.payment_processor}</p>}
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    size="lg"
                                    color="secondary"
                                    onClick={() => handlePreviousStep(form.data.content_type === 'text_to_speech' ? 2 : 1)}
                                    className="w-full"
                                >
                                    Voltar
                                </Button>
                                <Button type="submit" size="lg" isDisabled={form.processing} className="w-full">
                                    {form.processing ? 'Processando...' : 'Pagar'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </div>
            </div>

            <div className="relative z-10 mt-6 flex items-center gap-3 rounded-xl border border-border-primary bg-primary px-5 py-3 font-bold text-primary select-none">
                <p>Live</p>
            </div>
        </div>
    );
}
