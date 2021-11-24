import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'jsonparse'})
export class ParsePipe implements PipeTransform {
  /**
   * @param value A value of any type to convert into a JSON-format string.
   */
  transform(value: any) {
    if (value?.length > 0) {
    return JSON.parse(value)
}
  else {
    return 'no tags'
  }
  }
}
