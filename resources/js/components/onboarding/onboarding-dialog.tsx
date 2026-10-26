import { Dialog, Modal, ModalOverlay } from '@/components/untitled-ui/application/modals/modal';
import { Button } from '@/components/untitled-ui/base/buttons/button';
import { CloseButton } from '@/components/untitled-ui/base/buttons/close-button';
import { BackgroundPattern } from '@/components/untitled-ui/shared-assets/background-patterns';
import { useAuth } from '@/hooks/use-auth';
import { GraduationHat02 } from '@untitledui/icons';
import { useEffect, useState } from 'react';
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from 'react-aria-components';

/**
 * Mark onboarding as dismissed in localStorage for a specific user
 */
function dismissOnboarding(userId: string): void {
    localStorage.setItem(`live_onboarding_dismissed_${userId}`, 'true');
}

/**
 * Reset onboarding state for a specific user (useful for testing or resetting)
 */
export function resetOnboarding(userId: string): void {
    localStorage.removeItem(`live_onboarding_dismissed_${userId}`);
}

/**
 * Onboarding dialog that appears to new users within 3 minutes of registration
 * Shows a welcome message and platform guidance
 */
export function OnboardingDialog() {
    const { user } = useAuth();
    const [shouldShow, setShouldShow] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Check if onboarding should be shown
    useEffect(() => {
        // Check if user has dismissed the onboarding before
        const hasSeenOnboarding = localStorage.getItem(`live_onboarding_dismissed_${user!.id}`);

        if (hasSeenOnboarding) {
            return;
        }

        // Check if user was created less than 3 minutes ago
        const createdDate = new Date(user!.created_at);
        const now = new Date();
        const diffInSeconds = (now.getTime() - createdDate.getTime()) / 1000;
        const threeMinutesInSeconds = 3 * 60;

        if (diffInSeconds < threeMinutesInSeconds) {
            setShouldShow(true);
            setIsOpen(true);
        }
    }, [user!.created_at, user!.id]);

    const handleClose = () => {
        setIsOpen(false);
        dismissOnboarding(user!.id);
    };

    if (!shouldShow) {
        return null;
    }

    return (
        <AriaDialogTrigger isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <ModalOverlay isDismissable>
                <Modal className="sm:max-w-120">
                    <Dialog>
                            {/* Close Button */}
                            <CloseButton onClick={handleClose} theme="light" size="lg" className="absolute top-3 right-3 z-10" />

                            {/* Header */}
                            <div className="flex flex-col gap-4 px-4 pt-5 pb-6 sm:px-6 sm:pt-6">
                                <div className="relative flex size-14 items-center justify-center">
                                    <GraduationHat02 className="z-10 h-12 w-12 text-brand-primary" />
                                    <BackgroundPattern
                                        pattern="circle"
                                        size="sm"
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                    />
                                </div>
                                <div className="z-10 flex flex-col gap-0.5">
                                        <AriaHeading slot="title" className="text-md font-semibold text-primary">
                                        Bem-vindo ao Live!
                                    </AriaHeading>
                                    <p className="text-sm text-tertiary">Conheça os recursos e comece a usar a plataforma Live.</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-4 px-4 pb-6 sm:px-6">
                                <div className="flex flex-col gap-2 rounded-lg border border-secondary/30 bg-transparent p-4">
                                    <p className="text-sm font-medium text-primary">Precisa de ajuda?</p>
                                    <p className="text-sm text-tertiary">Explore o painel para configurar sua página e suas transmissões.</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-1 flex-col-reverse gap-3 p-4 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pb-6">
                                <Button type="button" color="secondary" size="lg" onClick={handleClose}>
                                    Agora não
                                </Button>
                                <Button type="button" color="primary" size="lg" onClick={handleClose}>
                                    Começar
                                </Button>
                            </div>
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </AriaDialogTrigger>
    );
}
