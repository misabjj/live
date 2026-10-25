import { PaginationCardMinimal, PaginationPageMinimalCenter } from '@/components/untitled-ui/application/pagination/pagination';
import { Table, TableCard } from '@/components/untitled-ui/application/table/table';
import { Avatar } from '@/components/untitled-ui/base/avatar/avatar';
import { Button } from '@/components/untitled-ui/base/buttons/button';
import { Dropdown } from '@/components/untitled-ui/base/dropdown/dropdown';
import { Input } from '@/components/untitled-ui/base/input/input';
import PanelLayout from '@/layouts/panel-layout';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { getInitials } from '@/lib/utils';
import { dashboard } from '@/routes';
import { index, playDonationAlert } from '@/routes/admin/donations';
import { Pagination } from '@/types/pagination';
import { router, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, CurrencyDollar, SearchLg } from '@untitledui/icons';
import { useEffect, useRef } from 'react';

interface Donation {
    id: number;
    donor_name: string;
    amount: number;
    currency: string;
    created_at: string;
    streamer: {
        id: number;
        display_name: string;
        handle: string;
    };
}

interface Props {
    donations: Pagination<Donation>;
    filter: {
        donor_name: string;
        streamer_id: string;
    };
}

function Page({ donations, filter }: Props) {
    const isInitialMount = useRef(true);
    const form = useForm({
        filter: {
            donor_name: filter.donor_name,
            streamer_id: filter.streamer_id,
        },
    });

    const handleSearchChange = (search: string) => {
        form.setData('filter', { ...form.data.filter, donor_name: search });
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            if (form.data.filter.donor_name === '' && form.data.filter.streamer_id === '') {
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
                            Voltar
                        </Button>
                    </div>

                    <div className="flex flex-col gap-0.5 md:gap-1">
                        <p className="text-lg font-semibold text-primary sm:text-xl md:text-display-xs">Todas as Doações (Admin)</p>
                        <p className="text-sm text-tertiary sm:text-md">Visualize todas as doações da plataforma.</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
                {/* Search */}
                <div className="relative flex flex-wrap items-center justify-between gap-x-3 gap-y-4 pb-6 after:pointer-events-none after:absolute after:inset-0 after:border-b after:border-secondary lg:flex-nowrap lg:px-0 lg:pb-0 lg:after:border-b-0">
                    <Input
                        className="lg:max-w-100"
                        size="sm"
                        placeholder="Buscar por doador"
                        icon={SearchLg}
                        value={form.data.filter.donor_name}
                        onChange={handleSearchChange}
                    />
                </div>

                {/* Donations table */}
                <TableCard.Root className="lg:rounded-xl">
                    <TableCard.Header title="Doações" badge={`${donations.total} total`} />
                    <Table aria-label="Doações" selectionMode="none" className="bg-primary">
                        <Table.Header>
                            <Table.Head id="id" label="ID" />
                            <Table.Head id="donor_name" label="Nome de usuário" isRowHeader />
                            <Table.Head id="streamer" label="Streamer" className="w-full" />
                            <Table.Head id="amount" label="Valor" />
                            <Table.Head id="created_at" label="Data" />
                            <Table.Head id="actions" label="" className="text-right" />
                        </Table.Header>

                        <Table.Body items={donations.data}>
                            {(donation) => (
                                <Table.Row id={donation.id} className="selected:bg-primary">
                                    <Table.Cell>
                                        <span className="text-sm text-tertiary">#{donation.id}</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div className="group flex items-center gap-3 outline-hidden">
                                            <Avatar src="" alt={donation.donor_name} size="sm" initials={getInitials(donation.donor_name)} />
                                            <div>
                                                <p className="text-sm font-medium text-primary">{donation.donor_name}</p>
                                            </div>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div className="group flex items-center gap-3 outline-hidden">
                                            <div>
                                                <p className="text-sm font-medium text-primary">{donation.streamer.display_name}</p>
                                                <p className="text-xs text-tertiary">@{donation.streamer.handle}</p>
                                            </div>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-2">
                                            <CurrencyDollar size={16} className="text-success-500" />
                                            <span className="text-sm font-medium text-primary">
                                                {formatCurrency(donation.amount, donation.currency)}
                                            </span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="text-sm whitespace-nowrap text-tertiary">{formatDate(donation.created_at)}</Table.Cell>
                                    <Table.Cell className="text-right">
                                        <Dropdown.Root>
                                            <Dropdown.DotsButton />
                                            <Dropdown.Popover>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item
                                                        label="Mostrar alerta"
                                                        icon={AlertCircle}
                                                        onAction={() => {
                                                            router.post(
                                                                playDonationAlert(donation.id.toString()),
                                                                {},
                                                                {
                                                                    preserveScroll: true,
                                                                },
                                                            );
                                                        }}
                                                    />
                                                </Dropdown.Menu>
                                            </Dropdown.Popover>
                                        </Dropdown.Root>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>

                    {/* Desktop pagination */}
                    <div className="max-lg:hidden">
                        <PaginationCardMinimal align="right" page={donations.current_page} total={donations.last_page} />
                    </div>
                </TableCard.Root>

                {/* Mobile pagination */}
                <div className="lg:hidden">
                    <PaginationPageMinimalCenter page={donations.current_page} total={donations.last_page} className="mt-6" />
                </div>
            </div>
        </div>
    );
}

Page.layout = (page: React.ReactNode) => <PanelLayout children={page} title="Todas as Doações" />;

export default Page;
