import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CarFilters } from '../../../../core/models/car.model';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="filters" [formGroup]="form" (ngSubmit)="submit()">
      <label>Car brand <select formControlName="brand"><option value="">All brands</option>@for (brand of brands; track brand) {<option [value]="brand">{{ brand }}</option>}</select></label>
      <label>Price per day <select formControlName="rentalPrice"><option [ngValue]="null">Any price</option>@for (price of prices; track price) {<option [ngValue]="price">&#36;{{ price }}</option>}</select></label>
      <label>Min mileage <input type="number" formControlName="minMileage" placeholder="e.g. 1000" min="0"></label>
      <label>Max mileage <input type="number" formControlName="maxMileage" placeholder="e.g. 100000" min="0"></label>
      <div class="actions"><button type="submit">Search</button><button class="reset" type="button" (click)="reset()">Reset</button></div>
    </form>
  `,
  styles: [`.filters { display: grid; grid-template-columns: 1.2fr repeat(3, 1fr) auto; gap: 14px; align-items: end; padding: 20px; border-radius: 16px; background: #f8f9fb; } label { display: grid; gap: 7px; color: #667085; font-size: 12px; font-weight: 600; } input, select { min-width: 0; border: 1px solid #d0d5dd; border-radius: 8px; padding: 11px 12px; font: inherit; background: #fff; } .actions { display: flex; gap: 8px; } button { border: 0; border-radius: 8px; padding: 12px 18px; background: #3470ff; color: #fff; font-weight: 700; cursor: pointer; } button.reset { background: transparent; color: #3470ff; border: 1px solid #3470ff; } @media (max-width: 800px) { .filters { grid-template-columns: repeat(2, 1fr); } } @media (max-width: 480px) { .filters { grid-template-columns: 1fr; } .actions { justify-content: stretch; } .actions button { flex: 1; } }`],
})
export class FilterBarComponent {
  readonly prices = [30, 40, 50, 60, 70, 80];
  @Input() brands: string[] = [];
  @Output() filtersChanged = new EventEmitter<CarFilters>();
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({ brand: '', rentalPrice: null as number | null, minMileage: null as number | null, maxMileage: null as number | null });

  submit(): void {
    this.filtersChanged.emit(this.form.getRawValue());
  }

  reset(): void {
    this.form.reset({ brand: '', rentalPrice: null, minMileage: null, maxMileage: null });
    this.submit();
  }
}
