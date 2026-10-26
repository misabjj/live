<?php

namespace App\Navigation;

use App\Models\User;

class NavigationGroup
{
    protected string $name;

    /** @var list<NavigationItem> */
    protected array $items = [];

    protected ?int $sort = null;

    /**
     * Create a new navigation group.
     */
    public static function make(string $name): self
    {
        $instance = new self;
        $instance->name = $name;

        return $instance;
    }

    /**
     * Set the sort order for this group.
     */
    public function sort(int $sort): self
    {
        $this->sort = $sort;

        return $this;
    }

    /**
     * Add navigation items to this group.
     */
    /** @param list<NavigationItem> $items */
    public function items(array $items): self
    {
        $this->items = $items;

        return $this;
    }

    /**
     * Get navigation items filtered by user permissions.
     */
    /** @return list<array<string, mixed>> */
    public function getItems(?User $user = null): array
    {
        return collect($this->items)
            ->filter(fn (NavigationItem $item) => $item->shouldBeVisible($user))
            ->sortBy(fn (NavigationItem $item) => $item->getSort() ?? 0)
            ->map(fn (NavigationItem $item) => $item->toArray())
            ->values()
            ->all();
    }

    /**
     * Get the group name.
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * Get the sort order.
     */
    public function getSort(): ?int
    {
        return $this->sort;
    }

    /**
     * Check if this group has any visible items for the user.
     */
    public function hasVisibleItems(?User $user = null): bool
    {
        return collect($this->items)
            ->some(fn (NavigationItem $item) => $item->shouldBeVisible($user));
    }
}
