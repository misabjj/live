import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import { Button } from '@/components/untitled-ui/base/buttons/button';
import { Input } from '@/components/untitled-ui/base/input/input';
import { Label } from '@/components/untitled-ui/base/input/label';
import { store } from '@/routes/password';

interface ResetPasswordProps {
    token: string;
    email: string;
}

type ResetPasswordForm = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const {
        data,
        setData,
        submit: submitForm,
        processing,
        errors,
        reset,
    } = useForm<Required<ResetPasswordForm>>({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        submitForm(store(), {
            preserveScroll: true,
            onSuccess: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="bg-background flex min-h-screen items-center justify-center px-4">
            <Head title="Reset password" />

            <div className="w-full max-w-md">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">Reset password</h1>
                        <p className="text-muted-foreground text-sm">Please enter your new password below</p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={data.email}
                                isReadOnly
                                onChange={(value) => setData('email', value)}
                            />
                            {errors.email && <p className="text-destructive text-sm font-medium">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                value={data.password}
                                autoFocus
                                onChange={(value) => setData('password', value)}
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
                                value={data.password_confirmation}
                                onChange={(value) => setData('password_confirmation', value)}
                                placeholder="Confirm password"
                                isDisabled={processing}
                            />
                            {errors.password_confirmation && <p className="text-destructive text-sm font-medium">{errors.password_confirmation}</p>}
                        </div>

                        <Button type="submit" color="primary" size="md" className="mt-4 w-full" isDisabled={processing} isLoading={processing}>
                            Reset password
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
