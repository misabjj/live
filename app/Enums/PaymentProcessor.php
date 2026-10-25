<?php

namespace App\Enums;

enum PaymentProcessor: string
{
    case Stripe = 'stripe';
    case EfiBank = 'efi_bank';
    case MercadoPago = 'mercado_pago';
}
