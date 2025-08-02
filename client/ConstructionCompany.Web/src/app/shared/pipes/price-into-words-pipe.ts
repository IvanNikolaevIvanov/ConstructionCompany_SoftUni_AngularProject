import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'priceIntoWords', standalone: true })
export class PriceIntoWordsPipe implements PipeTransform {
  private units = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];

  private tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  transform(value: number | null): string {
    if (value == null || isNaN(value)) return '';

    const euros = Math.floor(value);
    const cents = Math.round((value - euros) * 100);

    const eurosText =
      this.convertToWords(euros) + (euros === 1 ? ' euro' : ' euros');
    const centsText =
      cents > 0
        ? ' and ' +
          this.convertToWords(cents) +
          (cents === 1 ? ' cent' : ' cents')
        : '';

    return eurosText + centsText;
  }

  private convertToWords(n: number): string {
    if (n === 0) return 'Zero';

    let result = '';
    const thousands = ['', 'Thousand', 'Million', 'Billion'];
    let groupIndex = 0;

    while (n > 0) {
      const group = n % 1000;
      if (group > 0) {
        let groupWords = this.convertThreeDigits(group);
        if (thousands[groupIndex]) groupWords += ' ' + thousands[groupIndex];
        result = groupWords + ' ' + result;
      }
      n = Math.floor(n / 1000);
      groupIndex++;
    }

    return result.trim();
  }

  private convertThreeDigits(n: number): string {
    let str = '';
    if (n >= 100) {
      str += this.units[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += this.tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      str += this.units[n] + ' ';
    }
    return str.trim();
  }
}
