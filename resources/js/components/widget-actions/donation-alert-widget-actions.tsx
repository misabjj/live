import { Button } from '@/components/ui/base/buttons/button';
import { Dropdown } from '@/components/ui/base/dropdown/dropdown';
import { useClipboard } from '@/hooks/use-clipboard';
import { useLang } from '@/hooks/use-lang';
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
                    <Dropdown.Item label={__('pages.widgets.actions.test_alert')} icon={PlayCircle} onAction={handleTestAlert} />
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
    );
}
