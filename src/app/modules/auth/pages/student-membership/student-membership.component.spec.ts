import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentMembershipComponent } from './student-membership.component';

describe('StudentMembershipComponent', () => {
  let component: StudentMembershipComponent;
  let fixture: ComponentFixture<StudentMembershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentMembershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
