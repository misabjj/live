import { Goal } from '@/components/widgets/goal';
import { useEchoPublic } from '@laravel/echo-react';
import { useState } from 'react';

interface GoalData {
    id: number;
    title?: string;
    target_amount: number;
    raised_amount: number;
    background_color: string;
    progress_bar_color: string;
    text_color: string;
    show_profile_link: boolean;
    user_handle: string;
    closes_at?: string;
}

interface GoalUpdatedEvent {
    id: number;
    title?: string;
    target_amount: number;
    raised_amount: number;
    background_color: string;
    progress_bar_color: string;
    text_color: string;
    show_profile_link: boolean;
    user_handle: string;
    closes_at?: string;
    percentage: number;
}

interface WidgetData {
    token: string;
}

interface Props {
    goal: GoalData | null;
    widget: WidgetData;
}

export default function Page({ goal: initialGoal, widget }: Props) {
    const [goal, setGoal] = useState<GoalData | null>(initialGoal);

    useEchoPublic(`widgets.${widget.token}`, '.goal.updated', (data: GoalUpdatedEvent | Record<string, never>) => {
        if (!('id' in data) || data.id === undefined) {
            setGoal(null);
        } else {
            const event = data as GoalUpdatedEvent;
            setGoal({
                id: event.id,
                title: event.title,
                target_amount: event.target_amount,
                raised_amount: event.raised_amount,
                background_color: event.background_color,
                progress_bar_color: event.progress_bar_color,
                text_color: event.text_color,
                show_profile_link: event.show_profile_link,
                user_handle: event.user_handle,
                closes_at: event.closes_at,
            });
        }
    });

    if (!goal) {
        return null;
    }

    return (
        <Goal
            title={goal.title}
            targetAmount={goal.target_amount}
            raisedAmount={goal.raised_amount}
            backgroundColor={goal.background_color}
            progressBarColor={goal.progress_bar_color}
            textColor={goal.text_color}
            showProfileLink={goal.show_profile_link}
            userHandle={goal.user_handle}
            closesAt={goal.closes_at}
            className="w-full"
        />
    );
}
