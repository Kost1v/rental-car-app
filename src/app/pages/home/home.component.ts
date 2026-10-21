import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="hero">
      <div class="hero-copy"><p class="eyebrow">Move freely</p><h1>Find your perfect rental car</h1><p>Quality cars, transparent prices, and a simple booking experience. Your next adventure starts here.</p><a class="button" routerLink="/catalog">Browse cars</a></div>
      <div class="hero-art" aria-hidden="true"><div class="sun"></div><div class="road"></div><div class="car-shape">CAR</div></div>
    </main>
  `,
  styles: [`.hero { max-width: 1184px; min-height: calc(100vh - 68px); margin: auto; padding: 72px 24px; display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 32px; } .hero-copy { max-width: 520px; } .eyebrow { color: #3470ff; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; } h1 { margin: 12px 0 20px; color: #101828; font-size: clamp(42px, 5vw, 68px); line-height: 1.05; letter-spacing: -.04em; } .hero-copy > p:not(.eyebrow) { color: #667085; font-size: 18px; line-height: 1.6; margin-bottom: 32px; } .button { display: inline-block; padding: 14px 28px; border-radius: 12px; background: #3470ff; color: #fff; text-decoration: none; font-weight: 700; } .hero-art { min-height: 360px; position: relative; overflow: hidden; border-radius: 32px; background: linear-gradient(135deg, #dce8ff, #f3f6ff); } .sun { width: 160px; height: 160px; position: absolute; top: 36px; right: 42px; border-radius: 50%; background: #fff; box-shadow: 0 0 60px #fff; } .road { position: absolute; inset: 58% -20% -30%; transform: rotate(-8deg); background: #1d2939; } .car-shape { position: absolute; left: 20%; bottom: 25%; padding: 28px 80px; border-radius: 24px 44px 12px 12px; background: #3470ff; color: #fff; font-size: 30px; font-weight: 800; box-shadow: 0 18px 30px #1d4ed866; } @media (max-width: 720px) { .hero { grid-template-columns: 1fr; padding-top: 40px; } .hero-art { min-height: 250px; } }`],
})
export class HomeComponent {}
