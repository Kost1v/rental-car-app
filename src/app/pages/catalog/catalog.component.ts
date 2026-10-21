import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { toast } from 'ngx-sonner';
import { CarFilters } from '../../core/models/car.model';
import { CarsService } from '../../core/services/cars.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { CarCardComponent } from './components/car-card/car-card.component';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [FilterBarComponent, CarCardComponent, LoaderComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogComponent implements OnInit {
  readonly carsService = inject(CarsService);
  filters: CarFilters = { brand: '', rentalPrice: null, minMileage: null, maxMileage: null };

  ngOnInit(): void {
    this.carsService.loadBrands().subscribe();
    this.load();
  }

  applyFilters(filters: CarFilters): void {
    this.filters = filters;
    this.load();
  }

  loadMore(): void {
    this.carsService.filterCars(this.filters, this.carsService.page() + 1, true).subscribe();
  }

  private load(): void {
    const request = Object.values(this.filters).some(value => value !== '' && value !== null)
      ? this.carsService.filterCars(this.filters)
      : this.carsService.loadCars();
    request.subscribe(response => {
      if (!response.cars.length && !this.carsService.error()) toast.info('No cars match your filters.');
    });
  }
}
