import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<main class="empty"><h1>404</h1><p>We couldn't find that page.</p><a routerLink="/catalog">Back to catalog</a></main>`,
  styles: [`.empty { text-align: center; padding: 120px 24px; } h1 { margin: 0; color: #3470ff; font-size: 96px; } p { color: #667085; } a { color: #3470ff; font-weight: 700; }`],
})
export class NotFoundComponent {}
