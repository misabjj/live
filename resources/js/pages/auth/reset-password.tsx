import { Head, Form as InertiaForm } from '@inertiajs/react';

import { Button } from '@/components/untitled-ui/base/buttons/button';
import { Input } from '@/components/untitled-ui/base/input/input';
import { Label } from '@/components/untitled-ui/base/input/label';
import { store } from '@/routes/password';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    return (
        <div className="bg-background flex min-h-screen items-center justify-center px-4">
            <Head title="Reset password" />

            <div className="w-full max-w-md">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">Reset password</h1>
                        <p className="text-muted-foreground text-sm">Please enter your new password below</p>
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
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" name="email" autoComplete="email" defaultValue={email} isReadOnly />
                                    {errors.email && <p className="text-destructive text-sm font-medium">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        autoComplete="new-password"
                                        autoFocus
                                        placeholder="Password"
                                        isDisabled={processing}
                                    />
                                    {errors.password && <p className="text-destructive text-sm font-medium">{errors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Confirm password</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        autoComplete="new-password"
                                        placeholder="Confirm password"
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
                                    Reset password
                                </Button>
                            </>
                        )}
                    </InertiaForm>
                </div>
            </div>
        </div>
    );
}
