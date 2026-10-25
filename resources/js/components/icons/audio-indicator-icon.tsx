import React from 'react';

interface AudioIndicatorIconProps extends React.ComponentPropsWithoutRef<'svg'> {
    isPlaying?: boolean;
}

export function AudioIndicatorIcon({ isPlaying = false, className, ...props }: AudioIndicatorIconProps) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
            {/* Audio wave bars */}
            <rect x="2" y="10" width="2" height="4" rx="1" className={isPlaying ? 'animate-pulse' : ''} />
            <rect x="6" y="8" width="2" height="8" rx="1" className={isPlaying ? 'animate-pulse' : ''} style={{ animationDelay: '0.1s' }} />
            <rect x="10" y="6" width="2" height="12" rx="1" className={isPlaying ? 'animate-pulse' : ''} style={{ animationDelay: '0.2s' }} />
            <rect x="14" y="8" width="2" height="8" rx="1" className={isPlaying ? 'animate-pulse' : ''} style={{ animationDelay: '0.3s' }} />
            <rect x="18" y="10" width="2" height="4" rx="1" className={isPlaying ? 'animate-pulse' : ''} style={{ animationDelay: '0.4s' }} />
        </svg>
    );
}
