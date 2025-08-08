import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sliceDescription',
})
export class SliceDescriptionPipe implements PipeTransform {
  transform(value: string, maxLength: number = 15): string {
    if (!value) {
      return '';
    }

    return value.length > maxLength ? value.slice(0, maxLength) + '...' : value;
  }
}
