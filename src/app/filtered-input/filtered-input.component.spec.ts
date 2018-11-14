import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredInputComponent } from './filtered-input.component';

describe('FilteredInputComponent', () => {
  let component: FilteredInputComponent;
  let fixture: ComponentFixture<FilteredInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilteredInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilteredInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
