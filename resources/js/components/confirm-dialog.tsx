import { Dialog, Modal, ModalOverlay } from '@/components/ui/application/modals/modal';
import { Button } from '@/components/ui/base/buttons/button';
import { CloseButton } from '@/components/ui/base/buttons/close-button';
import { FeaturedIcon } from '@/components/ui/foundations/featured-icon/featured-icon';
import { BackgroundPattern } from '@/components/ui/shared-assets/background-patterns';
import type { ConfirmOptions } from '@/hooks/use-confirm';
import { Trash01 } from '@untitledui/icons';
import { Heading as AriaHeading } from 'react-aria-components';

interface ConfirmDialogProps {
    isOpen: boolean;
    options: ConfirmOptions | null;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({ isOpen, options, onConfirm, onCancel }: ConfirmDialogProps) {
    if (!options) return null;

    const isDanger = options.variant === 'danger';
    const confirmLabel = options.confirmLabel ?? 'Confirmar';
    const cancelLabel = options.cancelLabel ?? 'Cancelar';

    return (
        <ModalOverlay isOpen={isOpen} onOpenChange={(open) => !open && onCancel()} isDismissable>
                <Modal className="sm:max-w-136">
                    <Dialog>
                            <CloseButton onClick={onCancel} theme="light" size="lg" className="absolute top-3 right-3 z-20" />
                            <div className="flex flex-col gap-4 px-4 pt-5 sm:flex-row sm:px-6 sm:pt-6">
                                {isDanger && (
                                    <div className="relative size-max">
                                        <FeaturedIcon color="error" size="lg" theme="light" icon={Trash01} />
                                        <BackgroundPattern
                                            pattern="circle"
                                            size="sm"
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                        />
                                    </div>
                                )}
                                <div className="relative flex flex-col gap-0.5">
                                    <AriaHeading slot="title" className="text-md font-semibold text-primary">
                                        {options.title}
                                    </AriaHeading>
                                    {options.description && <p className="text-sm text-tertiary">{options.description}</p>}
                                </div>
                            </div>
                            <div className="relative flex flex-1 flex-col-reverse gap-3 p-4 pt-6 sm:flex-row sm:items-center sm:px-6 sm:pt-8 sm:pb-6">
                                <Button color="secondary" size="lg" onClick={onCancel} className="sm:ml-auto">
                                    {cancelLabel}
                                </Button>
                                <Button color={isDanger ? 'primary-destructive' : 'primary'} size="lg" onClick={onConfirm}>
                                    {confirmLabel}
                                </Button>
                            </div>
                    </Dialog>
                </Modal>
        </ModalOverlay>
    );
}
