import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistgroupComponent } from './distgroup.component';

describe('DistgroupComponent', () => {
  let component: DistgroupComponent;
  let fixture: ComponentFixture<DistgroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistgroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
