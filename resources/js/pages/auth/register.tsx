import { store as submitRegistration } from '@/actions/App/Http/Controllers/Auth/RegisterController';
import { Button } from '@/components/untitled-ui/base/buttons/button';
import { SocialButton } from '@/components/untitled-ui/base/buttons/social-button';
import { Form } from '@/components/untitled-ui/base/form/form';
import { Input } from '@/components/untitled-ui/base/input/input';
import { login } from '@/routes';
import oauth from '@/routes/oauth';
import { cx } from '@/utils/cx';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface RegisterProps {
    status?: string;
}

export default function Page({ status }: RegisterProps) {
    const {
        data,
        setData,
        submit: submitForm,
        processing,
        errors,
        reset,
    } = useForm({
        display_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        submitForm(submitRegistration(), {
            preserveScroll: true,
            onSuccess: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Registrar" />
            <section className="flex min-h-screen items-center justify-center overflow-hidden bg-primary px-4 py-12 md:px-8">
                <div className="mx-auto flex w-full flex-col gap-8 sm:max-w-90">
                    <div className="flex flex-col items-center gap-6 text-center">
                        <div className="z-10 flex flex-col gap-2 md:gap-3">
                            <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">Criar uma conta</h1>
                            <p className="text-md text-tertiary">Comece agora</p>
                        </div>
                    </div>

                    {status && (
                        <div className="z-10 rounded-md bg-green-50 p-4">
                            <p className="text-sm text-green-800">{status}</p>
                        </div>
                    )}

                    <Form onSubmit={submit} className="z-10 flex flex-col gap-6">
                        <div className="flex flex-col gap-5">
                            <Input
                                isRequired
                                hideRequiredIndicator
                                label="Nome de exibição"
                                type="text"
                                name="display_name"
                                value={data.display_name}
                                onChange={(value) => setData('display_name', value)}
                                placeholder="Digite seu nome de exibição"
                                size="md"
                                isInvalid={!!errors.display_name}
                                hint={errors.display_name}
                            />
                            <Input
                                isRequired
                                hideRequiredIndicator
                                label="Email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(value) => setData('email', value)}
                                placeholder="Digite seu email"
                                size="md"
                                isInvalid={!!errors.email}
                                hint={errors.email}
                            />
                            <Input
                                isRequired
                                hideRequiredIndicator
                                label="Senha"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(value) => setData('password', value)}
                                size="md"
                                placeholder="Crie uma senha"
                                minLength={8}
                                pattern='.*[!@#$%^&*(),.?\":{}|<>].*'
                                isInvalid={!!errors.password}
                                hint={errors.password}
                            />
                            <Input
                                isRequired
                                hideRequiredIndicator
                                label="Confirmar senha"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(value) => setData('password_confirmation', value)}
                                size="md"
                                placeholder="Confirme sua senha"
                                isInvalid={!!errors.password_confirmation}
                                hint={errors.password_confirmation}
                            />
                            <div className="flex flex-col gap-3">
                                <span className="flex gap-2">
                                    <div
                                        className={cx(
                                            'flex size-5 items-center justify-center rounded-full bg-fg-disabled_subtle text-fg-white transition duration-150 ease-in-out',
                                            data.password.length >= 8 ? 'bg-fg-success-primary' : '',
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
                                    <p className="text-sm text-tertiary">Deve ter pelo menos 8 caracteres</p>
                                </span>
                            </div>
                        </div>

                        <div className="z-10 flex flex-col gap-4">
                            <Button type="submit" size="lg" isDisabled={processing} >
                                {processing ? 'Criando conta...' : 'Começar'}
                            </Button>
                            <SocialButton
                                social="google"
                                theme="color"
                                href={oauth.redirect.url('google')}
                            >
                                Cadastrar com Google
                            </SocialButton>
                        </div>
                    </Form>

                    <div className="flex justify-center gap-1 text-center">
                        <span className="text-sm text-tertiary">Já tem uma conta?</span>
                        <Button href={login.url()} color="link-color" size="md">
                            Entrar
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}
