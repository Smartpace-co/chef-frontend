import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRatingComponent } from './student-feedback1.component';

describe('StudentRatingComponent', () => {
  let component: StudentRatingComponent;
  let fixture: ComponentFixture<StudentRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
