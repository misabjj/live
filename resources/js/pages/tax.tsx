import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { BadgeGroup } from '@/components/untitled-ui/base/badges/badge-groups';
import { Button } from '@/components/untitled-ui/base/buttons/button';
import { Header } from '@/components/untitled-ui/marketing/header-navigation/header';
import { SectionDivider } from '@/components/untitled-ui/shared-assets/section-divider';
import { ArrowRight } from '@untitledui/icons';
import { type ComponentProps, type FC } from 'react';

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

// Interface para as props do componente PaymentTransparency
interface PaymentTransparencyProps {
    platformFeePercentage: number;
}

const PaymentTransparency = ({ platformFeePercentage }: PaymentTransparencyProps) => {
    const donationAmount = 100;
    const platformFee = platformFeePercentage;
    const processingFee = 1.19;
    const totalFeePercentage = platformFee + processingFee;
    const totalFeeAmount = (donationAmount * totalFeePercentage) / 100;
    const youReceive = donationAmount - totalFeeAmount;
    return (
        <section className="bg-primary py-16 md:py-24">
            <div className="mx-auto max-w-container px-4 md:px-8">
                <div className="flex flex-col gap-8 rounded-2xl bg-secondary p-6 sm:p-8 md:gap-16 md:rounded-none md:bg-transparent md:p-0">
                    <div className="flex w-full flex-col self-center text-center md:max-w-3xl">
                        <h2 className="text-display-sm font-semibold text-primary md:text-display-md lg:text-display-lg">Tenha liberdade ✌️</h2>
                        <p className="mt-4 text-base text-tertiary sm:mt-5 sm:text-lg md:mt-6 md:text-xl lg:mt-8">
                            Receba seu dinheiro instantaneamente no seu banco. Sem esperas, sem complicações, totalmente transparente.
                        </p>
                    </div>

                    <dl className="flex flex-col gap-6 rounded-2xl bg-secondary p-6 sm:gap-6 sm:p-8 md:flex-row md:gap-8 md:p-12 lg:gap-12 lg:p-16">
                        {[
                            {
                                title: `R$ ${donationAmount.toFixed(2)}`,
                                subtitle: 'Viewers enviam',
                            },
                            {
                                title: `${processingFee}%`,
                                subtitle: 'Intermediador recebe',
                            },
                            {
                                title: `${platformFee}%`,
                                subtitle: 'Nós recebemos',
                            },
                            {
                                title: `R$ ${youReceive.toFixed(2)}`,
                                subtitle: 'Você recebe',
                            },
                        ].map((item, index) => (
                            <div key={index} className="flex flex-1 flex-col-reverse gap-2 text-center sm:gap-2 md:gap-3">
                                <dt className="text-lg font-semibold text-primary sm:text-lg md:text-base lg:text-lg">{item.subtitle}</dt>
                                <dd className="text-display-sm font-semibold text-brand-tertiary_alt sm:text-display-sm md:text-2xl lg:text-display-lg">
                                    {item.title}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
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
                        <br className="hidden md:flex" /> Aproveite também nosso suporte 24h
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
                                    href: '#',
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

interface TaxPageProps {
    platform_fee_percentage: number;
}

const TaxPage: FC<TaxPageProps> = ({ platform_fee_percentage }) => {
    return (
        <div className="bg-primary">
            <Hero />

            <SectionDivider />

            <PaymentTransparency platformFeePercentage={platform_fee_percentage} />

            <SectionDivider />

            <CTA />

            <Footer />

            <WhatsappButton phoneNumber="557196992155" message="Olá, quero saber mais sobre a plataforma Live!" tooltipText="Fale Conosco" />
        </div>
    );
};

export default TaxPage;
