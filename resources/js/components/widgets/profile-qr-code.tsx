import { QRCode } from '@/components/ui/shared-assets/qr-code';
import { cx } from '@/utils/cx';
import type { Options as QRCodeStylingOptions } from 'qr-code-styling';
import { useMemo } from 'react';

interface ProfileQrCodeProps {
    profileUrl: string;
    gradientColor1: string;
    gradientColor2: string;
    gradientType: 'linear' | 'radial';
    gradientRotation: number;
    dotsType: string;
    message: string | null;
    textColor: string;
    backgroundColor: string;
    className?: string;
}

export function ProfileQrCode({
    profileUrl,
    gradientColor1,
    gradientColor2,
    gradientType,
    gradientRotation,
    dotsType,
    message,
    textColor,
    backgroundColor,
    className,
}: ProfileQrCodeProps) {
    const qrCodeOptions = useMemo<QRCodeStylingOptions>(() => {
        const gradient = {
            type: gradientType,
            rotation: (gradientRotation * Math.PI) / 180,
            colorStops: [
                { offset: 0, color: gradientColor1 },
                { offset: 1, color: gradientColor2 },
            ],
        };

        return {
            width: 300,
            height: 300,
            qrOptions: {
                typeNumber: 0,
                mode: 'Byte',
                errorCorrectionLevel: 'Q',
            },
            dotsOptions: {
                type: dotsType as any,
                gradient,
            },
            backgroundOptions: {
                color: backgroundColor,
            },
            cornersSquareOptions: {
                type: 'extra-rounded',
                gradient,
            },
            cornersDotOptions: {
                type: 'dot',
                gradient,
            },
        };
    }, [gradientColor1, gradientColor2, gradientType, gradientRotation, dotsType, backgroundColor]);

    return (
        <div
            className={cx('rounded-2xl shadow-2xl', className)}
            style={{
                background: backgroundColor,
            }}
        >
            <div className="flex max-w-[324px] flex-col items-center px-4 py-4">
                <div className="text-center">
                    <p className="text-xl font-bold" style={{ color: textColor }}>
                        {profileUrl.replace('https://', '')}
                    </p>
                </div>

                <QRCode value={profileUrl} options={qrCodeOptions} size="lg" />

                {message && (
                    <div className="text-center break-all">
                        <h1 className="text-xl font-bold" style={{ color: textColor }}>
                            {message}
                        </h1>
                    </div>
                )}
            </div>
        </div>
    );
}
