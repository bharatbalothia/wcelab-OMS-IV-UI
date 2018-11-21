import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaViewerComponent } from './ava-viewer.component';

describe('AvaViewerComponent', () => {
  let component: AvaViewerComponent;
  let fixture: ComponentFixture<AvaViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvaViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvaViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
