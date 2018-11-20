import { FocusMonitor } from "@angular/cdk/a11y";
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, HostBinding, Input, Optional, Self, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NgControl, NG_VALUE_ACCESSOR, FormGroup } from '@angular/forms';
import { MatFormFieldControl } from "@angular/material";
import { Observable, Subject } from "rxjs";
import { map, startWith } from 'rxjs/operators';




const customValueProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AutocompleteDropdownComponent),
  multi: true
};


@Component({
  selector: 'app-autocomplete-dropdown',
  templateUrl: './autocomplete-dropdown.component.html',
  styleUrls: ['./autocomplete-dropdown.component.less'],
  // providers: [customValueProvider] 
  providers: [
    { provide: MatFormFieldControl, useExisting: AutocompleteDropdownComponent }],
})
export class AutocompleteDropdownComponent implements MatFormFieldControl<string>, OnDestroy, ControlValueAccessor{

  private static nextId = 0;

  @HostBinding() id = `app-autocomplete-dropdown-${AutocompleteDropdownComponent.nextId++}`;
  @HostBinding('attr.aria-describedby') describedBy = '';
  @HostBinding('class.floating')
  get shouldLabelFloat() {
    // console.debug('asked about if I can float********');
    return this.focused || !this.empty;
  }


  stateChanges = new Subject<void>();

  focused = false;

  controlType = 'example-tel-input';

  errorState = false;

  autocompleteFormGroup: FormGroup;

  @Input() get value(): string | null {
    // console.debug("<===Getting userInput: ", this.autocompleteFormGroup.get('userInput').value);
    return this.autocompleteFormGroup.get('userInput').value;
  }
  set value(inputString: string | null) {
    // console.debug(">===Setting userInput: ", inputString);
    this.autocompleteFormGroup.get('userInput').setValue(inputString);
    this.stateChanges.next();
  }

  @Input() get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder: string;

  @Input() get options(): Observable<string[]> {
    return this._options;
  }
  set options(opts: Observable<string[]>) {
    this._options = opts;
  }
  private _options: Observable<string[]>;

  @Input() get optionValueFieldName(): string{
    return this._optionValueFieldName;
  }
  set optionValueFieldName(fieldName: string){
    this._optionValueFieldName = fieldName;
    this.stateChanges.next();
  }
  private _optionValueFieldName: string;

  @Input()
  get required() {
    return this._required;
  }
  set required(req: boolean) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _disabled = false;

  get empty() {
    return !this.value || this.value.length == 0;
  }

  constructor(@Optional() @Self() public ngControl: NgControl, fb: FormBuilder, private fm: FocusMonitor, 
  private elRef: ElementRef<HTMLElement>) {
    // super();

    this.autocompleteFormGroup = fb.group({
      userInput: ''
    });

    // Replace the provider from above with this.
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      // console.debug("Setting ngControl value accessor to this");
      this.ngControl.valueAccessor = this;
    }

    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      // console.debug('Focsed = %s', this.focused);
      this.stateChanges.next();
    });
  }


  filteredAutoCompOptions: Observable<string[]>;

  private _propagateChange: any = () => { };

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    // console.debug('RegisterOnChange: ', fn);
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    // console.debug('RegisterOnTouched: ', fn);
    // TODO: not sure what I need to do here.
  }
  

  setDisabledState(isDisabled: boolean): void {
    //TODO: add logic to disable the input and options
  }

  doAutoCompFilter(userInput: string): void {

    const filterValue = userInput ? userInput.toLocaleLowerCase() : null;

    this.filteredAutoCompOptions = this.options.pipe(
      startWith(''),
      map((optionsInPipe: string[]): string[] => {
        return this.filterOptionsInPipe(optionsInPipe, filterValue);
      })
    );

    this._propagateChange(this.value);
  }

  private filterOptionsInPipe(optionsInPipe, filterValue: string): string[] {
    // console.debug('About to filter %s from pipe of: ', filterValue, optionsInPipe);
    if (filterValue == null || filterValue.length == 0) {
      return optionsInPipe;
    } else {
      return optionsInPipe ? optionsInPipe.filter(option => option.toLowerCase().indexOf(filterValue) === 0) : null;
    }
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
    }
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef);
  }

}
