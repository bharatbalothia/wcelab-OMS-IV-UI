import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayList'
})
// Convert an array of object to a string.
// It can use a specifc field to present the object (instead of toString)
export class ArrayListPipe implements PipeTransform {

  transform(arrayOfValues: any[], nameField?: string, separator?: string): any {
    
    if (arrayOfValues == null) {
      return null;
    } else {

      let itemSeparator = (separator == null) ? ', ' : separator;
      let shipnodeNameArray = (nameField == null) ?
        arrayOfValues : arrayOfValues.map(a => a[nameField]);

      // console.log(`about to join the array of ${JSON.stringify(arrayOfValues)} with separator of "${itemSeparator}"`);

      return shipnodeNameArray.join(itemSeparator);
    }
  }

}
