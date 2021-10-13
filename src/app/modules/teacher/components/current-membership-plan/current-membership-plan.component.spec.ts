import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentMembershipPlanComponent } from './current-membership-plan.component';

describe('CurrentMembershipPlanComponent', () => {
  let component: CurrentMembershipPlanComponent;
  let fixture: ComponentFixture<CurrentMembershipPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentMembershipPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentMembershipPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
