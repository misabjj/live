<?php

namespace App\Navigation;

use App\Models\User;

class Navigation
{
    /** @return array<string, mixed> */
    public static function getNavigationItems(?User $user = null, string $panel = 'user'): array
    {
        $mainGroup = static::getUserNavigationGroup();

        return [
            'main' => $mainGroup->getItems($user),
            'panel' => $panel,
            'texts' => [
                'profile' => __('navigation.profile'),
                'settings' => __('navigation.settings'),
                'logout' => __('navigation.logout'),
                'user' => __('navigation.user'),
            ],
        ];
    }

    protected static function getUserNavigationGroup(): NavigationGroup
    {
        return NavigationGroup::make('user')
            ->sort(0)
            ->items([
                NavigationItem::make()
                    ->title(__('navigation.dashboard'))
                    ->route('dashboard')
                    ->icon('home-05')
                    ->sort(10),

                NavigationItem::make()
                    ->title(__('navigation.controls'))
                    ->route('controls')
                    ->icon('cursor-01')
                    ->sort(15),

                NavigationItem::make()
                    ->title(__('navigation.donations'))
                    ->route('donations.index')
                    ->icon('heart-hand')
                    ->sort(20),

                NavigationItem::make()
                    ->title(__('navigation.goals'))
                    ->route('goals.index')
                    ->icon('target-04')
                    ->sort(25),

                NavigationItem::make()
                    ->title(__('navigation.settings'))
                    ->route('settings.profile.show')
                    ->icon('settings-01')
                    ->sort(30),

            ]);
    }
}
