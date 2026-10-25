import { ProfileQrCode } from '@/components/widgets/profile-qr-code';
import { useEchoPublic } from '@laravel/echo-react';
import { useState } from 'react';

interface User {
    handle: string;
    profile_url: string;
}

interface Widget {
    token: string;
}

interface QRCodeSettings {
    gradient_color_1: string;
    gradient_color_2: string;
    gradient_type: 'linear' | 'radial';
    gradient_rotation: number;
    dots_type: string;
    message: string | null;
    text_color: string;
    background_color: string;
    card_border_color: string;
}

interface ProfileQrCodeUpdatedEvent {
    gradient_color_1: string;
    gradient_color_2: string;
    gradient_type: 'linear' | 'radial';
    gradient_rotation: number;
    dots_type: string;
    message: string | null;
    text_color: string;
    background_color: string;
    card_border_color: string;
}

interface Props {
    user: User;
    widget: Widget;
    profile_qr_code: QRCodeSettings;
}

function Page({ user, widget, profile_qr_code: initialSettings }: Props) {
    const [settings, setSettings] = useState<QRCodeSettings>(initialSettings);

    useEchoPublic(`widgets.${widget.token}`, '.profile-qr-code.updated', (data: ProfileQrCodeUpdatedEvent) => {
        setSettings({
            gradient_color_1: data.gradient_color_1,
            gradient_color_2: data.gradient_color_2,
            gradient_type: data.gradient_type,
            gradient_rotation: data.gradient_rotation,
            dots_type: data.dots_type,
            message: data.message,
            text_color: data.text_color,
            background_color: data.background_color,
            card_border_color: data.card_border_color,
        });
    });

    return (
        <div className="flex min-h-screen items-center justify-center">
            <ProfileQrCode
                profileUrl={user.profile_url}
                gradientColor1={settings.gradient_color_1}
                gradientColor2={settings.gradient_color_2}
                gradientType={settings.gradient_type}
                gradientRotation={settings.gradient_rotation}
                dotsType={settings.dots_type}
                message={settings.message}
                textColor={settings.text_color}
                backgroundColor={settings.background_color}
            />
        </div>
    );
}

export default Page;
