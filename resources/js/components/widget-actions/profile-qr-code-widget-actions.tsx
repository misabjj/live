import { Button } from '@/components/ui/base/buttons/button';
import { Dropdown } from '@/components/ui/base/dropdown/dropdown';
import { useClipboard } from '@/hooks/use-clipboard';
import { useToast } from '@/hooks/use-toast';
import { profileQrCode } from '@/routes/settings';
import { index, regenerate } from '@/routes/settings/widgets';
import { router } from '@inertiajs/react';
import { Copy01, DotsVertical, RefreshCcw05, Settings01 } from '@untitledui/icons';

interface ProfileQrCodeWidgetActionsProps {
    widgetId: string;
    widgetUrl: string;
    hidePersonalize?: boolean;
}

export function ProfileQrCodeWidgetActions({ widgetId, widgetUrl, hidePersonalize = false }: ProfileQrCodeWidgetActionsProps) {
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
        router.visit(profileQrCode());
    };

    const handleWidgets = () => {
        router.visit(index());
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
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
    );
}
