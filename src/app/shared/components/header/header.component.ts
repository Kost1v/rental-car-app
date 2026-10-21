import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="header">
      <a class="logo" routerLink="/" aria-label="RentalCar home"><span>Rental</span>Car</a>
      <nav aria-label="Main navigation">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
        <a routerLink="/catalog" routerLinkActive="active">Catalog</a>
      </nav>
      <div class="auth-actions">
        @if (auth.isAuthenticated()) {
          <span class="greeting">Hi, {{ auth.currentUser()?.name }}</span>
          <button type="button" (click)="auth.logout()">Logout</button>
        } @else {
          <a routerLink="/login" routerLinkActive="active">Login</a>
          <a class="register" routerLink="/register" routerLinkActive="active">Register</a>
        }
      </div>
    </header>
  `,
  styles: [`.header { height: 68px; display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 0 max(24px, calc((100% - 1184px) / 2)); border-bottom: 1px solid #f0f0f0; background: #fff; } .logo { color: #101828; font-size: 22px; font-weight: 700; text-decoration: none; } .logo span { color: #3470ff; } nav, .auth-actions { display: flex; align-items: center; gap: 20px; } nav a, .auth-actions a { color: #475467; text-decoration: none; font-weight: 500; } nav a.active, nav a:hover, .auth-actions a.active, .auth-actions a:hover { color: #3470ff; } .greeting { color: #475467; font-size: 14px; } .auth-actions button, .register { padding: 9px 14px; border: 0; border-radius: 8px; background: #3470ff; color: #fff !important; font: inherit; font-weight: 700; cursor: pointer; } @media (max-width: 700px) { .header { padding: 0 16px; gap: 10px; } nav { display: none; } .greeting { display: none; } }`],
})
export class HeaderComponent {
  readonly auth = inject(AuthService);
}
