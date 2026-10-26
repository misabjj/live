import { useEchoPublic } from '@laravel/echo-react';
import axios from 'axios';
import { useState } from 'react';

import { DonationAlert } from '@/components/widgets/donation-alert';
import { donationAlertPlayed } from '@/routes/widgets';

interface Donation {
    id: string;
    donor_name: string;
    amount: number;
    currency: string;
    content_text?: string;
    content_type: 'text' | 'audio';
    content_url?: string;
}

interface DonationAlertCreated {
    force_play: boolean;
    donation: Donation;
}

interface DonationAlertConfiguration {
    primary_color: string;
    secondary_color: string;
    message_color: string;
}

interface DonationAlertEvent {
    type: 'skip' | 'pause' | 'resume';
}

interface Props {
    token: string;
    configuration: DonationAlertConfiguration;
}

interface PreparedAudio {
    element: HTMLAudioElement;
}

const queue: Donation[] = [];

let activeAudio: HTMLAudioElement | null = null;
let notificationAudio: HTMLAudioElement | null = null;
let notificationReady: Promise<void> | null = null;

function getNotificationAudio(): { element: HTMLAudioElement; ready: Promise<void> } {
    const element = notificationAudio ?? new Audio('/audio/notifications/donation-alert.mp3');
    const ready =
        notificationReady ??
        preloadAudio(element).catch((error) => {
            console.error('Unable to preload donation notification.', error);
        });

    notificationAudio = element;
    notificationReady = ready;

    return { element, ready };
}

function preloadAudio(element: HTMLAudioElement): Promise<void> {
    element.preload = 'auto';

    if (element.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
        const timeout = window.setTimeout(() => {
            cleanup();
            reject(new Error(`Timed out loading audio: ${element.src}`));
        }, 15_000);

        const cleanup = () => {
            window.clearTimeout(timeout);
            element.removeEventListener('canplaythrough', handleReady);
            element.removeEventListener('error', handleError);
        };

        const handleReady = () => {
            cleanup();
            resolve();
        };

        const handleError = () => {
            cleanup();
            reject(new Error(`Failed to load audio: ${element.src}`));
        };

        element.addEventListener('canplaythrough', handleReady, { once: true });
        element.addEventListener('error', handleError, { once: true });
        element.load();
    });
}

function wait(milliseconds: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export default function Page({ token, configuration: initialConfiguration }: Props) {
    const [currentAlert, setCurrentAlert] = useState<Donation | null>(null);
    const [configuration, setConfiguration] = useState(initialConfiguration);

    async function playNextAlert() {
        clearCurrentAlert();

        const nextAlert = queue.shift();

        if (nextAlert) {
            await playAlert(nextAlert);
        }
    }

    function playAudio(element: HTMLAudioElement): Promise<void> {
        activeAudio = element;
        element.currentTime = 0;

        return new Promise<void>((resolve, reject) => {
            const cleanup = () => {
                element.onended = null;
                element.onerror = null;

                if (activeAudio === element) {
                    activeAudio = null;
                }
            };

            element.onended = () => {
                cleanup();
                resolve();
            };

            element.onerror = (error) => {
                cleanup();
                reject(error);
            };

            element.play().catch((error) => {
                console.error(error);
                cleanup();
                window.setTimeout(resolve, 3_000);
            });
        });
    }

    async function prepareAlertAudio(donation: Donation): Promise<PreparedAudio | null> {
        const url = donation.content_url;
        if (!url) {
            return null;
        }

        const element = new Audio(url);

        try {
            await preloadAudio(element);

            return { element };
        } catch (error) {
            console.error('Unable to preload donation audio.', error);

            return null;
        }
    }

    function clearCurrentAlert() {
        activeAudio?.pause();
        activeAudio = null;
        setCurrentAlert(null);
    }

    async function playAlert(donation: Donation) {
        const { element: alertNotificationAudio, ready: notificationReady } = getNotificationAudio();
        const [preparedAudio] = await Promise.all([prepareAlertAudio(donation), notificationReady]);

        setCurrentAlert(donation);
        markAlertAsPlayed(donation);

        await playAudio(alertNotificationAudio);

        if (preparedAudio) {
            await playAudio(preparedAudio.element);
        } else {
            await wait(3_000);
        }

        await playNextAlert();
    }

    function addToQueue(donation: Donation) {
        queue.push(donation);
    }

    function markAlertAsPlayed(donation: Donation) {
        if (donation.id !== 'test') {
            axios.post(donationAlertPlayed.url({ widget: token, donation: donation.id }));
        }
    }

    useEchoPublic(
        `widgets.${token}`,
        '.DonationAlertCreated',
        async (event: DonationAlertCreated) => {
            if (currentAlert) {
                if (!queue.some((donation) => event.donation.id === donation.id)) {
                    addToQueue(event.donation);
                }
            } else {
                await playAlert(event.donation);
            }
        },
        [currentAlert],
    );

    async function skipCurrentAlert() {
        await playNextAlert();
    }

    function pauseQueue() {}

    function resumeQueue() {}

    useEchoPublic(`widgets.${token}`, '.DonationAlertControls', async (event: DonationAlertEvent) => {
        if (event.type === 'skip') {
            await skipCurrentAlert();
        } else if (event.type === 'pause') {
            pauseQueue();
        } else if (event.type === 'resume') {
            resumeQueue();
        }
    });

    useEchoPublic(`widgets.${token}`, '.DonationAlertConfigurationUpdated', (event: DonationAlertConfiguration) => {
        setConfiguration({
            primary_color: event.primary_color,
            secondary_color: event.secondary_color,
            message_color: event.message_color,
        });
    });

    if (!currentAlert) {
        return null;
    }

    return (
        <DonationAlert
            donorName={currentAlert.donor_name}
            amount={currentAlert.amount}
            currency={currentAlert.currency}
            message={currentAlert.content_text}
            configuration={configuration}
            className="w-full"
        />
    );
}
