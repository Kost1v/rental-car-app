import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
import { Car } from '../../core/models/car.model';
import { CarsService } from '../../core/services/cars.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [RouterLink, LoaderComponent, BookingFormComponent, DecimalPipe],
  templateUrl: './car-details.component.html',
  styleUrl: './car-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly cars = inject(CarsService);
  car?: Car;
  loading = true;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;
      this.loading = true;
      this.cars.getCarById(id).subscribe({
        next: car => { this.car = car; this.loading = false; },
        error: () => { this.car = undefined; this.loading = false; },
      });
    });
  }

  bookingRequested(): void {
    toast.success('Form submitted successfully');
  }
}
