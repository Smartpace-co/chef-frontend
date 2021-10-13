import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CookingStepsComponent } from './cooking-steps.component';

describe('CookingStepsComponent', () => {
  let component: CookingStepsComponent;
  let fixture: ComponentFixture<CookingStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookingStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookingStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
