<?php

namespace App\Support;

class MoneyToWords
{
    public static function toWords(float $value): string
    {
        $formatted = number_format($value, 2, ',', '.');
        [$integer, $cents] = explode(',', $formatted);

        $integerPart = (int) str_replace('.', '', $integer);
        $result = self::numberToWords($integerPart).' '.($integerPart > 1 ? 'reais' : 'real');

        $centsValue = (int) $cents;
        if ($centsValue > 0) {
            $result .= ' e '.self::numberToWords($centsValue).' centavo'.($centsValue > 1 ? 's' : '');
        }

        return trim($result);
    }

    private static function numberToWords(int $number): string
    {
        if ($number < 0) {
            return 'menos '.self::numberToWords(abs($number));
        }

        if ($number === 0) {
            return 'zero';
        }

        $units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
        $teens = [10 => 'dez', 11 => 'onze', 12 => 'doze', 13 => 'treze', 14 => 'quatorze', 15 => 'quinze', 16 => 'dezesseis', 17 => 'dezessete', 18 => 'dezoito', 19 => 'dezenove'];
        $tens = ['', 'dez', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
        $hundreds = ['', 'cem', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

        if ($number < 10) {
            return $units[$number];
        } elseif ($number < 20) {
            return $teens[$number];
        } elseif ($number < 100) {
            $ten = intdiv($number, 10);
            $unit = $number % 10;

            return $tens[$ten].($unit ? ' e '.$units[$unit] : '');
        } elseif ($number < 1000) {
            $hundred = intdiv($number, 100);
            $remainder = $number % 100;
            if ($hundred == 1 && $remainder > 0) {
                return 'cento e '.self::numberToWords($remainder);
            }

            return $hundreds[$hundred].($remainder ? ' e '.self::numberToWords($remainder) : '');
        } elseif ($number < 1000000) {
            $thousands = intdiv($number, 1000);
            $remainder = $number % 1000;

            $thousandsPart = $thousands == 1 ? 'mil' : self::numberToWords($thousands).' mil';
            if ($remainder > 0) {
                if ($remainder < 100) {
                    return $thousandsPart.' e '.self::numberToWords($remainder);
                }

                return $thousandsPart.' '.self::numberToWords($remainder);
            }

            return $thousandsPart;
        } elseif ($number == 1000000) {
            return 'um milhão';
        }

        return (string) $number; // fallback
    }
}
