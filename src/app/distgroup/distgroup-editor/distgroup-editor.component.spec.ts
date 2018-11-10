import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistgroupEditorComponent } from './distgroup-editor.component';

describe('DistgroupEditorComponent', () => {
  let component: DistgroupEditorComponent;
  let fixture: ComponentFixture<DistgroupEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistgroupEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistgroupEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
