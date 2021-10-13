import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyDragndropComponent } from './safety-dragndrop.component';

describe('SafetyDragndropComponent', () => {
  let component: SafetyDragndropComponent;
  let fixture: ComponentFixture<SafetyDragndropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafetyDragndropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetyDragndropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
