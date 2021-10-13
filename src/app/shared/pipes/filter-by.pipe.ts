

/*
 *ngFor="let item of (itemData | filterBy:'inputText'"
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBy'
})
export class FilterByPipe implements PipeTransform {
  transform(items: any[], searchTerm: string, labelKey?: string) {
    if (!items || !searchTerm) {
      return items;
    }

    return items.filter(function (data) {
      return data.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }
}
