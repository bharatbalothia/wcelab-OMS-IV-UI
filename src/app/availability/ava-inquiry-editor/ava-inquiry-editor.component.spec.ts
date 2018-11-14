import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaInquiryEditorComponent } from './ava-inquiry-editor.component';

describe('AvaInquiryEditorComponent', () => {
  let component: AvaInquiryEditorComponent;
  let fixture: ComponentFixture<AvaInquiryEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvaInquiryEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvaInquiryEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
