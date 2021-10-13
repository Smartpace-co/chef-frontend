import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyHygieneComponent } from './safety-hygiene.component';

describe('SafetyHygieneComponent', () => {
  let component: SafetyHygieneComponent;
  let fixture: ComponentFixture<SafetyHygieneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafetyHygieneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetyHygieneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
