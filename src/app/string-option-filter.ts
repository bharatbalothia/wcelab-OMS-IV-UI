import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

export class StringOptionFilter {

  public static filterOptions(
    options: string[], filterTrigger: Observable<string>): Observable<string[]> {
    
      return filterTrigger.pipe(
      startWith(''),
      map(value => StringOptionFilter._fitler(options, value))
    );
  }

  private static _fitler(options: string[], value: string): string[] {
    
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  
  }
}