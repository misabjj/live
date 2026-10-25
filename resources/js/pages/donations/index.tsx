import { Dialog, Modal, ModalOverlay } from '@/components/untitled-ui/application/modals/modal';
import { PaginationCardMinimal, PaginationPageMinimalCenter } from '@/components/untitled-ui/application/pagination/pagination';
import { Table, TableCard } from '@/components/untitled-ui/application/table/table';
import { Avatar } from '@/components/untitled-ui/base/avatar/avatar';
import { Button } from '@/components/untitled-ui/base/buttons/button';
import { CloseButton } from '@/components/untitled-ui/base/buttons/close-button';
import { Dropdown } from '@/components/untitled-ui/base/dropdown/dropdown';
import { Input } from '@/components/untitled-ui/base/input/input';
import { BackgroundPattern } from '@/components/untitled-ui/shared-assets/background-patterns';
import PanelLayout from '@/layouts/panel-layout';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { getInitials } from '@/lib/utils';
import { index, playDonationAlert } from '@/routes/donations';
import { Pagination } from '@/types/pagination';
import { router, useForm } from '@inertiajs/react';
import { InfoCircle, Play, SearchLg } from '@untitledui/icons';
import { useEffect, useRef, useState } from 'react';
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from 'react-aria-components';

interface Donation {
    id: number;
    donor_name: string;
    amount: number;
    currency: string;
    created_at: string;
    content_type: 'text' | 'text_to_speech' | 'audio';
    content_text?: string;
    content_path?: string;
}

interface Props {
    donations: Pagination<Donation>;
    filter: {
        donor_name: string;
    };
}

const contentTypeMap: Record<'text' | 'text_to_speech' | 'audio', string> = {
    text: 'Mensagem de texto',
    text_to_speech: 'Gerado por IA',
    audio: 'Áudio gravado',
};

function getContentTypeLabel(contentType: 'text' | 'text_to_speech' | 'audio'): string {
    return contentTypeMap[contentType] || contentType;
}

function Page({ donations, filter }: Props) {
    const isInitialMount = useRef(true);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
    const form = useForm({
        filter: {
            donor_name: filter.donor_name,
        },
    });

    const handleSearchChange = (search: string) => {
        form.setData('filter', { ...form.data.filter, donor_name: search });
    };

    const handleOpenDonationInfo = (donation: Donation) => {
        setTimeout(() => {
            setSelectedDonation(donation);
        }, 150);
    };

    const handleCloseDonationInfo = () => {
        setSelectedDonation(null);
    };

    const handlePlayContent = (donation: Donation) => {
        if (audioRef.current && donation.content_path) {
            audioRef.current.src = donation.content_path;
            audioRef.current.play().catch((error) => {
                console.error('Erro ao reproduzir áudio:', error);
            });
        }
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            if (form.data.filter.donor_name === '') {
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
                    <div className="flex flex-col gap-0.5 md:gap-1">
                        <p className="text-lg font-semibold text-primary sm:text-xl md:text-display-xs">Doações</p>
                        <p className="text-sm text-tertiary sm:text-md">Gerencie suas doações e alertas de streaming.</p>
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
                            <Table.Head id="donor_name" label="Nome de usuário" isRowHeader className="w-full" />
                            <Table.Head id="amount" label="Valor" />
                            <Table.Head id="created_at" label="Data" />
                            <Table.Head id="actions" label="" className="text-right" />
                        </Table.Header>

                        <Table.Body items={donations.data}>
                            {(donation) => (
                                <Table.Row id={donation.id} className="selected:bg-primary">
                                    <Table.Cell>
                                        <div className="group flex items-center gap-3 outline-hidden">
                                            <Avatar src="" alt={donation.donor_name} size="sm" initials={getInitials(donation.donor_name)} />
                                            <div>
                                                <p className="text-sm font-medium text-primary">{donation.donor_name}</p>
                                            </div>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className="text-sm font-medium text-primary">{formatCurrency(donation.amount, donation.currency)}</span>
                                    </Table.Cell>
                                    <Table.Cell className="text-sm whitespace-nowrap text-tertiary">{formatDate(donation.created_at)}</Table.Cell>
                                    <Table.Cell className="text-right">
                                        <Dropdown.Root>
                                            <Dropdown.DotsButton />
                                            <Dropdown.Popover>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item
                                                        label="Informações"
                                                        icon={InfoCircle}
                                                        onAction={() => handleOpenDonationInfo(donation)}
                                                    />
                                                    <Dropdown.Item
                                                        label="Mostrar alerta"
                                                        icon={Play}
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

            {/* Donation Info Modal */}
            <AriaDialogTrigger isOpen={selectedDonation !== null} onOpenChange={(open) => !open && handleCloseDonationInfo()}>
                <ModalOverlay isDismissable>
                    <Modal>
                        <Dialog>
                            {selectedDonation && (
                                <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-120">
                                    <CloseButton onClick={handleCloseDonationInfo} theme="light" size="lg" className="absolute top-3 right-3 z-10" />

                                    <div className="flex flex-col gap-4 px-4 pt-5 pb-6 sm:px-6 sm:pt-6">
                                        <div className="relative flex size-14 items-center justify-center">
                                            <InfoCircle className="z-10 h-12 w-12 text-primary" />
                                            <BackgroundPattern
                                                pattern="circle"
                                                size="sm"
                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                            />
                                        </div>
                                        <div className="z-10 flex flex-col gap-0.5">
                                            <AriaHeading slot="title" className="text-md font-semibold text-primary">
                                                Informações da doação
                                            </AriaHeading>
                                            <p className="text-sm text-tertiary">Detalhes e conteúdo da doação</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4 px-4 pb-6 sm:px-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-tertiary">Doador:</span>
                                                <span className="text-sm font-medium text-primary">{selectedDonation.donor_name}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-tertiary">Valor:</span>
                                                <span className="text-sm font-medium text-primary">
                                                    {formatCurrency(selectedDonation.amount, selectedDonation.currency)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-tertiary">Data:</span>
                                                <span className="text-sm font-medium text-primary">{formatDate(selectedDonation.created_at)}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-tertiary">Tipo de conteúdo:</span>
                                                <span className="text-sm font-medium text-primary">
                                                    {getContentTypeLabel(selectedDonation.content_type)}
                                                </span>
                                            </div>
                                            {selectedDonation.content_text && (
                                                <div className="flex flex-col gap-1 border-t border-secondary pt-3">
                                                    <span className="text-sm text-tertiary">Mensagem:</span>
                                                    <p className="text-sm text-secondary">{selectedDonation.content_text}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-1 flex-col-reverse gap-3 p-4 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pb-6">
                                        <Button type="button" color="secondary" size="lg" onClick={handleCloseDonationInfo}>
                                            Fechar
                                        </Button>
                                        {(selectedDonation.content_type === 'text_to_speech' || selectedDonation.content_type === 'audio') &&
                                            selectedDonation.content_path && (
                                                <Button
                                                    type="button"
                                                    color="primary"
                                                    size="lg"
                                                    onClick={() => handlePlayContent(selectedDonation)}
                                                    iconLeading={Play}
                                                >
                                                    Ouvir
                                                </Button>
                                            )}
                                    </div>
                                </div>
                            )}
                        </Dialog>
                    </Modal>
                </ModalOverlay>
            </AriaDialogTrigger>

            {/* Hidden audio element for playback */}
            <audio
                ref={audioRef}
                onError={(e) => {
                    console.error('Erro ao carregar áudio:', {
                        error: e,
                        code: audioRef.current?.error?.code,
                        message: audioRef.current?.error?.message,
                    });
                }}
                className="hidden"
            />
        </div>
    );
}

Page.layout = (page: React.ReactNode) => <PanelLayout children={page} title="Doações" />;

export default Page;
