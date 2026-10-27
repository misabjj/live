import { Button } from '@/components/ui/base/buttons/button';
import { Dropdown } from '@/components/ui/base/dropdown/dropdown';
import { useClipboard } from '@/hooks/use-clipboard';
import { useLang } from '@/hooks/use-lang';
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
    const { __ } = useLang();
    const toast = useToast();

    const handleCopy = async () => {
        await copy(widgetUrl);
        toast.success(__('pages.widgets.actions.link_copied'));
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
                {__('pages.widgets.actions.integration')}
            </Button>
            <Dropdown.Popover>
                <Dropdown.Menu>
                    <Dropdown.Item label={__('pages.widgets.actions.copy_link')} icon={Copy01} onAction={handleCopy} />
                    <Dropdown.Item label={__('pages.widgets.actions.regenerate_link')} icon={RefreshCcw05} onAction={handleRegenerate} />
                    {!hidePersonalize && (
                        <>
                            <Dropdown.Separator />
                            <Dropdown.Item label={__('pages.widgets.actions.customize')} icon={Settings01} onAction={handlePersonalize} />
                        </>
                    )}
                    {hidePersonalize && (
                        <>
                            <Dropdown.Separator />
                            <Dropdown.Item label={__('pages.widgets.actions.widgets')} icon={Settings01} onAction={handleWidgets} />
                        </>
                    )}
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
    );
}
