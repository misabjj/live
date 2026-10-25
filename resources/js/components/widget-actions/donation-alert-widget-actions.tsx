import { Button } from '@/components/untitled-ui/base/buttons/button';
import { Dropdown } from '@/components/untitled-ui/base/dropdown/dropdown';
import { useClipboard } from '@/hooks/use-clipboard';
import { useToast } from '@/hooks/use-toast';
import { show } from '@/routes/settings/donation-alert';
import { index, regenerate, test } from '@/routes/settings/widgets';
import { router } from '@inertiajs/react';
import { Copy01, DotsVertical, PlayCircle, RefreshCcw05, Settings01 } from '@untitledui/icons';

interface DonationAlertWidgetActionsProps {
    widgetId: string;
    widgetUrl: string;
    hidePersonalize?: boolean;
}

export function DonationAlertWidgetActions({ widgetId, widgetUrl, hidePersonalize = false }: DonationAlertWidgetActionsProps) {
    const { copy } = useClipboard();
    const toast = useToast();

    const handleCopy = async () => {
        await copy(widgetUrl);
        toast.success('Link copiado com sucesso!');
    };

    const handleRegenerate = () => {
        router.patch(regenerate(widgetId), {}, { preserveScroll: true });
    };

    const handlePersonalize = () => {
        router.visit(show());
    };

    const handleWidgets = () => {
        router.visit(index());
    };

    const handleTestAlert = () => {
        router.post(test(widgetId), {}, { preserveScroll: true });
    };

    return (
        <Dropdown.Root>
            <Button size="md" color="secondary" iconLeading={DotsVertical}>
                Integração
            </Button>
            <Dropdown.Popover>
                <Dropdown.Menu>
                    <Dropdown.Item label="Copiar link" icon={Copy01} onAction={handleCopy} />
                    <Dropdown.Item label="Regenerar link" icon={RefreshCcw05} onAction={handleRegenerate} />
                    {!hidePersonalize && (
                        <>
                            <Dropdown.Separator />
                            <Dropdown.Item label="Personalizar" icon={Settings01} onAction={handlePersonalize} />
                        </>
                    )}
                    {hidePersonalize && (
                        <>
                            <Dropdown.Separator />
                            <Dropdown.Item label="Widgets" icon={Settings01} onAction={handleWidgets} />
                        </>
                    )}
                    <Dropdown.Item label="Testar alerta" icon={PlayCircle} onAction={handleTestAlert} />
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
    );
}
