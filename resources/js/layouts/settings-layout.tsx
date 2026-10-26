import { Tab, TabList, Tabs } from '@/components/ui/application/tabs/tabs';
import { NativeSelect } from '@/components/ui/base/select/select-native';
import { useLang } from '@/hooks/use-lang';
import PanelLayout from '@/layouts/panel-layout';
import { show as donationRules } from '@/routes/settings/donation-rules';
import { index as paymentProcessors } from '@/routes/settings/payment-processors';
import { show as profile } from '@/routes/settings/profile';
import { index as widgets } from '@/routes/settings/widgets';
import { router, usePage } from '@inertiajs/react';
import { Key, ReactNode } from 'react';

const tabs = [
    { id: 'profile', label: 'pages.settings.tabs.profile', route: profile },
    { id: 'donation-rules', label: 'pages.settings.tabs.donation_rules', route: donationRules },
    { id: 'payment-processors', label: 'pages.settings.tabs.payment_processors', route: paymentProcessors },
    { id: 'widgets', label: 'pages.settings.tabs.widgets', route: widgets },
];

interface SettingsLayoutProps {
    children: ReactNode;
}

function SettingsLayout({ children }: SettingsLayoutProps) {
    const { __ } = useLang();
    const currentUrl = usePage().url.split('?')[0];
    const currentTab = tabs.find((tab) => tab.route.url() === currentUrl)?.id;

    const handleTabChange = (key: Key) => {
        const tab = tabs.find((t) => t.id === key);
        if (tab) {
            router.visit(tab.route());
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
                {/* Page header */}
                <div className="relative flex flex-col gap-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                        <div className="flex flex-col gap-0.5 lg:gap-1">
                            <h1 className="text-xl font-semibold text-primary lg:text-display-xs">{__('pages.settings.title')}</h1>
                        </div>
                    </div>
                </div>

                <NativeSelect
                    aria-label={__('pages.settings.tabs_label')}
                    className="md:hidden"
                    value={currentTab}
                    onChange={(event) => handleTabChange(event.target.value)}
                    options={tabs.map((tab) => ({ label: __(tab.label), value: tab.id }))}
                />

                <div className="-mx-4 -my-1 scrollbar-hide flex overflow-auto px-4 py-1 lg:-mx-8 lg:px-8">
                    <Tabs className="hidden w-full md:flex" selectedKey={currentTab}>
                        <TabList type="underline" className="w-full">
                            {tabs.map((tab) => (
                                <Tab key={tab.id} id={tab.id} href={tab.route.url()}>
                                    {__(tab.label)}
                                </Tab>
                            ))}
                        </TabList>
                    </Tabs>
                </div>
            </div>

            {children}
        </div>
    );
}

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const currentUrl = usePage().url.split('?')[0];
    const currentTab = tabs.find((tab) => tab.route.url() === currentUrl);

    return (
        <PanelLayout title={currentTab!.label}>
            <SettingsLayout>{children}</SettingsLayout>
        </PanelLayout>
    );
}
