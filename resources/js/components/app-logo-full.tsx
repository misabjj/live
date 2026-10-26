import { cn } from '@/lib/utils';

export default function AppLogoFull({ className }: { className?: string }) {
    return (
        <div className={cn(className, 'flex items-center gap-x-3 rounded-lg border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm')}>
            <p className="text-lg font-bold text-white drop-shadow-md">Live</p>
        </div>
    );
}
