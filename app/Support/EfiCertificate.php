<?php

namespace App\Support;

use InvalidArgumentException;

final class EfiCertificate
{
    public static function fromConfig(object $config): string
    {
        $certificateBase64 = $config->certificate_base64 ?? null;

        if (is_string($certificateBase64) && $certificateBase64 !== '') {
            return $certificateBase64;
        }

        $legacyCertificateContent = $config->certificate_content ?? null;

        if (! is_string($legacyCertificateContent) || $legacyCertificateContent === '') {
            throw new InvalidArgumentException('O certificado EFI não está configurado.');
        }

        return base64_encode($legacyCertificateContent);
    }
}
