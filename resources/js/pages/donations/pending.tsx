import { Avatar } from '@/components/ui/base/avatar/avatar';
import { Badge } from '@/components/ui/base/badges/badges';
import { Button } from '@/components/ui/base/buttons/button';
import { useClipboard } from '@/hooks/use-clipboard';
import { useLang } from '@/hooks/use-lang';
import { show } from '@/routes/donate';
import { ArrowPathIcon, CheckIcon, ClipboardDocumentIcon, CreditCardIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import { Head } from '@inertiajs/react';
import { useEchoPublic } from '@laravel/echo-react';
import QRCodeStyling from 'qr-code-styling';
import { useEffect, useRef, useState } from 'react';

interface User {
    id: string;
    name: string;
    handle: string;
    avatar: string | null;
    background_image: string | null;
    theme_color: string;
    background_color_light: string;
    background_color_dark: string;
    button_color: string;
}

interface Donation {
    id: string;
    donor_name: string;
    amount: number;
    content_type: string;
    content: Record<string, any>;
    currency: string;
    status: string;
    payment_reference: string;
    payment_method: string;
    expires_at: number;
    streamer: User;
}

interface Props {
    donation: Donation;
}

export default function Page({ donation }: Props) {
    const { __ } = useLang();
    const { copied, copy } = useClipboard();
    const [timeLeft, setTimeLeft] = useState(Math.floor(donation.expires_at || 0));
    const qrCodeRef = useRef<HTMLDivElement>(null);
    const qrCodeInstance = useRef<QRCodeStyling | null>(null);

    // Listen for donation updates and reload the page
    useEchoPublic(`donations.${donation.id}`, '.DonationUpdated', (_event: any) => {
        window.location.reload();
    });

    // Get QR code from payment reference (for PIX payments)
    const pixCode = donation.payment_method.includes('pix') ? donation.payment_reference : '';

    // Check if it's a card or PIX payment
    const isCardPayment = donation.payment_method.includes('card');
    const isPixPayment = donation.payment_method.includes('pix');

    // Timer countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const totalSeconds = Math.floor(seconds);
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Generate QR Code
    useEffect(() => {
        if (pixCode && qrCodeRef.current && !qrCodeInstance.current) {
            qrCodeInstance.current = new QRCodeStyling({
                width: 200,
                height: 200,
                type: 'svg',
                data: pixCode,
                dotsOptions: {
                    color: '#000000',
                    type: 'rounded',
                },
                backgroundOptions: {
                    color: '#FFFFFF',
                },
                cornersSquareOptions: {
                    type: 'extra-rounded',
                },
                cornersDotOptions: {
                    type: 'dot',
                },
            });
            qrCodeInstance.current.append(qrCodeRef.current);
        }

        return () => {
            if (qrCodeInstance.current) {
                qrCodeRef.current?.firstChild?.remove();
                qrCodeInstance.current = null;
            }
        };
    }, [pixCode]);

    const copyPixCode = async () => {
        await copy(pixCode);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
            <Head title={__('pages.donations.checkout_title', { name: donation.streamer.name })} />

            <div className="w-full max-w-md">
                {/* Streamer Profile */}
                <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center space-x-4">
                        <Avatar src={donation.streamer.avatar} alt={donation.streamer.name} size="lg" />
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{donation.streamer.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">@{donation.streamer.handle}</p>
                        </div>
                        <Badge size="sm" color="success">
                            R$ {donation.amount.toFixed(2)}
                        </Badge>
                    </div>
                </div>

                {/* Payment Pending */}
                <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    {/* Payment Method Header */}
                    <div className="text-center">
                        <div className="mb-2 flex items-center justify-center space-x-2">
                            {isCardPayment ? (
                                <>
                                    <CreditCardIcon className="h-5 w-5 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{__('pages.donations.card_payment')}</span>
                                </>
                            ) : (
                                <>
                                    <QrCodeIcon className="h-5 w-5 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{__('pages.donations.pix_payment')}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* PIX Payment */}
                    {isPixPayment && pixCode && (
                        <div className="space-y-6 text-center">
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                                        <div ref={qrCodeRef} />
                                    </div>
                                </div>
                            </div>

                            {/* PIX Code */}
                            <div className="space-y-3">
                                <Button
                                    size="md"
                                    color={copied ? 'secondary' : 'primary'}
                                    onClick={copyPixCode}
                                    iconLeading={copied ? CheckIcon : ClipboardDocumentIcon}
                                    className="w-full"
                                >
                                    {copied ? __('pages.donations.copied') : __('pages.donations.copy_pix')}
                                </Button>

                                <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                                    {__('pages.donations.pix_valid_for', { time: formatTime(timeLeft) })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Loading State for PIX */}
                    {isPixPayment && !pixCode && (
                        <div className="space-y-4 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                <ArrowPathIcon className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{__('pages.donations.generating_qr')}</p>
                        </div>
                    )}
                </div>

                {/* Back Button - Outside Cards */}
                <div className="mt-4">
                    <Button size="sm" color="secondary" href={show.url(donation.streamer.handle)} className="w-full">
                        {__('pages.donations.back')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
