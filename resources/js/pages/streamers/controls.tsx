import { router } from '@inertiajs/react';
import { useEchoPublic } from '@laravel/echo-react';
import { Copy01, PlayCircle, SkipForward, X } from '@untitledui/icons';
import { ReactNode, useRef, useState } from 'react'; // Added useRef

import { SettingsButtonSection, SettingsContainer, SettingsCustomSection, SettingsSwitchSection } from '@/components/form-fields';
import { SettingsPageHeader } from '@/components/settings';
import { SlideoutMenu } from '@/components/ui/application/slideout-menus/slideout-menu';
import { Button } from '@/components/ui/base/buttons/button';
import { Input } from '@/components/ui/base/input/input';
import { useClipboard } from '@/hooks/use-clipboard';
import { useLang } from '@/hooks/use-lang';
import { useToast } from '@/hooks/use-toast';
import PanelLayout from '@/layouts/panel-layout';
import { markAsPlayed, playDonation, skipDonationAlert, toggleAcceptingDonations, toggleAutoplay } from '@/routes/controls';
import { index as widgets } from '@/routes/settings/widgets';
import { Heading as AriaHeading } from 'react-aria-components';

interface Donation {
    id: string;
    donor_name: string;
    amount: number;
    currency: string;
    content_text: string | null;
    content_path?: string; // Added
    content_type?: 'text' | 'audio';
}

/**
 * WebSocket Event: DonationAlertPlayed
 * Fired when a donation alert has finished playing
 */
interface DonationAlertPlayedEvent {
    donation_id: string;
}

/**
 * WebSocket Event: DonationAlert
 * Fired when a new donation is received and should be displayed
 */
interface DonationAlertEvent {
    donation: {
        id: string;
        donor_name: string;
        amount: number;
        currency: string;
        content_text: string | null;
    };
}

interface Props {
    queue_paused: boolean;
    accepting_donations: boolean;
    profile_url: string;
    unplayed_donations: Donation[];
    donation_alert_widget_token: string | null;
}

function Page({ queue_paused, accepting_donations, profile_url, unplayed_donations, donation_alert_widget_token }: Props) {
    const { __ } = useLang();
    const { copy } = useClipboard();
    const toast = useToast();
    const [isQueueSlideoutOpen, setIsQueueSlideoutOpen] = useState(false);
    const [donations, setDonations] = useState<Donation[]>(unplayed_donations);
    const [isProcessing, setIsProcessing] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null); // Added

    useEchoPublic(`widgets.${donation_alert_widget_token}`, '.DonationAlertPlayed', (event: DonationAlertPlayedEvent) => {
        if (event.donation_id !== 'test') {
            setDonations((prev) => prev.filter((d) => d.id !== event.donation_id));
        }
    });

    useEchoPublic(`widgets.${donation_alert_widget_token}`, '.DonationAlertCreated', (event: DonationAlertEvent) => {
        const newDonation: Donation = {
            id: event.donation.id,
            donor_name: event.donation.donor_name,
            amount: event.donation.amount,
            currency: event.donation.currency,
            content_text: event.donation.content_text,
        };

        setDonations((prev) => {
            if (prev.some((d) => d.id === newDonation.id)) {
                return prev;
            }
            return [...prev, newDonation];
        });
    });

    const handleToggleAutoplay = () => {
        router.post(toggleAutoplay(), {}, { preserveScroll: true });
    };

    const handleToggleAcceptingDonations = () => {
        router.post(toggleAcceptingDonations(), {}, { preserveScroll: true });
    };

    const handleSkipAlert = () => {
        if (isProcessing) return;
        setIsProcessing(true);
        router.post(skipDonationAlert(), {}, { preserveScroll: true, onFinish: () => setIsProcessing(false) });
    };

    const handlePlayDonation = (donationId: string) => {
        if (isProcessing) return;
        setIsProcessing(true);
        router.post(playDonation(donationId), {}, { preserveScroll: true, onFinish: () => setIsProcessing(false) });
    };

    const handleMarkAsPlayed = (donationId: string) => {
        if (isProcessing) return;
        setIsProcessing(true);
        router.post(markAsPlayed(donationId), {}, { preserveScroll: true, onFinish: () => setIsProcessing(false) });
    };

    const handleListen = (donation: Donation) => {
        // Added
        if (audioRef.current && donation.content_path) {
            audioRef.current.src = donation.content_path;
            audioRef.current.play().catch((error) => {
                console.error(__('pages.controls.audio_error'), error);
                toast.error(__('pages.controls.audio_error'));
            });
        } else {
            toast.info(__('pages.controls.no_audio'));
        }
    };

    const handleCopyProfileUrl = async () => {
        await copy(profile_url);
        toast.success(__('pages.controls.profile_link_copied'));
    };

    return (
        <SettingsContainer gap="lg">
            <SettingsPageHeader title={__('pages.controls.title')} description={__('pages.controls.description')} />

            <SettingsContainer gap="md">
                {/* Autoplay Toggle */}
                <SettingsSwitchSection
                    title={__('pages.controls.autoplay_title')}
                    description={__('pages.controls.autoplay_description')}
                    value={!queue_paused}
                    onChange={handleToggleAutoplay}
                    withDivider={true}
                />

                {/* Accepting Donations Toggle */}
                <SettingsSwitchSection
                    title={__('pages.controls.accept_donations_title')}
                    description={__('pages.controls.accept_donations_description')}
                    value={accepting_donations}
                    onChange={handleToggleAcceptingDonations}
                    withDivider={true}
                />

                {/* Queue Management */}
                <SettingsButtonSection
                    title={__('pages.controls.queue_title')}
                    description={__('pages.controls.queue_description')}
                    buttonText={__('pages.controls.queue_button')}
                    onClick={() => setIsQueueSlideoutOpen(true)}
                    buttonSize="md"
                    withDivider={true}
                />

                {/* Handle & Share */}
                <SettingsCustomSection title={__('pages.controls.profile_title')} description={__('pages.controls.profile_description')} row>
                    <Input aria-label={__('pages.controls.profile_link')} value={profile_url} isDisabled />
                    <Button onClick={handleCopyProfileUrl} iconLeading={Copy01} />
                </SettingsCustomSection>

                {/* Widget Link */}
                <SettingsButtonSection
                    title={__('pages.widgets.title')}
                    description={__('pages.widgets.subtitle')}
                    buttonText={__('pages.controls.widgets_button')}
                    onClick={() => router.visit(widgets())}
                    buttonSize="md"
                    withDivider={false}
                />
            </SettingsContainer>

            <SlideoutMenu isOpen={isQueueSlideoutOpen} onOpenChange={setIsQueueSlideoutOpen} isDismissable>
                    <SlideoutMenu.Header onClose={() => setIsQueueSlideoutOpen(false)}>
                        <div className="flex flex-col gap-1">
                            <AriaHeading slot="title" className="text-lg font-semibold text-primary">
                                Fila de alertas
                            </AriaHeading>
                            <p className="text-sm text-secondary">{__('pages.controls.queue_dialog_description')}</p>
                        </div>
                    </SlideoutMenu.Header>

                    <SlideoutMenu.Content>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-primary">
                                    {donations.length === 1
                                        ? __('pages.controls.queue_count_singular', { count: donations.length })
                                        : __('pages.controls.queue_count_plural', { count: donations.length })}
                                </p>

                                <Button size="sm" iconLeading={SkipForward} onClick={handleSkipAlert} isDisabled={isProcessing}>
                                    {__('pages.controls.skip')}
                                </Button>
                            </div>

                            {donations.length === 0 ? (
                                <div className="rounded-lg border border-border-secondary bg-secondary p-8 text-center">
                                    <p className="text-sm text-secondary">{__('pages.controls.queue_empty')}</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {donations.map((donation) => (
                                        <div key={donation.id} className="relative rounded-lg border border-border-secondary bg-secondary p-4">
                                            {/* X Button (top right) */}
                                            <Button
                                                size="sm"
                                                color="secondary-destructive"
                                                iconLeading={X}
                                                onClick={() => handleMarkAsPlayed(donation.id)}
                                                isDisabled={isProcessing}
                                                className="absolute top-2 right-2"
                                            />

                                            {/* Donation details */}
                                            <div className="mb-2">
                                                <p className="text-sm font-semibold text-primary">{donation.donor_name}</p>
                                                <p className="text-brand text-sm font-medium text-primary">
                                                    {donation.currency} {donation.amount.toFixed(2)}
                                                </p>
                                            </div>
                                            {donation.content_text && <p className="mt-2 text-sm text-secondary">{donation.content_text}</p>}

                                            {/* Reproduzir and Ouvir buttons (bottom right) */}
                                            <div className="mt-4 flex items-center justify-end gap-x-2">
                                                <Button
                                                    size="sm"
                                                    color="primary"
                                                    iconLeading={PlayCircle}
                                                    onClick={() => handlePlayDonation(donation.id)}
                                                    isDisabled={isProcessing}
                                                >
                                                    {__('pages.controls.skip_stream')}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    color="secondary"
                                                    iconLeading={PlayCircle}
                                                    onClick={() => handleListen(donation)}
                                                    isDisabled={isProcessing || !donation.content_path || donation.content_type === 'text'}
                                                >
                                                    {__('pages.controls.listen')}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </SlideoutMenu.Content>
            </SlideoutMenu>

            {/* Hidden audio element for playback */}
            <audio ref={audioRef} className="hidden" onError={(e) => console.error(__('pages.controls.audio_load_error'), e)} />
        </SettingsContainer>
    );
}

Page.layout = (page: ReactNode) => <PanelLayout children={page} title="pages.controls.title" />;

export default Page;
