import { ArrowRight } from "@untitledui/icons";
import { useState } from "react";
import { Button } from "@/components/ui/landing-page-02/base/buttons/button";
import { useLang } from "@/hooks/use-lang";


const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { __ } = useLang();
    return (
        <header className="relative z-20 border-b border-secondary bg-primary/90 backdrop-blur">
            <div className="mx-auto flex h-18 max-w-container items-center justify-between px-4 md:px-8">
                <a href="/" aria-label={__('pages.home.home_label')} className="text-2xl font-bold tracking-tight text-brand-primary">Live</a>
                <nav className="hidden items-center gap-8 md:flex" aria-label={__('pages.home.main_nav')}>
                    <a className="text-sm font-semibold text-secondary hover:text-primary" href="#funcionalidades">{__('pages.home.nav_features')}</a>
                    <a className="text-sm font-semibold text-secondary hover:text-primary" href="/tax">{__('pages.home.nav_fees')}</a>
                </nav>
                <div className="hidden items-center gap-3 md:flex">
                    <Button href="/login" color="secondary" size="md">{__('pages.home.login')}</Button>
                    <Button href="/register" size="md">{__('pages.home.register')}</Button>
                </div>
                <button className="rounded-lg p-2 text-primary md:hidden" aria-label={menuOpen ? __('pages.home.menu_close') : __('pages.home.menu_open')} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
                    <span className="text-sm font-semibold">{menuOpen ? __('pages.home.close') : __('pages.home.menu')}</span>
                </button>
            </div>
            {menuOpen && <nav className="flex flex-col gap-1 border-t border-secondary bg-primary px-4 py-3 md:hidden" aria-label={__('pages.home.mobile_nav')}>
                <a className="rounded-lg px-3 py-3 text-base font-semibold text-secondary" href="#funcionalidades" onClick={() => setMenuOpen(false)}>{__('pages.home.nav_features')}</a>
                <a className="rounded-lg px-3 py-3 text-base font-semibold text-secondary" href="/tax">{__('pages.home.nav_fees')}</a>
                <div className="flex gap-3 px-3 py-3"><Button href="/login" color="secondary" size="md">{__('pages.home.login')}</Button><Button href="/register" size="md">{__('pages.home.register')}</Button></div>
            </nav>}
        </header>
    );
};

const Hero = () => {
    const { __ } = useLang();
    return (
    <section className="overflow-hidden bg-primary">
        <Header />
        <div className="relative mx-auto flex max-w-container flex-col items-center px-4 pb-0 pt-16 text-center md:px-8 md:pt-24">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-secondary bg-primary_alt px-3 py-1.5 text-sm font-semibold text-brand-secondary">
                <span className="size-2 rounded-full bg-brand-solid" /> {__('pages.home.hero_badge')}
            </div>
            <h1 className="max-w-4xl text-balance text-display-md font-semibold tracking-tight text-primary md:text-display-lg lg:text-display-xl">
                {__('pages.home.headline')}
            </h1>
                <p className="mt-5 max-w-2xl text-pretty text-lg text-tertiary md:mt-6 md:text-xl">
                {__('pages.home.hero_description')}
            </p>
            <div className="mt-8 flex w-full flex-col-reverse items-stretch justify-center gap-3 sm:w-auto sm:flex-row md:mt-10">
                <Button href="/register" size="xl">{__('pages.home.start_now')}</Button>
            </div>
            <div className="relative mt-14 w-full max-w-5xl md:mt-20">
                <div className="overflow-hidden rounded-t-2xl border border-secondary bg-primary text-left shadow-xl md:rounded-t-3xl">
                    <div className="grid min-h-72 md:min-h-96 md:grid-cols-[190px_1fr]">
                        <aside className="hidden border-r border-secondary bg-primary_alt p-5 md:block">
                            <a href="/" className="text-lg font-bold text-brand-primary">Live</a>
                            <div className="mt-8 space-y-2 text-sm font-medium text-tertiary"><p className="rounded-lg bg-secondary px-3 py-2 text-primary">{__('pages.home.overview')}</p><p className="px-3 py-2">{__('pages.home.controls')}</p><p className="px-3 py-2">{__('pages.home.donations')}</p><p className="px-3 py-2">{__('pages.home.goals')}</p><p className="px-3 py-2">{__('pages.home.settings')}</p></div>
                        </aside>
                        <div className="p-5 md:p-8">
                            <p className="text-xs font-medium text-quaternary">{__('pages.home.illustrative_preview')}</p>
                            <div className="mt-3 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-semibold text-primary md:text-2xl">{__('pages.home.overview')}</h2><p className="mt-1 text-sm text-tertiary">{__('pages.home.stream_in_one_place')}</p></div><span className="rounded-lg border border-secondary px-3 py-2 text-xs font-semibold text-tertiary">{__('pages.home.streamer_panel')}</span></div>
                            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3"><div className="rounded-xl border border-secondary p-4"><p className="text-sm text-tertiary">{__('pages.home.donations')}</p><div className="mt-5 h-2 rounded bg-secondary"><div className="h-2 w-2/3 rounded bg-brand-solid" /></div></div><div className="rounded-xl border border-secondary p-4"><p className="text-sm text-tertiary">{__('pages.home.goals')}</p><div className="mt-5 flex gap-1"><i className="h-2 w-1/4 rounded bg-brand-solid"/><i className="h-2 w-1/4 rounded bg-brand-solid"/><i className="h-2 w-1/4 rounded bg-secondary"/><i className="h-2 flex-1 rounded bg-secondary"/></div></div><div className="rounded-xl border border-secondary p-4"><p className="text-sm text-tertiary">{__('pages.home.alerts')}</p><div className="mt-4 flex items-center gap-2"><span className="size-2 rounded-full bg-success-solid"/><span className="text-sm font-medium text-primary">{__('pages.home.connected_widgets')}</span></div></div></div>
                            <div className="mt-4 flex h-28 items-end gap-2 rounded-xl border border-secondary p-4 md:h-40">{[32, 48, 40, 67, 53, 75, 61, 86, 66, 78, 55, 72].map((height, i) => <span key={i} className="flex-1 rounded-t bg-brand-solid/70" style={{ height: `${height}%` }} />)}</div>
                        </div>
                    </div>
                </div>
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary to-transparent" />
            </div>
        </div>
    </section>
    );
};

const Compatibility = () => {
    const { __ } = useLang();
    return (
    <section className="border-y border-secondary bg-primary_alt py-10 md:py-12">
        <div className="mx-auto flex max-w-container flex-col items-center gap-7 px-4 md:px-8">
            <p className="text-center text-sm font-semibold text-tertiary md:text-md">{__('pages.home.compatibility')}</p>
            <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
                <img src="/images/logos/streamlabs-light.webp" alt="Streamlabs" className="h-8 w-auto object-contain dark:hidden" />
                <img src="/images/logos/streamlabs-dark.webp" alt="Streamlabs" className="hidden h-8 w-auto object-contain dark:block" />
                <img src="/images/logos/streamelements-light.webp" alt="StreamElements" className="h-8 w-auto object-contain dark:hidden" />
                <img src="/images/logos/streamelements-dark.webp" alt="StreamElements" className="hidden h-8 w-auto object-contain dark:block" />
                <img src="/images/logos/obs.webp" alt="OBS" className="h-9 w-auto object-contain" />
            </div>
        </div>
    </section>
    );
};

const features = [
    { key: 'integrations', image: "/images/features/integrations2.webp" },
    { key: 'message', visual: "message" as const },
    { key: 'settings', visual: "settings" as const },
];

const FeaturePreview = ({ type }: { type: "message" | "settings" }) => {
    const { __ } = useLang();
    return type === "message" ? <div className="flex min-h-64 items-center justify-center rounded-xl bg-primary p-6 md:min-h-80 md:rounded-2xl"><div className="w-full max-w-sm rounded-2xl border border-secondary bg-primary_alt p-5 shadow-md"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">L</span><div><p className="text-sm font-semibold text-primary">{__('pages.home.message_label')}</p><p className="text-xs text-tertiary">{__('pages.home.message_preview')}</p></div></div><p className="mt-5 rounded-xl bg-secondary p-4 text-md text-primary">{__('pages.home.message_text')}</p><div className="mt-4 flex items-center justify-between"><span className="text-sm text-tertiary">{__('pages.home.message_received')}</span><span className="rounded-full bg-success-secondary px-2.5 py-1 text-xs font-semibold text-success-primary">{__('pages.home.ready_for_alert')}</span></div></div></div> : <div className="min-h-64 rounded-xl bg-primary p-5 md:min-h-80 md:rounded-2xl md:p-7"><div className="mx-auto max-w-md rounded-xl border border-secondary bg-primary_alt p-5"><div className="flex items-center justify-between border-b border-secondary pb-4"><div><p className="text-sm font-semibold text-primary">{__('pages.home.customize_alerts')}</p><p className="mt-1 text-xs text-tertiary">{__('pages.home.adjust_stream')}</p></div><span className="size-2.5 rounded-full bg-success-solid" /></div><div className="space-y-4 pt-4"><div className="flex items-center justify-between"><span className="text-sm text-secondary">{__('pages.home.donation_alert')}</span><span className="h-5 w-9 rounded-full bg-brand-solid p-0.5"><span className="ml-auto block size-4 rounded-full bg-white" /></span></div><div className="flex items-center justify-between"><span className="text-sm text-secondary">{__('pages.home.community_goal')}</span><span className="h-5 w-9 rounded-full bg-brand-solid p-0.5"><span className="ml-auto block size-4 rounded-full bg-white" /></span></div><div><div className="flex justify-between text-sm"><span className="text-secondary">{__('pages.home.alert_volume')}</span><span className="text-tertiary">75%</span></div><div className="mt-3 h-2 rounded-full bg-secondary"><div className="h-2 w-3/4 rounded-full bg-brand-solid" /></div></div></div></div></div>;
};

const Features = () => {
    const { __ } = useLang();
    return <section id="funcionalidades" className="scroll-mt-20 bg-primary py-16 md:py-24">
    <div className="mx-auto max-w-container px-4 md:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
            <p className="text-sm font-semibold text-brand-secondary md:text-md">{__('pages.home.features_eyebrow')}</p>
            <h2 className="mt-3 text-balance text-display-sm font-semibold text-primary md:text-display-md">{__('pages.home.features_title')}</h2>
            <p className="mx-auto mt-4 max-w-[62ch] text-pretty text-lg text-tertiary md:mt-5 md:text-xl">{__('pages.home.features_description')}</p>
        </div>
        <div className="flex flex-col gap-16 md:gap-24">
            {features.map((feature, index) => <article key={feature.key} className="grid items-center gap-8 md:gap-14 lg:grid-cols-2 lg:gap-20">
                <div className={index % 2 ? "lg:order-2" : ""}>
                    <p className="text-sm font-semibold text-brand-secondary md:text-md">{__('pages.home.' + feature.key + '_eyebrow')}</p>
                    <h3 className="mt-3 max-w-[22ch] text-balance text-display-xs font-semibold text-primary md:text-display-sm">{__('pages.home.' + feature.key + '_title')}</h3>
                    <p className="mt-4 max-w-[55ch] text-pretty text-md text-tertiary md:text-lg">{__('pages.home.' + feature.key + '_description')}</p>
                    <a className="mt-6 inline-flex items-center gap-2 text-md font-semibold text-brand-secondary hover:text-brand-primary" href="/register">{__('pages.home.learn_more')} <ArrowRight className="size-5" /></a>
                </div>
                <div className={`overflow-hidden rounded-2xl border border-secondary bg-secondary p-2 shadow-lg md:rounded-3xl md:p-3 ${index % 2 ? "lg:order-1" : ""}`}>
                    {"image" in feature ? <img src={feature.image} alt={__('pages.home.integration_image_alt')} loading="lazy" className="h-auto w-full rounded-xl object-cover md:rounded-2xl" /> : <FeaturePreview type={feature.visual} />}
                </div>
            </article>)}
        </div>
    </div>
    </section>;
};

const LandingPage02 = ({ platform_fee_percentage = 0 }: { platform_fee_percentage?: number }) => {
    const { __ } = useLang();
    return (
    <main className="bg-primary">
        <Hero />
        <Compatibility />
        <Features />
        <section className="bg-brand-section py-16 md:py-20">
            <div className="mx-auto flex max-w-container flex-col gap-8 px-4 md:flex-row md:items-center md:justify-between md:px-8">
                <div className="max-w-2xl"><p className="text-sm font-semibold text-tertiary_on-brand">{__('pages.home.transparency')}</p><h2 className="mt-3 text-balance text-display-sm font-semibold text-primary_on-brand md:text-display-md">{__('pages.home.keep_more')}</h2><p className="mt-4 text-pretty text-lg text-tertiary_on-brand">{__('pages.home.platform_fee', { percentage: platform_fee_percentage })}</p></div>
                <Button href="/tax" color="secondary" size="xl">{__('pages.home.view_fees')}</Button>
            </div>
        </section>
        <section className="bg-primary py-16 md:py-24"><div className="mx-auto flex max-w-container flex-col items-start justify-between gap-8 rounded-2xl border border-secondary bg-primary_alt p-6 md:flex-row md:items-center md:p-12"><div><p className="text-sm font-semibold text-brand-secondary">{__('pages.home.ready_title')}</p><h2 className="mt-3 max-w-[24ch] text-balance text-display-sm font-semibold text-primary md:text-display-md">{__('pages.home.cta_title')}</h2></div><div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"><Button href="/register" size="xl">{__('pages.home.create_account')}</Button></div></div></section>
        <footer className="border-t border-secondary bg-primary py-10"><div className="mx-auto flex max-w-container flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between md:px-8"><a href="/" aria-label={__('pages.home.home_label')} className="text-xl font-bold text-brand-primary">Live</a><nav aria-label={__('pages.home.footer_nav')} className="flex flex-wrap gap-x-6 gap-y-3"><a className="text-sm font-semibold text-tertiary hover:text-primary" href="#funcionalidades">{__('pages.home.nav_features')}</a><a className="text-sm font-semibold text-tertiary hover:text-primary" href="/tax">{__('pages.home.nav_fees')}</a><a className="text-sm font-semibold text-tertiary hover:text-primary" href="/login">{__('pages.home.login')}</a></nav><p className="text-sm text-quaternary">{__('pages.home.copyright')}</p></div></footer>
    </main>
    );
};

export default LandingPage02;
