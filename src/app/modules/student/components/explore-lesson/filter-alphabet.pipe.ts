import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filterAlphabet'
})
export class FilterAlphabetPipe implements PipeTransform {
  transform(items: any, searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    return items.filter((country) => country.startsWith(searchText));
  }
}