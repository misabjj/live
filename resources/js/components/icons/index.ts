import { AudioIndicatorIcon } from './audio-indicator-icon';
import { EfiBankIcon } from './efi-bank-icon';
import { GoogleIcon } from './google-icon';
import { MercadoPagoIcon } from './mercado-pago-icon';
import { PlayIcon } from './play-icon';
import { SparkleIcon } from './sparkle-icon';
import { StripeIcon } from './stripe-icon';
import { WhatsAppIcon } from './whatsapp-icon';

export { AudioIndicatorIcon, EfiBankIcon, GoogleIcon, MercadoPagoIcon, PlayIcon, SparkleIcon, StripeIcon, WhatsAppIcon };

// Icons object for iteration
export const Icons = {
    AudioIndicator: AudioIndicatorIcon,
    EfiBank: EfiBankIcon,
    Google: GoogleIcon,
    MercadoPago: MercadoPagoIcon,
    Play: PlayIcon,
    Sparkle: SparkleIcon,
    Stripe: StripeIcon,
    WhatsApp: WhatsAppIcon,
} as const;
