import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Car } from '../../../../core/models/car.model';
import { FavoritesService } from '../../../../core/services/favorites.service';
import { MileagePipe } from '../../../../shared/pipes/mileage.pipe';

@Component({
  selector: 'app-car-card',
  standalone: true,
  imports: [RouterLink, MileagePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card">
      <div class="image-wrap"><img [src]="car.img" [alt]="car.brand + ' ' + car.model" loading="lazy"><button class="heart" type="button" (click)="favorites.toggleFavorite(car.id)" [attr.aria-label]="favorites.isFavorite(car.id) ? 'Remove from favorites' : 'Add to favorites'">{{ favorites.isFavorite(car.id) ? '♥' : '♡' }}</button></div>
      <div class="content"><div class="title-row"><h2>{{ car.brand }}, <span>{{ car.model }}, {{ car.year }}</span></h2><strong>&#36;{{ car.rentalPrice }}</strong></div><p class="meta">{{ city }} | {{ country }} | {{ car.rentalCompany }} | {{ car.type }} | {{ car.mileage | mileage }}</p><a class="details" [routerLink]="['/catalog', car.id]">Read more</a></div>
    </article>
  `,
  styles: [`.card { overflow: hidden; border: 1px solid #eaecf0; border-radius: 16px; background: #fff; } .image-wrap { position: relative; height: 210px; background: #f2f4f7; } img { width: 100%; height: 100%; object-fit: cover; } .heart { position: absolute; top: 12px; right: 12px; width: 34px; height: 34px; border: 0; border-radius: 50%; background: #fff; color: #3470ff; font-size: 21px; cursor: pointer; } .content { padding: 16px; } .title-row { display: flex; justify-content: space-between; gap: 12px; } h2 { margin: 0; color: #101828; font-size: 17px; } h2 span { color: #667085; font-weight: 400; } strong { color: #101828; white-space: nowrap; } strong small { color: #98a2b3; font-size: 12px; font-weight: 400; } .meta, .location { color: #667085; font-size: 13px; } .location { margin-bottom: 18px; } .details { color: #3470ff; font-size: 14px; font-weight: 700; text-decoration: none; }`],
})
export class CarCardComponent {
  @Input({ required: true }) car!: Car;
  readonly favorites = inject(FavoritesService);

  get city(): string {
    return this.car.address.split(',')[0]?.trim() || this.car.address;
  }

  get country(): string {
    const parts = this.car.address.split(',');
    return parts.length > 1 ? parts[parts.length - 1].trim() : '';
  }
}
