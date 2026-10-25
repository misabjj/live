import { Button } from '@/components/untitled-ui/base/buttons/button';
import { Dropdown } from '@/components/untitled-ui/base/dropdown/dropdown';
import { useClipboard } from '@/hooks/use-clipboard';
import { useToast } from '@/hooks/use-toast';
import { index as goals } from '@/routes/goals';
import { regenerate, index as widgets } from '@/routes/settings/widgets';
import { router } from '@inertiajs/react';
import { Copy01, DotsVertical, RefreshCcw05, Settings01 } from '@untitledui/icons';

interface GoalWidgetActionsProps {
    widgetId: string;
    widgetUrl: string;
    hidePersonalize?: boolean;
}

export function GoalWidgetActions({ widgetId, widgetUrl, hidePersonalize = false }: GoalWidgetActionsProps) {
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
        router.visit(goals());
    };

    const handleWidgets = () => {
        router.visit(widgets());
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
