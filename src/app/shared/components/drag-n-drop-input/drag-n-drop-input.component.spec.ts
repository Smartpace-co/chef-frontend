import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragNDropInputComponent } from './drag-n-drop-input.component';

describe('DragNDropInputComponent', () => {
  let component: DragNDropInputComponent;
  let fixture: ComponentFixture<DragNDropInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragNDropInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragNDropInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
