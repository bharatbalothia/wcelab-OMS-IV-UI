import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandContainerComponent } from './expand-container.component';

describe('ExpandContainerComponent', () => {
  let component: ExpandContainerComponent;
  let fixture: ComponentFixture<ExpandContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
