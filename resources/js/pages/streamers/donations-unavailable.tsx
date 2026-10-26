import * as Alerts from '@/components/ui/application/alerts/alerts';
import { Head } from '@inertiajs/react';
import { useLang } from '@/hooks/use-lang';

interface Props {
    streamer: {
        handle: string;
        accepting_donations: boolean;
    };
    reason: 'no_payment_processors' | 'not_accepting_donations';
}

export default function Page({ streamer, reason }: Props) {
    const { __ } = useLang();
    const description = reason === 'no_payment_processors'
        ? __('pages.donations_unavailable.no_processors')
        : __('pages.donations_unavailable.not_accepting');

    return (
        <div className="flex min-h-screen items-center justify-center bg-primary_alt px-4 py-12">
            <Head title={`@${streamer.handle}`} />

            <div className="w-full max-w-md">
                <Alerts.AlertFloating color="error" title={__('pages.donations_unavailable.title')} description={description} />
            </div>
        </div>
    );
}
