/**
 * Currency formatting utilities
 */
export function formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}

/**
 * Date formatting utilities
 */
export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Date formatting with relative time
 */
export function formatRelativeDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
        return 'Agora mesmo';
    } else if (diffInHours < 24) {
        return `${diffInHours}h atrás`;
    } else if (diffInHours < 48) {
        return 'Ontem';
    } else {
        return formatDate(dateString);
    }
}

/**
 * Format date for display in tables or lists
 */
export function formatShortDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}
