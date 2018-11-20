import {FocusMonitor} from '@angular/cdk/a11y';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {Component, ElementRef, Input, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatFormFieldControl} from '@angular/material';
import {Subject} from 'rxjs';

/** @title Form field with custom telephone number input control. */
@Component({
  selector: 'app-phone-number-input',
  templateUrl: 'phone-number-input.component.html',
  styleUrls: ['phone-number-input.component.css'],
})
export class PhoneNumberInputComponent {}

/** Data structure for holding telephone number. */
export class UsTelNumber {
  constructor(public area: string, public exchange: string, public subscriber: string) {}
}

/** Custom `MatFormFieldControl` for telephone number input. */
@Component({
  selector: 'app-phone-number-field',
  templateUrl: 'phone-number-field.component.html',
  styleUrls: ['phone-number-field.component.css'],
  providers: [{provide: MatFormFieldControl, useExisting: PhoneNumberFieldComponent}],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy',
  }
})
export class PhoneNumberFieldComponent implements MatFormFieldControl<UsTelNumber>, OnDestroy {
  static nextId = 0;

  parts: FormGroup;
  stateChanges = new Subject<void>();
  focused = false;
  ngControl = null;
  errorState = false;
  controlType = 'phone-number-input';
  id = `phone-number-input-${PhoneNumberFieldComponent.nextId++}`;
  describedBy = '';

  get empty() {
    const {value: {area, exchange, subscriber}} = this.parts;

    return !area && !exchange && !subscriber;
  }

  get shouldLabelFloat() { return this.focused || !this.empty; }

  @Input()
  get placeholder(): string { return this._placeholder; }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder: string;

  @Input()
  get required(): boolean { return this._required; }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
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

  @Input()
  get value(): UsTelNumber | null {
    const {value: {area, exchange, subscriber}} = this.parts;
    if (area.length === 3 && exchange.length === 3 && subscriber.length === 4) {
      return new UsTelNumber(area, exchange, subscriber);
    }
    return null;
  }
  set value(tel: UsTelNumber | null) {
    const {area, exchange, subscriber} = tel || new UsTelNumber('', '', '');
    this.parts.setValue({area, exchange, subscriber});
    this.stateChanges.next();
  }

  constructor(fb: FormBuilder, private fm: FocusMonitor, private elRef: ElementRef<HTMLElement>) {
    this.parts = fb.group({
      area: '',
      exchange: '',
      subscriber: '',
    });

    fm.monitor(elRef, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef);
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this.elRef.nativeElement.querySelector('input')!.focus();
    }
  }
}


/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */