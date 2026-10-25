import { ConfirmDialog } from '@/components/confirm-dialog';
import { PaginationCardMinimal, PaginationPageMinimalCenter } from '@/components/untitled-ui/application/pagination/pagination';
import { Table, TableCard } from '@/components/untitled-ui/application/table/table';
import { BadgeWithDot } from '@/components/untitled-ui/base/badges/badges';
import { Button } from '@/components/untitled-ui/base/buttons/button';
import { Dropdown } from '@/components/untitled-ui/base/dropdown/dropdown';
import { Input } from '@/components/untitled-ui/base/input/input';
import { GoalWidgetActions } from '@/components/widget-actions/goal-widget-actions';
import { useConfirm } from '@/hooks/use-confirm';
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
                title: 'Deletar meta',
                description: 'Tem certeza que deseja deletar esta meta? Esta ação não pode ser desfeita.',
                confirmLabel: 'Deletar',
                cancelLabel: 'Cancelar',
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
                title: isActivating ? 'Ativar meta' : 'Desativar meta',
                description: isActivating ? 'Tem certeza que deseja ativar esta meta?' : 'Tem certeza que deseja desativar esta meta?',
                confirmLabel: isActivating ? 'Ativar' : 'Desativar',
                cancelLabel: 'Cancelar',
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
                                    <p className="text-lg font-semibold text-primary sm:text-xl md:text-display-xs">Metas</p>
                                    <p className="text-sm text-tertiary sm:text-md">Gerencie suas metas de arrecadação.</p>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                    <Link href={create()}>
                                        <Button size="md" iconLeading={Plus}>
                                            Nova meta
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
                            placeholder="Buscar por título"
                            icon={SearchLg}
                            value={form.data.filter.title}
                            onChange={(value) => handleSearchChange(value)}
                        />
                    </div>

                    <TableCard.Root className="lg:rounded-xl">
                        <TableCard.Header title="Metas" badge={`${goals.total} total`} />
                        <Table aria-label="Metas" selectionMode="none" className="bg-primary">
                            <Table.Header>
                                <Table.Head id="title" label="Título" isRowHeader className="w-full" />
                                <Table.Head id="raised_amount" label="Arrecadado" />
                                <Table.Head id="target_amount" label="Meta" />
                                <Table.Head id="is_active" label="Status" />
                                <Table.Head id="created_at" label="Criado em" />
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
                                                {goal.is_active ? 'Ativa' : 'Inativa'}
                                            </BadgeWithDot>
                                        </Table.Cell>
                                        <Table.Cell className="text-sm whitespace-nowrap text-tertiary">{formatDate(goal.created_at)}</Table.Cell>
                                        <Table.Cell className="text-right">
                                            <Dropdown.Root>
                                                <Dropdown.DotsButton />
                                                <Dropdown.Popover>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item label="Editar" icon={Edit03} onAction={() => handleEditGoal(goal.id)} />
                                                        <Dropdown.Item
                                                            label={goal.is_active ? 'Desativar' : 'Ativar'}
                                                            icon={goal.is_active ? XCircle : CheckCircle}
                                                            onAction={() => handleToggleGoalStatus(goal)}
                                                        />
                                                        <Dropdown.Separator />
                                                        <Dropdown.Item label="Deletar" icon={Trash02} onAction={() => handleDeleteGoal(goal.id)} />
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

Page.layout = (page: React.ReactNode) => <PanelLayout children={page} title="Metas" />;

export default Page;
