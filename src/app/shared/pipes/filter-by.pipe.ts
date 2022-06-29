

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
      if(data.name){
        return data.name.toLowerCase().includes(searchTerm.toLowerCase());
        
      } else if(labelKey){
        return data[labelKey].toLowerCase().includes(searchTerm.toLowerCase());
      }
      else {
        return data.toLowerCase().includes(searchTerm.toLowerCase());

      }
    });
  }
}
