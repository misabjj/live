import { Button } from '@/components/untitled-ui/base/buttons/button';
import { Dropdown } from '@/components/untitled-ui/base/dropdown/dropdown';
import { useClipboard } from '@/hooks/use-clipboard';
import { useToast } from '@/hooks/use-toast';
import { regenerate } from '@/routes/settings/widgets';
import { router } from '@inertiajs/react';
import { Copy01, DotsVertical, RefreshCcw05 } from '@untitledui/icons';
import type { FC } from 'react';

interface DropdownAction {
    label: string;
    icon: FC<{ className?: string }>;
    onAction: () => void | Promise<void>;
    isSeparator?: false;
}

interface DropdownSeparator {
    isSeparator: true;
}

type DropdownMenuItem = DropdownAction | DropdownSeparator;

interface Widget {
    id: string;
    url: string;
}

interface WidgetActionsDropdownProps {
    widget: Widget;
    regenerateRoute: typeof regenerate;
    additionalActions?: DropdownMenuItem[];
}

export function WidgetActionsDropdown({ widget, regenerateRoute, additionalActions = [] }: WidgetActionsDropdownProps) {
    const { copy } = useClipboard();
    const toast = useToast();

    const handleCopy = async () => {
        await copy(widget.url);
        toast.success('Link copiado com sucesso!');
    };

    const handleRegenerate = () => {
        router.patch(regenerateRoute(widget.id), {}, { preserveScroll: true });
    };

    const baseActions: DropdownMenuItem[] = [
        {
            label: 'Copiar link',
            icon: Copy01,
            onAction: handleCopy,
        },
        {
            label: 'Regenerar link',
            icon: RefreshCcw05,
            onAction: handleRegenerate,
        },
    ];

    const allActions: DropdownMenuItem[] = additionalActions.length > 0 ? [...baseActions, { isSeparator: true }, ...additionalActions] : baseActions;

    return (
        <Dropdown.Root>
            <Button size="md" color="secondary" iconLeading={DotsVertical}>
                Integração
            </Button>
            <Dropdown.Popover>
                <Dropdown.Menu>
                    {allActions.map((action, index) => {
                        if (action.isSeparator) {
                            return <Dropdown.Separator key={`separator-${index}`} />;
                        }
                        return <Dropdown.Item key={action.label} label={action.label} icon={action.icon} onAction={action.onAction} />;
                    })}
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
    );
}
