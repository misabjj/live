import { show as showDonationPage } from '@/routes/donate';

interface GoalProps {
    title?: string;
    targetAmount: number | string;
    raisedAmount: number | string;
    backgroundColor: string;
    progressBarColor: string;
    textColor: string;
    showProfileLink: boolean;
    userHandle: string;
    /**
     * Goal closing date in ISO string format (e.g., "2024-01-15T00:00")
     * The component handles the conversion to Date internally.
     * Optional - if not provided, days remaining won't be shown.
     */
    closesAt?: string;
    className?: string;
}

export function Goal({
    title,
    targetAmount,
    raisedAmount,
    backgroundColor,
    progressBarColor,
    textColor,
    showProfileLink,
    userHandle,
    closesAt,
    className,
}: GoalProps) {
    const targetValue = typeof targetAmount === 'string' ? parseFloat(targetAmount) || 0 : targetAmount || 0;
    const raisedValue = typeof raisedAmount === 'string' ? parseFloat(raisedAmount) || 0 : raisedAmount || 0;
    const currentAmount = raisedValue;
    const progressPercentage = targetValue > 0 ? Math.min((currentAmount / targetValue) * 100, 100) : 0;

    // Calculate days remaining from closesAt date
    let daysRemaining: number | undefined;
    if (closesAt) {
        const endDate = new Date(closesAt);
        const now = new Date();
        const diffTime = endDate.getTime() - now.getTime();
        daysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    return (
        <div className={className ? `w-full space-y-2 ${className}` : 'w-full space-y-2'}>
            {/* URL - show at top in white */}
            {showProfileLink && userHandle && (
                <div
                    style={{
                        color: textColor,
                        textShadow: '0 0 3px rgba(0, 0, 0, 0.7)',
                    }}
                    className="text-center text-lg font-semibold"
                >
                    {showDonationPage.url(userHandle).replace(/^\//, '')}
                </div>
            )}

            {/* Main Container with background color */}
            <div>
                {/* Progress Bar with title and amounts inside */}
                <div
                    className="relative h-9 w-full overflow-hidden rounded"
                    style={{
                        backgroundColor: backgroundColor,
                    }}
                >
                    {/* Colored progress bar */}
                    <div
                        className="h-full transition-all duration-300"
                        style={{
                            backgroundColor: progressBarColor,
                            width: `${progressPercentage}%`,
                        }}
                    />
                    {/* Content centered inside the bar */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 text-center text-xl font-semibold">
                        {/* Title */}
                        {title && (
                            <div
                                style={{
                                    color: textColor,
                                    textShadow: '0 0 3px rgba(0, 0, 0, 0.7)',
                                }}
                            >
                                {title}
                            </div>
                        )}
                        {/* Amount raised / target */}
                        {targetValue > 0 && (
                            <div
                                style={{
                                    color: textColor,
                                    textShadow: '0 0 3px rgba(0, 0, 0, 0.7)',
                                }}
                            >
                                (R${' '}
                                {currentAmount.toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}{' '}
                                / R${' '}
                                {targetValue.toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                                )
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Closing Date - show at bottom in text color */}
            {daysRemaining && daysRemaining > 0 && (
                <div
                    className="text-center text-lg font-semibold"
                    style={{
                        color: textColor,
                        textShadow: '0 0 3px rgba(0, 0, 0, 0.7)',
                    }}
                >
                    {daysRemaining} dias
                </div>
            )}
        </div>
    );
}
