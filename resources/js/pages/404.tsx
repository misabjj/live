import { Button } from '@/components/untitled-ui/base/buttons/button';
import { FeaturedIcon } from '@/components/untitled-ui/foundations/featured-icon/featured-icon';
import { BackgroundPattern } from '@/components/untitled-ui/shared-assets/background-patterns';
import { ArrowLeft, SearchLg } from '@untitledui/icons';

export default function Page() {
    return (
        <section className="flex min-h-screen items-center justify-center overflow-hidden bg-primary px-4 py-12 md:px-8">
            <div className="mx-auto flex w-full max-w-90 flex-col gap-8 text-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <FeaturedIcon color="gray" theme="modern" size="xl" className="z-10 hidden md:flex" icon={SearchLg} />
                        <FeaturedIcon color="gray" theme="modern" size="lg" className="z-10 md:hidden" icon={SearchLg} />

                        <BackgroundPattern
                            pattern="grid"
                            className="absolute top-1/2 left-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 md:block"
                        />
                        <BackgroundPattern
                            pattern="grid"
                            size="md"
                            className="absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 md:hidden"
                        />
                    </div>

                    <div className="z-10 flex flex-col gap-2 md:gap-3">
                        <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">Página não encontrada</h1>
                        <p className="text-md text-tertiary">A página que você está procurando não existe.</p>
                    </div>
                </div>

                <div className="z-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Button iconLeading={ArrowLeft} color="secondary" size="lg" onClick={() => window.history.back()}>
                        Voltar
                    </Button>
                    <Button size="lg" href="/">
                        Ir para início
                    </Button>
                </div>
            </div>
        </section>
    );
}
