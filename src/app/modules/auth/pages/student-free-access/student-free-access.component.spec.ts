import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentFreeAccessComponent } from './student-free-access.component';

describe('StudentFreeAccessComponent', () => {
  let component: StudentFreeAccessComponent;
  let fixture: ComponentFixture<StudentFreeAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentFreeAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentFreeAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
