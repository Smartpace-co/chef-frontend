import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualStudentAssignmentDetailsComponent } from './individual-student-assignment-details.component';

describe('IndividualStudentAssignmentDetailsComponent', () => {
  let component: IndividualStudentAssignmentDetailsComponent;
  let fixture: ComponentFixture<IndividualStudentAssignmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualStudentAssignmentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualStudentAssignmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
