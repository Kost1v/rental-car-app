import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<div class="loader" role="status" aria-label="Loading"></div>',
  styles: [`.loader { width: 38px; height: 38px; margin: 48px auto; border: 4px solid #e8e8e8; border-top-color: #3470ff; border-radius: 50%; animation: spin .8s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`],
})
export class LoaderComponent {}
