import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosterAssignmentDetailsComponent } from './roster-assignment-details.component';

describe('RosterAssignmentDetailsComponent', () => {
  let component: RosterAssignmentDetailsComponent;
  let fixture: ComponentFixture<RosterAssignmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RosterAssignmentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosterAssignmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
