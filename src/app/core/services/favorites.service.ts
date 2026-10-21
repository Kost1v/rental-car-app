import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly storageKey = 'savedCar';
  readonly favoriteIds = signal<string[]>(this.read());

  isFavorite(id: string): boolean {
    return this.favoriteIds().includes(id);
  }

  toggleFavorite(id: string): void {
    const ids = this.isFavorite(id)
      ? this.favoriteIds().filter(favoriteId => favoriteId !== id)
      : [...this.favoriteIds(), id];
    this.favoriteIds.set(ids);
    localStorage.setItem(this.storageKey, JSON.stringify(ids));
  }

  toggle(id: string): void {
    this.toggleFavorite(id);
  }

  private read(): string[] {
    try {
      const saved = localStorage.getItem(this.storageKey);
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
    } catch {
      return [];
    }
  }
}
