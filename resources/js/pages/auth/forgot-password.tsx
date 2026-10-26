import { Head, Form as InertiaForm } from '@inertiajs/react';
import { ArrowLeft, Key01 } from '@untitledui/icons';
import { Button } from '@/components/ui/base/buttons/button';
import { Input } from '@/components/ui/base/input/input';
import { Label } from '@/components/ui/base/input/label';
import { FeaturedIcon } from '@/components/ui/foundations/featured-icon/featured-icon';
import { BackgroundPattern } from '@/components/ui/shared-assets/background-patterns';
import { useLang } from '@/hooks/use-lang';
import { login } from '@/routes';
import { email } from '@/routes/password';

interface ForgotPasswordProps {
    status?: string;
}

export default function Page({ status }: ForgotPasswordProps) {
    const { __ } = useLang();
    return (
        <>
            <Head title={__('auth/forgot-password.title')} />
            <section className="flex min-h-screen items-center justify-center overflow-hidden bg-primary px-4 py-12 md:px-8">
                <div className="mx-auto flex w-full max-w-90 flex-col gap-8">
                    <div className="flex flex-col items-center gap-6 text-center">
                        <div className="relative">
                            <FeaturedIcon color="gray" theme="modern" size="xl" className="z-10">
                                <Key01 className="size-7" />
                            </FeaturedIcon>
                            <BackgroundPattern
                                size="lg"
                                pattern="grid"
                                className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block"
                            />
                            <BackgroundPattern
                                size="md"
                                pattern="grid"
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden"
                            />
                        </div>

                        <div className="z-10 flex flex-col gap-2 md:gap-3">
                            <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">{__('auth/forgot-password.title')}</h1>
                            <p className="self-stretch text-md text-tertiary">{__('auth/forgot-password.subtitle')}</p>
                        </div>
                    </div>

                    {status && (
                        <div className="z-10 rounded-md bg-green-50 p-4">
                            <p className="text-sm text-green-800">{status}</p>
                        </div>
                    )}

                    <InertiaForm {...email.form()} options={{ preserveScroll: true }} className="z-10 flex flex-col gap-6">
                        {({ errors, processing }) => (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="email">{__('auth/forgot-password.fields.email.label')}</Label>
                                    <Input id="email" type="email" name="email" placeholder={__('auth/forgot-password.fields.email.placeholder')} />
                                    {errors.email && <p className="text-destructive text-sm font-medium">{errors.email}</p>}
                                </div>

                                <div className="flex flex-col gap-4">
                                    <Button type="submit" size="md" isDisabled={processing} isLoading={processing}>
                                        {__('auth/forgot-password.buttons.reset')}
                                    </Button>
                                </div>
                            </>
                        )}
                    </InertiaForm>

                    <div className="z-10 flex justify-center gap-1 text-center">
                        <Button size="sm" color="tertiary" href={login.url()} className="mx-auto" iconLeading={ArrowLeft}>
                            {__('auth/forgot-password.buttons.back')}
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}
