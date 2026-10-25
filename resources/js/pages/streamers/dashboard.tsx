import { ChartTooltipContent } from '@/components/untitled-ui/application/charts/charts-base';
import { MetricsSimple } from '@/components/untitled-ui/application/metrics/metrics';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import PanelLayout from '@/layouts/panel-layout';
import { Area, AreaChart, CartesianGrid, Label, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ChartDataPoint {
    date: string;
    total: number;
    count: number;
}

interface DashboardStats {
    donations_received: number;
    total_billed: string;
    average_amount: string;
    donations_change: number;
    billing_change: number;
    average_change: number;
    chart_data: ChartDataPoint[];
}

interface DashboardProps {
    stats: DashboardStats;
}

function Page({ stats }: DashboardProps) {
    const isDesktop = useBreakpoint('lg');

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
                {/* Page header */}
                <div className="flex flex-col justify-between gap-4 lg:flex-row">
                    <div className="flex flex-col gap-0.5 lg:gap-1">
                        <p className="text-xl font-semibold text-primary lg:text-display-xs">Visão geral</p>
                        <p className="text-md text-tertiary">Resumo das suas doações e atividades.</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-10 lg:flex-row">
                <div className="flex min-w-0 flex-1 flex-col gap-8 lg:gap-5">
                    <div className="flex w-full flex-col flex-wrap gap-4 lg:flex-row lg:gap-5">
                        <MetricsSimple
                            title={String(stats.donations_received)}
                            subtitle="Doações nos últimos 30 dias"
                            type="modern"
                            trend={stats.donations_change >= 0 ? 'positive' : 'negative'}
                            change={`${Math.abs(stats.donations_change)}%`}
                            className="flex-1 lg:min-w-[240px]"
                            actions={false}
                        />
                        <MetricsSimple
                            title={`R$ ${stats.total_billed}`}
                            subtitle="Valor arrecadado nos últimos 30 dias"
                            type="modern"
                            trend={stats.billing_change >= 0 ? 'positive' : 'negative'}
                            change={`${Math.abs(stats.billing_change)}%`}
                            className="flex-1 lg:min-w-[240px]"
                            actions={false}
                        />
                        <MetricsSimple
                            title={`R$ ${stats.average_amount}`}
                            subtitle="Valor médio por donate nos últimos 30 dias"
                            type="modern"
                            trend={stats.average_change >= 0 ? 'positive' : 'negative'}
                            change={`${Math.abs(stats.average_change)}%`}
                            className="flex-1 lg:min-w-[240px]"
                            actions={false}
                        />
                    </div>

                    {/* Chart Section */}
                    <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                        <div className="flex items-center justify-between">
                            <p className="text-lg font-semibold text-primary">Doações</p>
                        </div>

                        <div className="h-60 outline-none [&_*]:outline-none [&_*]:focus:outline-none">
                            <ResponsiveContainer className="h-full">
                                <AreaChart
                                    data={stats.chart_data}
                                    className="text-tertiary outline-none focus:outline-none [&_.recharts-text]:text-xs"
                                    margin={{
                                        top: isDesktop ? 12 : 6,
                                        bottom: isDesktop ? 16 : 0,
                                        left: isDesktop ? 10 : 5,
                                        right: isDesktop ? 10 : 5,
                                    }}
                                >
                                    <defs>
                                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="currentColor" className="text-utility-brand-700" stopOpacity="0.7" />
                                            <stop offset="95%" stopColor="currentColor" className="text-utility-brand-700" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid vertical={false} stroke="currentColor" className="text-utility-gray-100" />

                                    <XAxis
                                        fill="currentColor"
                                        axisLine={false}
                                        tickLine={false}
                                        interval="preserveStartEnd"
                                        dataKey="date"
                                        tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit' })}
                                        padding={{ left: 0, right: 0 }}
                                    >
                                        {isDesktop && (
                                            <Label fill="currentColor" className="!text-xs font-medium max-lg:hidden" position="bottom">
                                                Dia do mês
                                            </Label>
                                        )}
                                    </XAxis>

                                    <YAxis
                                        fill="currentColor"
                                        axisLine={false}
                                        tickLine={false}
                                        interval="preserveStartEnd"
                                        tickFormatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                                    >
                                        <Label
                                            value="Valor arrecadado"
                                            fill="currentColor"
                                            className="!text-xs font-medium"
                                            style={{ textAnchor: 'middle' }}
                                            angle={-90}
                                            position="insideLeft"
                                        />
                                    </YAxis>

                                    <Tooltip
                                        content={<ChartTooltipContent />}
                                        formatter={(value) => [
                                            `R$ ${Number(value ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                                            'Total',
                                        ]}
                                        labelFormatter={(value) =>
                                            new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
                                        }
                                        cursor={{
                                            className: 'stroke-utility-brand-600 stroke-2',
                                        }}
                                    />

                                    <Area
                                        isAnimationActive={false}
                                        className="text-utility-brand-600 [&_.recharts-area-area]:translate-y-1.5 [&_.recharts-area-area]:[clip-path:inset(0_0_6px_0)]"
                                        dataKey="total"
                                        name="Total"
                                        type="monotone"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        fill="url(#gradient)"
                                        fillOpacity={0.1}
                                        activeDot={{
                                            className: 'fill-bg-primary stroke-utility-brand-600 stroke-2',
                                        }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Page.layout = (page: React.ReactNode) => <PanelLayout children={page} title="Dashboard" />;

export default Page;
