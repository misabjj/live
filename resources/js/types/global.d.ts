declare global {
    namespace App.DTOs.Settings {
        export interface PaymentProcessorDto {
            id: string;
            type: string;
            type_display: string;
            is_active: boolean;
            created_at: string;
            has_valid_config: boolean;
        }

        export interface PaymentProcessorsSettingsDto {
            processors: Array<PaymentProcessorDto>;
        }
    }
}
