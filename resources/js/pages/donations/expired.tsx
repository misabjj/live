import { Avatar } from '@/components/untitled-ui/base/avatar/avatar';
import { Button } from '@/components/untitled-ui/base/buttons/button';
import { BackgroundPattern } from '@/components/untitled-ui/shared-assets/background-patterns';
import { show } from '@/routes/donate';
import { Head, Link } from '@inertiajs/react';

interface Donation {
    id: string;
    streamer: {
        display_name: string;
        handle: string;
        profile_photo: string;
    };
}

interface Props {
    donation: Donation;
}

export default function Page({ donation }: Props) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-primary_alt px-4 py-12">
            <Head title={`Doação para @${donation.streamer.handle}`} />

            <div className="w-full max-w-md space-y-6">
                <div className="flex items-center gap-4">
                    <Avatar src={donation.streamer.profile_photo} alt={donation.streamer.display_name} className="size-14 rounded-xl" />

                    <div className="flex flex-col">
                        <span className="text-xl font-semibold text-primary">{donation.streamer.display_name}</span>
                        <span className="text-sm text-tertiary">@{donation.streamer.handle}</span>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl bg-primary px-4 py-6 shadow-lg ring-1 ring-secondary sm:p-6">
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative flex size-16 items-center justify-center rounded-full bg-warning-50">
                            <svg className="z-10 size-8 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <BackgroundPattern pattern="circle" size="sm" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>

                        <div className="z-10 text-center">
                            <h2 className="text-2xl font-semibold text-primary">Pagamento expirado</h2>
                            <p className="mt-2 text-sm text-secondary">O tempo para realizar o pagamento expirou. Tente fazer uma nova doação.</p>
                        </div>

                        <div className="z-10 w-full space-y-3">
                            <Link href={show(donation.streamer.handle)} className="block">
                                <Button type="button" size="lg" color="primary" className="w-full">
                                    Tentar novamente
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
