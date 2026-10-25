import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { BadgeGroup } from '@/components/untitled-ui/base/badges/badge-groups';
import { Button } from '@/components/untitled-ui/base/buttons/button';
import { FeaturedIcon } from '@/components/untitled-ui/foundations/featured-icon/featured-icon';
import { Header } from '@/components/untitled-ui/marketing/header-navigation/header';
import { Flow } from '@/components/untitled-ui/shared-assets/background-patterns/flow';
import { SectionDivider } from '@/components/untitled-ui/shared-assets/section-divider';
import { getVoiceTileStyle, supertonicVoiceOptions, type SupertonicVoiceOption } from '@/lib/supertonic/voices';
import { cx } from '@/utils/cx';
import { isReactComponent } from '@/utils/is-react-component';
import { ArrowLeft, ArrowRight, Brush01, CheckCircle, MessageTextSquare01, Play, Settings01, VolumeMax } from '@untitledui/icons';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useRef, useState, type ComponentProps, type ComponentPropsWithRef, type FC } from 'react';

interface WhatsappButtonProps {
    phoneNumber: string;
    message?: string;
    ariaLabel?: string;
    tooltipText?: string;
}

const WhatsappButton: FC<WhatsappButtonProps> = ({
    phoneNumber,
    message = 'Olá! Gostaria de mais informações.',
    ariaLabel = 'Fale Conosco pelo WhatsApp',
    tooltipText = 'Fale Conosco',
}) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            className="group fixed right-6 bottom-6 z-[999] flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-110 hover:bg-green-600"
            style={{ position: 'fixed' }}
        >
            <WhatsAppIcon className="size-7 text-white" />
            <div
                className="absolute right-full mr-4 scale-95 rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold whitespace-nowrap text-white opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
                style={{ transformOrigin: 'right center' }}
            >
                {tooltipText}
                <div className="absolute top-1/2 left-full h-2 w-2 -translate-y-1/2 rotate-45 bg-gray-800"></div>
            </div>
        </a>
    );
};

const CheckItemText = (props: {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    text?: string;
    color?: 'primary' | 'success';
    iconStyle?: 'outlined' | 'contained' | 'filled';
    textClassName?: string;
}) => {
    const { text, color, size, iconStyle = 'contained' } = props;

    return (
        <li className="flex gap-3">
            {iconStyle === 'contained' && (
                <div
                    className={cx(
                        'flex shrink-0 items-center justify-center rounded-full',
                        color === 'success'
                            ? 'bg-success-secondary text-featured-icon-light-fg-success'
                            : 'bg-brand-primary text-featured-icon-light-fg-brand',
                        size === 'lg' ? 'size-7 md:h-8 md:w-8' : size === 'md' ? 'size-7' : 'size-6',
                    )}
                >
                    <svg
                        width={size === 'lg' ? 16 : size === 'md' ? 15 : 13}
                        height={size === 'lg' ? 14 : size === 'md' ? 13 : 11}
                        viewBox="0 0 13 11"
                        fill="none"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.0964 0.390037L3.93638 7.30004L2.03638 5.27004C1.68638 4.94004 1.13638 4.92004 0.736381 5.20004C0.346381 5.49004 0.236381 6.00004 0.476381 6.41004L2.72638 10.07C2.94638 10.41 3.32638 10.62 3.75638 10.62C4.16638 10.62 4.55638 10.41 4.77638 10.07C5.13638 9.60004 12.0064 1.41004 12.0064 1.41004C12.9064 0.490037 11.8164 -0.319963 11.0964 0.380037V0.390037Z"
                            fill="currentColor"
                        />
                    </svg>
                </div>
            )}

            {iconStyle === 'filled' && (
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-solid text-white">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1.5 4L4.5 7L10.5 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            )}

            {iconStyle === 'outlined' && (
                <CheckCircle
                    className={cx(
                        'shrink-0',
                        color === 'success' ? 'text-fg-success-primary' : 'text-fg-brand-primary',
                        size === 'lg' ? 'size-7 md:h-8 md:w-8' : size === 'md' ? 'size-7' : 'size-6',
                    )}
                />
            )}

            <span
                className={cx(
                    'text-tertiary',
                    size === 'lg' ? 'pt-0.5 text-lg md:pt-0' : size === 'md' ? 'pt-0.5 text-md md:pt-0 md:text-lg' : 'text-md',
                    iconStyle === 'filled' && 'text-brand-secondary',
                    props.textClassName,
                )}
            >
                {text}
            </span>
        </li>
    );
};

type Voice = SupertonicVoiceOption;

const voicesData = supertonicVoiceOptions;

const HeaderPrimary = (props: ComponentProps<typeof Header>) => {
    return (
        <Header
            {...props}
            className="bg-utility-brand-50_alt [&_nav>ul>li>a]:text-brand-primary [&_nav>ul>li>a]:hover:text-brand-primary [&_nav>ul>li>button]:text-brand-primary [&_nav>ul>li>button]:hover:text-brand-primary [&_nav>ul>li>button>svg]:text-fg-brand-secondary_alt"
        />
    );
};

export const BackgroundStripes = () => {
    return (
        <div className="absolute top-0 h-108 w-full overflow-hidden pt-[152px] md:pt-[94px] 2xl:h-128 2xl:pt-[136px]">
            <div className="-skew-y-[7deg] [--column-width:minmax(0,calc(1280px/var(--content-columns)))] [--content-columns:12] [--gutter-columns:4] [--stripe-height:34px] sm:[--stripe-height:48px] lg:[--stripe-height:72px]">
                {/* BG MASK */}
                <div className="absolute bottom-[var(--stripe-height)] h-110 w-full bg-utility-brand-50_alt"></div>
                {/* STRIPES */}
                <div
                    className="relative grid h-full"
                    style={{
                        gridTemplateRows: 'repeat(3,var(--stripe-height))',
                        gridTemplateColumns:
                            '[viewport-start] 1fr [left-gutter-start] repeat(var(--gutter-columns),var(--column-width)) [left-gutter-end content-start] repeat(var(--content-columns),var(--column-width)) [content-end right-gutter-start] repeat(var(--gutter-columns),var(--column-width)) [right-gutter-end] 1fr [viewport-end]',
                    }}
                >
                    <div style={{ gridArea: '2 / left-gutter-start / auto / span 5' }} className="bg-utility-brand-100_alt"></div>
                    <div style={{ gridArea: '3 / viewport-start / auto / span 4' }} className="bg-utility-brand-400_alt"></div>
                    <div style={{ gridArea: '1 / span 7 / auto / viewport-end' }} className="bg-utility-brand-400_alt"></div>
                    <div style={{ gridArea: '2 / span 8 / auto / right-gutter-end' }} className="bg-utility-brand-200_alt"></div>
                    <div style={{ gridArea: '3 / span 3 / auto / viewport-end' }} className="bg-utility-brand-100_alt"></div>
                </div>
            </div>
        </div>
    );
};

const Hero = () => {
    return (
        <div className="bg-primary">
            <HeaderPrimary />
            <section>
                <div className="flex flex-col items-center bg-utility-brand-50_alt pt-16 md:pt-24">
                    <div className="mx-auto flex w-full max-w-container flex-col px-4 md:px-8">
                        <div className="flex flex-col items-start sm:items-center sm:text-center">
                            <a
                                href="/register"
                                className="rounded-full outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2"
                            >
                                <BadgeGroup
                                    className="hidden md:flex"
                                    size="lg"
                                    addonText="Atualização"
                                    iconTrailing={ArrowRight}
                                    theme="light"
                                    color="brand"
                                >
                                    Taxa reduzida e novas customizações
                                </BadgeGroup>
                                <BadgeGroup
                                    className="md:hidden"
                                    size="md"
                                    addonText="Atualização"
                                    iconTrailing={ArrowRight}
                                    theme="light"
                                    color="brand"
                                >
                                    Taxa reduzida e novas customizações
                                </BadgeGroup>
                            </a>

                            <h1 className="mt-4 text-display-md font-semibold text-brand-primary md:text-display-lg lg:text-display-xl">
                                Chega de ficar aguardando por saques!
                            </h1>
                            <p className="mt-4 max-w-3xl text-lg text-brand-secondary md:mt-6 md:text-xl">
                                Receba seus donates diretamente no seu banco, sem saques e com as vozes de IA com mais qualidade.
                            </p>
                            <div className="relative z-1 mt-8 flex w-full flex-col-reverse items-stretch gap-3 sm:w-auto sm:flex-row sm:items-start md:mt-12">
                                <Button
                                    iconLeading={<WhatsAppIcon data-icon="leading" className="size-5 shrink-0 text-green-600" />}
                                    color="secondary-whatsapp"
                                    size="xl"
                                    href="https://api.whatsapp.com/send/?phone=557196992155&text=Ol%C3%A1%2C+quero+saber+mais+sobre+a+plataforma+Live%21&type=phone_number&app_absent=0"
                                    target="blank"
                                >
                                    Saber mais
                                </Button>
                                <Button size="xl" href="/register" >
                                    Começar agora mesmo!
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative pt-16">
                    <BackgroundStripes />
                </div>

            </section>
        </div>
    );
};

export const Compatible = () => {
    return (
        <section className="flex flex-col bg-primary py-16 md:py-24">
            <div className="mx-auto w-full max-w-container px-4 md:px-8">
                <div className="mx-auto mb-12 flex w-full max-w-3xl flex-col items-center text-center sm:mb-16 md:mb-20">
                    <span className="text-sm font-semibold text-brand-secondary md:text-md">Plug in play</span>
                    <h2 className="mt-3 text-display-sm font-semibold text-primary md:text-display-md">Totalmente compatível</h2>
                </div>

                <div className="mx-auto grid grid-cols-1 justify-center sm:grid-cols-2 md:max-w-xl lg:max-w-2xl">
                    {/* STREAMLABS */}
                    <div className="flex items-center justify-center">
                        <img alt="Streamlabs" src="/images/logos/streamlabs-light.webp" className="h-auto w-48 md:w-60 dark:hidden" />
                        <img alt="Streamlabs" src="/images/logos/streamlabs-dark.webp" className="h-auto w-48 not-dark:hidden md:w-60" />
                    </div>

                    {/* STREAMELEMENTS */}
                    <div className="flex items-center justify-center">
                        <img alt="StreamElements" src="/images/logos/streamelements-light.webp" className="h-auto w-50 md:w-60 dark:hidden" />
                        <img alt="StreamElements" src="/images/logos/streamelements-dark.webp" className="h-auto w-50 not-dark:hidden md:w-60" />
                    </div>

                    {/* OBS */}
                    <div className="flex items-center justify-center sm:col-span-2">
                        <img alt="OBS" src="/images/logos/obs.webp" className="h-auto w-12 md:w-14" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export const Features = () => {
    return (
        <section id="funcionalidades" className="flex flex-col gap-12 bg-primary py-16 sm:gap-16 md:gap-20 md:py-24 lg:gap-24">
            <div className="mx-auto w-full max-w-container px-4 md:px-8">
                <div className="mx-auto mb-12 flex w-full max-w-3xl flex-col items-center text-center sm:mb-16 md:mb-20">
                    <span className="text-sm font-semibold text-brand-secondary md:text-md">Plataforma completa</span>
                    <h2 className="mt-3 text-display-sm font-semibold text-primary md:text-display-md">Conheça algumas das funcionalidades</h2>
                    <p className="mt-4 text-lg text-tertiary md:mt-5 md:text-xl">
                        Configure em minutos, personalize como preferir e receba seus donates direto na conta. O Live faz o resto.
                    </p>
                </div>
            </div>

            <div className="mx-auto flex w-full max-w-container flex-col gap-12 overflow-hidden px-4 sm:gap-16 md:gap-20 md:px-8 lg:gap-24">
                {/*Integrations*/}
                <div className="grid grid-cols-1 gap-10 md:gap-20 lg:grid-cols-2 lg:gap-24">
                    <div className="max-w-xl flex-1 self-center">
                        <FeaturedIcon icon={Settings01} size="lg" color="brand" theme="light" />
                        <h2 className="mt-5 text-display-xs font-semibold text-primary md:text-display-sm">Integrações</h2>
                        <p className="mt-2 text-md text-tertiary md:mt-4 md:text-lg">Integrado com todos os app de stream e overlays.</p>
                        <ul className="mt-6 flex flex-col gap-4 sm:mt-7 md:mt-8 md:gap-5 lg:mt-10">
                            {[
                                'Widgets que funcionam independentemente',
                                'Tutoriais fáceis de seguir para configuração rápida',
                                'Suporte dedicado para qualquer dúvida que você tenha',
                            ].map((feat) => (
                                <CheckItemText key={feat} size="md" iconStyle="outlined" color="primary" text={feat} />
                            ))}
                        </ul>
                        <div className="mt-8">
                            <Button href="/register" size="xl" className="w-full md:w-auto" >
                                Testar agora
                            </Button>
                        </div>
                    </div>

                    <div className="relative -ml-4 w-screen bg-tertiary px-4 py-6 md:ml-0 md:h-140 md:w-auto md:rounded-3xl md:p-10 lg:h-110">
                        <div className="relative flex h-full w-full">
                            {/* Light mode image (hidden in dark mode) */}
                            <img
                                alt="Mockup do painel mostrando interface do aplicativo"
                                src="/images/features/integrations2.webp"
                                className="z-10 size-full rounded-md object-cover object-left-top ring-4 ring-screen-mockup-border md:absolute lg:scale-120 dark:hidden"
                            />
                            {/* Dark mode image (hidden in light mode) */}
                            <img
                                alt="Mockup do painel mostrando interface do aplicativo"
                                src="/images/features/integrations2.webp"
                                className="z-10 size-full rounded-md object-cover object-left-top ring-4 ring-screen-mockup-border not-dark:hidden md:absolute lg:scale-120"
                            />
                        </div>
                        <div className="absolute right-0 bottom-0 hidden translate-x-1/3 translate-y-1/4 md:block">
                            <Flow />
                        </div>
                    </div>
                </div>

                {/*Mesages*/}
                <div className="grid grid-cols-1 gap-10 md:gap-20 lg:grid-cols-2 lg:gap-24">
                    <div className="max-w-xl flex-1 self-center lg:order-last">
                        <FeaturedIcon icon={MessageTextSquare01} size="lg" color="brand" theme="light" />
                        <h2 className="mt-5 text-display-xs font-semibold text-primary md:text-display-sm">Tipos de mensagens</h2>
                        <p className="mt-2 text-md text-tertiary md:mt-4 md:text-lg">
                            Mensagens de texto simples, áudios gravados e mensagem lida por voz IA.
                        </p>
                        <ul className="mt-6 flex flex-col gap-4 sm:mt-7 md:mt-8 md:gap-5 lg:mt-10">
                            {[
                                'Interação completa com seu ajuste de valores para cada tipo de mensagem',
                                'Garantia de qualidade nas vozes IA com atualizações constantes',
                            ].map((feat) => (
                                <CheckItemText key={feat} size="md" iconStyle="outlined" color="primary" text={feat} />
                            ))}
                        </ul>
                        <div className="mt-8">
                            <Button href="/register" size="xl" className="w-full md:w-auto" >
                                Testar agora
                            </Button>
                        </div>
                    </div>

                    <div className="relative -ml-4 w-screen bg-tertiary px-4 py-6 md:ml-0 md:h-140 md:w-auto md:rounded-3xl md:p-10 lg:h-110">
                        <div className="relative flex h-full w-full">
                            {/* Light mode image (hidden in dark mode) */}
                            <img
                                alt="Mockup do painel mostrando interface do aplicativo"
                                src="/images/features/mesages2.webp"
                                className="z-10 size-full rounded-md object-cover object-left-top ring-4 ring-screen-mockup-border md:absolute lg:scale-120 dark:hidden"
                            />
                            {/* Dark mode image (hidden in light mode) */}
                            <img
                                alt="Mockup do painel mostrando interface do aplicativo"
                                src="/images/features/mesages2.webp"
                                className="z-10 size-full rounded-md object-cover object-left-top ring-4 ring-screen-mockup-border not-dark:hidden md:absolute lg:scale-120"
                            />
                        </div>
                        <div className="absolute bottom-0 left-0 hidden -translate-x-1/3 md:block md:translate-y-12 lg:translate-y-1/4">
                            <Flow />
                        </div>
                    </div>
                </div>

                {/*Customization*/}
                <div className="grid grid-cols-1 gap-10 md:gap-20 lg:grid-cols-2 lg:gap-24">
                    <div className="max-w-xl flex-1 self-center">
                        <FeaturedIcon icon={Brush01} size="lg" color="brand" theme="light" />
                        <h2 className="mt-5 text-display-xs font-semibold text-primary md:text-display-sm">Personalização</h2>
                        <p className="mt-2 text-md text-tertiary md:mt-4 md:text-lg">
                            Personalize seu QR Code, sua página de checkout, alerta e metas do seu jeito!
                        </p>
                        <ul className="mt-6 flex flex-col gap-4 sm:mt-7 md:mt-8 md:gap-5 lg:mt-10">
                            {[
                                'Liberdade que você merece para personalizar cada detalhe',
                                'Do minimalista ao extravagante, você escolhe o estilo',
                            ].map((feat) => (
                                <CheckItemText key={feat} size="md" iconStyle="outlined" color="primary" text={feat} />
                            ))}
                        </ul>
                        <div className="mt-8">
                            <Button href="/register" size="xl" className="w-full md:w-auto" >
                                Testar agora
                            </Button>
                        </div>
                    </div>
                    <div className="relative -ml-4 w-screen bg-tertiary px-4 py-6 md:ml-0 md:h-140 md:w-auto md:rounded-3xl md:p-10 lg:h-110">
                        <div className="relative flex h-full w-full">
                            {/* Light mode image (hidden in dark mode) */}
                            <img
                                alt="Mockup do painel mostrando interface do aplicativo"
                                src="/images/features/customizations3.webp"
                                className="z-10 size-full rounded-md object-cover object-left-top ring-4 ring-screen-mockup-border md:absolute lg:scale-120 dark:hidden"
                            />
                            {/* Dark mode image (hidden in light mode) */}
                            <img
                                alt="Mockup do painel mostrando interface do aplicativo"
                                src="/images/features/customizations3.webp"
                                className="z-10 size-full rounded-md object-cover object-left-top ring-4 ring-screen-mockup-border not-dark:hidden md:absolute lg:scale-120"
                            />
                        </div>
                        <div className="absolute top-0 right-0 hidden translate-x-1/3 -translate-y-1/4 md:block">
                            <Flow />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

interface RoundButtonProps extends ComponentPropsWithRef<'button'> {
    icon?: FC<{ className?: string }>;
}

const RoundButton = ({ icon: Icon, ...props }: RoundButtonProps) => {
    return (
        <Button
            {...props}
            color="link-gray"
            className={cx(
                'group flex size-12 items-center justify-center rounded-full bg-primary ring-1 ring-secondary backdrop-blur transition duration-100 ease-linear ring-inset hover:bg-secondary md:size-14',
                props.className,
            )}
        >
            {props.children ??
                (isReactComponent(Icon) ? (
                    <Icon className="size-5 text-fg-quaternary transition-inherit-all group-hover:text-fg-quaternary_hover md:size-6" />
                ) : null)}
        </Button>
    );
};

const VoiceCarousel: FC = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        dragFree: true,
    });

    const [playingId, setPlayingId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const handlePlay = (voice: Voice) => {
        if (audioRef.current) {
            if (playingId === voice.id) {
                audioRef.current.pause();
                setPlayingId(null);
            } else {
                audioRef.current.src = voice.audioSrc;
                setPlayingId(voice.id);
                audioRef.current.play().catch(() => setPlayingId(null));
            }
        }
    };

    useEffect(() => {
        const audioEl = audioRef.current;
        const handleAudioEnd = () => setPlayingId(null);
        audioEl?.addEventListener('ended', handleAudioEnd);
        return () => audioEl?.removeEventListener('ended', handleAudioEnd);
    }, []);

    return (
        <div id="nossas-vozes" className="w-full bg-primary py-16 md:py-24">
            <div className="mx-auto mb-12 flex w-full max-w-3xl flex-col items-center px-4 text-center sm:mb-16 md:mb-20 md:px-8 lg:mb-24">
                <span className="text-sm font-semibold text-brand-secondary md:text-md">Inteligência artificial</span>
                <h2 className="mt-3 text-display-sm font-semibold text-primary md:text-display-md">
                    Conheça nossas <br className="md:hidden" /> vozes IA
                </h2>
            </div>
            <div className="relative mx-auto w-full max-w-7xl px-4 md:px-8">
                <audio ref={audioRef} />
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                        {voicesData.map((voice) => (
                            <button
                                type="button"
                                key={voice.id}
                                className="group w-1/3 flex-shrink-0 cursor-pointer px-2 select-none sm:w-1/4 md:w-1/5 lg:w-1/6 xl:w-[12.5%]"
                                onClick={() => handlePlay(voice)}
                                aria-label={`${playingId === voice.id ? 'Parar' : 'Ouvir'} voz ${voice.id}, ${voice.name}`}
                            >
                                <div
                                    className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                                        playingId === voice.id ? 'border-gray-300' : 'border-transparent'
                                    }`}
                                >
                                    <div
                                        className={`pointer-events-none flex aspect-square w-full flex-col items-center justify-center gap-1 select-none ${getVoiceTileStyle(voice.id)}`}
                                    >
                                        <span className="text-3xl font-bold">{voice.id}</span>
                                        <span className="text-sm font-semibold">{voice.name}</span>
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                        {playingId !== voice.id && <Play className="h-8 w-8 text-gray-300 md:h-10 md:w-10" />}
                                    </div>

                                    {playingId === voice.id && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <VolumeMax className="h-8 w-8 text-gray-300 md:h-10 md:w-10" />
                                        </div>
                                    )}
                                </div>
                                <p
                                    className="mt-2 truncate text-center text-sm font-semibold select-none"
                                    style={{ color: 'var(--color-text-primary)' }}
                                >
                                    {voice.name}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-3 flex justify-between">
                    <RoundButton icon={ArrowLeft} onClick={scrollPrev} aria-label="Voz anterior"></RoundButton>
                    <RoundButton icon={ArrowRight} onClick={scrollNext} aria-label="Próxima voz"></RoundButton>
                </div>
                <div className="z-1 mt-8 flex w-full flex-col-reverse items-center justify-center gap-3 md:mt-12 md:flex-row">
                    <Button
                        className="w-full md:w-auto"
                        iconLeading={<WhatsAppIcon data-icon="leading" className="size-5 shrink-0 text-green-600" />}
                        color="secondary-whatsapp"
                        size="xl"
                        href="https://api.whatsapp.com/send/?phone=557196992155&text=Ol%C3%A1%2C+quero+saber+mais+sobre+a+plataforma+Live%21&type=phone_number&app_absent=0"
                        target="blank"
                    >
                        Saber mais
                    </Button>
                    <Button className="w-full md:w-auto" size="xl" href="/register" >
                        Quero as vozes em minhas lives!
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const CTA = () => {
    return (
        <section className="bg-brand-section py-16 md:py-24">
            <div className="mx-auto max-w-container px-4 md:px-8">
                <div className="flex flex-col justify-center text-center">
                    <h2 className="text-display-sm font-semibold text-primary_on-brand md:text-display-md">Vamos começar algo incrível 🤍</h2>
                    <p className="mt-4 text-lg text-tertiary_on-brand md:mt-5 md:text-xl">
                        Junte-se aos streamers que já estão crescendo com o Live.
                        <br className="hidden md:flex" /> Aproveite também nosso suporte 24h.
                    </p>
                    <div className="mt-8 flex flex-col-reverse gap-3 self-stretch md:mt-8 md:flex-row md:self-center">
                        <Button size="xl" href="/register" >
                            Começar agora mesmo
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export const Footer = () => {
    return (
        <footer className="dark-mode bg-primary py-12 md:pt-16">
            <div className="mx-auto max-w-container px-4 md:px-8">
                <div className="flex flex-col items-center gap-8 md:items-start">
                    <div className="flex items-center justify-center gap-3 font-bold text-primary select-none md:justify-start">
                        <p className="text-lg text-brand-primary">Live</p>
                    </div>
                    <nav>
                        <ul className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-[repeat(6,max-content)]">
                            {[
                                {
                                    label: 'Página inicial',
                                    href: '/',
                                },
                                {
                                    label: 'Nossa taxa',
                                    href: '/tax',
                                },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Button color="link-gray" size="lg" href={item.href}>
                                        {item.label}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                <div className="mt-12 flex flex-col-reverse items-center justify-between gap-4 border-t border-secondary pt-8 md:mt-16 md:flex-row md:gap-6">
                    <p className="text-md text-quaternary">© 2025 Live. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

const Page = () => {
    return (
        <div className="bg-primary">
            <Hero />

            <SectionDivider />

            <Compatible />

            <SectionDivider />

            <VoiceCarousel />

            <SectionDivider />

            <Features />

            <SectionDivider />

            <CTA />

            <Footer />

            <WhatsappButton phoneNumber="557196992155" message="Olá, quero saber mais sobre a plataforma Live!" tooltipText="Fale Conosco" />
        </div>
    );
};

export default Page;
