import { ConfirmDialog } from '@/components/confirm-dialog';
import { PaginationCardMinimal, PaginationPageMinimalCenter } from '@/components/ui/application/pagination/pagination';
import { Table, TableCard } from '@/components/ui/application/table/table';
import { BadgeWithDot } from '@/components/ui/base/badges/badges';
import { Button } from '@/components/ui/base/buttons/button';
import { Dropdown } from '@/components/ui/base/dropdown/dropdown';
import { Input } from '@/components/ui/base/input/input';
import { GoalWidgetActions } from '@/components/widget-actions/goal-widget-actions';
import { useConfirm } from '@/hooks/use-confirm';
import { useLang } from '@/hooks/use-lang';
import PanelLayout from '@/layouts/panel-layout';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { create, destroy, edit, index, toggleStatus } from '@/routes/goals';
import type { Pagination } from '@/types/pagination';
import { Link, router, useForm } from '@inertiajs/react';
import { CheckCircle, Edit03, Plus, SearchLg, Trash02, XCircle } from '@untitledui/icons';
import { useEffect, useRef } from 'react';

interface Goal {
    id: string;
    title: string;
    target_amount: number;
    raised_amount: number;
    is_active: boolean;
    closes_at: string;
    created_at: string;
    widget_url: string;
}

interface Props {
    goals: Pagination<Goal>;
    filter: {
        title: string;
    };
    widget: {
        id: string;
        url: string;
    };
}

function Page({ goals, filter, widget }: Props) {
    const { __ } = useLang();
    const isInitialMount = useRef(true);
    const { isOpen, options, confirm, handleConfirm, handleCancel } = useConfirm();
    const form = useForm({
        filter: {
            title: filter.title,
        },
    });

    const handleSearchChange = (search: string) => {
        form.setData('filter', { title: search });
    };

    const handlePageChange = (page: number): void => {
        if (page < goals.current_page && goals.prev_page_url) {
            router.visit(goals.prev_page_url, { preserveState: true, preserveScroll: true });
        } else if (page > goals.current_page && goals.next_page_url) {
            router.visit(goals.next_page_url, { preserveState: true, preserveScroll: true });
        }
    };

    const handleEditGoal = (goalId: string): void => {
        router.visit(edit(goalId));
    };

    const handleDeleteGoal = (goalId: string) => {
        setTimeout(async () => {
            const confirmed = await confirm({
                title: __('pages.goals.delete_confirmation_title'),
                description: __('pages.goals.delete_confirmation_description'),
                confirmLabel: __('pages.goals.delete'),
                cancelLabel: __('pages.goals.cancel'),
                variant: 'danger',
            });
            if (confirmed) {
                router.delete(destroy(goalId), { preserveScroll: true });
            }
        }, 150);
    };

    const handleToggleGoalStatus = (goal: Goal) => {
        setTimeout(async () => {
            const isActivating = !goal.is_active;
            const confirmed = await confirm({
                title: __('pages.goals.toggle_confirmation_title'),
                description: isActivating
                    ? __('pages.goals.activate_confirmation_description')
                    : __('pages.goals.deactivate_confirmation_description'),
                confirmLabel: isActivating ? __('pages.goals.activate') : __('pages.goals.deactivate'),
                cancelLabel: __('pages.goals.cancel'),
                variant: 'danger',
            });
            if (confirmed) {
                router.patch(toggleStatus(goal.id), {}, { preserveScroll: true });
            }
        }, 150);
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            if (form.data.filter.title === '') {
                return;
            }
        }

        const timer = setTimeout(() => {
            form.submit(index(), {
                preserveState: true,
                preserveScroll: true,
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [form.data.filter]);

    return (
        <>
            <ConfirmDialog isOpen={isOpen} options={options} onConfirm={handleConfirm} onCancel={handleCancel} />

            <div className="flex flex-col gap-4 sm:gap-6">
                <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
                    <div className="relative flex flex-col gap-4">
                        <div className="flex flex-col gap-0.5 md:gap-1">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex flex-col gap-0.5 md:gap-1">
                                    <p className="text-lg font-semibold text-primary sm:text-xl md:text-display-xs">{__('pages.goals.title')}</p>
                                    <p className="text-sm text-tertiary sm:text-md">{__('pages.goals.description')}</p>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                    <Link href={create()}>
                                        <Button size="md" iconLeading={Plus}>
                                            {__('pages.goals.create_title')}
                                        </Button>
                                    </Link>
                                    {widget && <GoalWidgetActions widgetId={widget.id} widgetUrl={widget.url} hidePersonalize />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
                    <div className="relative flex flex-wrap items-center justify-between gap-x-3 gap-y-4 pb-6 after:pointer-events-none after:absolute after:inset-0 after:border-b after:border-secondary lg:flex-nowrap lg:px-0 lg:pb-0 lg:after:border-b-0">
                        <Input
                            className="lg:max-w-100"
                            size="sm"
                            placeholder={__('pages.goals.search')}
                            icon={SearchLg}
                            value={form.data.filter.title}
                            onChange={(value) => handleSearchChange(value)}
                        />
                    </div>

                    <TableCard.Root className="lg:rounded-xl">
                        <TableCard.Header title={__('pages.goals.title')} badge={__('pages.goals.total', { count: goals.total })} />
                        <Table aria-label={__('pages.goals.title')} selectionMode="none" className="bg-primary">
                            <Table.Header>
                                <Table.Head id="title" label={__('pages.goals.field_title')} isRowHeader className="w-full" />
                                <Table.Head id="raised_amount" label={__('pages.goals.raised')} />
                                <Table.Head id="target_amount" label={__('pages.goals.target')} />
                                <Table.Head id="is_active" label={__('pages.goals.status')} />
                                <Table.Head id="created_at" label={__('pages.goals.created_at')} />
                                <Table.Head id="actions" label="" className="text-right" />
                            </Table.Header>

                            <Table.Body items={goals.data}>
                                {(goal) => (
                                    <Table.Row id={goal.id} className="selected:bg-primary">
                                        <Table.Cell>
                                            <p className="text-sm font-medium text-primary">{goal.title}</p>
                                        </Table.Cell>
                                        <Table.Cell className="whitespace-nowrap">
                                            <p className="text-sm font-medium text-primary">{formatCurrency(goal.raised_amount, 'BRL')}</p>
                                        </Table.Cell>
                                        <Table.Cell className="whitespace-nowrap">
                                            <p className="text-sm font-medium text-primary">{formatCurrency(goal.target_amount, 'BRL')}</p>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <BadgeWithDot size="sm" color={goal.is_active ? 'success' : 'gray'}>
                                                {goal.is_active ? __('pages.goals.active') : __('pages.goals.inactive')}
                                            </BadgeWithDot>
                                        </Table.Cell>
                                        <Table.Cell className="text-sm whitespace-nowrap text-tertiary">{formatDate(goal.created_at)}</Table.Cell>
                                        <Table.Cell className="text-right">
                                            <Dropdown.Root>
                                                <Dropdown.DotsButton />
                                                <Dropdown.Popover>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item label={__('pages.goals.edit')} icon={Edit03} onAction={() => handleEditGoal(goal.id)} />
                                                        <Dropdown.Item
                                                            label={goal.is_active ? __('pages.goals.deactivate') : __('pages.goals.activate')}
                                                            icon={goal.is_active ? XCircle : CheckCircle}
                                                            onAction={() => handleToggleGoalStatus(goal)}
                                                        />
                                                        <Dropdown.Separator />
                                                        <Dropdown.Item label={__('pages.goals.delete')} icon={Trash02} onAction={() => handleDeleteGoal(goal.id)} />
                                                    </Dropdown.Menu>
                                                </Dropdown.Popover>
                                            </Dropdown.Root>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>

                        <div className="max-lg:hidden">
                            <PaginationCardMinimal align="right" page={goals.current_page} total={goals.last_page} onPageChange={handlePageChange} />
                        </div>
                    </TableCard.Root>

                    <div className="lg:hidden">
                        <PaginationPageMinimalCenter
                            page={goals.current_page}
                            total={goals.last_page}
                            className="mt-6"
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

Page.layout = (page: React.ReactNode) => <PanelLayout children={page} title="pages.goals.title" />;

export default Page;
