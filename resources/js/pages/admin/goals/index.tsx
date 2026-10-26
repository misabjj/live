import { PaginationCardMinimal, PaginationPageMinimalCenter } from '@/components/ui/application/pagination/pagination';
import { Table, TableCard } from '@/components/ui/application/table/table';
import { Badge } from '@/components/ui/base/badges/badges';
import { Button } from '@/components/ui/base/buttons/button';
import { Input } from '@/components/ui/base/input/input';
import PanelLayout from '@/layouts/panel-layout';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { useLang } from '@/hooks/use-lang';
import { dashboard } from '@/routes';
import { index } from '@/routes/admin/goals';
import { Pagination } from '@/types/pagination';
import { useForm } from '@inertiajs/react';
import { ArrowLeft, SearchLg } from '@untitledui/icons';
import { useEffect, useRef } from 'react';

interface Goal {
    id: string;
    title: string;
    target_amount: number;
    raised_amount: number;
    progress_percentage: number;
    is_active: boolean;
    closes_at: string | null;
    created_at: string;
    user: {
        id: string;
        display_name: string;
        handle: string;
    };
}

interface Props {
    goals: Pagination<Goal>;
    filter: {
        title: string;
        user_id: string;
    };
}

function Page({ goals, filter }: Props) {
    const { __ } = useLang();
    const isInitialMount = useRef(true);
    const form = useForm({
        filter: {
            title: filter.title,
            user_id: filter.user_id,
        },
    });

    const handleSearchChange = (search: string) => {
        form.setData('filter', { ...form.data.filter, title: search });
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            if (form.data.filter.title === '' && form.data.filter.user_id === '') {
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
        <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
                {/* Page header */}
                <div className="relative flex flex-col gap-4">
                    <div className="flex lg:hidden">
                        <Button href={dashboard.url()} color="link-gray" size="md" iconLeading={ArrowLeft}>
                            {__('pages.admin.back')}
                        </Button>
                    </div>

                    <div className="flex flex-col gap-0.5 md:gap-1">
                        <p className="text-lg font-semibold text-primary sm:text-xl md:text-display-xs">{__('pages.admin.goals.title')}</p>
                        <p className="text-sm text-tertiary sm:text-md">{__('pages.admin.goals.subtitle')}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
                {/* Search */}
                <div className="relative flex flex-wrap items-center justify-between gap-x-3 gap-y-4 pb-6 after:pointer-events-none after:absolute after:inset-0 after:border-b after:border-secondary lg:flex-nowrap lg:px-0 lg:pb-0 lg:after:border-b-0">
                    <Input
                        className="lg:max-w-100"
                        size="sm"
                        placeholder={__('pages.admin.goals.search')}
                        icon={SearchLg}
                        value={form.data.filter.title}
                        onChange={handleSearchChange}
                    />
                </div>

                {/* Goals table */}
                <TableCard.Root className="lg:rounded-xl">
                    <TableCard.Header title={__('pages.admin.goals.table_title')} badge={__('pages.admin.total', { count: goals.total })} />
                    <Table aria-label={__('pages.admin.goals.table_title')} selectionMode="none" className="bg-primary">
                        <Table.Header>
                            <Table.Head id="title" label={__('pages.admin.goals.goal')} isRowHeader className="w-full" />
                            <Table.Head id="user" label={__('pages.admin.goals.streamer')} />
                            <Table.Head id="progress" label={__('pages.admin.goals.progress')} />
                            <Table.Head id="status" label={__('pages.admin.goals.status')} />
                            <Table.Head id="created_at" label={__('pages.admin.goals.created_at')} />
                        </Table.Header>

                        <Table.Body items={goals.data}>
                            {(goal) => (
                                <Table.Row id={goal.id} className="selected:bg-primary">
                                    <Table.Cell>
                                        <div>
                                            <p className="text-sm font-medium text-primary">{goal.title}</p>
                                            {goal.closes_at && <p className="text-xs text-tertiary">{__('pages.admin.goals.closes_at', { date: formatDate(goal.closes_at) })}</p>}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div>
                                            <p className="text-sm font-medium text-primary">{goal.user.display_name}</p>
                                            <p className="text-xs text-tertiary">@{goal.user.handle}</p>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div>
                                            <p className="text-sm font-medium text-primary">{goal.progress_percentage.toFixed(1)}%</p>
                                            <p className="text-xs text-tertiary">
                                                {formatCurrency(goal.raised_amount, 'BRL')} / {formatCurrency(goal.target_amount, 'BRL')}
                                            </p>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge color={goal.is_active ? 'success' : 'gray'} size="sm">
                                            {goal.is_active ? __('pages.admin.goals.active') : __('pages.admin.goals.inactive')}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell className="text-sm whitespace-nowrap text-tertiary">{formatDate(goal.created_at)}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>

                    {/* Desktop pagination */}
                    <div className="max-lg:hidden">
                        <PaginationCardMinimal align="right" page={goals.current_page} total={goals.last_page} />
                    </div>
                </TableCard.Root>

                {/* Mobile pagination */}
                <div className="lg:hidden">
                    <PaginationPageMinimalCenter page={goals.current_page} total={goals.last_page} className="mt-6" />
                </div>
            </div>
        </div>
    );
}

Page.layout = (page: React.ReactNode) => <PanelLayout children={page} title="pages.admin.goals.title" />;

export default Page;
