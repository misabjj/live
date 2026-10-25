interface AlertConfiguration {
    primary_color: string;
    secondary_color: string;
    message_color: string;
}

interface DonationAlertProps {
    donorName: string;
    amount: number;
    currency: string;
    message?: string | null;
    isAiGenerated?: boolean;
    configuration: AlertConfiguration;
    className?: string;
}

export function DonationAlert({ donorName, amount, currency, message, isAiGenerated = false, configuration, className }: DonationAlertProps) {
    const config = configuration;

    const formattedAmount =
        currency === 'BRL'
            ? `R$ ${amount.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
              })}`
            : `${currency} ${amount.toFixed(2)}`;

    const displayMessage = message;

    return (
        <div className={className}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div
                    className="bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent drop-shadow-md"
                    style={{
                        backgroundImage: `linear-gradient(to right, ${config.primary_color}, ${config.secondary_color})`,
                    }}
                >
                    {donorName} mandou {formattedAmount}
                </div>
                {displayMessage && (
                    <div className="text-2xl font-medium drop-shadow-md" style={{ color: config.message_color }}>
                        {displayMessage}
                    </div>
                )}
                {isAiGenerated && (
                    <div
                        className="rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white"
                        aria-label="Conteúdo gerado por inteligência artificial"
                    >
                        Voz gerada por IA
                    </div>
                )}
            </div>
        </div>
    );
}
