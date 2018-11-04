import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipnodeEditorComponent } from './shipnode-editor.component';

describe('ShipnodeEditorComponent', () => {
  let component: ShipnodeEditorComponent;
  let fixture: ComponentFixture<ShipnodeEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipnodeEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipnodeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
