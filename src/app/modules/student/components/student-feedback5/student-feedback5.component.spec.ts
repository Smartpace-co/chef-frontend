import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentFeedback5Component } from './student-feedback5.component';

describe('StudentFeedback5Component', () => {
  let component: StudentFeedback5Component;
  let fixture: ComponentFixture<StudentFeedback5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentFeedback5Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentFeedback5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
