import { PaginationCardMinimal, PaginationPageMinimalCenter } from '@/components/untitled-ui/application/pagination/pagination';
import { Table, TableCard } from '@/components/untitled-ui/application/table/table';
import { Avatar } from '@/components/untitled-ui/base/avatar/avatar';
import { Button } from '@/components/untitled-ui/base/buttons/button';
import { Input } from '@/components/untitled-ui/base/input/input';
import PanelLayout from '@/layouts/panel-layout';
import { formatDate } from '@/lib/formatters';
import { dashboard } from '@/routes';
import { index } from '@/routes/admin/narrators';
import { Pagination } from '@/types/pagination';
import { useForm } from '@inertiajs/react';
import { ArrowLeft, SearchLg } from '@untitledui/icons';
import { useEffect, useRef } from 'react';

interface Narrator {
    id: string;
    name: string;
    image_path: string | null;
    voice_id: string;
    voice_preview_path: string | null;
    is_active: boolean;
    created_at: string;
}

interface Props {
    narrators: Pagination<Narrator>;
    filter: {
        name: string;
    };
}

function Page({ narrators, filter }: Props) {
    const isInitialMount = useRef(true);
    const form = useForm({
        filter: {
            name: filter.name,
        },
    });

    const handleSearchChange = (search: string) => {
        form.setData('filter', { name: search });
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            if (form.data.filter.name === '') {
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
                        <p className="text-lg font-semibold text-primary sm:text-xl md:text-display-xs">Todos os Narradores (Admin)</p>
                        <p className="text-sm text-tertiary sm:text-md">Visualize todos os narradores da plataforma.</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
                {/* Search */}
                <div className="relative flex flex-wrap items-center justify-between gap-x-3 gap-y-4 pb-6 after:pointer-events-none after:absolute after:inset-0 after:border-b after:border-secondary lg:flex-nowrap lg:px-0 lg:pb-0 lg:after:border-b-0">
                    <Input
                        className="lg:max-w-100"
                        size="sm"
                        placeholder="Buscar por nome"
                        icon={SearchLg}
                        value={form.data.filter.name}
                        onChange={handleSearchChange}
                    />
                </div>

                {/* Narrators table */}
                <TableCard.Root className="lg:rounded-xl">
                    <TableCard.Header title="Narradores" badge={`${narrators.total} total`} />
                    <Table aria-label="Narradores" selectionMode="none" className="bg-primary">
                        <Table.Header>
                            <Table.Head id="narrator" label="Narrador" isRowHeader className="w-full" />
                            <Table.Head id="voice_id" label="Voice ID" />
                            <Table.Head id="status" label="Status" />
                            <Table.Head id="created_at" label="Data de Criação" />
                        </Table.Header>

                        <Table.Body items={narrators.data}>
                            {(narrator) => (
                                <Table.Row id={narrator.id} className="selected:bg-primary">
                                    <Table.Cell>
                                        <div className="group flex items-center gap-3 outline-hidden">
                                            <Avatar
                                                src={narrator.image_path ? `/storage/${narrator.image_path}` : ''}
                                                alt={narrator.name}
                                                initials={narrator.voice_id}
                                                size="sm"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-primary">{narrator.name}</p>
                                            </div>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className="text-sm text-tertiary">{narrator.voice_id}</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className={`text-sm font-medium ${narrator.is_active ? 'text-fg-success-primary' : 'text-tertiary'}`}>
                                            {narrator.is_active ? 'Ativo' : 'Legado'}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell className="text-sm whitespace-nowrap text-tertiary">{formatDate(narrator.created_at)}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>

                    {/* Desktop pagination */}
                    <div className="max-lg:hidden">
                        <PaginationCardMinimal align="right" page={narrators.current_page} total={narrators.last_page} />
                    </div>
                </TableCard.Root>

                {/* Mobile pagination */}
                <div className="lg:hidden">
                    <PaginationPageMinimalCenter page={narrators.current_page} total={narrators.last_page} className="mt-6" />
                </div>
            </div>
        </div>
    );
}

Page.layout = (page: React.ReactNode) => <PanelLayout children={page} title="Todos os Narradores" />;

export default Page;
