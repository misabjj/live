import { Head, Form as InertiaForm } from '@inertiajs/react';

import { store as submitPasswordConfirmation } from '@/actions/App/Http/Controllers/Auth/ConfirmablePasswordController';
import { Button } from '@/components/ui/base/buttons/button';
import { Input } from '@/components/ui/base/input/input';
import { Label } from '@/components/ui/base/input/label';
import { useLang } from '@/hooks/use-lang';

export default function ConfirmPassword() {
    const { __ } = useLang();
    return (
        <div className="bg-background flex min-h-screen items-center justify-center px-4">
            <Head title={__('auth.confirm-password.confirm_password.title')} />

            <div className="w-full max-w-md">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">{__('auth.confirm-password.confirm_password.title')}</h1>
                        <p className="text-muted-foreground text-sm">{__('auth.confirm-password.confirm_password.subtitle')}</p>
                    </div>

                    <InertiaForm
                        {...submitPasswordConfirmation.form()}
                        options={{ preserveScroll: true }}
                        resetOnSuccess={['password']}
                        className="space-y-4"
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="password">{__('auth.confirm-password.confirm_password.fields.password.label')}</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder={__('auth.confirm-password.confirm_password.fields.password.placeholder')}
                                        autoComplete="current-password"
                                        autoFocus
                                        isDisabled={processing}
                                    />
                                    {errors.password && <p className="text-destructive text-sm font-medium">{errors.password}</p>}
                                </div>

                                <Button type="submit" color="primary" size="md" className="w-full" isDisabled={processing} isLoading={processing}>
                                    {__('auth.confirm-password.confirm_password.buttons.confirm')}
                                </Button>
                            </>
                        )}
                    </InertiaForm>
                </div>
            </div>
        </div>
    );
}
