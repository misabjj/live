import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import { store as submitPasswordConfirmation } from '@/actions/App/Http/Controllers/Auth/ConfirmablePasswordController';
import { Button } from '@/components/untitled-ui/base/buttons/button';
import { Input } from '@/components/untitled-ui/base/input/input';
import { Label } from '@/components/untitled-ui/base/input/label';

export default function ConfirmPassword() {
    const {
        data,
        setData,
        submit: submitForm,
        processing,
        errors,
        reset,
    } = useForm<Required<{ password: string }>>({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        submitForm(submitPasswordConfirmation(), {
            preserveScroll: true,
            onSuccess: () => reset('password'),
        });
    };

    return (
        <div className="bg-background flex min-h-screen items-center justify-center px-4">
            <Head title="Confirm password" />

            <div className="w-full max-w-md">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">Confirm your password</h1>
                        <p className="text-muted-foreground text-sm">
                            This is a secure area of the application. Please confirm your password before continuing.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Password"
                                autoComplete="current-password"
                                value={data.password}
                                autoFocus
                                onChange={(value) => setData('password', value)}
                                isDisabled={processing}
                            />
                            {errors.password && <p className="text-destructive text-sm font-medium">{errors.password}</p>}
                        </div>

                        <Button type="submit" color="primary" size="md" className="w-full" isDisabled={processing} isLoading={processing}>
                            Confirm password
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
