import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentFeedback4Component } from './student-feedback4.component';

describe('StudentFeedback4Component', () => {
  let component: StudentFeedback4Component;
  let fixture: ComponentFixture<StudentFeedback4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentFeedback4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentFeedback4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
