import { Head, Form as InertiaForm } from '@inertiajs/react';

import { Button } from '@/components/ui/base/buttons/button';
import { Input } from '@/components/ui/base/input/input';
import { Label } from '@/components/ui/base/input/label';
import { store } from '@/routes/password';
import { useLang } from '@/hooks/use-lang';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { __ } = useLang();
    return (
        <div className="bg-background flex min-h-screen items-center justify-center px-4">
            <Head title={__('auth.reset-password.title')} />

            <div className="w-full max-w-md">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">{__('auth.reset-password.title')}</h1>
                        <p className="text-muted-foreground text-sm">{__('auth.reset-password.subtitle')}</p>
                    </div>

                    <InertiaForm
                        {...store.form()}
                        options={{ preserveScroll: true }}
                        resetOnSuccess={['password', 'password_confirmation']}
                        className="space-y-4"
                    >
                        {({ errors, processing }) => (
                            <>
                                <input type="hidden" name="token" value={token} />
                                <div className="space-y-2">
                                    <Label htmlFor="email">{__('auth.reset-password.fields.email.label')}</Label>
                                    <Input id="email" type="email" name="email" autoComplete="email" defaultValue={email} isReadOnly />
                                    {errors.email && <p className="text-destructive text-sm font-medium">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">{__('auth.reset-password.fields.password.label')}</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        autoComplete="new-password"
                                        autoFocus
                                        placeholder={__('auth.reset-password.fields.password.placeholder')}
                                        isDisabled={processing}
                                    />
                                    {errors.password && <p className="text-destructive text-sm font-medium">{errors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">{__('auth.reset-password.fields.password_confirmation.label')}</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        autoComplete="new-password"
                                        placeholder={__('auth.reset-password.fields.password_confirmation.placeholder')}
                                        isDisabled={processing}
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-destructive text-sm font-medium">{errors.password_confirmation}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    color="primary"
                                    size="md"
                                    className="mt-4 w-full"
                                    isDisabled={processing}
                                    isLoading={processing}
                                >
                                    {__('auth.reset-password.buttons.reset')}
                                </Button>
                            </>
                        )}
                    </InertiaForm>
                </div>
            </div>
        </div>
    );
}
