import { Component, Input, forwardRef, Output } from '@angular/core';
import { ControlValueAccessor,NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from "rxjs";
import { startWith, map } from 'rxjs/operators'



const customValueProvider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AutocompleteDropdownComponent),
    multi: true
};


@Component({
  selector: 'app-autocomplete-dropdown',
  templateUrl: './autocomplete-dropdown.component.html',
  styleUrls: ['./autocomplete-dropdown.component.less'],
  providers: [ customValueProvider ]
})
export class AutocompleteDropdownComponent implements ControlValueAccessor {

  constructor() { }

  @Input() placeholder: string;
  // @Input() @Output() modelData: String;
  @Input() options: Observable<string[]>;

  private modelData: string;

  filteredAutoCompOptions: Observable<string[]>;

  // get placeholder(): string {
  //   return this._placeholder;
  // }

  private _propagateChange:any = () => {};

  writeValue(value: any): void {
    this.modelData = value;
  }

  registerOnChange(fn: any): void {
    // console.debug('RegisterOnChange: ', fn);
    this._propagateChange = fn;
  }
  
  registerOnTouched(fn: any): void{
    console.debug('RegisterOnTouched: ', fn);
  }

  // onChange(inputValue: string){
  //   console.debug('Autocomp OnChange: ', inputValue);
  //   this._propagateChange(this.modelData);
  // }

  setDisabledState(isDisabled: boolean): void {
    //TODO: add logic to disable the input and options
  }

  doAutoCompFilter(userInput: string): void {
    
    console.debug("autocomplete-dropdown got input: %s with modelData of: ", userInput, this.modelData);

    const filterValue = userInput ? userInput.toLocaleLowerCase() : null;

    this.filteredAutoCompOptions = this.options.pipe(
      startWith(''),
      map( (optionsInPipe: string[]): string[] => {
        return this.filterOptionsInPipe(optionsInPipe,filterValue);
      })
    );

    this._propagateChange(this.modelData);
  }

  private   filterOptionsInPipe(optionsInPipe, filterValue: string): string[] {
    // console.debug('About to filter %s from pipe of: ', filterValue, optionsInPipe);
    if (filterValue == null || filterValue.length == 0) {
      return optionsInPipe;
    } else {
      return optionsInPipe ? optionsInPipe.filter(option => option.toLowerCase().indexOf(filterValue) === 0) : null;
    }
  }

}
