<?php

namespace App\Navigation;

class Navigation
{
    public static function getNavigationItems(?object $user = null, string $panel = 'user'): array
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
                    ->title('Visão geral')
                    ->route('dashboard')
                    ->icon('home-05')
                    ->sort(10),

                NavigationItem::make()
                    ->title('Controles')
                    ->route('controls')
                    ->icon('cursor-01')
                    ->sort(15),

                NavigationItem::make()
                    ->title('Doações')
                    ->route('donations.index')
                    ->icon('heart-hand')
                    ->sort(20),

                NavigationItem::make()
                    ->title('Metas')
                    ->route('goals.index')
                    ->icon('target-04')
                    ->sort(25),

                NavigationItem::make()
                    ->title('Configurações')
                    ->route('settings.profile.show')
                    ->icon('settings-01')
                    ->sort(30),

            ]);
    }
}
