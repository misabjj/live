<?php

namespace App\Enums;

enum WidgetType: string
{
    case ProfileQrCode = 'profile_qr_code';
    case DonationAlert = 'donation_alert';
    case Goal = 'goal';
}
