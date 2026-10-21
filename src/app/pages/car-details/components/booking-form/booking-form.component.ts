import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="booking" [formGroup]="form" (ngSubmit)="submit()">
      <h2>Book this car</h2><p>We will contact you to confirm availability.</p>
      <label>Full name<input formControlName="name" placeholder="Your name"></label>
      @if (form.controls.name.touched && form.controls.name.invalid) { <small>Name is required.</small> }
      <label>Email<input type="email" formControlName="email" placeholder="you@example.com"></label>
      @if (form.controls.email.touched && form.controls.email.invalid) { <small>Enter a valid email.</small> }
      <label>Booking date<input type="date" formControlName="date"></label>
      @if (form.controls.date.touched && form.controls.date.invalid) { <small>Booking date is required.</small> }
      <label>Comment<textarea formControlName="comment" rows="4" placeholder="Add a comment (optional)"></textarea></label>
      <button type="submit">Request booking</button>
    </form>
  `,
  styles: [`.booking { padding: 24px; border: 1px solid #eaecf0; border-radius: 16px; background: #fff; } h2 { margin: 0 0 6px; } p { margin-top: 0; color: #667085; font-size: 14px; } label { display: grid; gap: 7px; margin-top: 16px; color: #344054; font-size: 13px; font-weight: 600; } input, textarea { padding: 11px; border: 1px solid #d0d5dd; border-radius: 8px; font: inherit; resize: vertical; } small { color: #d92d20; margin-top: 4px; } button { width: 100%; margin-top: 22px; padding: 13px; border: 0; border-radius: 8px; background: #3470ff; color: #fff; font-weight: 700; cursor: pointer; }`],
})
export class BookingFormComponent {
  @Output() booked = new EventEmitter<void>();
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    date: ['', Validators.required],
    comment: '',
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.booked.emit();
    this.form.reset();
  }
}
