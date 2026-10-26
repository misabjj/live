import { SectionFooter } from '@/components/ui/application/section-footers/section-footer';
import { SectionHeader } from '@/components/ui/application/section-headers/section-headers';
import { FeaturedIcon } from '@/components/ui/foundations/featured-icon/featured-icon';
import { DonationAlertWidgetActions } from '@/components/widget-actions/donation-alert-widget-actions';
import { GoalWidgetActions } from '@/components/widget-actions/goal-widget-actions';
import { ProfileQrCodeWidgetActions } from '@/components/widget-actions/profile-qr-code-widget-actions';
import { useLang } from '@/hooks/use-lang';
import SettingsLayout from '@/layouts/settings-layout';
import { BellRinging04, QrCode01, Target04 } from '@untitledui/icons';
import React from 'react';

interface Widget {
    id: string;
    type: string;
    url: string;
}

interface Props {
    widgets: Widget[];
}

const widgetConfig: Record<string, { icon: React.FC<{ className?: string }> }> = {
    profile_qr_code: {
        icon: QrCode01,
    },
    donation_alert: {
        icon: BellRinging04,
    },
    goal: {
        icon: Target04,
    },
};

function Page({ widgets }: Props) {
    const { __ } = useLang();
    const renderWidgetActions = (widget: Widget) => {
        switch (widget.type) {
            case 'profile_qr_code':
                return <ProfileQrCodeWidgetActions widgetId={widget.id} widgetUrl={widget.url} />;
            case 'donation_alert':
                return <DonationAlertWidgetActions widgetId={widget.id} widgetUrl={widget.url} />;
            case 'goal':
                return <GoalWidgetActions widgetId={widget.id} widgetUrl={widget.url} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <SectionHeader.Root className="border-none pb-0">
                <SectionHeader.Group>
                    <div className="flex flex-1 flex-col justify-center gap-0.5">
                        <SectionHeader.Heading>{__('pages.widgets.title')}</SectionHeader.Heading>
                        <SectionHeader.Subheading>{__('pages.widgets.subtitle')}</SectionHeader.Subheading>
                    </div>
                </SectionHeader.Group>
            </SectionHeader.Root>

            <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
                {widgets.map((widget) => {
                    const config = widgetConfig[widget.type];
                    const Icon = config.icon;

                    return (
                        <li key={widget.id}>
                            <div className="w-full flex-1 rounded-xl bg-primary_alt shadow-xs ring-1 ring-secondary ring-inset">
                                <div className="flex flex-col gap-6 px-4 py-5 lg:px-5">
                                    <div className="flex gap-2">
                                        <div className="flex flex-1 items-center gap-3">
                                            <FeaturedIcon icon={Icon} size="lg" color="gray" theme="modern-neue" />
                                            <p className="text-md font-medium text-primary lg:text-md lg:font-semibold">
                                                {__('pages.widgets.types.' + widget.type + '.label')}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-tertiary">{__('pages.widgets.types.' + widget.type + '.description')}</p>
                                </div>
                                <SectionFooter.Root isCard className="px-6 py-4">
                                    <SectionFooter.Actions className="flex w-full justify-end">{renderWidgetActions(widget)}</SectionFooter.Actions>
                                </SectionFooter.Root>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

Page.layout = (page: React.ReactNode) => <SettingsLayout>{page}</SettingsLayout>;

export default Page;
