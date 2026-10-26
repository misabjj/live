<?php

namespace App\Navigation;

use App\Models\User;

class NavigationItem
{
    protected string $title;

    protected ?string $route = null;

    protected ?string $url = null;

    protected ?string $icon = null;

    protected bool $isAdmin = false;

    protected bool $isExternal = false;

    protected ?int $sort = null;

    protected bool $isActive = true;

    protected ?string $badge = null;

    protected ?string $group = null;

    /** @var list<NavigationItem> */
    protected array $items = [];

    /**
     * Create a new navigation item instance.
     */
    public static function make(): self
    {
        return new self;
    }

    /**
     * Set the title of the navigation item.
     */
    public function title(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Set the route name for the navigation item.
     */
    public function route(string $route): self
    {
        $this->route = $route;
        $this->url = null; // Clear URL if route is set

        return $this;
    }

    /**
     * Set the URL for the navigation item.
     */
    public function url(string $url): self
    {
        $this->url = $url;
        $this->route = null; // Clear route if URL is set

        return $this;
    }

    /**
     * Set the icon for the navigation item.
     */
    public function icon(string $icon): self
    {
        $this->icon = $icon;

        return $this;
    }

    /**
     * Mark this navigation item as admin-only.
     */
    public function admin(bool $admin = true): self
    {
        $this->isAdmin = $admin;

        return $this;
    }

    /**
     * Mark this navigation item as external.
     */
    public function external(bool $external = true): self
    {
        $this->isExternal = $external;

        return $this;
    }

    /**
     * Set the sort order for the navigation item.
     */
    public function sort(int $sort): self
    {
        $this->sort = $sort;

        return $this;
    }

    /**
     * Set whether the navigation item is active.
     */
    public function active(bool $active = true): self
    {
        $this->isActive = $active;

        return $this;
    }

    /**
     * Add a badge to the navigation item.
     */
    public function badge(string $badge): self
    {
        $this->badge = $badge;

        return $this;
    }

    /**
     * Set the group for the navigation item.
     */
    public function group(string $group): self
    {
        $this->group = $group;

        return $this;
    }

    /**
     * Set the items for the navigation item.
     */
    /** @param list<NavigationItem> $items */
    public function items(array $items): self
    {
        $this->items = $items;

        return $this;
    }

    /**
     * Check if this navigation item should be visible for the given user.
     */
    public function shouldBeVisible(?User $user = null): bool
    {
        if (! $this->isActive) {
            return false;
        }

        if ($this->isAdmin && (! $user || ! $user->is_admin)) {
            return false;
        }

        return true;
    }

    /**
     * Get the resolved URL for this navigation item.
     */
    public function getUrl(): string
    {
        if ($this->url) {
            return $this->url;
        }

        if ($this->route) {
            return route($this->route);
        }

        throw new \InvalidArgumentException('Navigation item must have either a route or URL set.');
    }

    /**
     * Convert the navigation item to an array.
     */
    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'route' => $this->route,
            'href' => $this->isExternal ? $this->url : null,
            'url' => $this->getUrl(),
            'icon' => $this->icon,
            'admin' => $this->isAdmin,
            'external' => $this->isExternal,
            'sort' => $this->sort,
            'active' => $this->isCurrentRoute(),
            'badge' => $this->badge,
            'group' => $this->group,
            'items' => $this->items,
        ];
    }

    /**
     * Check if this navigation item matches the current route.
     */
    public function isCurrentRoute(): bool
    {
        if (! $this->isActive) {
            return false;
        }

        if ($this->isExternal) {
            return false;
        }

        if ($this->route) {
            // Special handling for dashboard route - should be active for user panel routes
            if ($this->route === 'dashboard') {
                $currentRoute = request()->route()?->getName();

                if (! $currentRoute) {
                    return false;
                }

                // Exclude admin routes explicitly
                if (str_starts_with($currentRoute, 'admin.')) {
                    return false;
                }

                // Include user panel routes - be more permissive for now
                $userRoutes = ['dashboard', 'donations.index', 'donations.show', 'donations.checkout', 'donations.block-donor', 'donations.confirm-payment', 'donations.play-donation-alert', 'settings.donations', 'settings.donations.update'];

                return in_array($currentRoute, $userRoutes);
            }

            // Check for exact route match
            if (request()->routeIs($this->route)) {
                return true;
            }

            // For index routes, check if we're on a child route
            if (str_ends_with($this->route, '.index')) {
                $baseRoute = str_replace('.index', '', $this->route);

                return request()->routeIs($baseRoute.'.*');
            }

            // For non-index routes, check if we're on any child route
            // This allows settings.profile to be active for settings.payment-processors.index, etc.
            $currentRoute = request()->route()?->getName();
            if ($currentRoute) {
                // Extract the base segment (e.g., "settings" from "settings.profile")
                $routeParts = explode('.', $this->route);
                $baseSegment = $routeParts[0];

                // Check if current route starts with the same base segment
                if (str_starts_with($currentRoute, $baseSegment.'.')) {
                    return true;
                }
            }

            return false;
        }

        if ($this->url) {
            return request()->url() === $this->url;
        }

        return false;
    }

    /**
     * Get the title.
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * Get the icon.
     */
    public function getIcon(): ?string
    {
        return $this->icon;
    }

    /**
     * Check if this is an admin item.
     */
    public function isAdmin(): bool
    {
        return $this->isAdmin;
    }

    /**
     * Check if this is an external link.
     */
    public function isExternal(): bool
    {
        return $this->isExternal;
    }

    /**
     * Get the sort order.
     */
    public function getSort(): ?int
    {
        return $this->sort;
    }
}
