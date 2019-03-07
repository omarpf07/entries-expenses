import { Pipe, PipeTransform } from '@angular/core';
import { Movements } from '../core/models/movements.models';

@Pipe({
  name: 'orderMovements'
})
export class OrderMovementsPipe implements PipeTransform {

  transform(items: Movements[]): Movements[] {

    return items.sort(a => {
      return a.type === 'entry' ? -1 : 1;
    });
  }

}
