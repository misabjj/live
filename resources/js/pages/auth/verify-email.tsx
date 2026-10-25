import { Head, Link as InertiaLink, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import { Button } from '@/components/untitled-ui/base/buttons/button';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    const { submit: submitForm, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        submitForm(send(), { preserveScroll: true });
    };

    return (
        <div className="bg-background flex min-h-screen items-center justify-center px-4">
            <Head title="Email verification" />

            <div className="w-full max-w-md">
                <div className="space-y-6">
                    <div className="space-y-2 text-center">
                        <h1 className="text-2xl font-bold">Verify email</h1>
                        <p className="text-muted-foreground text-sm">
                            Please verify your email address by clicking on the link we just emailed to you.
                        </p>
                    </div>

                    {status === 'verification-link-sent' && (
                        <div className="rounded-lg bg-green-50 p-4 text-center text-sm font-medium text-green-700 dark:bg-green-950/30 dark:text-green-400">
                            A new verification link has been sent to the email address you provided during registration.
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4 text-center">
                        <Button type="submit" color="primary" size="md" className="w-full" isDisabled={processing} isLoading={processing}>
                            Resend verification email
                        </Button>

                        <div className="text-sm">
                            <InertiaLink href={logout()} as="button" className="font-medium text-primary hover:underline">
                                Log out
                            </InertiaLink>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
