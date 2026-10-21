import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { MOCK_CARS } from '../data/mock-cars';
import { Car, CarFilters, CarsResponse } from '../models/car.model';

@Injectable({ providedIn: 'root' })
export class CarsService {
  readonly cars = signal<Car[]>([]);
  readonly brands = signal<string[]>([]);
  readonly loading = signal(false);
  readonly isLoading = this.loading;
  readonly error = signal('');
  readonly page = signal(1);
  readonly totalPages = signal(1);
  readonly totalCars = signal(0);

  loadCars(page = 1, append = page > 1): Observable<CarsResponse> {
    return this.requestCars({}, page, append);
  }

  filterCars(filters: Partial<CarFilters>, page = 1, append = false): Observable<CarsResponse> {
    return this.requestCars(filters, page, append);
  }

  getCars(filters: Partial<CarFilters> = {}, page = 1, append = false): Observable<CarsResponse> {
    return this.requestCars(filters, page, append);
  }

  private requestCars(filters: Partial<CarFilters>, page: number, append: boolean): Observable<CarsResponse> {
    this.loading.set(true);
    this.error.set('');
    const filtered = MOCK_CARS.filter(car =>
      (!filters.brand || car.brand === filters.brand) &&
      (filters.rentalPrice == null || car.rentalPrice === filters.rentalPrice) &&
      (filters.minMileage == null || car.mileage >= filters.minMileage) &&
      (filters.maxMileage == null || car.mileage <= filters.maxMileage),
    );
    const pageSize = 3;
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const cars = filtered.slice((page - 1) * pageSize, page * pageSize);
    const response = { cars, page: Math.min(page, totalPages), totalPages, totalCars: filtered.length };
    this.cars.update(current => append ? [...current, ...cars] : cars);
    this.page.set(response.page);
    this.totalPages.set(totalPages);
    this.totalCars.set(filtered.length);
    this.loading.set(false);
    return of(response);
  }

  getCarById(id: string): Observable<Car> {
    const car = MOCK_CARS.find(item => item.id === id);
    return car ? of(car) : throwError(() => new Error('Car not found'));
  }

  getCar(id: string): Observable<Car> {
    return this.getCarById(id);
  }

  loadBrands(): Observable<string[]> {
    const brands = [...new Set(MOCK_CARS.map(car => car.brand))].sort();
    this.brands.set(brands);
    return of(brands);
  }

  getBrands(): Observable<string[]> {
    return this.loadBrands();
  }
}
