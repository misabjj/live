import { PaginationCardMinimal, PaginationPageMinimalCenter } from '@/components/untitled-ui/application/pagination/pagination';
import { Table, TableCard } from '@/components/untitled-ui/application/table/table';
import { Avatar } from '@/components/untitled-ui/base/avatar/avatar';
import { Badge } from '@/components/untitled-ui/base/badges/badges';
import { Button } from '@/components/untitled-ui/base/buttons/button';
import { Input } from '@/components/untitled-ui/base/input/input';
import PanelLayout from '@/layouts/panel-layout';
import { formatDate } from '@/lib/formatters';
import { getInitials } from '@/lib/utils';
import { dashboard } from '@/routes';
import { index } from '@/routes/admin/users';
import { Pagination } from '@/types/pagination';
import { useForm } from '@inertiajs/react';
import { ArrowLeft, SearchLg } from '@untitledui/icons';
import { useEffect, useRef } from 'react';

interface User {
    id: string;
    display_name: string;
    email: string;
    handle: string;
    is_admin: boolean;
    accepting_donations: boolean;
    created_at: string;
}

interface Props {
    users: Pagination<User>;
    filter: {
        display_name: string;
        email: string;
        handle: string;
    };
}

function Page({ users, filter }: Props) {
    const isInitialMount = useRef(true);
    const form = useForm({
        filter: {
            display_name: filter.display_name,
            email: filter.email,
            handle: filter.handle,
        },
    });

    const handleSearchChange = (search: string) => {
        form.setData('filter', { ...form.data.filter, display_name: search });
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            if (form.data.filter.display_name === '' && form.data.filter.email === '' && form.data.filter.handle === '') {
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
                        <p className="text-lg font-semibold text-primary sm:text-xl md:text-display-xs">Todos os Usuários (Admin)</p>
                        <p className="text-sm text-tertiary sm:text-md">Visualize todos os usuários da plataforma.</p>
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
                        value={form.data.filter.display_name}
                        onChange={handleSearchChange}
                    />
                </div>

                {/* Users table */}
                <TableCard.Root className="lg:rounded-xl">
                    <TableCard.Header title="Usuários" badge={`${users.total} total`} />
                    <Table aria-label="Usuários" selectionMode="none" className="bg-primary">
                        <Table.Header>
                            <Table.Head id="user" label="Usuário" isRowHeader className="w-full" />
                            <Table.Head id="handle" label="Handle" />
                            <Table.Head id="status" label="Status" />
                            <Table.Head id="created_at" label="Data de Cadastro" />
                        </Table.Header>

                        <Table.Body items={users.data}>
                            {(user) => (
                                <Table.Row id={user.id} className="selected:bg-primary">
                                    <Table.Cell>
                                        <div className="group flex items-center gap-3 outline-hidden">
                                            <Avatar src="" alt={user.display_name} size="sm" initials={getInitials(user.display_name)} />
                                            <div>
                                                <p className="text-sm font-medium text-primary">{user.display_name}</p>
                                                <p className="text-xs text-tertiary">{user.email}</p>
                                            </div>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className="text-sm text-tertiary">@{user.handle}</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-2">
                                            {user.is_admin && (
                                                <Badge color="purple" size="sm">
                                                    Admin
                                                </Badge>
                                            )}
                                            {user.accepting_donations && (
                                                <Badge color="success" size="sm">
                                                    Aceitando doações
                                                </Badge>
                                            )}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="text-sm whitespace-nowrap text-tertiary">{formatDate(user.created_at)}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>

                    {/* Desktop pagination */}
                    <div className="max-lg:hidden">
                        <PaginationCardMinimal align="right" page={users.current_page} total={users.last_page} />
                    </div>
                </TableCard.Root>

                {/* Mobile pagination */}
                <div className="lg:hidden">
                    <PaginationPageMinimalCenter page={users.current_page} total={users.last_page} className="mt-6" />
                </div>
            </div>
        </div>
    );
}

Page.layout = (page: React.ReactNode) => <PanelLayout children={page} title="Todos os Usuários" />;

export default Page;
