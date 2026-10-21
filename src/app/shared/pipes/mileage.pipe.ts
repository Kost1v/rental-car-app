import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'mileage', standalone: true })
export class MileagePipe implements PipeTransform {
  transform(value: number): string {
    return `${new Intl.NumberFormat('en-US').format(value)} km`;
  }
}
