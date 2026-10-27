import { Head, Form as InertiaForm, Link as InertiaLink } from '@inertiajs/react';

import { Button } from '@/components/ui/base/buttons/button';
import { logout } from '@/routes';
import { send } from '@/routes/verification';
import { useLang } from '@/hooks/use-lang';

export default function VerifyEmail({ status }: { status?: string }) {
    const { __ } = useLang();
    return (
        <div className="bg-background flex min-h-screen items-center justify-center px-4">
            <Head title={__('auth.verify-email.verify_email.title')} />

            <div className="w-full max-w-md">
                <div className="space-y-6">
                    <div className="space-y-2 text-center">
                        <h1 className="text-2xl font-bold">{__('auth.verify-email.verify_email.title')}</h1>
                        <p className="text-muted-foreground text-sm">{__('auth.verify-email.verify_email.subtitle')}</p>
                    </div>

                    {status === 'verification-link-sent' && (
                        <div className="rounded-lg bg-green-50 p-4 text-center text-sm font-medium text-green-700 dark:bg-green-950/30 dark:text-green-400">
                            {__('auth.verify-email.verify_email.sent')}
                        </div>
                    )}

                    <InertiaForm {...send.form()} noValidate options={{ preserveScroll: true }} className="space-y-4 text-center">
                        {({ processing }) => (
                            <>
                                <Button type="submit" color="primary" size="md" className="w-full" isDisabled={processing} isLoading={processing}>
                                    {__('auth.verify-email.verify_email.buttons.resend')}
                                </Button>

                                <div className="text-sm">
                                    <InertiaLink href={logout()} as="button" className="font-medium text-primary hover:underline">
                                        {__('auth.verify-email.verify_email.buttons.logout')}
                                    </InertiaLink>
                                </div>
                            </>
                        )}
                    </InertiaForm>
                </div>
            </div>
        </div>
    );
}
