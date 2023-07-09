import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timer',
})
export class TimerPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): string {
    if (value <= 0) {
      return '00:00.0';
    }
    const minutes = Math.floor(value / 60000);
    const seconds = Math.floor((value % 60000) / 1000);
    const miliseconds = Math.floor(value % 1000);
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}${seconds < 10 && minutes === 0 ? '.' + miliseconds / 100 : ''}`;
  }
}
