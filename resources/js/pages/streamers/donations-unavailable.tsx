import * as Alerts from '@/components/untitled-ui/application/alerts/alerts';
import { Head } from '@inertiajs/react';

interface Props {
    streamer: {
        handle: string;
        accepting_donations: boolean;
    };
    reason: 'no_payment_processors' | 'not_accepting_donations';
}

export default function Page({ streamer, reason }: Props) {
    const descriptions = {
        no_payment_processors: 'Este streamer ainda não configurou nenhum método de pagamento. Entre em contato diretamente com o streamer.',
        not_accepting_donations: 'Este streamer não está aceitando doações no momento.',
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-primary_alt px-4 py-12">
            <Head title={`@${streamer.handle}`} />

            <div className="w-full max-w-md">
                <Alerts.AlertFloating color="error" title="Doações não disponíveis" description={descriptions[reason]} />
            </div>
        </div>
    );
}
