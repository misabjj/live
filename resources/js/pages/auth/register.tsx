import { Head, Form as InertiaForm } from '@inertiajs/react';
import { useState } from 'react';
import { store as submitRegistration } from '@/actions/App/Http/Controllers/Auth/RegisterController';
import { Button } from '@/components/ui/base/buttons/button';
import { SocialButton } from '@/components/ui/base/buttons/social-button';
import { Input } from '@/components/ui/base/input/input';
import { login } from '@/routes';
import oauth from '@/routes/oauth';
import { cx } from '@/utils/cx';
import { useLang } from '@/hooks/use-lang';

interface RegisterProps {
    status?: string;
}

export default function Page({ status }: RegisterProps) {
    const { __ } = useLang();
    const [password, setPassword] = useState('');

    return (
        <>
            <Head title={__('auth.register.title')} />
            <section className="flex min-h-screen items-center justify-center overflow-hidden bg-primary px-4 py-12 md:px-8">
                <div className="mx-auto flex w-full flex-col gap-8 sm:max-w-90">
                    <div className="flex flex-col items-center gap-6 text-center">
                        <div className="z-10 flex flex-col gap-2 md:gap-3">
                            <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">{__('auth.register.title')}</h1>
                            <p className="text-md text-tertiary">{__('auth.register.subtitle')}</p>
                        </div>
                    </div>

                    {status && (
                        <div className="z-10 rounded-md bg-green-50 p-4">
                            <p className="text-sm text-green-800">{status}</p>
                        </div>
                    )}

                    <InertiaForm
                        {...submitRegistration.form()}
                        options={{ preserveScroll: true }}
                        resetOnSuccess={['password', 'password_confirmation']}
                        onSuccess={() => setPassword('')}
                        className="z-10 flex flex-col gap-6"
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="flex flex-col gap-5">
                                    <Input
                                        isRequired
                                        hideRequiredIndicator
                                        label={__('auth.register.fields.display_name.label')}
                                        type="text"
                                        name="display_name"
                                        placeholder={__('auth.register.fields.display_name.placeholder')}
                                        size="md"
                                        isInvalid={!!errors.display_name}
                                        hint={errors.display_name}
                                    />
                                    <Input
                                        isRequired
                                        hideRequiredIndicator
                                        label={__('auth.register.fields.email.label')}
                                        type="email"
                                        name="email"
                                        placeholder={__('auth.register.fields.email.placeholder')}
                                        size="md"
                                        isInvalid={!!errors.email}
                                        hint={errors.email}
                                    />
                                    <Input
                                        isRequired
                                        hideRequiredIndicator
                                        label={__('auth.register.fields.password.label')}
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={setPassword}
                                        size="md"
                                        placeholder={__('auth.register.fields.password.placeholder')}
                                        minLength={8}
                                        pattern='.*[!@#$%^&*\\(\\),.?":\\{\\}\\|<>].*'
                                        isInvalid={!!errors.password}
                                        hint={errors.password}
                                    />
                                    <Input
                                        isRequired
                                        hideRequiredIndicator
                                        label={__('auth.register.fields.password_confirmation.label')}
                                        type="password"
                                        name="password_confirmation"
                                        placeholder={__('auth.register.fields.password_confirmation.placeholder')}
                                        size="md"
                                        isInvalid={!!errors.password_confirmation}
                                        hint={errors.password_confirmation}
                                    />
                                    <div className="flex flex-col gap-3">
                                        <span className="flex gap-2">
                                            <div
                                                className={cx(
                                                    'flex size-5 items-center justify-center rounded-full bg-fg-disabled_subtle text-fg-white transition duration-150 ease-in-out',
                                                    password.length >= 8 ? 'bg-fg-success-primary' : '',
                                                )}
                                            >
                                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                    <path
                                                        d="M1.25 4L3.75 6.5L8.75 1.5"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>
                                            <p className="text-sm text-tertiary">{__('auth.register.password_requirement')}</p>
                                        </span>
                                    </div>
                                </div>

                                <div className="z-10 flex flex-col gap-4">
                                    <Button type="submit" size="lg" isDisabled={processing}>
                                        {processing ? __('auth.register.buttons.processing') : __('auth.register.buttons.register')}
                                    </Button>
                                    <SocialButton social="google" theme="color" href={oauth.redirect.url('google')}>
                                        Cadastrar com Google
                                    </SocialButton>
                                </div>
                            </>
                        )}
                    </InertiaForm>

                    <div className="flex justify-center gap-1 text-center">
                        <span className="text-sm text-tertiary">{__('auth.register.signin_prompt')}</span>
                        <Button href={login.url()} color="link-color" size="md">
                            Entrar
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}
