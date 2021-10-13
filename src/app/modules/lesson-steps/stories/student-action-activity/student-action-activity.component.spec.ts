import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentActionActivityComponent } from './student-action-activity.component';

describe('StudentActionActivityComponent', () => {
  let component: StudentActionActivityComponent;
  let fixture: ComponentFixture<StudentActionActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentActionActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentActionActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
