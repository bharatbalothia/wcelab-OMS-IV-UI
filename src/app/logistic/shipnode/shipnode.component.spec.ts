import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipnodeComponent } from './shipnode.component';

describe('ShipnodeComponent', () => {
  let component: ShipnodeComponent;
  let fixture: ComponentFixture<ShipnodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipnodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipnodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
