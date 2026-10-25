declare namespace App.Data.Events {
    export type DonationAlertConfigurationUpdatedEventData = {
        primary_color: string;
        secondary_color: string;
        message_color: string;
    };
    export type DonationAlertEventData = {
        donation: App.Data.Events.DonationEventData;
        force_play: boolean;
    };
    export type DonationEventData = {
        id: string;
        donor_name: string;
        amount: number;
        currency: string;
        content_text: string | null;
        content_type: App.Enums.DonationContentType;
        content_url: string | null;
        speech_text: string | null;
        voice_id: string | null;
    };
}
declare namespace App.Data.Widgets {
    export type DonationAlertConfigurationData = {
        primary_color: string;
        secondary_color: string;
        message_color: string;
    };
    export type DonationAlertWidgetData = {
        token: string;
        configuration: App.Data.Widgets.DonationAlertConfigurationData;
    };
}
declare namespace App.Enums {
    export type DonationContentType = 'text' | 'text_to_speech' | 'audio';
    export type DonationCurrency = 'BRL';
    export type DonationStatus = 'pending' | 'approved' | 'expired';
    export type PaymentMethod = 'pix' | 'credit_card';
    export type PaymentProcessor = 'stripe' | 'efi_bank' | 'mercado_pago';
    export type QrCodeDotsType = 'rounded' | 'dots' | 'classy' | 'classy_rounded' | 'square' | 'extra_rounded';
    export type QrCodeGradientType = 'linear' | 'radial';
    export type WidgetType = 'profile_qr_code' | 'donation_alert' | 'goal';
}
