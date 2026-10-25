<?php

namespace App\Support;

use RuntimeException;

final class EfiCertificate
{
    public static function pemFromP12(string $certificateContent): string
    {
        $certificateData = [];

        if (! openssl_pkcs12_read($certificateContent, $certificateData, '')) {
            throw new RuntimeException('Não foi possível ler o certificado.');
        }

        return $certificateData['pkey']."\n".$certificateData['cert'];
    }

    public static function writeTemporaryPem(string $certificateContent): string
    {
        $temporaryPath = tempnam(sys_get_temp_dir(), 'efi_');

        if ($temporaryPath === false) {
            throw new RuntimeException('Não foi possível criar o arquivo temporário do certificado.');
        }

        $temporaryPemPath = $temporaryPath.'.pem';

        if (! rename($temporaryPath, $temporaryPemPath)) {
            unlink($temporaryPath);

            throw new RuntimeException('Não foi possível preparar o arquivo temporário do certificado.');
        }

        if (file_put_contents($temporaryPemPath, $certificateContent) === false) {
            unlink($temporaryPemPath);

            throw new RuntimeException('Não foi possível gravar o arquivo temporário do certificado.');
        }

        return $temporaryPemPath;
    }

    public static function deleteTemporary(?string $path): void
    {
        if ($path !== null && is_file($path)) {
            unlink($path);
        }
    }
}
